/**
 * dsh-price-monitor host plugin.
 *
 * Registers the `priceMonitorUsage` session projection — the per-attempt
 * token ledger folded from the durable session log — and (see stage D of the
 * implementation guide) the official-pricing refresh route. The ledger is the
 * only fact source; all pricing lives in the client half.
 *
 * @module dsh-price-monitor
 */
import type { Context } from '@deepseek-ai/cordis';
export { priceMonitorUsageProjectionDefinition } from './usage-ledger.ts';
export * from './projection-types.ts';
export { parseOfficialPricing, diffOfficialPricing } from './official-pricing.ts';
/** Host service requirements. */
export declare const inject: string[];
/**
 * Host plugin body: register the usage-ledger projection and the official
 * pricing refresh route. Both registrations bind to this plugin's fiber
 * (unload removes them), so the calls themselves are the effects.
 * @param ctx - host root context.
 */
export declare function apply(ctx: Context): void;
