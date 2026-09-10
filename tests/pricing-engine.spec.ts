/**
 * Pricing-engine tests: exact decimal math, peak boundaries, effective-window
 * selection, the two modes, and partial-propagation semantics.
 */

import { Decimal } from 'decimal.js'
import { describe, expect, it } from 'vitest'
import type { AttemptUsageRow, PriceMonitorUsageView, TurnUsageRow } from '../src/projection-types.ts'
import { isPeak, planFor, priceLedger, resolveModelAlias } from '../src/pricing/engine.ts'
import { parsePersistedSettings, pricingPlanSchema, type PeakSchedule, type PersistedSettings, type PricingPlan } from '../src/pricing/schema.ts'
import { defaultSettings, expandOfficialModelIds, officialSeedPlans } from '../src/pricing/official-seed.ts'

const SCHEDULE: PeakSchedule = {
  timezone: 'UTC',
  peakWeekdays: [1, 2, 3, 4, 5],
  peakWindows: [['01:00', '04:00'], ['06:00', '10:00']],
}

const flashPlan = (over: Partial<PricingPlan> = {}): PricingPlan => ({
  id: 'p-flash',
  name: 'flash',
  source: 'manual',
  provider: 'deepseek-official',
  modelIds: ['deepseek-v4-flash'],
  currency: 'USD',
  effectiveFrom: '2026-09-10',
  schedule: SCHEDULE,
  ratesPerMillion: {
    offPeak: { cacheMiss: '0.22', cacheHit: '0.007', output: '0.66' },
    peak: { cacheMiss: '0.44', cacheHit: '0.014', output: '1.32' },
  },
  ...over,
})

function attempt(over: Partial<AttemptUsageRow> = {}): AttemptUsageRow {
  return {
    id: '1:0:0',
    turn: 1,
    step: 0,
    attempt: 0,
    startedAt: Date.UTC(2026, 8, 10, 0, 0),
    settledAt: Date.UTC(2026, 8, 10, 0, 1),
    provider: 'deepseek-official',
    model: 'deepseek-v4-flash',
    uncachedInputTokens: 0,
    cacheReadTokens: 0,
    cacheWriteTokens: 0,
    outputTokens: 0,
    completeness: 'complete',
    ...over,
  }
}

function ledgerOf(rows: AttemptUsageRow[]): PriceMonitorUsageView {
  const turn: TurnUsageRow = { turn: 1, startedAt: rows[0]?.startedAt ?? 0, complete: true, attempts: rows }
  return { turns: [turn] }
}

function settingsOf(
  plans: PricingPlan[],
  mode: 'effective' | 'reprice' = 'effective',
  aliases?: Record<string, string>,
): PersistedSettings {
  return {
    schemaVersion: 1,
    selectedPlanId: plans[0]!.id,
    mode,
    plans,
    ...aliases === undefined ? {} : { aliases },
  }
}

/** UTC epoch ms for a date/time. Month is 1-based in the helper. */
function utc(year: number, month: number, day: number, hour: number, minute: number): number {
  return Date.UTC(year, month - 1, day, hour, minute)
}

describe('peak classification', () => {
  const cases: [string, number, boolean][] = [
    ['Monday 00:59', utc(2026, 9, 7, 0, 59), false],
    ['Monday 01:00', utc(2026, 9, 7, 1, 0), true],
    ['Monday 03:59', utc(2026, 9, 7, 3, 59), true],
    ['Monday 04:00', utc(2026, 9, 7, 4, 0), false],
    ['Monday 05:59', utc(2026, 9, 7, 5, 59), false],
    ['Monday 06:00', utc(2026, 9, 7, 6, 0), true],
    ['Monday 09:59', utc(2026, 9, 7, 9, 59), true],
    ['Monday 10:00', utc(2026, 9, 7, 10, 0), false],
    ['Friday 03:59', utc(2026, 9, 11, 3, 59), true],
    ['Saturday 02:00', utc(2026, 9, 12, 2, 0), false],
  ]
  for (const [label, epochMs, expected] of cases) {
    it(`${label} is ${expected ? 'peak' : 'off-peak'}`, () => {
      expect(isPeak(SCHEDULE, epochMs)).toBe(expected)
    })
  }
})

