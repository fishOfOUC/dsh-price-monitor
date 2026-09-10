/**
 * Exact pricing engine. Rates travel as decimal strings, are converted to
 * `Decimal` once, and every product/sum stays `Decimal` until the display
 * boundary — no binary float ever carries an amount, and nothing is rounded
 * before the final aggregate.
 *
 * Peak/off-peak is chosen from an attempt's UTC start time; the effective
 * plan is chosen from its UTC calendar date (left-closed, right-open
 * effective window). Aggregation order is attempt → turn → session, and each
 * layer carries the three cost buckets plus the total, so the per-turn rows
 * add up to the session card exactly.
 *
 * @module dsh-price-monitor/pricing/engine
 */

import { Decimal } from 'decimal.js'
import type { AttemptUsageRow, PriceMonitorUsageView, TurnUsageRow } from '../projection-types.ts'
import type { PeakSchedule, PersistedSettings, PricingMode, PricingPlan, RateBand } from './schema.ts'

/** Why one attempt was not priced exactly. */
export type AttemptPricingReason =
  | 'no-usage'
  | 'invalid'
  | 'no-route'
  | 'not-official'
  /** No plan names this model (after the alias map). */
  | 'no-plan'
  /** A plan names it, but no version of that plan is in force at the attempt's time. */
  | 'inactive-plan'
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
  readonly mode: PricingMode
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
     * Whether any priced attempt's plan declares a peak schedule. Distinguishes
     * "this session ran entirely off-peak" from "this plan has no peak tiers",
     * which are different facts and get different copy.
     */
    readonly peakTiered: boolean
  }
  /**
   * Comparison anchor for the top card: the selected plan applied to every
   * attempt it matches, or undefined when no comparison is meaningful.
   */
  readonly anchor?: { readonly planId: string; readonly total: Decimal }
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

