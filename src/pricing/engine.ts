/**
 * Exact pricing engine. Rates travel as decimal strings, are converted to
 * `Decimal` once, and every product/sum stays `Decimal` until the display
 * boundary — no binary float ever carries an amount, and nothing is rounded
 * before the final aggregate.
 *
 * The selected plan is the sole pricing basis, and a plan is a whole era: it
 * prices every attempt of the session, and within it each attempt is priced by
 * the rate table its own model belongs to, so a session that switched models
 * mid-way is still priced model by model. A model the era does not list falls
 * back to the plan's first group (the era's headline rates), and the attempt
 * records which group priced it.
 *
 * Peak/off-peak is chosen from an attempt's UTC start time, with the schedule
 * the plan shares across its groups. Aggregation order is attempt → turn →
 * session, and each layer carries the three cost buckets plus the total, so the
 * per-turn rows add up to the session card exactly.
 *
 * @module dsh-price-monitor/pricing/engine
 */

import { Decimal } from 'decimal.js'
import type { AttemptUsageRow, PriceMonitorUsageView, TurnUsageRow } from '../projection-types.ts'
import type { PeakSchedule, PersistedSettings, PlanEntry, PricingPlan, RateBand } from './schema.ts'

/** Why one attempt was not priced exactly. */
export type AttemptPricingReason =
  | 'no-usage'
  | 'invalid'
  /** No plan is selected, so there is no rate to apply. */
  | 'no-plan'
  | 'no-split'
  | 'cache-write'

/** One attempt's three billed buckets plus total, as exact decimals. */
export interface AttemptCost {
  readonly miss: Decimal
  readonly hit: Decimal
  readonly output: Decimal
  readonly total: Decimal
}

/** One attempt after pricing. */
export interface PricedAttempt {
  readonly row: AttemptUsageRow
  /** The plan that priced the attempt (present only when priced). */
  readonly planId?: string
  /** Display name of that plan. */
  readonly planName?: string
  /** The plan group that priced it (its first model id), when substitution happened. */
  readonly pricedAs?: string
  /** Whether the plan's peak band applied (chosen from the attempt's UTC start time). */
  readonly peak?: boolean
  readonly cost?: AttemptCost
  readonly reason?: AttemptPricingReason
}

/** One turn after pricing. */
export interface PricedTurn {
  readonly row: TurnUsageRow
  readonly attempts: readonly PricedAttempt[]
  readonly cost: AttemptCost
  readonly tokens: { readonly uncachedInput: number; readonly cacheRead: number; readonly output: number; readonly total: number }
  readonly priced: number
  /** Priced attempts that used a peak band (display note; costs already include it). */
  readonly peak: number
}

/** The whole-session pricing result. */
export interface PriceView {
  readonly selectedPlanId: string | undefined
  readonly turns: readonly PricedTurn[]
  readonly cost: AttemptCost
  readonly tokens: { readonly uncachedInput: number; readonly cacheRead: number; readonly output: number; readonly total: number }
  readonly coverage: {
    readonly priced: number
    readonly uncovered: number
    readonly byReason: Readonly<Record<AttemptPricingReason, number>>
    /** Priced attempts that used a peak band. */
    readonly peak: number
    /**
     * Whether the selected plan declares a peak schedule. Distinguishes "this
     * session ran entirely off-peak" from "this plan has no peak tiers", which
     * are different facts and get different copy.
     */
    readonly peakTiered: boolean
  }
}

/** The number of minutes after UTC midnight for an epoch-ms timestamp. */
function utcMinutes(epochMs: number): number {
  const date = new Date(epochMs)
  return date.getUTCHours() * 60 + date.getUTCMinutes()
}

/** ISO weekday, 1 = Monday … 7 = Sunday. */
function utcWeekday(epochMs: number): number {
  return ((new Date(epochMs).getUTCDay() + 6) % 7) + 1
}

/** Minutes after UTC midnight for an `HH:MM` clock string. */
function windowMinutes(clock: string): number {
  const [hour, minute] = clock.split(':').map(Number)
  return hour! * 60 + minute!
}

/** Whether a timestamp falls in a peak window of the schedule (left-closed, right-open). */
export function isPeak(schedule: PeakSchedule, epochMs: number): boolean {
  if (!schedule.peakWeekdays.includes(utcWeekday(epochMs))) return false
  const minutes = utcMinutes(epochMs)
  return schedule.peakWindows.some(([start, end]) => {
    return minutes >= windowMinutes(start) && minutes < windowMinutes(end)
  })
}

/** The rate band of one entry at a timestamp; peak only when the plan schedules it. */
function bandFor(plan: PricingPlan, entry: PlanEntry, epochMs: number): RateBand {
  if (plan.schedule !== null && entry.peak !== undefined && isPeak(plan.schedule, epochMs)) {
    return entry.peak
  }
  return entry.offPeak
}

/**
 * The group of a plan that prices one model: the group naming it, or the plan's
 * first group. The era's headline rates are the documented fallback for a model
 * the era does not list — a session that ran a model this era never priced is
 * still compared against it — and the priced attempt names the group it used.
 * @param plan - the selected plan.
 * @param model - the attempt's reported model id, when it has one.
 * @returns the entry that prices this attempt.
 */
export function entryFor(plan: PricingPlan, model: string | undefined): PlanEntry {
  if (model !== undefined) {
    const named = plan.entries.find(entry => entry.models.includes(model))
    if (named !== undefined) return named
  }
  return plan.entries[0]!
}

const ZERO = new Decimal(0)

