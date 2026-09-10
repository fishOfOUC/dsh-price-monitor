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

/** A currency a set of published rates is denominated in. */
export const currencySchema = z.enum(['USD', 'CNY'])
export type Currency = z.infer<typeof currencySchema>

/**
 * One group of models that share a rate table inside a plan: DeepSeek prices
 * several models in one era, and sometimes bills one model at another's rates
 * (a retired model whose requests are served by its successor), so a rate table
 * belongs to a set of ids rather than to a single model.
 */
export const planEntrySchema = z.object({
  /** Every id these rates apply to; the first names the group. */
  models: z.array(z.string().min(1)).min(1),
  offPeak: rateBandSchema,
  peak: rateBandSchema.optional(),
}).strict()

/** The fields every generation of a plan shares. */
const planBase = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  source: z.enum(['official', 'manual']),
  provider: z.literal('deepseek-official'),
  currency: currencySchema,
  /**
   * The UTC dates this plan's rates applied, for the plan card's description.
   * Either end may be absent on its own: a snapshot observes today's rates and
   * knows no start, while a superseded era knows its end. The period is a label
   * only — the selected plan prices every attempt whatever date it ran, so no
   * amount depends on this window.
   */
  effectiveFrom: isoDate.optional(),
  effectiveTo: isoDate.optional(),
  /** Peak schedule shared by every entry; null prices one flat rate. */
  schedule: peakScheduleSchema.nullable(),
  provenance: provenanceSchema.optional(),
}).strict()

const planPeriodOrder = (plan: { effectiveFrom?: string, effectiveTo?: string }, context: z.RefinementCtx): void => {
  if (plan.effectiveFrom !== undefined && plan.effectiveTo !== undefined
    && plan.effectiveTo <= plan.effectiveFrom) {
    context.addIssue({ code: 'custom', message: 'effectiveTo must be after effectiveFrom' })
  }
}

/**
 * One pricing era: the rates one provider charged for a set of models over a
 * window. `source: 'official'` plans are immutable catalog entries the user
 * copies before editing; `source: 'manual'` plans are user-owned. Rates are per
 * million tokens, as decimal strings.
 *
 * A plan carries the currency its publisher printed, and no conversion is ever
 * applied: DeepSeek publishes the same rates as USD on the English page and as
 * CNY on the Chinese one, and the two are not the same numbers (the English
 * page rounds its conversion). An amount therefore always reads in the currency
 * of the plan that produced it.
 */
export const pricingPlanSchema = planBase.extend({
  /** Every model group this era prices. */
  entries: z.array(planEntrySchema).min(1),
}).strict().superRefine((plan, context) => {
  planPeriodOrder(plan, context)
  // A peak band is only meaningful with a peak schedule, and a schedule without
  // a peak band for a group cannot price that group at peak.
  for (const entry of plan.entries) {
    if ((plan.schedule !== null) !== (entry.peak !== undefined)) {
      context.addIssue({ code: 'custom', message: 'peak band must be present exactly when a peak schedule is present' })
    }
  }
  // One model id belongs to exactly one group, or which rates apply is a
  // question the plan does not answer.
  const seen = new Set<string>()
  for (const entry of plan.entries) {
    for (const model of entry.models) {
      if (seen.has(model)) context.addIssue({ code: 'custom', message: `model ${model} is listed by two entries` })
      seen.add(model)
    }
  }
})

/**
 * A plan as generations 1 and 2 stored it: one model-id list with one rate
 * table, before a plan could price several models.
 */
const legacyPlanSchema = planBase.extend({
  modelIds: z.array(z.string().min(1)).min(1),
  ratesPerMillion: z.object({
    offPeak: rateBandSchema,
    peak: rateBandSchema.optional(),
  }).strict(),
}).strict().superRefine((plan, context) => {
  planPeriodOrder(plan, context)
  if ((plan.schedule !== null) !== (plan.ratesPerMillion.peak !== undefined)) {
    context.addIssue({ code: 'custom', message: 'peak band must be present exactly when a peak schedule is present' })
  }
})

export const pricingPlanSchemaStrict: ZodType<PricingPlan> = pricingPlanSchema

