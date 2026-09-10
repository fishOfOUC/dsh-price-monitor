/**
 * Pricing-engine tests: exact decimal math, peak boundaries, the selected plan
 * as the sole pricing basis, and partial-propagation semantics.
 */

import { Decimal } from 'decimal.js'
import { describe, expect, it } from 'vitest'
import type { AttemptUsageRow, PriceMonitorUsageView, TurnUsageRow } from '../src/projection-types.ts'
import { isPeak, priceLedger } from '../src/pricing/engine.ts'
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

const proPlan = (over: Partial<PricingPlan> = {}): PricingPlan => flashPlan({
  id: 'p-pro',
  name: 'pro',
  modelIds: ['deepseek-v4-pro'],
  ratesPerMillion: {
    offPeak: { cacheMiss: '0.66', cacheHit: '0.022', output: '1.98' },
    peak: { cacheMiss: '1.32', cacheHit: '0.044', output: '3.96' },
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

/** Settings selecting the first plan unless told otherwise. */
function settingsOf(plans: PricingPlan[], selectedPlanId?: string): PersistedSettings {
  return {
    schemaVersion: 2,
    selectedPlanId: selectedPlanId ?? plans[0]!.id,
    plans,
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

describe('the selected plan is the pricing basis', () => {
  it('prices every attempt with usable tokens, whatever model or provider produced them', () => {
    const rows = [
      attempt({ id: '1:0:0', uncachedInputTokens: 1_000_000 }),
      // A different model, an unknown id, a route never recorded, and a
      // third-party gateway: the point of switching plans is "what would these
      // tokens have cost at these rates", so none of them may gate it.
      attempt({ id: '1:1:0', model: 'deepseek-v4-pro', uncachedInputTokens: 1_000_000 }),
      attempt({ id: '1:2:0', model: 'renamed-flash', uncachedInputTokens: 1_000_000 }),
      attempt({ id: '1:3:0', model: undefined, completeness: 'route-missing', uncachedInputTokens: 1_000_000 }),
      attempt({ id: '1:4:0', model: 'mystery', provider: 'other-gateway', uncachedInputTokens: 1_000_000 }),
    ]
    const result = priceLedger(ledgerOf(rows), settingsOf([flashPlan()]))
    expect(result.coverage.priced).toBe(5)
    expect(result.coverage.uncovered).toBe(0)
    for (const entry of result.turns[0]!.attempts) {
      expect(entry.planId).toBe('p-flash')
      expect(entry.cost?.total.toFixed()).toBe('0.22')
    }
    expect(result.cost.total.toFixed()).toBe('1.1')
  })

  it('reprices every amount when the selected plan changes', () => {
    const row = attempt({
      startedAt: utc(2026, 9, 14, 1, 30), // Monday peak window
      uncachedInputTokens: 1_000_000,
      cacheReadTokens: 2_000_000,
      outputTokens: 500_000,
    })
    const plans = [flashPlan(), proPlan()]

    const atFlash = priceLedger(ledgerOf([row]), settingsOf(plans, 'p-flash'))
    const atPro = priceLedger(ledgerOf([row]), settingsOf(plans, 'p-pro'))

    // Flash peak: 1.0×0.44·… = 1 × 0.44 + 2 × 0.014 + 0.5 × 1.32
    expect(atFlash.cost.total.toFixed()).toBe('1.128')
    expect(atFlash.turns[0]!.cost.total.toFixed()).toBe('1.128')
    // Pro peak: 1 × 1.32 + 2 × 0.044 + 0.5 × 3.96
    expect(atPro.cost.total.toFixed()).toBe('3.388')
    expect(atPro.turns[0]!.cost.total.toFixed()).toBe('3.388')
    // The tokens are the same facts under either plan.
    expect(atPro.tokens).toEqual(atFlash.tokens)
    expect(atPro.turns[0]!.peak).toBe(atFlash.turns[0]!.peak)
  })

  it('prices a plan’s rate period as a label, never as a gate', () => {
    // The window says when these rates applied; an attempt outside it is still
    // priced at them, because the user selected this plan to price the session.
    const plan = flashPlan({ effectiveFrom: '2026-09-10', effectiveTo: '2026-09-12' })
    const row = attempt({ startedAt: utc(2025, 1, 6, 0, 0), uncachedInputTokens: 1_000_000, cacheReadTokens: 0, outputTokens: 0 })
    const result = priceLedger(ledgerOf([row]), settingsOf([plan]))
    expect(result.coverage.priced).toBe(1)
    expect(result.cost.total.toFixed()).toBe('0.22')
  })

  it('refuses to price anything when no plan is selected', () => {
    const row = attempt({ uncachedInputTokens: 1_000_000, cacheReadTokens: 0, outputTokens: 0 })
    const result = priceLedger(ledgerOf([row]), settingsOf([flashPlan()], 'no-such-plan'))
    expect(result.coverage.uncovered).toBe(1)
    expect(result.coverage.byReason['no-plan']).toBe(1)
    expect(result.turns[0]!.attempts[0]!.planId).toBeUndefined()
  })
})

describe('token facts under partial pricing', () => {
  it('reports the tokens of an unpriced attempt instead of zero', () => {
    const priced = attempt({ id: '1:0:0', uncachedInputTokens: 1_000_000, cacheReadTokens: 0, outputTokens: 0 })
    const unpriced = attempt({
      id: '1:1:0',
      completeness: 'usage-missing',
      uncachedInputTokens: undefined,
      cacheReadTokens: undefined,
      outputTokens: undefined,
    })
    const result = priceLedger(ledgerOf([priced, unpriced]), settingsOf([flashPlan()]))
    // The money covers only the priced attempt...
    expect(result.coverage.priced).toBe(1)
    expect(result.cost.total.toFixed()).toBe('0.22')
    // ...while the reported tokens are complete facts.
    expect(result.turns[0]!.tokens).toEqual({
      uncachedInput: 1_000_000,
      cacheRead: 0,
      output: 0,
      total: 1_000_000,
    })
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
      startedAt: utc(2026, 9, 14, 2, 0), // Monday peak
      uncachedInputTokens: 123_456,
      cacheReadTokens: 0,
      outputTokens: 7,
    })
    const result = priceLedger(ledgerOf([row]), settingsOf([flashPlan()]))
    const expected = new Decimal(123_456).mul('0.44').div(1_000_000)
      .plus(new Decimal(7).mul('1.32').div(1_000_000))
    expect(result.cost.total.eq(expected)).toBe(true)
    expect(result.coverage.peak).toBe(1)
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

describe('partial propagation', () => {
  it('keeps cache writes and missing cache splits out of the total, never as zero', () => {
    const rows = [
      attempt({ id: '1:0:0', cacheWriteTokens: 10, cacheReadTokens: 0 }),
      attempt({ id: '1:1:0', cacheReadTokens: undefined }),
      attempt({ id: '1:2:0', completeness: 'usage-missing' }),
      attempt({ id: '1:3:0', completeness: 'invalid' }),
      attempt({ id: '1:4:0', uncachedInputTokens: 1_000_000, cacheReadTokens: 0 }),
    ]
    const result = priceLedger(ledgerOf(rows), settingsOf([flashPlan()]))
    const reasons = result.turns[0]!.attempts.map(entry => entry.reason)
    expect(reasons).toEqual(['cache-write', 'no-split', 'no-usage', 'invalid', undefined])
    expect(result.coverage.priced).toBe(1)
    expect(result.coverage.uncovered).toBe(4)
    expect(result.cost.total.toFixed()).toBe('0.22')
    expect(result.coverage.byReason['cache-write']).toBe(1)
  })

  it('claims no peak tiers when nothing was priced', () => {
    const row = attempt({ completeness: 'usage-missing' })
    const result = priceLedger(ledgerOf([row]), settingsOf([flashPlan()]))
    expect(result.coverage.priced).toBe(0)
    expect(result.coverage.peakTiered).toBe(false)
  })

  it('reports a plan without peak tiers as untiered', () => {
    const flat = flashPlan({
      schedule: null,
      ratesPerMillion: { offPeak: { cacheMiss: '0.22', cacheHit: '0.007', output: '0.66' } },
    })
    const row = attempt({ uncachedInputTokens: 1_000_000, cacheReadTokens: 0, outputTokens: 0 })
    const result = priceLedger(ledgerOf([row]), settingsOf([flat]))
    expect(result.coverage.peakTiered).toBe(false)
    expect(result.coverage.peak).toBe(0)
    expect(result.cost.total.toFixed()).toBe('0.22')
  })
})

describe('shipped official snapshot', () => {
  it('prices exactly two models, with one flash price covering its ids', () => {
    expect(officialSeedPlans).toHaveLength(2)
    const [flash, pro] = officialSeedPlans
    expect(flash!.modelIds).toEqual(['deepseek-flash', 'deepseek-v4-flash', 'deepseek-v4-flash-vision-exp'])
    expect(pro!.modelIds).toEqual(['deepseek-v4-pro'])
    // The yuan figures the Chinese page prints, which are the primary
    // published numbers; the English page prints their rounded USD conversion.
    expect(flash!.ratesPerMillion).toEqual({
      offPeak: { cacheMiss: '1', cacheHit: '0.02', output: '4' },
      peak: { cacheMiss: '2', cacheHit: '0.04', output: '8' },
    })
    expect(pro!.ratesPerMillion).toEqual({
      offPeak: { cacheMiss: '4.5', cacheHit: '0.15', output: '13.5' },
      peak: { cacheMiss: '9', cacheHit: '0.3', output: '27' },
    })
    expect(flash!.currency).toBe('CNY')
    expect(flash!.provenance?.url).toContain('/zh-cn/')
  })

  it('expands a page-listed flash id to the whole family and leaves others alone', () => {
    expect(expandOfficialModelIds('deepseek-flash')).toEqual(['deepseek-flash', 'deepseek-v4-flash', 'deepseek-v4-flash-vision-exp'])
    expect(expandOfficialModelIds('deepseek-v4-flash')).toEqual(['deepseek-flash', 'deepseek-v4-flash', 'deepseek-v4-flash-vision-exp'])
    expect(expandOfficialModelIds('deepseek-v4-pro')).toEqual(['deepseek-v4-pro'])
    expect(expandOfficialModelIds('some-future-model')).toEqual(['some-future-model'])
  })

  it('prices a session at the selected plan’s shipped rates', () => {
    // An id no plan names is still priced: the selected plan is the basis, so
    // a deployment's own model id needs no mapping.
    const row = attempt({ model: 'deepseek-v4.1-flash-expires-on-0910', uncachedInputTokens: 1_000_000, cacheReadTokens: 0, outputTokens: 0 })
    const priced = priceLedger(ledgerOf([row]), defaultSettings())
    expect(priced.coverage.priced).toBe(1)
    expect(priced.cost.total.toFixed()).toBe('1')
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
    // Either end of the rate period may stand alone: an official snapshot knows
    // no start, and a superseded rate knows its end without its beginning.
    expect(pricingPlanSchema.safeParse(flashPlan({ effectiveFrom: undefined })).success).toBe(true)
    expect(pricingPlanSchema.safeParse(flashPlan({ effectiveFrom: undefined, effectiveTo: '2026-08-16' })).success).toBe(true)
    // A period that ends before it starts is still refused.
    expect(pricingPlanSchema.safeParse(flashPlan({ effectiveFrom: '2026-09-10', effectiveTo: '2026-08-16' })).success).toBe(false)
  })

  it('keeps the currency a plan was published in, and refuses an unknown one', () => {
    expect(pricingPlanSchema.safeParse(flashPlan({ currency: 'CNY' })).success).toBe(true)
    expect(pricingPlanSchema.safeParse({ ...flashPlan(), currency: 'EUR' }).success).toBe(false)
  })

  it('prices the same tokens identically whatever currency the plan is in', () => {
    // The engine multiplies plain decimals; the unit is the plan's, and no
    // conversion happens anywhere.
    const row = attempt({ uncachedInputTokens: 1_000_000, cacheReadTokens: 0, outputTokens: 0 })
    const usd = priceLedger(ledgerOf([row]), settingsOf([flashPlan()]))
    const cny = priceLedger(ledgerOf([row]), settingsOf([flashPlan({ currency: 'CNY' })]))
    expect(cny.cost.total.toFixed()).toBe(usd.cost.total.toFixed())
  })

  it('upgrades a v1 blob, keeping its plans and selection', () => {
    const plans = [...officialSeedPlans]
    const upgraded = parsePersistedSettings({
      schemaVersion: 1,
      selectedPlanId: plans[1]!.id,
      mode: 'effective',
      plans,
      aliases: { 'deepseek-v4.1-flash-expires-on-0910': 'deepseek-v4-flash-vision-exp' },
      lastOfficialRefresh: '2026-09-10T00:00:00.000Z',
    })
    expect(upgraded).toEqual({
      schemaVersion: 2,
      selectedPlanId: plans[1]!.id,
      plans,
      lastOfficialRefresh: '2026-09-10T00:00:00.000Z',
    })
  })

  it('reads the retired keys a merged write leaves behind', () => {
    // Settings writes merge plain objects recursively, so the keys dropped from
    // this schema stay in the stored document after the first write — the exact
    // blob a version 1 install has on disk once it switches plans.
    const plans = [...officialSeedPlans]
    const read = parsePersistedSettings({
      schemaVersion: 2,
      selectedPlanId: plans[1]!.id,
      mode: 'effective',
      plans,
      aliases: { 'deepseek-v4.1-flash-expires-on-0910': 'deepseek-flash' },
    })
    expect(read).toEqual({ schemaVersion: 2, selectedPlanId: plans[1]!.id, plans })
  })

  it('returns undefined for a corrupted blob', () => {
    expect(parsePersistedSettings({ schemaVersion: 0, plans: [] })).toBeUndefined()
    expect(parsePersistedSettings({ ...defaultSettings(), plans: [] })).toBeUndefined()
    expect(parsePersistedSettings({ ...defaultSettings(), selectedPlanId: '' })).toBeUndefined()
    // A v1 blob whose own fields are invalid is still unreadable.
    expect(parsePersistedSettings({ schemaVersion: 1, selectedPlanId: 'x', mode: 'effective', plans: [] })).toBeUndefined()
  })
})