function sumCost(parts: readonly AttemptCost[]): AttemptCost {
  let miss = ZERO
  let hit = ZERO
  let output = ZERO
  let total = ZERO
  for (const part of parts) {
    miss = miss.plus(part.miss)
    hit = hit.plus(part.hit)
    output = output.plus(part.output)
    total = total.plus(part.total)
  }
  return { miss, hit, output, total }
}

/** The three cost buckets of one attempt under one group's band, per million tokens. */
function costOf(attempt: AttemptUsageRow, plan: PricingPlan, entry: PlanEntry): AttemptCost {
  const band = bandFor(plan, entry, attempt.startedAt)
  const divisor = new Decimal(1_000_000)
  const miss = new Decimal(attempt.uncachedInputTokens ?? 0).mul(band.cacheMiss).div(divisor)
  const hit = new Decimal(attempt.cacheReadTokens ?? 0).mul(band.cacheHit).div(divisor)
  const output = new Decimal(attempt.outputTokens ?? 0).mul(band.output).div(divisor)
  return { miss, hit, output, total: miss.plus(hit).plus(output) }
}

/**
 * The token facts a price needs. An attempt whose usage was never reported,
 * failed validation, or reported cache-write tokens no plan has a rate for has
 * no priceable tokens at all, and one whose cache split cannot be separated
 * cannot use the split rates. Everything else about the attempt — its model,
 * its provider, whether a route was recorded — describes the request that
 * produced the tokens, not the rate they are being priced at.
 */
function tokenBlocker(attempt: AttemptUsageRow): AttemptPricingReason | undefined {
  if (attempt.completeness === 'usage-missing') return 'no-usage'
  if (attempt.completeness === 'invalid') return 'invalid'
  if (attempt.cacheWriteTokens !== undefined && attempt.cacheWriteTokens > 0) return 'cache-write'
  if (attempt.cacheReadTokens === undefined) return 'no-split'
  return undefined
}

/**
 * Price one attempt under the selected plan, or record why it cannot be priced.
 * @param attempt - the ledger row.
 * @param plan - the selected plan, or undefined when none is selected.
 * @returns the priced attempt, or the attempt with its reason.
 */
function priceAttempt(attempt: AttemptUsageRow, plan: PricingPlan | undefined): PricedAttempt {
  const blocker = tokenBlocker(attempt)
  if (blocker !== undefined) return { row: attempt, reason: blocker }
  if (plan === undefined) return { row: attempt, reason: 'no-plan' }
  const entry = entryFor(plan, attempt.model)
  const substituted = attempt.model === undefined || !entry.models.includes(attempt.model)
  return {
    row: attempt,
    planId: plan.id,
    planName: plan.name,
    ...substituted ? { pricedAs: entry.models[0]! } : {},
    peak: plan.schedule !== null && entry.peak !== undefined && isPeak(plan.schedule, attempt.startedAt),
    cost: costOf(attempt, plan, entry),
  }
}

/**
 * Price a whole ledger under the persisted settings.
 * @param ledger - the projection wire value.
 * @param settings - the persisted catalog and selection.
 * @returns the exact per-attempt/per-turn/session result.
 */
export function priceLedger(ledger: PriceMonitorUsageView, settings: PersistedSettings): PriceView {
  const selectedPlan = settings.plans.find(plan => plan.id === settings.selectedPlanId)

  const byReason: Record<AttemptPricingReason, number> = {
    'no-usage': 0,
    invalid: 0,
    'no-plan': 0,
    'no-split': 0,
    'cache-write': 0,
  }
  let priced = 0
  let uncovered = 0
  const turns: PricedTurn[] = []

  for (const row of ledger.turns) {
    const attempts = row.attempts.map(attempt => {
      const result = priceAttempt(attempt, selectedPlan)
      if (result.cost === undefined) {
        uncovered += 1
        byReason[result.reason!] += 1
      } else {
        priced += 1
      }
      return result
    })
    const pricedAttempts = attempts.filter((entry): entry is PricedAttempt & { cost: AttemptCost } => entry.cost !== undefined)
    const costs = pricedAttempts.map(entry => entry.cost)
    // Token counts are provider-reported facts, summed for every attempt that
    // carries them — priced or not. Only the money is partial.
    const uncachedInput = attempts.reduce((sum, entry) => sum + (entry.row.uncachedInputTokens ?? 0), 0)
    const cacheRead = attempts.reduce((sum, entry) => sum + (entry.row.cacheReadTokens ?? 0), 0)
    const output = attempts.reduce((sum, entry) => sum + (entry.row.outputTokens ?? 0), 0)
    turns.push({
      row,
      attempts,
      cost: sumCost(costs),
      tokens: {
        uncachedInput,
        cacheRead,
        output,
        total: uncachedInput + cacheRead + output,
      },
      priced: pricedAttempts.length,
      peak: pricedAttempts.filter(entry => entry.peak === true).length,
    })
  }

  const peakTiered = selectedPlan !== undefined && selectedPlan.schedule !== null && priced > 0
  const cost = sumCost(turns.map(turn => turn.cost))
  const uncachedInput = turns.reduce((sum, turn) => sum + turn.tokens.uncachedInput, 0)
  const cacheRead = turns.reduce((sum, turn) => sum + turn.tokens.cacheRead, 0)
  const output = turns.reduce((sum, turn) => sum + turn.tokens.output, 0)
  const tokens = {
    uncachedInput,
    cacheRead,
    output,
    total: uncachedInput + cacheRead + output,
  }

  return {
    selectedPlanId: selectedPlan?.id,
    turns,
    cost,
    tokens,
    coverage: {
      priced,
      uncovered,
      byReason,
      peak: turns.reduce((sum, turn) => sum + turn.peak, 0),
      peakTiered,
    },
  }
}
