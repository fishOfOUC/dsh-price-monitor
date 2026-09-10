/**
 * The official DeepSeek price history shipped with this plugin, so the tab is
 * usable offline on first launch: one plan per pricing era, each carrying a
 * rate table per model group. It is a reviewed point-in-time fact, not a live
 * price oracle — the plan card shows each era's source and period, and the host
 * route refreshes the current era (see official-pricing-route.ts) into new
 * immutable versions.
 *
 * Reviewed 2026-09-10 against
 * https://api-docs.deepseek.com/zh-cn/quick_start/pricing/, all rates in CNY per
 * million tokens — the Chinese page prints the primary numbers and the English
 * page prints their rounded USD conversion, so this snapshot keeps the former
 * and converts nothing. Peak windows are UTC, Monday–Friday, 01:00–04:00 and
 * 06:00–10:00 (left-closed, right-open), which the page states as Beijing time
 * 09:00–12:00 and 14:00–18:00.
 *
 * The three eras are the flash model's published history: one flat price before
 * the 2026-08-17 increase, that increase's peak/off-peak tiers, and the cut in
 * force now. Vision is a capability of the flash model rather than a separate
 * price line, so one group covers the ids it has been listed or reported under
 * ({@link FLASH_MODEL_IDS}). The pro model belongs to the current era only:
 * the page states its requests are served by DeepSeek-V4.1-Flash and billed at
 * Flash prices from 2026-09-14, and earlier pro rates were never published in a
 * form this catalog recorded. Availability and naming change without notice;
 * the refresh route is the way to re-read them.
 *
 * @module dsh-price-monitor/pricing/official-seed
 */

import type { PeakSchedule, PersistedSettings, PlanEntry, PricingPlan } from './schema.ts'

const SOURCE_URL = 'https://api-docs.deepseek.com/zh-cn/quick_start/pricing/'
const SNAPSHOT_DATE = '2026-09-10'
const SOURCE_CURRENCY = 'CNY'

/** Shared peak schedule for every model group in the current era. */
const OFFICIAL_SCHEDULE: PeakSchedule = {
  timezone: 'UTC',
  peakWeekdays: [1, 2, 3, 4, 5],
  peakWindows: [['01:00', '04:00'], ['06:00', '10:00']],
}

/**
 * The flash model's ids: the page's current name, the id earlier pages and
 * harness builds reported it under, and the id sessions recorded while vision
 * was listed as its own price line used. One price tier, so one group covers
 * them.
 */
export const FLASH_MODEL_IDS: readonly string[] = [
  'deepseek-flash',
  'deepseek-v4-flash',
  'deepseek-v4-flash-vision-exp',
]

/** The pro model's ids, priced by the current era's own table. */
export const PRO_MODEL_IDS: readonly string[] = ['deepseek-v4-pro']

/** The rates one era charged, per million tokens, as decimal strings. */
interface EraRates {
  readonly cacheHit: string
  readonly cacheMiss: string
  readonly output: string
  /** Absent on an era that charged one flat price. */
  readonly peakCacheHit?: string
  readonly peakCacheMiss?: string
  readonly peakOutput?: string
}

const FLASH_CURRENT: EraRates = { cacheHit: '0.02', cacheMiss: '1', output: '4', peakCacheHit: '0.04', peakCacheMiss: '2', peakOutput: '8' }
const PRO_CURRENT: EraRates = { cacheHit: '0.15', cacheMiss: '4.5', output: '13.5', peakCacheHit: '0.3', peakCacheMiss: '9', peakOutput: '27' }
/** Before the increase: one flat price, cache hit and miss already at today's levels. */
const FLASH_BEFORE: EraRates = { cacheHit: '0.02', cacheMiss: '1', output: '2' }
/** The increase: the peak column the era published, its off-peak half. */
const FLASH_RAISED: EraRates = { cacheHit: '0.05', cacheMiss: '1.5', output: '4.5', peakCacheHit: '0.1', peakCacheMiss: '3', peakOutput: '9' }

function entryOf(models: readonly string[], rates: EraRates): PlanEntry {
  return {
    models: [...models],
    offPeak: { cacheMiss: rates.cacheMiss, cacheHit: rates.cacheHit, output: rates.output },
    ...rates.peakCacheHit === undefined || rates.peakCacheMiss === undefined || rates.peakOutput === undefined
      ? {}
      : { peak: { cacheMiss: rates.peakCacheMiss, cacheHit: rates.peakCacheHit, output: rates.peakOutput } },
  }
}

