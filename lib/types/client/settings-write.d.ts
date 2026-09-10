/**
 * Serialized writes of this plugin's `pluginSettings['price-monitor'].catalog`
 * blob.
 *
 * The write goes through the sidebar's own settings route
 * (`/sidebar/api/settings.update`) with the same whole-`pluginSettings` patch
 * shape its own client sends, so one call persists the complete catalog and
 * two quick edits can never interleave into a half-written document. Writes
 * are queued through one promise chain (the pattern the sidebar's own
 * plugin-settings helper documents: a burst of clicks must not read a stale
 * map and drop an earlier edit).
 *
 * The local prefs are updated from the same computed value so the tab
 * re-renders without waiting for the round trip; a failed write surfaces as a
 * rejected promise the caller renders as an error.
 *
 * @module dsh-price-monitor/client/settings-write
 */
import type { SidebarPrefs, SidebarStore } from 'dsh-better-sidebar/client/service';
import { type PersistedSettings } from '../pricing/index.ts';
/** The pluginSettings key this plugin owns. */
export declare const SETTINGS_KEY = "price-monitor";
/** The catalog slot inside this plugin's settings blob. */
export declare const CATALOG_KEY = "catalog";
/** Read this plugin's catalog from a prefs snapshot, or undefined when absent/corrupt. */
export declare function catalogFromPrefs(prefs: SidebarPrefs): PersistedSettings | undefined;
/**
 * Parse one stored catalog blob.
 * @param value - the persisted `catalog` value.
 * @returns the validated settings, or undefined when unreadable.
 */
export declare function parseCatalog(value: unknown): PersistedSettings | undefined;
/** The catalog shown when nothing is stored yet. */
export declare function initialCatalog(): PersistedSettings;
interface WriteDeps {
    store: SidebarStore;
    /** The settings route base (the sidebar owns it: `/sidebar/api`). */
    route?: string;
}
/**
 * Persist one catalog edit. The updater runs against the freshest catalog read
 * from the prefs *at write time* (inside the queue), so a burst of edits
 * composes instead of overwriting.
 * @param deps - the sidebar store and optional route base.
 * @param update - pure catalog update.
 * @returns a promise settling when the write landed (or rejecting with the error).
 */
export declare function writeCatalog(deps: WriteDeps, update: (catalog: PersistedSettings) => PersistedSettings): Promise<void>;
export {};