describe('plan resolution', () => {
  it('selects the plan whose effective window contains the UTC date (left-closed, right-open)', () => {
    const plan = flashPlan({ effectiveFrom: '2026-09-10', effectiveTo: '2026-09-12' })
    expect(planFor([plan], 'deepseek-official', 'deepseek-v4-flash', utc(2026, 9, 9, 23, 59))).toBeUndefined()
    expect(planFor([plan], 'deepseek-official', 'deepseek-v4-flash', utc(2026, 9, 10, 0, 0))).toBe(plan)
    expect(planFor([plan], 'deepseek-official', 'deepseek-v4-flash', utc(2026, 9, 11, 23, 59))).toBe(plan)
    expect(planFor([plan], 'deepseek-official', 'deepseek-v4-flash', utc(2026, 9, 12, 0, 0))).toBeUndefined()
  })

  it('prefers the latest effectiveFrom among matching plans', () => {
    const older = flashPlan({ id: 'older', effectiveFrom: '2026-07-31' })
    const newer = flashPlan({ id: 'newer', effectiveFrom: '2026-09-10' })
    expect(planFor([older, newer], 'deepseek-official', 'deepseek-v4-flash', utc(2026, 9, 11, 0, 0))).toBe(newer)
  })
})

describe('effective windows', () => {
  it('treats an absent start as in force back to the beginning of the log', () => {
    const plan = flashPlan({ effectiveFrom: undefined })
    // A session that ran long before the plan was observed is still priced:
    // the snapshot knows today's rates, not when they began.
    expect(planFor([plan], 'deepseek-official', 'deepseek-v4-flash', utc(2025, 1, 6, 0, 0))).toBe(plan)
    expect(planFor([plan], 'deepseek-official', 'deepseek-v4-flash', utc(2026, 9, 10, 0, 0))).toBe(plan)
  })

  it('lets a later observation supersede an earlier startless version', () => {
    const older = flashPlan({ id: 'older', effectiveFrom: undefined, provenance: { url: 'u', fetchedAt: '2026-08-01T00:00:00.000Z', contentHash: 'a' } })
    const newer = flashPlan({ id: 'newer', effectiveFrom: undefined, provenance: { url: 'u', fetchedAt: '2026-09-10T00:00:00.000Z', contentHash: 'b' } })
    expect(planFor([older, newer], 'deepseek-official', 'deepseek-v4-flash', utc(2026, 9, 11, 0, 0))).toBe(newer)
    // Array order does not decide it.
    expect(planFor([newer, older], 'deepseek-official', 'deepseek-v4-flash', utc(2026, 9, 11, 0, 0))).toBe(newer)
  })

  it('still honours an explicit declared start and end', () => {
    const plan = flashPlan({ effectiveFrom: '2026-09-10', effectiveTo: '2026-09-12' })
    expect(planFor([plan], 'deepseek-official', 'deepseek-v4-flash', utc(2026, 9, 9, 0, 0))).toBeUndefined()
    expect(planFor([plan], 'deepseek-official', 'deepseek-v4-flash', utc(2026, 9, 10, 0, 0))).toBe(plan)
  })

  it('separates "no plan names this model" from "no version is in force then"', () => {
    const future = flashPlan({ effectiveFrom: '2099-01-01' })
    const row = attempt({ uncachedInputTokens: 1_000_000 })

    const inactive = priceLedger(ledgerOf([row]), settingsOf([future]))
    expect(inactive.coverage.byReason['inactive-plan']).toBe(1)
    expect(inactive.coverage.byReason['no-plan']).toBe(0)

    const unknown = attempt({ model: 'no-such-model', uncachedInputTokens: 1_000_000, cacheReadTokens: 0, outputTokens: 0 })
    const unmatched = priceLedger(ledgerOf([unknown]), settingsOf([flashPlan()]))
    expect(unmatched.coverage.byReason['no-plan']).toBe(1)
    expect(unmatched.coverage.byReason['inactive-plan']).toBe(0)
  })
})

