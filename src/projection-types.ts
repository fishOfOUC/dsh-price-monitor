/**
 * Wire and fold-state vocabulary of the `priceMonitorUsage` session
 * projection, plus its merge into the session-projection type tables.
 *
 * The wire only carries facts: per-attempt timestamps, provider/model route
 * and the DSH disjoint token buckets. No price or plan ever enters the log or
 * the projection — pricing is a client-side view over this ledger.
 *
 * @module dsh-price-monitor/projection-types
 */

import type {
  SessionProjectionMap,
  SessionProjectionStateMap,
} from '@deepseek-ai/dsh-session-projection/types'

declare module '@deepseek-ai/dsh-session-projection/types' {
  interface SessionProjectionStateMap {
    priceMonitorUsage: PriceMonitorUsageState
  }
  interface SessionProjectionMap {
    priceMonitorUsage: PriceMonitorUsageView
  }
}

/** Why one attempt row cannot be priced exactly; `complete` means all facts are present. */
export type AttemptCompleteness = 'complete' | 'usage-missing' | 'route-missing' | 'invalid'

/**
 * One billed model-request attempt of one step. Buckets are absent unless the
 * provider reported them and they validated; a `complete` row always carries
 * all four buckets (see the fold's usage validation).
 */
export interface AttemptUsageRow {
  /** `${turn}:${step}:${attempt}` — stable per-attempt identity. */
  readonly id: string
  readonly turn: number
  readonly step: number
  readonly attempt: number
  /** Request start, epoch ms: step/start, then request/header or retry-started time. */
  readonly startedAt: number
  /** Epoch ms of the assistant settlement that closed the attempt; absent while open or never settled. */
  readonly settledAt?: number
  readonly provider?: string
  readonly model?: string
  readonly uncachedInputTokens?: number
  readonly cacheReadTokens?: number
  readonly cacheWriteTokens?: number
  readonly outputTokens?: number
  /** Output subset; never billed on its own. */
  readonly reasoningTokens?: number
  readonly completeness: AttemptCompleteness
}

/** One turn's ledger: every closed attempt, flattened across steps in (step, attempt) order. */
export interface TurnUsageRow {
  readonly turn: number
  readonly startedAt: number
  readonly endedAt?: number
  /** False when the fold saw a lifecycle contradiction inside the turn. */
  readonly complete: boolean
  readonly attempts: readonly AttemptUsageRow[]
}

/** Client wire value: the whole-session ledger, newest-first is a display choice. */
export interface PriceMonitorUsageView {
  readonly turns: readonly TurnUsageRow[]
}

/** Provider/model pair captured from a request header or an assistant message source. */
export interface LedgerRoute {
  readonly provider: string
  readonly model: string
}

/** One provider-reported usage sample before validation (the DSH TokenUsage shape). */
export interface LedgerUsageSample {
  readonly inputTokens: number
  readonly outputTokens: number
  readonly totalTokens?: number
  readonly cacheReadTokens?: number
  readonly cacheWriteTokens?: number
  readonly reasoningTokens?: number
}

/** The in-flight attempt of the open step. */
export interface OpenAttemptState {
  readonly attempt: number
  readonly startedAt: number
  readonly route?: LedgerRoute
  readonly usage?: LedgerUsageSample
  readonly settledAt?: number
  /** Which assistant settlement closed the attempt (retry validity keys off this). */
  readonly settledBy?: 'attempt' | 'message'
  /** An `llm/retry` was recorded; the next event must be `llm/retry-started`. */
  readonly retried?: boolean
  /** A lifecycle or count contradiction tainted this attempt. */
  readonly invalid?: boolean
}

/** One closed step: its attempts are wire rows already. */
export interface ClosedStepRow {
  readonly step: number
  readonly attempts: readonly AttemptUsageRow[]
}

/** The open step of the open turn. */
export interface OpenStepState {
  readonly step: number
  readonly attempts: readonly AttemptUsageRow[]
  readonly attempt: OpenAttemptState
}

/** The open (current) turn; null while no turn is running. */
export interface OpenTurnState {
  readonly turn: number
  readonly startedAt: number
  readonly steps: readonly ClosedStepRow[]
  readonly step: OpenStepState | null
  readonly complete: boolean
}

/**
 * Fold state: closed turns plus the open turn, and the latest request route
 * carried across step boundaries (request/header persists until changed).
 */
export interface PriceMonitorUsageState {
  readonly turns: readonly TurnUsageRow[]
  readonly open: OpenTurnState | null
  readonly lastRoute: LedgerRoute | null
}
