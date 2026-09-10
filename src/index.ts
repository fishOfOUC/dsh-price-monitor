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

import type { Context } from '@deepseek-ai/cordis'
// Type-only: activates the `ctx.sessionProjections` Context declaration.
import type {} from '@deepseek-ai/dsh-session-projection'
import type { HostContext } from './context-types.ts'
import { officialPricingRoute } from './official-pricing-route.ts'
import { priceMonitorUsageProjectionDefinition } from './usage-ledger.ts'

export { priceMonitorUsageProjectionDefinition } from './usage-ledger.ts'
export * from './projection-types.ts'
export { parseOfficialPricing, diffOfficialPricing } from './official-pricing.ts'

/** Host service requirements. */
export const inject = ['sessionProjections', 'webServer', 'webRuntime']

/**
 * Host plugin body: register the usage-ledger projection and the official
 * pricing refresh route. Both registrations bind to this plugin's fiber
 * (unload removes them), so the calls themselves are the effects.
 * @param ctx - host root context.
 */
export function apply(ctx: Context): void {
  const host = ctx as HostContext
  host.sessionProjections.register(priceMonitorUsageProjectionDefinition)
  host.webServer.register(officialPricingRoute(host.webRuntime.trustedHosts))
}
