/**
 * dsh-price-monitor client half: registers the bilingual dictionary and the
 * `price-monitor` sidebar tab with its plan-settings panel.
 *
 * The client is a pure reader of the host's `priceMonitorUsage` projection and
 * a pure calculator over it — pricing never touches the session log, and the
 * only writes are the user's own plan catalog in the sidebar's
 * `pluginSettings['price-monitor']`.
 *
 * @module dsh-price-monitor/client
 */
import type { ClientContext } from '../context-types.ts';
export { PriceMonitorTab } from './PriceMonitorTab.tsx';
export { PricePlanSettings } from './PricePlanSettings.tsx';
export { NS } from './locales.ts';
/** Client service requirements (the sidebar registry, sessions, and locale). */
export declare const inject: string[];
/** Tab descriptor id (also the `pluginSettings` key owner). */
export declare const TAB_ID = "price-monitor";
/**
 * Client plugin body: bind the dictionary, inject the stylesheet, and register
 * the single-instance tab with its settings panel.
 * @param ctx - client root context.
 */
export declare function apply(ctx: ClientContext): void;
