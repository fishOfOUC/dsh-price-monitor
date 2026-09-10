/**
 * Exact pricing engine. Rates travel as decimal strings, are converted to
 * `Decimal` once, and every product/sum stays `Decimal` until the display
 * boundary — no binary float ever carries an amount, and nothing is rounded
 * before the final aggregate.
 *
 * The selected plan is the sole pricing basis: it prices every attempt of the
 * session, so switching plans changes every amount, whether or not the attempt
 * ran on a model that plan names. Peak/off-peak is chosen from an attempt's
 * UTC start time. Aggregation order is attempt → turn → session, and each
 * layer carries the three cost buckets plus the total, so the per-turn rows
 * add up to the session card exactly.
 *
 * @module dsh-price-monitor/pricing/engine
 */
import { Decimal } from 'decimal.js';
import type { AttemptUsageRow, PriceMonitorUsageView, TurnUsageRow } from '../projection-types.ts';
import type { PeakSchedule, PersistedSettings } from './schema.ts';
/** Why one attempt was not priced exactly. */
export type AttemptPricingReason = 'no-usage' | 'invalid'
/** No plan is selected, so there is no rate to apply. */
 | 'no-plan' | 'no-split' | 'cache-write';
/** One attempt's three billed buckets plus total, as exact decimals. */
export interface AttemptCost {
    readonly miss: Decimal;
    readonly hit: Decimal;
    readonly output: Decimal;
    readonly total: Decimal;
}
/** One attempt after pricing. */
export interface PricedAttempt {
    readonly row: AttemptUsageRow;
    /** The plan that priced the attempt (present only when priced). */
    readonly planId?: string;
    /** Display name of that plan. */
    readonly planName?: string;
    /** Whether the plan's peak band applied (chosen from the attempt's UTC start time). */
    readonly peak?: boolean;
    readonly cost?: AttemptCost;
    readonly reason?: AttemptPricingReason;
}
/** One turn after pricing. */
export interface PricedTurn {
    readonly row: TurnUsageRow;
    readonly attempts: readonly PricedAttempt[];
    readonly cost: AttemptCost;
    readonly tokens: {
        readonly uncachedInput: number;
        readonly cacheRead: number;
        readonly output: number;
        readonly total: number;
    };
    readonly priced: number;
    /** Priced attempts that used a peak band (display note; costs already include it). */
    readonly peak: number;
}
/** The whole-session pricing result. */
export interface PriceView {
    readonly selectedPlanId: string | undefined;
    readonly turns: readonly PricedTurn[];
    readonly cost: AttemptCost;
    readonly tokens: {
        readonly uncachedInput: number;
        readonly cacheRead: number;
        readonly output: number;
        readonly total: number;
    };
    readonly coverage: {
        readonly priced: number;
        readonly uncovered: number;
        readonly byReason: Readonly<Record<AttemptPricingReason, number>>;
        /** Priced attempts that used a peak band. */
        readonly peak: number;
        /**
         * Whether the selected plan declares a peak schedule. Distinguishes "this
         * session ran entirely off-peak" from "this plan has no peak tiers", which
         * are different facts and get different copy.
         */
        readonly peakTiered: boolean;
    };
}
/** Whether a timestamp falls in a peak window of the schedule (left-closed, right-open). */
export declare function isPeak(schedule: PeakSchedule, epochMs: number): boolean;
/**
 * Price a whole ledger under the persisted settings.
 * @param ledger - the projection wire value.
 * @param settings - the persisted catalog and selection.
 * @returns the exact per-attempt/per-turn/session result.
 */
export declare function priceLedger(ledger: PriceMonitorUsageView, settings: PersistedSettings): PriceView;
