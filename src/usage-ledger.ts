/**
 * The `priceMonitorUsage` projection unit: a pure whole-session fold of the
 * durable lifecycle events into one per-attempt token ledger.
 *
 * The fold mirrors the per-turn attempt semantics of the harness's own
 * `deriveTurnTokenUsage` (packages/llm/token-meter/src/turn-usage.ts) — the
 * same usage-sample validation rules and the same step/retry lifecycle — but
 * keeps every attempt as its own row with timestamps and a route, so pricing
 * can place each billed request in a plan. Tests replay harness fixtures and
 * assert the bucket sums agree with `deriveTurnTokenUsage` for every complete
 * turn.
 *
 * Contradictory sequences (double settlements, retries without a settled
 * attempt, steps inside steps) never throw: the affected attempt is marked
 * `invalid` and the turn `complete: false`, and folding continues. Facts that
 * could not be proven are absent, never zeroed.
 *
 * @module dsh-price-monitor/usage-ledger
 */

import { z, type ZodType } from 'zod'
import type { SessionEvent, SessionEventMap } from '@deepseek-ai/dsh-session'
import type { TokenUsage } from '@deepseek-ai/dsh-llm'
import type { ProjectionDefinition } from '@deepseek-ai/dsh-session-projection'
import type {
  AttemptUsageRow,
  LedgerRoute,
  LedgerUsageSample,
  OpenAttemptState,
  OpenTurnState,
  PriceMonitorUsageState,
  PriceMonitorUsageView,
  TurnUsageRow,
} from './projection-types.ts'

/** One assistant settlement's compact stream record (chunk or joined-delta carrier). */
type AssistantStreamRecord = SessionEventMap['assistant/message']['stream'][number]

const EMPTY_STATE: PriceMonitorUsageState = { turns: [], open: null, lastRoute: null }

const count = z.number().int().nonnegative()

const routeSchema = z.object({
  provider: z.string(),
  model: z.string(),
}).strict()

const usageSampleSchema = z.object({
  inputTokens: count,
  outputTokens: count,
  totalTokens: count.optional(),
  cacheReadTokens: count.optional(),
  cacheWriteTokens: count.optional(),
  reasoningTokens: count.optional(),
}).strict()

const attemptRowSchema = z.object({
  id: z.string(),
  turn: count,
  step: count,
  attempt: count,
  startedAt: count,
  settledAt: count.optional(),
  provider: z.string().optional(),
  model: z.string().optional(),
  uncachedInputTokens: count.optional(),
  cacheReadTokens: count.optional(),
  cacheWriteTokens: count.optional(),
  outputTokens: count.optional(),
  reasoningTokens: count.optional(),
  completeness: z.enum(['complete', 'usage-missing', 'route-missing', 'invalid']),
}).strict()

const turnRowSchema = z.object({
  turn: count,
  startedAt: count,
  endedAt: count.optional(),
  complete: z.boolean(),
  attempts: z.array(attemptRowSchema),
}).strict()

const openAttemptSchema = z.object({
  attempt: count,
  startedAt: count,
  route: routeSchema.optional(),
  usage: usageSampleSchema.optional(),
  settledAt: count.optional(),
  settledBy: z.enum(['attempt', 'message']).optional(),
  retried: z.boolean().optional(),
  invalid: z.boolean().optional(),
}).strict()

const closedStepSchema = z.object({
  step: count,
  attempts: z.array(attemptRowSchema),
}).strict()

const openStepSchema = z.object({
  step: count,
  attempts: z.array(attemptRowSchema),
  attempt: openAttemptSchema,
}).strict()

const openTurnSchema = z.object({
  turn: count,
  startedAt: count,
  steps: z.array(closedStepSchema),
  step: openStepSchema.nullable(),
  complete: z.boolean(),
}).strict()

/** Checkpoint schema: the one definition of the fold state's wire shape. */
const stateSchema: ZodType<PriceMonitorUsageState> = z.object({
  turns: z.array(turnRowSchema),
  open: openTurnSchema.nullable(),
  lastRoute: routeSchema.nullable(),
}).strict()

/** Client view schema: closed turns plus the live open turn. */
const viewSchema: ZodType<PriceMonitorUsageView> = z.object({
  turns: z.array(turnRowSchema),
}).strict()

function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0
}

function safeSum(values: readonly number[]): number | undefined {
  let total = 0
  for (const value of values) {
    total += value
    if (!Number.isSafeInteger(total)) return undefined
  }
  return total
}

