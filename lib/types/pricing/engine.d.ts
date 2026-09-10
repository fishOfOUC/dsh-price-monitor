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
import { Decimal } from 'decimal.js';
import type { AttemptUsageRow, PriceMonitorUsageView, TurnUsageRow } from '../projection-types.ts';
import type { PeakSchedule, PersistedSettings, PricingMode, PricingPlan } from './schema.ts';
/** Why one attempt was not priced exactly. */
export type AttemptPricingReason = 'no-usage' | 'invalid' | 'no-route' | 'not-official'
/** No plan names this model (after the alias map). */
 | 'no-plan'
/** A plan names it, but no version of that plan is in force at the attempt's time. */
 | 'inactive-plan' | 'no-split' | 'cache-write';
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
    readonly mode: PricingMode;
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
         * Whether any priced attempt's plan declares a peak schedule. Distinguishes
         * "this session ran entirely off-peak" from "this plan has no peak tiers",
         * which are different facts and get different copy.
         */
        readonly peakTiered: boolean;
    };
    /**
     * Comparison anchor for the top card: the selected plan applied to every
     * attempt it matches, or undefined when no comparison is meaningful.
     */
    readonly anchor?: {
        readonly planId: string;
        readonly total: Decimal;
    };
}
/** Whether a timestamp falls in a peak window of the schedule (left-closed, right-open). */
export declare function isPeak(schedule: PeakSchedule, epochMs: number): boolean;
/** Whether any plan in the catalog names this provider/model, ignoring windows. */
export declare function namesModel(plans: readonly PricingPlan[], provider: string, model: string): boolean;
/**
 * The plan effective for one provider/model route at a timestamp: the
 * preferred candidate among those in force for the attempt's UTC date.
 * @param plans - the catalog.
 * @param provider - attempt provider.
 * @param model - attempt model (already alias-resolved).
 * @param epochMs - attempt start time.
 * @returns the matching plan, or undefined.
 */
export declare function planFor(plans: readonly PricingPlan[], provider: string, model: string, epochMs: number): PricingPlan | undefined;
/**
 * Resolve an attempt's model id through the catalog's alias map: a deployment
 * that exposes the same underlying model under its own id is priced by the
 * plan naming the aliased id. An unmapped id is returned unchanged.
 * @param aliases - the catalog's alias map.
 * @param model - the attempt's reported model id.
 * @returns the model id to match plans against.
 */
export declare function resolveModelAlias(aliases: Readonly<Record<string, string>> | undefined, model: string): string;
/**
 * Price a whole ledger under the persisted settings.
 * @param ledger - the projection wire value.
 * @param settings - the persisted catalog and mode.
 * @returns the exact per-attempt/per-turn/session result.
 */
export declare function priceLedger(ledger: PriceMonitorUsageView, settings: PersistedSettings): PriceView;
/** Human `$` formatting with an adaptive 4–8 decimal places for the top card. */
export declare function formatUsd(value: Decimal, decimals: number): string;