/** The UTC calendar date `YYYY-MM-DD` of an epoch-ms timestamp. */
function utcDate(epochMs: number): string {
  return new Date(epochMs).toISOString().slice(0, 10)
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

/** The effective rate band for one plan at a timestamp. */
function bandFor(plan: PricingPlan, epochMs: number): RateBand {
  if (plan.schedule !== null && isPeak(plan.schedule, epochMs) && plan.ratesPerMillion.peak !== undefined) {
    return plan.ratesPerMillion.peak
  }
  return plan.ratesPerMillion.offPeak
}

/** Whether a plan is in force on a UTC date under its optional window. */
function inWindow(plan: PricingPlan, date: string): boolean {
  if (plan.effectiveFrom !== undefined && plan.effectiveFrom > date) return false
  return plan.effectiveTo === undefined || plan.effectiveTo > date
}

/**
 * Order two in-force candidates for one date: the later declared start wins,
 * then the later observation (`provenance.fetchedAt`) — so a refreshed official
 * plan supersedes the snapshot it was fetched after even though neither
 * declares a start — then array order.
 */
function preferred(left: PricingPlan, right: PricingPlan): PricingPlan {
  if (left.effectiveFrom !== right.effectiveFrom) {
    return (left.effectiveFrom ?? '') > (right.effectiveFrom ?? '') ? left : right
  }
  const leftFetched = left.provenance?.fetchedAt ?? ''
  const rightFetched = right.provenance?.fetchedAt ?? ''
  return leftFetched >= rightFetched ? left : right
}

/** Whether any plan in the catalog names this provider/model, ignoring windows. */
export function namesModel(plans: readonly PricingPlan[], provider: string, model: string): boolean {
  return plans.some(plan => plan.provider === provider && plan.modelIds.includes(model))
}

/**
 * The plan effective for one provider/model route at a timestamp: the
 * preferred candidate among those in force for the attempt's UTC date.
 * @param plans - the catalog.
 * @param provider - attempt provider.
 * @param model - attempt model (already alias-resolved).
 * @param epochMs - attempt start time.
 * @returns the matching plan, or undefined.
 */
export function planFor(
  plans: readonly PricingPlan[],
  provider: string,
  model: string,
  epochMs: number,
): PricingPlan | undefined {
  const date = utcDate(epochMs)
  let best: PricingPlan | undefined
  for (const plan of plans) {
    if (plan.provider !== provider || !plan.modelIds.includes(model)) continue
    if (!inWindow(plan, date)) continue
    best = best === undefined ? plan : preferred(best, plan)
  }
  return best
}

/** Every attempt this view actually priced, in turn order. */
function attemptsOf(turns: readonly PricedTurn[]): AttemptUsageRow[] {
  return turns.flatMap(turn =>
    turn.attempts.filter(entry => entry.cost !== undefined).map(entry => entry.row))
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

/** The three cost buckets of one attempt under one plan's band, per million tokens. */
function costOf(attempt: AttemptUsageRow, plan: PricingPlan, epochMs: number): AttemptCost {
  const band = bandFor(plan, epochMs)
  const divisor = new Decimal(1_000_000)
  const miss = new Decimal(attempt.uncachedInputTokens ?? 0).mul(band.cacheMiss).div(divisor)
  const hit = new Decimal(attempt.cacheReadTokens ?? 0).mul(band.cacheHit).div(divisor)
  const output = new Decimal(attempt.outputTokens ?? 0).mul(band.output).div(divisor)
  return { miss, hit, output, total: miss.plus(hit).plus(output) }
}

/**
 * The provider/model facts an *attributed* cost needs. A row missing usage, or
 * whose usage failed validation, or whose cache split cannot be separated, has
 * no priceable tokens at all and stays unpriced under every mode.
 */
function tokenBlocker(attempt: AttemptUsageRow): AttemptPricingReason | undefined {
  if (attempt.completeness === 'usage-missing') return 'no-usage'
  if (attempt.completeness === 'invalid') return 'invalid'
  if (attempt.cacheWriteTokens !== undefined && attempt.cacheWriteTokens > 0) return 'cache-write'
  if (attempt.cacheReadTokens === undefined) return 'no-split'
  return undefined
}

/**
 * Additionally required to attribute a cost to the session's actual spend: the
 * route must be the provider the plans describe, and it must be known.
 */
function attributionBlocker(attempt: AttemptUsageRow): AttemptPricingReason | undefined {
  if (attempt.provider !== 'deepseek-official') return 'not-official'
  const tokens = tokenBlocker(attempt)
  if (tokens !== undefined) return tokens
  if (attempt.completeness === 'route-missing') return 'no-route'
  return undefined
}

/**
 * Price one attempt under a chosen plan, or record why it cannot be priced.
 * The unresolved case distinguishes "no plan names this model" from "a plan
 * names it but none is in force at that time": the two need different fixes.
 */
function priceAttempt(
  attempt: AttemptUsageRow,
  resolve: (attempt: AttemptUsageRow) => PricingPlan | undefined,
  unpriceablePlan: (attempt: AttemptUsageRow) => AttemptPricingReason,
  blockerOf: (attempt: AttemptUsageRow) => AttemptPricingReason | undefined,
): PricedAttempt {
  const blocker = blockerOf(attempt)
  if (blocker !== undefined) return { row: attempt, reason: blocker }
  const plan = resolve(attempt)
  if (plan === undefined) return { row: attempt, reason: unpriceablePlan(attempt) }
  return {
    row: attempt,
    planId: plan.id,
    planName: plan.name,
    peak: plan.schedule !== null && isPeak(plan.schedule, attempt.startedAt),
    cost: costOf(attempt, plan, attempt.startedAt),
  }
}

/**
 * Resolve an attempt's model id through the catalog's alias map: a deployment
 * that exposes the same underlying model under its own id is priced by the
 * plan naming the aliased id. An unmapped id is returned unchanged.
 * @param aliases - the catalog's alias map.
 * @param model - the attempt's reported model id.
 * @returns the model id to match plans against.
 */
export function resolveModelAlias(
  aliases: Readonly<Record<string, string>> | undefined,
  model: string,
): string {
  return aliases?.[model] ?? model
}

/**
 * Price a whole ledger under the persisted settings.
 * @param ledger - the projection wire value.
 * @param settings - the persisted catalog and mode.
 * @returns the exact per-attempt/per-turn/session result.
 */
export function priceLedger(ledger: PriceMonitorUsageView, settings: PersistedSettings): PriceView {
  const selectedPlan = settings.plans.find(plan => plan.id === settings.selectedPlanId)
  const aliases = settings.aliases
  const modelOf = (attempt: AttemptUsageRow): string =>
    resolveModelAlias(aliases, attempt.model ?? '')
  const reprice = settings.mode === 'reprice'
  // Reprice is a counterfactual over the same tokens: "what would these have
  // cost at the selected plan's rates". The model and provider that produced
  // them are exactly what the user is substituting away, so neither may gate
  // the simulation — only the token facts themselves can.
  const resolve = reprice
    ? (): PricingPlan | undefined => selectedPlan
    : (attempt: AttemptUsageRow): PricingPlan | undefined =>
      planFor(settings.plans, attempt.provider ?? '', modelOf(attempt), attempt.startedAt)
  const blockerOf = reprice ? tokenBlocker : attributionBlocker

  const byReason: Record<AttemptPricingReason, number> = {
    'no-usage': 0,
    invalid: 0,
    'no-route': 0,
    'not-official': 0,
    'no-plan': 0,
    'inactive-plan': 0,
    'no-split': 0,
    'cache-write': 0,
  }
  const unpriceablePlan = (attempt: AttemptUsageRow): AttemptPricingReason => {
    // Reprice has no plan at all when nothing is selected.
    if (reprice) return 'no-plan'
    return namesModel(settings.plans, attempt.provider ?? '', modelOf(attempt)) ? 'inactive-plan' : 'no-plan'
  }
  let priced = 0
  let uncovered = 0
  const turns: PricedTurn[] = []

  for (const row of ledger.turns) {
    const attempts = row.attempts.map(attempt => {
      const result = priceAttempt(attempt, resolve, unpriceablePlan, blockerOf)
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

  const peakTiered = settings.plans.some(plan =>
    plan.schedule !== null && turns.some(turn => turn.attempts.some(entry => entry.planId === plan.id)))
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

  // Comparison anchor: the attempts this view priced, re-priced at the
  // selected plan's rates — a rate comparison over the same tokens, so the
  // delta never mixes in a coverage difference.
  let anchor: PriceView['anchor']
  if (selectedPlan !== undefined && !reprice) {
    const pricedRows = attemptsOf(turns)
    if (pricedRows.length > 0) {
      anchor = {
        planId: selectedPlan.id,
        total: sumCost(pricedRows.map(attempt => costOf(attempt, selectedPlan, attempt.startedAt))).total,
      }
    }
  }

  return {
    mode: settings.mode,
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
    ...anchor === undefined ? {} : { anchor },
  }
}

/** Human `$` formatting with an adaptive 4–8 decimal places for the top card. */
export function formatUsd(value: Decimal, decimals: number): string {
  return `$${value.toFixed(decimals)}`
}