/** The last usage chunk of a compact assistant stream, or undefined when it reported none. */
function lastUsageChunk(stream: readonly AssistantStreamRecord[]): TokenUsage | undefined {
  for (let index = stream.length - 1; index >= 0; index -= 1) {
    const record = stream[index] as { type?: unknown; chunk?: unknown } | undefined
    if (record?.type !== 'chunk' || record.chunk === null || typeof record.chunk !== 'object') continue
    const chunk = record.chunk as { type?: unknown; usage?: TokenUsage }
    if (chunk.type === 'usage') return chunk.usage
  }
  return undefined
}

/**
 * Validate one provider-reported usage sample under the same rules as the
 * harness's turn usage fold: disjoint non-negative safe-integer counts, a
 * reasoning subset that never exceeds output, and a prompt total that agrees
 * with the exact total when one is reported. Both cache buckets are required
 * unless the exact total proves the split.
 * @param usage - raw provider usage.
 * @returns the normalized sample, or undefined when it cannot be proven.
 */
export function normalizeUsageSample(usage: TokenUsage): LedgerUsageSample | undefined {
  const {
    inputTokens, outputTokens, cacheReadTokens, cacheWriteTokens, reasoningTokens, totalTokens,
  } = usage
  if (!isCount(inputTokens) || !isCount(outputTokens)) return undefined
  if (cacheReadTokens !== undefined && !isCount(cacheReadTokens)) return undefined
  if (cacheWriteTokens !== undefined && !isCount(cacheWriteTokens)) return undefined
  if (reasoningTokens !== undefined && (!isCount(reasoningTokens) || reasoningTokens > outputTokens)) {
    return undefined
  }

  const knownPrompt = safeSum([
    inputTokens,
    ...cacheReadTokens === undefined ? [] : [cacheReadTokens],
    ...cacheWriteTokens === undefined ? [] : [cacheWriteTokens],
  ])
  if (knownPrompt === undefined) return undefined

  if (totalTokens !== undefined) {
    if (!isCount(totalTokens)) return undefined
    const exactPrompt = totalTokens - outputTokens
    if (!isCount(exactPrompt) || exactPrompt < knownPrompt) return undefined
    if (cacheReadTokens !== undefined && cacheWriteTokens !== undefined && exactPrompt !== knownPrompt) {
      return undefined
    }
  } else if (cacheReadTokens === undefined || cacheWriteTokens === undefined) {
    return undefined
  }

  return {
    inputTokens,
    outputTokens,
    ...cacheReadTokens === undefined ? {} : { cacheReadTokens },
    ...cacheWriteTokens === undefined ? {} : { cacheWriteTokens },
    ...reasoningTokens === undefined ? {} : { reasoningTokens },
  }
}

/**
 * Build the wire row for one attempt at close time. The completeness order
 * mirrors the fold's failure model: contradictions and unprovable counts are
 * `invalid`; a settled attempt without usage is `usage-missing`; valid usage
 * without a route is `route-missing`.
 */
function toAttemptRow(attempt: OpenAttemptState, turn: number, step: number): AttemptUsageRow {
  const base = {
    id: `${turn}:${step}:${attempt.attempt}`,
    turn,
    step,
    attempt: attempt.attempt,
    startedAt: attempt.startedAt,
    ...attempt.settledAt === undefined ? {} : { settledAt: attempt.settledAt },
    ...attempt.route === undefined ? {} : { provider: attempt.route.provider, model: attempt.route.model },
  }
  if (attempt.invalid === true || (attempt.usage !== undefined && normalizeUsageSample(attempt.usage) === undefined)) {
    return { ...base, completeness: 'invalid' }
  }
  const usage = attempt.usage === undefined ? undefined : normalizeUsageSample(attempt.usage)
  if (usage === undefined) return { ...base, completeness: 'usage-missing' }
  const buckets = {
    uncachedInputTokens: usage.inputTokens,
    outputTokens: usage.outputTokens,
    ...usage.cacheReadTokens === undefined ? {} : { cacheReadTokens: usage.cacheReadTokens },
    ...usage.cacheWriteTokens === undefined ? {} : { cacheWriteTokens: usage.cacheWriteTokens },
    ...usage.reasoningTokens === undefined ? {} : { reasoningTokens: usage.reasoningTokens },
  }
  if (attempt.route === undefined) return { ...base, ...buckets, completeness: 'route-missing' }
  return { ...base, ...buckets, completeness: 'complete' }
}