describe('token facts under partial pricing', () => {
  it('reports the tokens of an unpriced attempt instead of zero', () => {
    const priced = attempt({ id: '1:0:0', uncachedInputTokens: 1_000_000, cacheReadTokens: 0, outputTokens: 0 })
    const unpriced = attempt({
      id: '1:1:0',
      model: 'unmapped-model',
      uncachedInputTokens: 500_000,
      cacheReadTokens: 200_000,
      outputTokens: 100_000,
    })
    const result = priceLedger(ledgerOf([priced, unpriced]), settingsOf([flashPlan()]))
    // The money covers only the priced attempt...
    expect(result.coverage.priced).toBe(1)
    expect(result.cost.total.toFixed()).toBe('0.22')
    // ...while the reported tokens are complete facts.
    expect(result.turns[0]!.tokens).toEqual({
      uncachedInput: 1_500_000,
      cacheRead: 200_000,
      output: 100_000,
      total: 1_800_000,
    })
    expect(result.tokens.total).toBe(1_800_000)
  })
})

describe('pricing math', () => {
  it('charges the three buckets exactly with no binary-float drift', () => {
    const row = attempt({
      uncachedInputTokens: 1_000_000,
      cacheReadTokens: 1_000_000,
      outputTokens: 1_000_000,
    })
    const result = priceLedger(ledgerOf([row]), settingsOf([flashPlan()]))
    expect(result.cost.total.toFixed()).toBe('0.887') // 0.22 + 0.007 + 0.66
    expect(result.cost.miss.toFixed()).toBe('0.22')
    expect(result.cost.hit.toFixed()).toBe('0.007')
    expect(result.cost.output.toFixed()).toBe('0.66')
    expect(result.coverage.priced).toBe(1)
    expect(result.coverage.uncovered).toBe(0)
  })

  it('uses the peak band at peak times and keeps every decimal digit', () => {
    const row = attempt({
      startedAt: utc(2026, 9, 14, 2, 0), // Monday peak, inside the effective window
      uncachedInputTokens: 123_456,
      cacheReadTokens: 0,
      outputTokens: 7,
    })
    const result = priceLedger(ledgerOf([row]), settingsOf([flashPlan()]))
    const expected = new Decimal(123_456).mul('0.44').div(1_000_000)
      .plus(new Decimal(7).mul('1.32').div(1_000_000))
    expect(result.cost.total.eq(expected)).toBe(true)
  })

  it('matches the reference aggregate and keeps turn totals equal to session totals', () => {
    const rows = [
      attempt({ id: '1:0:0', uncachedInputTokens: 500_000, cacheReadTokens: 1_000_000, outputTokens: 250_000 }),
      attempt({ id: '1:1:0', uncachedInputTokens: 300_000, cacheReadTokens: 200_000, outputTokens: 100_000 }),
    ]
    const result = priceLedger(ledgerOf(rows), settingsOf([flashPlan()]))
    expect(result.turns).toHaveLength(1)
    expect(result.cost.total.eq(result.turns[0]!.cost.total)).toBe(true)
    expect(result.tokens.total).toBe(500_000 + 1_000_000 + 250_000 + 300_000 + 200_000 + 100_000)
  })
})

