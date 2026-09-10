import { z } from "zod";
import { Context } from "@deepseek-ai/cordis";
import { SessionEvent } from "@deepseek-ai/dsh-session";
import "@deepseek-ai/dsh-llm";
//#region src/projection-types.d.ts
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
declare module '@deepseek-ai/dsh-session-projection/types' {
  interface SessionProjectionStateMap {
    priceMonitorUsage: PriceMonitorUsageState;
  }
  interface SessionProjectionMap {
    priceMonitorUsage: PriceMonitorUsageView;
  }
}
/** Why one attempt row cannot be priced exactly; `complete` means all facts are present. */
type AttemptCompleteness = 'complete' | 'usage-missing' | 'route-missing' | 'invalid';
/**
 * One billed model-request attempt of one step. Buckets are absent unless the
 * provider reported them and they validated; a `complete` row always carries
 * all four buckets (see the fold's usage validation).
 */
interface AttemptUsageRow {
  /** `${turn}:${step}:${attempt}` — stable per-attempt identity. */
  readonly id: string;
  readonly turn: number;
  readonly step: number;
  readonly attempt: number;
  /** Request start, epoch ms: step/start, then request/header or retry-started time. */
  readonly startedAt: number;
  /** Epoch ms of the assistant settlement that closed the attempt; absent while open or never settled. */
  readonly settledAt?: number;
  readonly provider?: string;
  readonly model?: string;
  readonly uncachedInputTokens?: number;
  readonly cacheReadTokens?: number;
  readonly cacheWriteTokens?: number;
  readonly outputTokens?: number;
  /** Output subset; never billed on its own. */
  readonly reasoningTokens?: number;
  readonly completeness: AttemptCompleteness;
}
/** One turn's ledger: every closed attempt, flattened across steps in (step, attempt) order. */
interface TurnUsageRow {
  readonly turn: number;
  readonly startedAt: number;
  readonly endedAt?: number;
  /** False when the fold saw a lifecycle contradiction inside the turn. */
  readonly complete: boolean;
  readonly attempts: readonly AttemptUsageRow[];
}
/** Client wire value: the whole-session ledger, newest-first is a display choice. */
interface PriceMonitorUsageView {
  readonly turns: readonly TurnUsageRow[];
}
/** Provider/model pair captured from a request header or an assistant message source. */
interface LedgerRoute {
  readonly provider: string;
  readonly model: string;
}
/** One provider-reported usage sample before validation (the DSH TokenUsage shape). */
interface LedgerUsageSample {
  readonly inputTokens: number;
  readonly outputTokens: number;
  readonly totalTokens?: number;
  readonly cacheReadTokens?: number;
  readonly cacheWriteTokens?: number;
  readonly reasoningTokens?: number;
}
/** The in-flight attempt of the open step. */
interface OpenAttemptState {
  readonly attempt: number;
  readonly startedAt: number;
  readonly route?: LedgerRoute;
  readonly usage?: LedgerUsageSample;
  readonly settledAt?: number;
  /** Which assistant settlement closed the attempt (retry validity keys off this). */
  readonly settledBy?: 'attempt' | 'message';
  /** An `llm/retry` was recorded; the next event must be `llm/retry-started`. */
  readonly retried?: boolean;
  /** A lifecycle or count contradiction tainted this attempt. */
  readonly invalid?: boolean;
}
/** One closed step: its attempts are wire rows already. */
interface ClosedStepRow {
  readonly step: number;
  readonly attempts: readonly AttemptUsageRow[];
}
/** The open step of the open turn. */
interface OpenStepState {
  readonly step: number;
  readonly attempts: readonly AttemptUsageRow[];
  readonly attempt: OpenAttemptState;
}
/** The open (current) turn; null while no turn is running. */
interface OpenTurnState {
  readonly turn: number;
  readonly startedAt: number;
  readonly steps: readonly ClosedStepRow[];
  readonly step: OpenStepState | null;
  readonly complete: boolean;
}
/**
 * Fold state: closed turns plus the open turn, and the latest request route
 * carried across step boundaries (request/header persists until changed).
 */