/** One official/manual era plan (inferred from the schema). */
export type PricingPlan = z.infer<typeof pricingPlanSchema>
export type PlanEntry = z.infer<typeof planEntrySchema>
export type RateBand = z.infer<typeof rateBandSchema>
export type PeakSchedule = z.infer<typeof peakScheduleSchema>

/**
 * The single persisted settings blob under `pluginSettings['price-monitor'].catalog`.
 *
 * The selected plan is the whole pricing basis: it prices every attempt of the
 * session, so switching plans changes every amount the tab shows.
 *
 * Unknown keys are stripped, not rejected: every write goes through the
 * settings service as a patch whose plain objects merge recursively and whose
 * arrays replace wholesale, so a key this schema no longer declares stays in
 * the stored document forever. The retired generation-1 keys (`mode`,
 * `aliases`) and the generation-2 plan fields (`modelIds`, `ratesPerMillion`)
 * are therefore simply absent here, and a generation-1 or generation-2 blob
 * reads as the current one.
 */
export const persistedSettingsSchema = z.object({
  schemaVersion: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  selectedPlanId: z.string().min(1),
  plans: z.array(z.union([pricingPlanSchema, legacyPlanSchema])).min(1),
  lastOfficialRefresh: z.string().optional(),
})

export type PersistedSettings = Omit<z.infer<typeof persistedSettingsSchema>, 'schemaVersion' | 'plans'> & {
  /** The generation this build writes; earlier generations read as version 3. */
  readonly schemaVersion: 3
  readonly plans: readonly PricingPlan[]
}

/** Wrap a plan stored with one model-id list and one rate table into an entry. */
function entryOfLegacyPlan(plan: z.infer<typeof legacyPlanSchema>): PricingPlan {
  const { modelIds, ratesPerMillion, ...rest } = plan
  return {
    ...rest,
    entries: [{
      models: modelIds,
      offPeak: ratesPerMillion.offPeak,
      ...ratesPerMillion.peak === undefined ? {} : { peak: ratesPerMillion.peak },
    }],
  }
}

/**
 * Merge official plans that one fetch produced into a single era plan: the page
 * describes the rates in force, not one plan per model, and the merged plan is
 * what a refresh replaces. Any other plan is left alone.
 */
function mergeOfficialFetches(plans: readonly PricingPlan[]): PricingPlan[] {
  const merged: PricingPlan[] = []
  const byFetch = new Map<string, number>()
  for (const plan of plans) {
    const fetched = plan.source === 'official' ? plan.provenance?.contentHash : undefined
    const index = fetched === undefined ? undefined : byFetch.get(fetched)
    if (index === undefined) {
      if (fetched !== undefined) byFetch.set(fetched, merged.length)
      merged.push(plan)
      continue
    }
    const existing = merged[index]!
    merged[index] = { ...existing, entries: [...existing.entries, ...plan.entries] }
  }
  return merged
}

/**
 * Parse a stored settings blob; failures (an unreadable structure, a schema
 * generation this build does not know) yield undefined so the caller can offer
 * a reset instead of silently dropping the user's manual plans. Every readable
 * generation is normalized to the current one: a plan stored before a plan could
 * price several models becomes a one-entry plan, and official plans one fetch
 * produced become one era plan.
 * @param value - the persisted blob.
 * @returns the validated settings, normalized to the current schema version.
 */
export function parsePersistedSettings(value: unknown): PersistedSettings | undefined {
  const parsed = persistedSettingsSchema.safeParse(value)
  if (!parsed.success) return undefined
  const plans = mergeOfficialFetches(parsed.data.plans.map(plan =>
    'entries' in plan ? plan : entryOfLegacyPlan(plan)))
  const selectedPlanId = plans.some(plan => plan.id === parsed.data.selectedPlanId)
    ? parsed.data.selectedPlanId
    : plans[0]!.id
  return {
    schemaVersion: 3,
    selectedPlanId,
    plans,
    ...parsed.data.lastOfficialRefresh === undefined ? {} : { lastOfficialRefresh: parsed.data.lastOfficialRefresh },
  }
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