/** Stable short content hash so a plan id is derived from its rates. */
function hash8(text: string): string {
  let hash = 5381
  for (let index = 0; index < text.length; index += 1) {
    hash = ((hash << 5) + hash + text.charCodeAt(index)) >>> 0
  }
  return hash.toString(16).padStart(8, '0')
}

function eraPlan(input: {
  readonly slug: string
  readonly name: string
  readonly entries: readonly PlanEntry[]
  readonly schedule: PeakSchedule | null
  readonly effectiveFrom?: string
  readonly effectiveTo?: string
}): PricingPlan {
  const content = input.entries
    .map(entry => [
      entry.models.join(','),
      entry.offPeak.cacheHit, entry.offPeak.cacheMiss, entry.offPeak.output,
      entry.peak?.cacheHit ?? '', entry.peak?.cacheMiss ?? '', entry.peak?.output ?? '',
    ].join('/'))
    .join('|')
  return {
    id: `era:${input.slug}:${SNAPSHOT_DATE}:${hash8(content)}`,
    name: input.name,
    source: 'manual',
    provider: 'deepseek-official',
    currency: SOURCE_CURRENCY,
    schedule: input.schedule,
    entries: [...input.entries],
    // A period is a label for the plan card, never a gate on pricing.
    ...input.effectiveFrom === undefined ? {} : { effectiveFrom: input.effectiveFrom },
    ...input.effectiveTo === undefined ? {} : { effectiveTo: input.effectiveTo },
    provenance: {
      url: SOURCE_URL,
      fetchedAt: `${SNAPSHOT_DATE}T00:00:00.000Z`,
      contentHash: `seed-era-${input.slug}-${SNAPSHOT_DATE}`,
    },
  }
}

/** The shipped plan catalog: one plan per published flash-pricing era, oldest first. */
export const officialSeedPlans: readonly PricingPlan[] = [
  eraPlan({
    slug: 'before-hike',
    name: '涨价前（8-17 前）',
    entries: [entryOf(FLASH_MODEL_IDS, FLASH_BEFORE)],
    schedule: null,
    effectiveTo: '2026-08-16',
  }),
  eraPlan({
    slug: 'hike',
    name: '涨价后（8-17 起）',
    entries: [entryOf(FLASH_MODEL_IDS, FLASH_RAISED)],
    schedule: OFFICIAL_SCHEDULE,
    effectiveFrom: '2026-08-17',
    effectiveTo: SNAPSHOT_DATE,
  }),
  eraPlan({
    slug: 'current',
    name: '降价后（现行官方价）',
    entries: [entryOf(FLASH_MODEL_IDS, FLASH_CURRENT), entryOf(PRO_MODEL_IDS, PRO_CURRENT)],
    schedule: OFFICIAL_SCHEDULE,
  }),
]

/** Default settings: the shipped eras with the one in force selected. */
export function defaultSettings(): PersistedSettings {
  return {
    schemaVersion: 3,
    selectedPlanId: officialSeedPlans[officialSeedPlans.length - 1]!.id,
    plans: [...officialSeedPlans],
  }
}

/**
 * The shipped era in force: the one that declares no end. The refresh route
 * compares the live page against it, and applying a fetch replaces it.
 * @returns the current-era plan (the newest shipped plan when none declares an open end).
 */
export function currentEraPlan(): PricingPlan {
  return officialSeedPlans.find(plan => plan.effectiveTo === undefined)
    ?? officialSeedPlans[officialSeedPlans.length - 1]!
}

/**
 * Every id a page-listed model also answers to. The page names the flash model
 * by its current id; a deployment or an older session may report one of
 * {@link FLASH_MODEL_IDS} instead. A refresh-applied plan therefore keeps the
 * same coverage the shipped seed has, while its rates still come only from the
 * page.
 * @param model - the page's model id.
 * @returns the ids the group should cover (the input alone when none is known).
 */
export function expandOfficialModelIds(model: string): string[] {
  return FLASH_MODEL_IDS.includes(model) ? [...FLASH_MODEL_IDS] : [model]
}
