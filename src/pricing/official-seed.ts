/**
 * The official DeepSeek price snapshot shipped with this plugin, so the tab
 * is usable offline on first launch. It is a reviewed point-in-time fact, not
 * a live price oracle: the UI shows the fetch date and a link to the source,
 * and the host route refreshes it (see stage D) into new immutable versions.
 *
 * Snapshot date 2026-09-10, source
 * https://api-docs.deepseek.com/zh-cn/quick_start/pricing/, all rates in CNY
 * per million tokens — the Chinese page prints the primary numbers and the
 * English page prints their rounded USD conversion, so this snapshot keeps the
 * former and converts nothing. Peak windows are UTC, Monday–Friday,
 * 01:00–04:00 and 06:00–10:00 (left-closed, right-open), which the page states
 * as Beijing time 09:00–12:00 and 14:00–18:00.
 *
 * The page lists two priced models — the flash model (DeepSeek-V4.1-Flash on
 * this snapshot) and the pro model. Vision is a capability of that flash model
 * rather than a separate price line, so one plan covers the ids the flash
 * model has been listed or reported under ({@link FLASH_MODEL_IDS}).
 * Availability and naming change without notice; the refresh route is the way
 * to re-read them.
 *
 * @module dsh-price-monitor/pricing/official-seed
 */

import type { PeakSchedule, PersistedSettings, PricingPlan } from './schema.ts'

const SOURCE_URL = 'https://api-docs.deepseek.com/zh-cn/quick_start/pricing/'
const SNAPSHOT_DATE = '2026-09-10'
const SOURCE_CURRENCY = 'CNY'

/** Shared peak schedule for every official model in this snapshot. */
const OFFICIAL_SCHEDULE: PeakSchedule = {
  timezone: 'UTC',
  peakWeekdays: [1, 2, 3, 4, 5],
  peakWindows: [['01:00', '04:00'], ['06:00', '10:00']],
}

interface ModelRates {
  /** Every id this priced model answers to; the first is the page's current one. */
  readonly models: readonly string[]
  readonly cacheHit: string
  readonly cacheMiss: string
  readonly output: string
  readonly peakCacheHit: string
  readonly peakCacheMiss: string
  readonly peakOutput: string
}

/**
 * The flash model's ids: the page's current name, the id earlier pages and
 * harness builds reported it under, and the id sessions recorded while vision
 * was listed as its own price line used. One price tier, so one plan covers
 * them.
 */
export const FLASH_MODEL_IDS: readonly string[] = [
  'deepseek-flash',
  'deepseek-v4-flash',
  'deepseek-v4-flash-vision-exp',
]

const MODELS: readonly ModelRates[] = [
  { models: FLASH_MODEL_IDS, cacheHit: '0.02', cacheMiss: '1', output: '4', peakCacheHit: '0.04', peakCacheMiss: '2', peakOutput: '8' },
  { models: ['deepseek-v4-pro'], cacheHit: '0.15', cacheMiss: '4.5', output: '13.5', peakCacheHit: '0.3', peakCacheMiss: '9', peakOutput: '27' },
]

/** Stable short content hash so a plan id is derived from its rates. */
function hash8(text: string): string {
  let hash = 5381
  for (let index = 0; index < text.length; index += 1) {
    hash = ((hash << 5) + hash + text.charCodeAt(index)) >>> 0
  }
  return hash.toString(16).padStart(8, '0')
}

function seedPlan(entry: ModelRates): PricingPlan {
  const content = [entry.cacheHit, entry.cacheMiss, entry.output, entry.peakCacheHit, entry.peakCacheMiss, entry.peakOutput].join('/')
  const [model] = entry.models
  return {
    id: `official:${model}:${SNAPSHOT_DATE}:${hash8(content)}`,
    name: `${model} · official`,
    source: 'official',
    provider: 'deepseek-official',
    modelIds: [...entry.models],
    currency: SOURCE_CURRENCY,
    // No declared start: the snapshot observes today's rates, so it applies
    // back to the beginning of the log and any later-fetched version wins.
    schedule: OFFICIAL_SCHEDULE,
    ratesPerMillion: {
      offPeak: { cacheMiss: entry.cacheMiss, cacheHit: entry.cacheHit, output: entry.output },
      peak: { cacheMiss: entry.peakCacheMiss, cacheHit: entry.peakCacheHit, output: entry.peakOutput },
    },
    provenance: {
      url: SOURCE_URL,
      fetchedAt: `${SNAPSHOT_DATE}T00:00:00.000Z`,
      contentHash: `seed-snapshot-${SNAPSHOT_DATE}`,
    },
  }
}

/** The shipped official plan catalog (one plan per model). */
export const officialSeedPlans: readonly PricingPlan[] = MODELS.map(seedPlan)

/** Default settings: the official snapshot with its first plan selected. */
export function defaultSettings(): PersistedSettings {
  return {
    schemaVersion: 2,
    selectedPlanId: officialSeedPlans[0]!.id,
    plans: [...officialSeedPlans],
  }
}

/**
 * Every id a page-listed model also answers to. The page names the flash model
 * by its current id; a deployment or an older session may report one of
 * {@link FLASH_MODEL_IDS} instead. A refresh-applied plan therefore keeps the
 * same coverage the shipped seed has, while its rates still come only from the
 * page.
 * @param model - the page's model id.
 * @returns the ids the plan should cover (the input alone when none is known).
 */
export function expandOfficialModelIds(model: string): string[] {
  return FLASH_MODEL_IDS.includes(model) ? [...FLASH_MODEL_IDS] : [model]
}