describe('pricing modes', () => {
  const historical = flashPlan({ id: 'historical', effectiveFrom: '2026-07-31', effectiveTo: '2026-09-10' })
  const current = flashPlan({ id: 'current', effectiveFrom: '2026-09-10' })

  it('effective mode prices each attempt by the plan current at its time', () => {
    const rows = [
      attempt({ id: '1:0:0', startedAt: utc(2026, 8, 1, 0, 0), uncachedInputTokens: 1_000_000 }),
      attempt({ id: '1:1:0', startedAt: utc(2026, 9, 11, 0, 0), uncachedInputTokens: 1_000_000 }),
    ]
    const result = priceLedger(ledgerOf(rows), settingsOf([historical, current]))
    const first = result.turns[0]!.attempts[0]!
    const second = result.turns[0]!.attempts[1]!
    expect(first.planId).toBe('historical')
    expect(second.planId).toBe('current')
  })

  it('reprice mode prices every attempt with usable tokens, whatever model or provider produced them', () => {
    const rows = [
      attempt({ id: '1:0:0', startedAt: utc(2026, 8, 1, 0, 0), uncachedInputTokens: 1_000_000 }),
      // A different model, an unmapped id, and a third-party gateway: the whole
      // point of switching plans is "what would these tokens have cost at these
      // rates", so none of them may gate the simulation.
      attempt({ id: '1:1:0', model: 'deepseek-v4-pro', uncachedInputTokens: 1_000_000 }),
      attempt({ id: '1:2:0', model: 'renamed-flash', uncachedInputTokens: 1_000_000 }),
      attempt({ id: '1:3:0', model: 'mystery', provider: 'other-gateway', uncachedInputTokens: 1_000_000 }),
    ]
    const result = priceLedger(ledgerOf(rows), settingsOf([current], 'reprice'))
    expect(result.coverage.priced).toBe(4)
    expect(result.coverage.uncovered).toBe(0)
    for (const entry of result.turns[0]!.attempts) {
      expect(entry.planId).toBe('current')
      expect(entry.cost?.total.toFixed()).toBe('0.22')
    }
    expect(result.cost.total.toFixed()).toBe('0.88')
  })

  it('reprice still refuses attempts whose token facts are unusable', () => {
    const rows = [
      attempt({ id: '1:0:0', completeness: 'usage-missing' }),
      attempt({ id: '1:1:0', completeness: 'invalid' }),
      attempt({ id: '1:2:0', cacheReadTokens: undefined }),
      attempt({ id: '1:3:0', cacheWriteTokens: 5 }),
    ]
    const result = priceLedger(ledgerOf(rows), settingsOf([current], 'reprice'))
    expect(result.coverage.uncovered).toBe(4)
    expect(result.turns[0]!.attempts.map(entry => entry.reason))
      .toEqual(['no-usage', 'invalid', 'no-split', 'cache-write'])
  })

  it('reprice prices an attempt whose route was never recorded', () => {
    // Attribution needs the route; a counterfactual over the tokens does not.
    const row = attempt({ model: undefined, completeness: 'route-missing', uncachedInputTokens: 1_000_000 })
    expect(priceLedger(ledgerOf([row]), settingsOf([current], 'reprice')).coverage.priced).toBe(1)
    expect(priceLedger(ledgerOf([row]), settingsOf([current])).coverage.byReason['no-route']).toBe(1)
  })
})

describe('partial propagation', () => {
  it('keeps cache writes and missing cache splits out of the total, never as zero', () => {
    const rows = [
      attempt({ id: '1:0:0', cacheWriteTokens: 10, cacheReadTokens: 0 }),
      attempt({ id: '1:1:0', cacheReadTokens: undefined }),
      attempt({ id: '1:2:0', provider: 'other-gateway' }),
      attempt({ id: '1:3:0', completeness: 'invalid' }),
      attempt({ id: '1:4:0', uncachedInputTokens: 1_000_000, cacheReadTokens: 0 }),
    ]
    const result = priceLedger(ledgerOf(rows), settingsOf([flashPlan()]))
    const reasons = result.turns[0]!.attempts.map(entry => entry.reason)
    expect(reasons).toEqual(['cache-write', 'no-split', 'not-official', 'invalid', undefined])
    expect(result.coverage.priced).toBe(1)
    expect(result.coverage.uncovered).toBe(4)
    expect(result.cost.total.toFixed()).toBe('0.22')
    expect(result.coverage.byReason['cache-write']).toBe(1)
  })
})

