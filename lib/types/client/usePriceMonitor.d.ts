/**
 * React bindings for the price tab: the session ledger from the projection
 * face, the plan catalog from the sidebar prefs, and the memoized pricing
 * result every card and turn row reads from.
 *
 * Fallback functions are module-level stable references (React's
 * `useSyncExternalStore` requires a stable `getSnapshot`), and the hooks run
 * unconditionally — only the subscription target's identity changes, and only
 * when the session does.
 *
 * @module dsh-price-monitor/client/usePriceMonitor
 */
import type { ClientContext } from '../context-types.ts';
import type { SidebarPrefs, SidebarStore } from 'dsh-better-sidebar/client/service';
import type { PriceMonitorUsageView } from '../projection-types.ts';
import { type PersistedSettings, type PriceView } from '../pricing/index.ts';
/**
 * Subscribe to one session's per-attempt usage ledger.
 * @param ctx - client context (requires `sessions`).
 * @param sessionId - the tab scope's session id.
 * @returns the current ledger wire value (empty when the projection is absent).
 */
export declare function useUsageLedger(ctx: ClientContext, sessionId: string): PriceMonitorUsageView;
/** The sidebar prefs slice the tab reads (undefined before the store loads them). */
export type PrefsSnapshot = Pick<SidebarPrefs, 'pluginSettings'> | undefined;
/**
 * Subscribe to the sidebar's own prefs. The sidebar exposes no per-descriptor
 * face outside the settings popup, so the tab reads the shared snapshot (the
 * documented `subscribeState`/`getSnapshot` path).
 * @param store - the sidebar store the tab received.
 * @returns the live prefs, or undefined while they are not loaded.
 */
export declare function useSidebarPrefs(store: SidebarStore): PrefsSnapshot;
/**
 * Read this plugin's plan catalog from the live prefs, falling back to the
 * shipped official snapshot when nothing valid is stored.
 * @param prefs - the live prefs (undefined while loading).
 * @returns the catalog plus whether a stored blob existed but failed to parse.
 */
export declare function useCatalog(prefs: PrefsSnapshot): {
    catalog: PersistedSettings;
    corrupt: boolean;
};
/**
 * Price the ledger under the catalog (memoized on both inputs, so every card
 * and row reads one shared computation).
 * @param ledger - the usage ledger.
 * @param catalog - the validated plan catalog.
 * @returns the exact pricing result.
 */
export declare function usePriceView(ledger: PriceMonitorUsageView, catalog: PersistedSettings): PriceView;