/** Flatten an open turn into its wire row (used by the view and by turn close). */
function toTurnRow(open: OpenTurnState, endedAt: number | undefined, complete: boolean): TurnUsageRow {
  const attempts: AttemptUsageRow[] = []
  for (const step of open.steps) attempts.push(...step.attempts)
  if (open.step !== null) {
    attempts.push(...open.step.attempts, toAttemptRow(open.step.attempt, open.turn, open.step.step))
  }
  return {
    turn: open.turn,
    startedAt: open.startedAt,
    ...endedAt === undefined ? {} : { endedAt },
    complete,
    attempts,
  }
}

/** The fold's own event names for retry lifecycle events (structural read; the real map lives in dsh-llm-retry). */
interface RetryPosition {
  readonly turn: number
  readonly step: number
}

/**
 * Fold one `llm/retry` or `llm/retry-started` event. These two names are not
 * part of this package's compiled `SessionEventMap` (the map merge lives in
 * dsh-llm-retry), so they are read structurally instead of via narrowing.
 * @param state - ledger covering all prior events.
 * @param event - the retry lifecycle event.
 * @param kind - the event's type tag.
 * @returns the next state; the same reference when the event is not the unit's.
 */
function foldRetryLifecycle(
  state: PriceMonitorUsageState,
  event: SessionEvent,
  kind: 'llm/retry' | 'llm/retry-started',
): PriceMonitorUsageState {
  const data = (event as unknown as { data?: Partial<RetryPosition> }).data
  if (data?.turn === undefined || data.step === undefined
    || !Number.isSafeInteger(data.turn) || !Number.isSafeInteger(data.step)) {
    return state
  }
  const open = state.open
  if (open === null || open.step === null) return state
  const step = open.step
  if (open.turn !== data.turn || step.step !== data.step) return state
  const attempt = step.attempt
  if (kind === 'llm/retry') {
    // A retry is only valid after a settled failed attempt (never after a
    // surface message) and never twice for the same attempt.
    if (attempt.settledBy !== 'attempt' || attempt.retried === true) return taint(state, open.turn, step.step)
    return {
      ...state,
      open: { ...open, step: { ...step, attempt: { ...attempt, retried: true } } },
    }
  }
  if (attempt.retried !== true) return taint(state, open.turn, step.step)
  const closed = toAttemptRow(attempt, open.turn, step.step)
  return {
    ...state,
    open: {
      ...open,
      step: {
        step: step.step,
        attempts: [...step.attempts, closed],
        attempt: {
          attempt: attempt.attempt + 1,
          startedAt: event.time,
          ...state.lastRoute === null ? {} : { route: state.lastRoute },
        },
      },
    },
  }
}

/** A new step's first attempt, inheriting the latest logged request route. */
function firstAttempt(state: PriceMonitorUsageState, startedAt: number): OpenAttemptState {
  return {
    attempt: 0,
    startedAt,
    ...state.lastRoute === null ? {} : { route: state.lastRoute },
  }
}

function sameRoute(left: LedgerRoute | null, right: LedgerRoute): boolean {
  return left !== null && left.provider === right.provider && left.model === right.model
}

/** Mark the open attempt invalid and the turn incomplete; used on every lifecycle contradiction. */
function taint(state: PriceMonitorUsageState, turn: number, step: number, settledAt?: number): PriceMonitorUsageState {
  const open = state.open
  if (open === null || open.step === null || open.turn !== turn || open.step.step !== step) return state
  const attempt = open.step.attempt
  if (attempt.invalid === true) return state
  return {
    ...state,
    open: {
      ...open,
      complete: false,
      step: {
        ...open.step,
        attempt: { ...attempt, invalid: true, ...settledAt === undefined ? {} : { settledAt } },
      },
    },
  }
}

/**
 * Fold one committed event into the ledger.
 * @param state - ledger covering all prior events.
 * @param event - the next committed session event.
 * @returns the next state; the same reference when the event is not the unit's.
 */
