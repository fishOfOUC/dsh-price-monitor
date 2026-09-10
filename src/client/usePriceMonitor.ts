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

import { useMemo, useSyncExternalStore } from 'react'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import type { ClientContext } from '../context-types.ts'
import type { SidebarPrefs, SidebarSnapshot, SidebarStore } from 'dsh-better-sidebar/client/service'
import type { PriceMonitorUsageView } from '../projection-types.ts'
import { priceLedger, type PersistedSettings, type PriceView } from '../pricing/index.ts'
import { catalogFromPrefs, initialCatalog } from './settings-write.ts'

/** The empty ledger a session without the projection key reads. */
const EMPTY_LEDGER: PriceMonitorUsageView = { turns: [] }

/** The bare per-key projection face (`getSnapshot`/`subscribe`). */
interface ProjectionFace {
  getSnapshot(): unknown
  subscribe(listener: () => void): () => void
}

/** One session's resolved subscription target. */
interface LedgerTarget {
  subscribe: (onChange: () => void) => () => void
  read: () => PriceMonitorUsageView
}

const NOOP_SUBSCRIBE = (): (() => void) => () => {}
const NO_LEDGER = (): PriceMonitorUsageView => EMPTY_LEDGER

/** Read one session's ledger through its projection face. */
function readLedger(ctx: ClientContext, sessionId: string): PriceMonitorUsageView {
  const face = ctx.sessions.binding?.(sessionId as SessionId)
    ?.session.projections.faceOf('priceMonitorUsage') as ProjectionFace | undefined
  if (face === undefined) return EMPTY_LEDGER
  const value = face.getSnapshot()
  if (value === null || typeof value !== 'object') return EMPTY_LEDGER
  const turns = (value as { turns?: unknown }).turns
  return Array.isArray(turns) ? (value as PriceMonitorUsageView) : EMPTY_LEDGER
}

/**
 * Subscribe to one session's per-attempt usage ledger.
 * @param ctx - client context (requires `sessions`).
 * @param sessionId - the tab scope's session id.
 * @returns the current ledger wire value (empty when the projection is absent).
 */
export function useUsageLedger(ctx: ClientContext, sessionId: string): PriceMonitorUsageView {
  const target = useMemo<LedgerTarget>(() => {
    const face = ctx.sessions.binding?.(sessionId as SessionId)
      ?.session.projections.faceOf('priceMonitorUsage') as ProjectionFace | undefined
    if (face === undefined) return { subscribe: NOOP_SUBSCRIBE, read: NO_LEDGER }
    // A session created before the host half was mounted gains its binding
    // later; reading through the closure (not a captured snapshot) means the
    // next render picks up the face without a manual re-subscribe.
    return {
      subscribe: onChange => face.subscribe(onChange),
      read: () => readLedger(ctx, sessionId),
    }
  }, [ctx, sessionId])
  return useSyncExternalStore(target.subscribe, target.read, target.read)
}

/** The sidebar prefs slice the tab reads (undefined before the store loads them). */
export type PrefsSnapshot = Pick<SidebarPrefs, 'pluginSettings'> | undefined

/**
 * Subscribe to the sidebar's own prefs. The sidebar exposes no per-descriptor
 * face outside the settings popup, so the tab reads the shared snapshot (the
 * documented `subscribeState`/`getSnapshot` path).
 * @param store - the sidebar store the tab received.
 * @returns the live prefs, or undefined while they are not loaded.
 */
export function useSidebarPrefs(store: SidebarStore): PrefsSnapshot {
  const snapshot = useSyncExternalStore(
    onChange => store.subscribe(onChange),
    () => store.getSnapshot() as SidebarSnapshot,
    () => store.getSnapshot() as SidebarSnapshot,
  )
  return snapshot.prefs ?? undefined
}

/**
 * Read this plugin's plan catalog from the live prefs, falling back to the
 * shipped official snapshot when nothing valid is stored.
 * @param prefs - the live prefs (undefined while loading).
 * @returns the catalog plus whether a stored blob existed but failed to parse.
 */
export function useCatalog(prefs: PrefsSnapshot): { catalog: PersistedSettings; corrupt: boolean } {
  return useMemo(() => {
    if (prefs === undefined) return { catalog: initialCatalog(), corrupt: false }
    const stored = catalogFromPrefs(prefs as SidebarPrefs)
    if (stored !== undefined) return { catalog: stored, corrupt: false }
    const blob = prefs.pluginSettings?.['price-monitor']
    const present = blob !== undefined && (blob as Record<string, unknown>)['catalog'] !== undefined
    return { catalog: initialCatalog(), corrupt: present }
  }, [prefs])
}

/**
 * Price the ledger under the catalog (memoized on both inputs, so every card
 * and row reads one shared computation).
 * @param ledger - the usage ledger.
 * @param catalog - the validated plan catalog.
 * @returns the exact pricing result.
 */
export function usePriceView(ledger: PriceMonitorUsageView, catalog: PersistedSettings): PriceView {
  return useMemo(() => priceLedger(ledger, catalog), [ledger, catalog])
}