describe('shipped official snapshot', () => {
  it('prices exactly two models, with one flash price covering its ids', () => {
    expect(officialSeedPlans).toHaveLength(2)
    const [flash, pro] = officialSeedPlans
    expect(flash!.modelIds).toEqual(['deepseek-flash', 'deepseek-v4-flash', 'deepseek-v4-flash-vision-exp'])
    expect(pro!.modelIds).toEqual(['deepseek-v4-pro'])
    expect(flash!.ratesPerMillion).toEqual({
      offPeak: { cacheMiss: '0.15', cacheHit: '0.003', output: '0.6' },
      peak: { cacheMiss: '0.3', cacheHit: '0.006', output: '1.2' },
    })
    expect(pro!.ratesPerMillion).toEqual({
      offPeak: { cacheMiss: '0.66', cacheHit: '0.022', output: '1.98' },
      peak: { cacheMiss: '1.32', cacheHit: '0.044', output: '3.96' },
    })
  })

  it('expands a page-listed flash id to the whole family and leaves others alone', () => {
    expect(expandOfficialModelIds('deepseek-flash')).toEqual(['deepseek-flash', 'deepseek-v4-flash', 'deepseek-v4-flash-vision-exp'])
    expect(expandOfficialModelIds('deepseek-v4-flash')).toEqual(['deepseek-flash', 'deepseek-v4-flash', 'deepseek-v4-flash-vision-exp'])
    expect(expandOfficialModelIds('deepseek-v4-pro')).toEqual(['deepseek-v4-pro'])
    expect(expandOfficialModelIds('some-future-model')).toEqual(['some-future-model'])
  })

  it('prices every id the flash family answers to with the shipped rates', () => {
    for (const model of ['deepseek-flash', 'deepseek-v4-flash', 'deepseek-v4-flash-vision-exp']) {
      const row = attempt({ model, uncachedInputTokens: 1_000_000, cacheReadTokens: 0, outputTokens: 0 })
      const priced = priceLedger(ledgerOf([row]), defaultSettings())
      expect(priced.coverage.priced).toBe(1)
      expect(priced.cost.total.toFixed()).toBe('0.15')
    }
  })
})

describe('model aliases', () => {
  it('prices a deployment model id through its alias in effective mode', () => {
    const row = attempt({
      model: 'deepseek-v4.1-flash-expires-on-0910',
      uncachedInputTokens: 1_000_000,
      cacheReadTokens: 0,
      outputTokens: 0,
    })
    const aliases = { 'deepseek-v4.1-flash-expires-on-0910': 'deepseek-v4-flash-vision-exp' }
    // Without the alias the attempt matches no plan.
    expect(priceLedger(ledgerOf([row]), settingsOf([flashPlan()])).coverage.byReason['no-plan']).toBe(1)

    const vision = flashPlan({ id: 'p-vision', modelIds: ['deepseek-v4-flash-vision-exp'] })
    const priced = priceLedger(ledgerOf([row]), settingsOf([vision], 'effective', aliases))
    expect(priced.coverage.priced).toBe(1)
    expect(priced.turns[0]!.attempts[0]!.planId).toBe('p-vision')
    // The alias target's rates are the ones charged.
    expect(priced.cost.total.toFixed()).toBe('0.22')
  })

  it('prices an aliased id in effective mode and needs no alias under reprice', () => {
    const row = attempt({ model: 'renamed-flash', uncachedInputTokens: 1_000_000, cacheReadTokens: 0, outputTokens: 0 })
    const aliases = { 'renamed-flash': 'deepseek-v4-flash' }
    // Effective mode attributes the cost, so it needs the alias...
    expect(priceLedger(ledgerOf([row]), settingsOf([flashPlan()], 'effective', aliases)).coverage.priced).toBe(1)
    // ...while reprice substitutes the model away and needs none.
    expect(priceLedger(ledgerOf([row]), settingsOf([flashPlan()], 'reprice')).coverage.priced).toBe(1)
  })

  it('anchors the selected plan over exactly the attempts the view priced', () => {
    // A gateway attempt is excluded from the actual cost; the anchor must not
    // silently price it, or the delta would mix coverage into a rate compare.
    const rows = [
      attempt({ id: '1:0:0', uncachedInputTokens: 1_000_000, cacheReadTokens: 0, outputTokens: 0 }),
      attempt({ id: '1:1:0', provider: 'other-gateway', uncachedInputTokens: 1_000_000 }),
    ]
    const other = flashPlan({ id: 'p-other', effectiveFrom: undefined })
    const settings = { ...settingsOf([flashPlan()]), selectedPlanId: other.id, plans: [flashPlan(), other] }
    const priced = priceLedger(ledgerOf(rows), settings)
    expect(priced.coverage.priced).toBe(1)
    expect(priced.anchor?.planId).toBe('p-other')
    expect(priced.anchor?.total.toFixed()).toBe('0.22')
  })

  it('omits the anchor under reprice, where it would restate the total', () => {
    const row = attempt({ uncachedInputTokens: 1_000_000, cacheReadTokens: 0, outputTokens: 0 })
    expect(priceLedger(ledgerOf([row]), settingsOf([flashPlan()], 'reprice')).anchor).toBeUndefined()
  })

  it('leaves an alias pointing at an unknown model unpriced rather than guessing', () => {
    const row = attempt({ model: 'renamed-flash' })
    const settings = settingsOf([flashPlan()], 'effective', { 'renamed-flash': 'no-such-model' })
    const priced = priceLedger(ledgerOf([row]), settings)
    expect(priced.coverage.byReason['no-plan']).toBe(1)
  })

  it('returns an unmapped id unchanged', () => {
    expect(resolveModelAlias(undefined, 'm')).toBe('m')
    expect(resolveModelAlias({}, 'm')).toBe('m')
    expect(resolveModelAlias({ m: 'x' }, 'm')).toBe('x')
    expect(resolveModelAlias({ m: 'x' }, 'other')).toBe('other')
  })
})

