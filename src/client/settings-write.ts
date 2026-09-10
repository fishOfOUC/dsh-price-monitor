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

import type { SidebarPrefs, SidebarStore } from 'dsh-better-sidebar/client/service'
import { defaultSettings, parsePersistedSettings, type PersistedSettings } from '../pricing/index.ts'

/** The pluginSettings key this plugin owns. */
export const SETTINGS_KEY = 'price-monitor'

/** The catalog slot inside this plugin's settings blob. */
export const CATALOG_KEY = 'catalog'

/** Read this plugin's catalog from a prefs snapshot, or undefined when absent/corrupt. */
export function catalogFromPrefs(prefs: SidebarPrefs): PersistedSettings | undefined {
  const blob = prefs.pluginSettings?.[SETTINGS_KEY]
  if (blob === undefined || typeof blob !== 'object' || blob === null) return undefined
  return parseCatalog((blob as Record<string, unknown>)[CATALOG_KEY])
}

/**
 * Parse one stored catalog blob.
 * @param value - the persisted `catalog` value.
 * @returns the validated settings, or undefined when unreadable.
 */
export function parseCatalog(value: unknown): PersistedSettings | undefined {
  return parsePersistedSettings(value)
}

/** The catalog shown when nothing is stored yet. */
export function initialCatalog(): PersistedSettings {
  return defaultSettings()
}

let queue: Promise<void> = Promise.resolve()

interface WriteDeps {
  store: SidebarStore
  /** The settings route base (the sidebar owns it: `/sidebar/api`). */
  route?: string
}

/** POST one patch to the sidebar settings route and return the raw response envelope. */
async function postSettingsPatch(patch: Record<string, unknown>, route: string): Promise<unknown> {
  const response = await fetch(`${route}/settings.update`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ patch }),
  })
  if (!response.ok) throw new Error(`settings route responded ${response.status}`)
  return await response.json()
}

/**
 * Read the authoritative catalog subtree out of a settings response, falling
 * back to the value this call sent when the envelope omits it.
 * @param envelope - the route's JSON response.
 * @param fallback - the catalog this call wrote.
 * @returns the catalog to adopt locally.
 */
function adoptCatalog(envelope: unknown, fallback: PersistedSettings): PersistedSettings {
  const value = (envelope as { value?: unknown } | null)?.value
  const blob = (value as { pluginSettings?: Record<string, Record<string, unknown>> } | undefined)
    ?.pluginSettings?.[SETTINGS_KEY]
  const parsed = blob === undefined ? undefined : parseCatalog(blob[CATALOG_KEY])
  return parsed ?? fallback
}

/**
 * Persist one catalog edit. The updater runs against the freshest catalog read
 * from the prefs *at write time* (inside the queue), so a burst of edits
 * composes instead of overwriting.
 * @param deps - the sidebar store and optional route base.
 * @param update - pure catalog update.
 * @returns a promise settling when the write landed (or rejecting with the error).
 */
export function writeCatalog(
  deps: WriteDeps,
  update: (catalog: PersistedSettings) => PersistedSettings,
): Promise<void> {
  const route = deps.route ?? '/sidebar/api'
  const run = async (): Promise<void> => {
    const prefs = deps.store.getPrefs()
    const current = catalogFromPrefs(prefs) ?? initialCatalog()
    const next = update(current)
    const envelope = await postSettingsPatch(
      { pluginSettings: { ...prefs.pluginSettings, [SETTINGS_KEY]: { [CATALOG_KEY]: next } } },
      route,
    )
    const adopted = adoptCatalog(envelope, next)
    deps.store.setPrefs({
      ...deps.store.getPrefs(),
      pluginSettings: { ...deps.store.getPrefs().pluginSettings, [SETTINGS_KEY]: { [CATALOG_KEY]: adopted } },
    })
  }
  const chained = queue.then(run, run)
  // Keep the chain alive after a failure so one bad write cannot wedge the queue.
  queue = chained.catch(() => {})
  return chained
}