interface PriceMonitorUsageState {
  readonly turns: readonly TurnUsageRow[];
  readonly open: OpenTurnState | null;
  readonly lastRoute: LedgerRoute | null;
}
//#endregion
//#region src/usage-ledger.d.ts
/**
 * Fold one committed event into the ledger.
 * @param state - ledger covering all prior events.
 * @param event - the next committed session event.
 * @returns the next state; the same reference when the event is not the unit's.
 */
declare function foldLedgerState(state: PriceMonitorUsageState, event: SessionEvent): PriceMonitorUsageState;
/** Client view: closed turns plus the open turn as its live row (never complete). */
declare function view(state: PriceMonitorUsageState): PriceMonitorUsageView;
/**
 * The `priceMonitorUsage` projection unit registered on
 * `ctx.sessionProjections` (see the package entry).
 */
declare const priceMonitorUsageProjectionDefinition: {
  key: "priceMonitorUsage";
  stateVersion: number;
  stateSchema: z.ZodType<PriceMonitorUsageState, unknown, z.core.$ZodTypeInternals<PriceMonitorUsageState, unknown>>;
  init: () => PriceMonitorUsageState;
  apply: typeof foldLedgerState;
  wire: {
    viewSchema: z.ZodType<PriceMonitorUsageView, unknown, z.core.$ZodTypeInternals<PriceMonitorUsageView, unknown>>;
    view: typeof view;
  };
};
//#endregion
//#region src/pricing/schema.d.ts
/** A currency a set of published rates is denominated in. */
declare const currencySchema: z.ZodEnum<{
  USD: "USD";
  CNY: "CNY";
}>;
type Currency = z.infer<typeof currencySchema>;
//#endregion
//#region src/official-pricing.d.ts
/** One parsed model's four rates (per million tokens, decimal strings). */
interface OfficialModelRates {
  readonly model: string;
  readonly cacheHit: string;
  readonly cacheMiss: string;
  readonly output: string;
  readonly peakCacheHit: string;
  readonly peakCacheMiss: string;
  readonly peakOutput: string;
}
/** A validated parse result: one row per model plus the confirmed peak schedule. */
interface ParsedOfficialPricing {
  readonly models: readonly OfficialModelRates[];
  readonly peakWindows: readonly [readonly [string, string], readonly [string, string]];
  /** The currency the page printed (CNY on the Chinese page). */
  readonly currency: Currency;
}
/** One field-level change between a previous and a candidate rate. */
interface OfficialDiffEntry {
  readonly model: string;
  readonly field: keyof Omit<OfficialModelRates, 'model'>;
  readonly before?: string;
  readonly after: string;
}
/** Field-level diff between a previous catalog and the candidate. */
interface OfficialPricingDiff {
  readonly addedModels: readonly string[];
  readonly removedModels: readonly string[];
  readonly changed: readonly OfficialDiffEntry[];
}
/**
 * Parse the official pricing page HTML into validated per-model rates and the
 * confirmed peak schedule. Returns undefined on any structural mismatch, so a
 * caller keeps the last good catalog.
 * @param html - the fetched page body.
 * @returns the validated parse, or undefined when the page changed unexpectedly.
 */
declare function parseOfficialPricing(html: string): ParsedOfficialPricing | undefined;
/** Field-level diff between a previous official catalog and a candidate. */
declare function diffOfficialPricing(previous: readonly OfficialModelRates[], candidate: readonly OfficialModelRates[]): OfficialPricingDiff;
//#endregion
//#region src/index.d.ts
/** Host service requirements. */
declare const inject: string[];
/**
 * Host plugin body: register the usage-ledger projection and the official
 * pricing refresh route. Both registrations bind to this plugin's fiber
 * (unload removes them), so the calls themselves are the effects.
 * @param ctx - host root context.
 */
declare function apply(ctx: Context): void;
//#endregion
export { AttemptCompleteness, AttemptUsageRow, ClosedStepRow, LedgerRoute, LedgerUsageSample, OpenAttemptState, OpenStepState, OpenTurnState, PriceMonitorUsageState, PriceMonitorUsageView, TurnUsageRow, apply, diffOfficialPricing, inject, parseOfficialPricing, priceMonitorUsageProjectionDefinition };