export function foldLedgerState(state: PriceMonitorUsageState, event: SessionEvent): PriceMonitorUsageState {
  const type = (event as { type: string }).type
  if (type === 'llm/retry' || type === 'llm/retry-started') return foldRetryLifecycle(state, event, type)
  switch (event.type) {
    case 'turn/start': {
      const { turn } = event.data
      if (state.open === null) {
        return { ...state, open: { turn, startedAt: event.time, steps: [], step: null, complete: true } }
      }
      // A turn boundary inside an open turn is a contradiction: close the
      // running turn as incomplete and start the new one.
      const row = toTurnRow(state.open, undefined, false)
      return {
        ...state,
        turns: [...state.turns, row],
        open: { turn, startedAt: event.time, steps: [], step: null, complete: true },
      }
    }
    case 'step/start': {
      if (state.open === null || state.open.turn !== event.data.turn) return state
      const open = state.open
      const { step } = event.data
      if (open.step === null) {
        return { ...state, open: { ...open, step: { step, attempts: [], attempt: firstAttempt(state, event.time) } } }
      }
      // A step boundary inside an open step is a contradiction: taint and
      // close the current attempt, close the step, mark the turn incomplete.
      const steps = [
        ...open.steps,
        {
          step: open.step.step,
          attempts: [...open.step.attempts, toAttemptRow({ ...open.step.attempt, invalid: true }, open.turn, open.step.step)],
        },
      ]
      return {
        ...state,
        open: { ...open, steps, complete: false, step: { step, attempts: [], attempt: firstAttempt(state, event.time) } },
      }
    }
    case 'request/header': {
      const route = { provider: event.data.header.config.provider, model: event.data.header.config.model }
      const open = state.open
      if (open !== null && open.step !== null && open.step.attempt.settledAt === undefined) {
        const step = open.step
        // The header is logged before dispatch, so it pins both the route
        // and a request-start time closer than the step boundary.
        return {
          ...state,
          lastRoute: route,
          open: { ...open, step: { ...step, attempt: { ...step.attempt, startedAt: event.time, route } } },
        }
      }
      return sameRoute(state.lastRoute, route) ? state : { ...state, lastRoute: route }
    }
    case 'assistant/attempt': {
      const open = state.open
      if (open === null || open.step === null) return state
      const step = open.step
      if (open.turn !== event.data.turn || step.step !== event.data.step) return state
      const attempt = step.attempt
      if (attempt.settledAt !== undefined) return taint(state, open.turn, step.step)
      const usage = lastUsageChunk(event.data.stream)
      if (usage !== undefined && normalizeUsageSample(usage) === undefined) {
        return taint(state, open.turn, step.step, event.time)
      }
      return {
        ...state,
        open: {
          ...open,
          step: {
            ...step,
            attempt: {
              ...attempt,
              settledAt: event.time,
              settledBy: 'attempt',
              ...usage === undefined ? {} : { usage },
            },
          },
        },
      }
    }
    case 'assistant/message': {
      const open = state.open
      if (open === null || open.step === null) return state
      const step = open.step
      if (open.turn !== event.data.turn || step.step !== event.data.step) return state
      const attempt = step.attempt
      if (attempt.settledAt !== undefined) return taint(state, open.turn, step.step)
      const usage = event.data.usage ?? lastUsageChunk(event.data.stream)
      if (usage !== undefined && normalizeUsageSample(usage) === undefined) {
        return taint(state, open.turn, step.step, event.time)
      }
      const source = event.data.message.source
      const route = source.provider.length > 0 && source.model.length > 0
        ? { provider: source.provider, model: source.model }
        : attempt.route
      return {
        ...state,
        open: {
          ...open,
          step: {
            ...step,
            attempt: {
              ...attempt,
              settledAt: event.time,
              settledBy: 'message',
              ...usage === undefined ? {} : { usage },
              ...route === undefined ? {} : { route },
            },
          },
        },
      }
    }
    case 'step/end': {
      if (state.open === null) return state
      const open = state.open
      if (open.step === null) {
        // A step boundary with no open step is a contradiction inside this turn.
        return open.turn === event.data.turn ? { ...state, open: { ...open, complete: false } } : state
      }
      const step = open.step
      const steps = [...open.steps, { step: step.step, attempts: [...step.attempts, toAttemptRow(step.attempt, open.turn, step.step)] }]
      const complete = open.complete && step.step === event.data.step
      return { ...state, open: { ...open, steps, complete, step: null } }
    }
    case 'turn/end': {
      if (state.open === null) return state
      const open = state.open
      const complete = open.complete && open.turn === event.data.turn
      return { ...state, turns: [...state.turns, toTurnRow(open, event.time, complete)], open: null }
    }
    default:
      return state
  }
}

/** Client view: closed turns plus the open turn as its live row (never complete). */
function view(state: PriceMonitorUsageState): PriceMonitorUsageView {
  if (state.open === null) return { turns: state.turns }
  return { turns: [...state.turns, toTurnRow(state.open, undefined, false)] }
}

/**
 * The `priceMonitorUsage` projection unit registered on
 * `ctx.sessionProjections` (see the package entry).
 */
export const priceMonitorUsageProjectionDefinition = {
  key: 'priceMonitorUsage',
  stateVersion: 1,
  stateSchema,
  init: () => EMPTY_STATE,
  apply: foldLedgerState,
  wire: {
    viewSchema,
    view,
  },
} satisfies ProjectionDefinition<'priceMonitorUsage', PriceMonitorUsageState>
