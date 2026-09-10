/**
 * Pricing-plan and persisted-settings vocabulary: strict zod schemas plus the
 * inferred types. Rates are decimal strings, never JS numbers; the pricing
 * engine converts them with decimal.js and never rounds intermediate values.
 *
 * @module dsh-price-monitor/pricing/schema
 */

import { z, type ZodType } from 'zod'

/** A non-negative decimal string (integer or fixed-point, no exponent). */
const decimalRate = z.string().regex(/^(0|[1-9]\d*)(\.\d+)?$/, 'must be a non-negative decimal string')

/** `HH:MM`, 24-hour clock, minutes 0–59. */
const clock = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'must be HH:MM')

/** An ISO calendar date `YYYY-MM-DD`. */
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'must be YYYY-MM-DD')

const peakWindow = z.tuple([clock, clock])

/** The three billed buckets of one plan band, per million tokens, as decimal strings. */
export const rateBandSchema = z.object({
  cacheMiss: decimalRate,
  cacheHit: decimalRate,
  output: decimalRate,
}).strict()

/** Peak schedule: UTC weekdays (ISO 1=Monday … 7=Sunday) and disjoint windows. */
const peakScheduleSchema = z.object({
  timezone: z.literal('UTC'),
  peakWeekdays: z.array(z.number().int().min(1).max(7)).min(1),
  peakWindows: z.array(peakWindow).min(1),
}).strict().superRefine((schedule, context) => {
  const parse = (value: string): number => {
    const [hour, minute] = value.split(':').map(Number)
    return hour! * 60 + minute!
  }
  let previous = -1
  for (const [start, end] of schedule.peakWindows) {
    const from = parse(start)
    const to = parse(end)
    if (from >= to) {
      context.addIssue({ code: 'custom', message: `peak window ${start}–${end} must start before it ends` })
    }
    if (from <= previous) {
      context.addIssue({ code: 'custom', message: `peak windows must be sorted and non-overlapping (${start}–${end})` })
    }
    previous = to
  }
})

export const provenanceSchema = z.object({
  url: z.string(),
  fetchedAt: z.string(),
  contentHash: z.string(),
}).strict()

/**
 * One pricing plan. `source: 'official'` plans are immutable catalog entries
 * the user copies before editing; `source: 'manual'` plans are user-owned.
 * Rates are per million tokens, as decimal strings.
 */
export const pricingPlanSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  source: z.enum(['official', 'manual']),
  provider: z.literal('deepseek-official'),
  modelIds: z.array(z.string().min(1)).min(1),
  currency: z.literal('USD'),
  /**
   * First UTC date the plan is in force. Absent means "no known start": the
   * plan applies back to the beginning of the log and is superseded by any
   * later-fetched plan naming the same model. An official snapshot omits it —
   * a fetch observes today's rates, it does not learn when they began — while
   * a hand-entered historical plan states its window.
   */
  effectiveFrom: isoDate.optional(),
  effectiveTo: isoDate.optional(),
  schedule: peakScheduleSchema.nullable(),
  ratesPerMillion: z.object({
    offPeak: rateBandSchema,
    peak: rateBandSchema.optional(),
  }).strict(),
  provenance: provenanceSchema.optional(),
}).strict().superRefine((plan, context) => {
  if (plan.effectiveFrom === undefined && plan.effectiveTo !== undefined) {
    context.addIssue({ code: 'custom', message: 'a plan with no known start cannot also declare an end' })
  }
  if (plan.effectiveFrom !== undefined && plan.effectiveTo !== undefined
    && plan.effectiveTo <= plan.effectiveFrom) {
    context.addIssue({ code: 'custom', message: 'effectiveTo must be after effectiveFrom' })
  }
  // A peak band is only meaningful with a peak schedule, and a schedule
  // without a peak band cannot be priced.
  const hasSchedule = plan.schedule !== null
  const hasPeak = plan.ratesPerMillion.peak !== undefined
  if (hasSchedule !== hasPeak) {
    context.addIssue({ code: 'custom', message: 'peak band must be present exactly when a peak schedule is present' })
  }
})

export const pricingPlanSchemaStrict: ZodType<PricingPlan> = pricingPlanSchema

/** One official/manual plan (inferred from the schema). */
export type PricingPlan = z.infer<typeof pricingPlanSchema>
export type RateBand = z.infer<typeof rateBandSchema>
export type PeakSchedule = z.infer<typeof peakScheduleSchema>

/** Pricing mode: historical per-attempt plan, or reprice everything at one plan. */
export type PricingMode = 'effective' | 'reprice'

/**
 * The single persisted settings blob under `pluginSettings['price-monitor'].catalog`.
 *
 * `aliases` maps a deployment's own model id onto one named by a plan, so a
 * harness that exposes the same underlying model under a different id can be
 * priced without touching the read-only official plans or guessing an id into
 * the shipped snapshot. A target that no plan names simply stays unpriced.
 */
export const persistedSettingsSchema = z.object({
  schemaVersion: z.literal(1),
  selectedPlanId: z.string().min(1),
  mode: z.enum(['effective', 'reprice']),
  plans: z.array(pricingPlanSchema).min(1),
  aliases: z.record(z.string().min(1), z.string().min(1)).optional(),
  lastOfficialRefresh: z.string().optional(),
}).strict()

export type PersistedSettings = z.infer<typeof persistedSettingsSchema>

/**
 * Parse a stored settings blob; failures (corruption, unknown fields, an
 * older schema) yield undefined so the caller can offer a reset instead of
 * silently dropping the user's manual plans.
 * @param value - the persisted blob.
 * @returns the validated settings, or undefined when unreadable.
 */
export function parsePersistedSettings(value: unknown): PersistedSettings | undefined {
  const result = persistedSettingsSchema.safeParse(value)
  return result.success ? result.data : undefined
}

/**
 * Replace every official-source plan with a freshly fetched candidate set and
 * stamp the refresh time. Manual plans are preserved. The caller (the client)
 * runs this only after the user confirms a diff; the host route never writes
 * settings itself.
 * @param settings - current settings.
 * @param officialPlans - the confirmed candidate plans.
 * @param fetchedAt - ISO timestamp of the successful fetch.
 * @returns the updated settings; the selected plan id is kept when it still exists.
 */
export function applyOfficialCandidate(
  settings: PersistedSettings,
  officialPlans: readonly PricingPlan[],
  fetchedAt: string,
): PersistedSettings {
  const plans = [...settings.plans.filter(plan => plan.source !== 'official'), ...officialPlans]
  const selectedPlanId = plans.some(plan => plan.id === settings.selectedPlanId)
    ? settings.selectedPlanId
    : officialPlans[0]?.id ?? plans[0]?.id ?? ''
  return { ...settings, selectedPlanId, plans, lastOfficialRefresh: fetchedAt }
}
