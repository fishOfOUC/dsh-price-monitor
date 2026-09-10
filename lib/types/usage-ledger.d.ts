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
import { z } from 'zod';
import type { SessionEvent } from '@deepseek-ai/dsh-session';
import type { TokenUsage } from '@deepseek-ai/dsh-llm';
import type { LedgerUsageSample, PriceMonitorUsageState, PriceMonitorUsageView } from './projection-types.ts';
/**
 * Validate one provider-reported usage sample under the same rules as the
 * harness's turn usage fold: disjoint non-negative safe-integer counts, a
 * reasoning subset that never exceeds output, and a prompt total that agrees
 * with the exact total when one is reported. Both cache buckets are required
 * unless the exact total proves the split.
 * @param usage - raw provider usage.
 * @returns the normalized sample, or undefined when it cannot be proven.
 */
export declare function normalizeUsageSample(usage: TokenUsage): LedgerUsageSample | undefined;
/**
 * Fold one committed event into the ledger.
 * @param state - ledger covering all prior events.
 * @param event - the next committed session event.
 * @returns the next state; the same reference when the event is not the unit's.
 */
export declare function foldLedgerState(state: PriceMonitorUsageState, event: SessionEvent): PriceMonitorUsageState;
/** Client view: closed turns plus the open turn as its live row (never complete). */
declare function view(state: PriceMonitorUsageState): PriceMonitorUsageView;
/**
 * The `priceMonitorUsage` projection unit registered on
 * `ctx.sessionProjections` (see the package entry).
 */
export declare const priceMonitorUsageProjectionDefinition: {
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
export {};