describe('settings schema', () => {
  it('accepts the shipped official seed and round-trips a manual plan', () => {
    for (const plan of officialSeedPlans) {
      expect(pricingPlanSchema.safeParse(plan).success).toBe(true)
      // A snapshot observes rates; it does not learn when they began.
      expect(plan.effectiveFrom).toBeUndefined()
      expect(plan.provenance?.fetchedAt).toBeDefined()
    }
    const settings = defaultSettings()
    expect(parsePersistedSettings(settings)).toEqual(settings)
  })

  it('rejects negative rates, malformed windows, overlapping windows, and a schedule without a peak band', () => {
    expect(pricingPlanSchema.safeParse(flashPlan({
      ratesPerMillion: { offPeak: { cacheMiss: '-0.22', cacheHit: '0.007', output: '0.66' }, peak: { cacheMiss: '0.44', cacheHit: '0.014', output: '1.32' } },
    })).success).toBe(false)
    expect(pricingPlanSchema.safeParse(flashPlan({ schedule: { ...SCHEDULE, peakWindows: [['04:00', '01:00']] } })).success).toBe(false)
    expect(pricingPlanSchema.safeParse(flashPlan({ schedule: { ...SCHEDULE, peakWindows: [['01:00', '03:00'], ['02:00', '04:00']] } })).success).toBe(false)
    expect(pricingPlanSchema.safeParse(flashPlan({ schedule: SCHEDULE, ratesPerMillion: { offPeak: { cacheMiss: '0.22', cacheHit: '0.007', output: '0.66' } } })).success).toBe(false)
    expect(pricingPlanSchema.safeParse(flashPlan({ modelIds: [] })).success).toBe(false)
    // A startless plan is valid, but it cannot also declare an end.
    expect(pricingPlanSchema.safeParse(flashPlan({ effectiveFrom: undefined })).success).toBe(true)
    expect(pricingPlanSchema.safeParse(flashPlan({ effectiveFrom: undefined, effectiveTo: '2026-10-01' })).success).toBe(false)
  })

  it('round-trips the alias map and rejects a malformed one', () => {
    const withAliases = { ...defaultSettings(), aliases: { 'deepseek-v4.1-flash-expires-on-0910': 'deepseek-v4-flash-vision-exp' } }
    expect(parsePersistedSettings(withAliases)).toEqual(withAliases)
    expect(parsePersistedSettings({ ...defaultSettings(), aliases: { '': 'x' } })).toBeUndefined()
    expect(parsePersistedSettings({ ...defaultSettings(), aliases: { a: '' } })).toBeUndefined()
    expect(parsePersistedSettings({ ...defaultSettings(), aliases: { a: 1 } })).toBeUndefined()
  })

  it('returns undefined for a corrupted or legacy settings blob', () => {
    expect(parsePersistedSettings({ schemaVersion: 0, plans: [] })).toBeUndefined()
    expect(parsePersistedSettings({ ...defaultSettings(), mode: 'bogus' })).toBeUndefined()
  })
})
