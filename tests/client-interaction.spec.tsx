// @vitest-environment jsdom
/**
 * Interactive tab tests in a real DOM: expanding a turn reveals each billed
 * attempt (including its unpriced reason), and switching a plan writes the
 * whole catalog through the sidebar's settings route, reprices every amount,
 * and leaves the session ledger untouched.
 */

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import type { Context as CordisContext } from '@deepseek-ai/cordis'
import type { SidebarPrefs, SidebarSnapshot, SidebarStore, TabComponentProps } from 'dsh-better-sidebar/client/service'
import { PriceMonitorTab } from '../src/client/PriceMonitorTab.tsx'
import { PricePlanSettings } from '../src/client/PricePlanSettings.tsx'
import { bindTranslate, en, type PriceMonitorKey } from '../src/client/locales.ts'
import { CATALOG_KEY, SETTINGS_KEY } from '../src/client/settings-write.ts'
import { defaultSettings, officialSeedPlans } from '../src/pricing/index.ts'
import type { SidebarSettingsRenderProps } from 'dsh-better-sidebar/client/service'
import type { PriceMonitorUsageView } from '../src/projection-types.ts'

/** Resolve a key from the English dictionary with `{name}` substitution. */
function english(key: PriceMonitorKey, params?: Record<string, unknown>): string {
  const template = en[key]
  if (params === undefined) return template
  return template.replace(/\{(\w+)\}/g, (match, name: string) => name in params ? String(params[name]) : match)
}

beforeAll(() => {
  bindTranslate(english)
  // React 18 requires the act() environment flag for DOM rendering in tests.
  ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
})

/** Two attempts in one turn: a priced one and one whose usage never arrived. */
const LEDGER: PriceMonitorUsageView = {
  turns: [{
    turn: 7,
    startedAt: Date.UTC(2026, 8, 14, 20, 0),
    endedAt: Date.UTC(2026, 8, 14, 20, 5),
    complete: true,
    attempts: [
      {
        id: '7:0:0',
        turn: 7,
        step: 0,
        attempt: 0,
        startedAt: Date.UTC(2026, 8, 14, 20, 0),
        settledAt: Date.UTC(2026, 8, 14, 20, 1),
        provider: 'deepseek-official',
        model: 'deepseek-v4-flash',
        uncachedInputTokens: 1_000_000,
        cacheReadTokens: 0,
        cacheWriteTokens: 0,
        outputTokens: 0,
        completeness: 'complete',
      },
      {
        id: '7:1:0',
        turn: 7,
        step: 1,
        attempt: 0,
        startedAt: Date.UTC(2026, 8, 14, 20, 2),
        provider: 'deepseek-official',
        model: 'deepseek-v4-flash',
        completeness: 'usage-missing',
      },
    ],
  }],
}

let container: HTMLDivElement | undefined
let root: Root | undefined

afterEach(() => {
  act(() => { root?.unmount() })
  container?.remove()
  root = undefined
  container = undefined
  vi.unstubAllGlobals()
})

/** Prefs for a store carrying the given catalog. */
function prefsOf(catalog: unknown): SidebarPrefs {
  return { pluginSettings: { [SETTINGS_KEY]: { [CATALOG_KEY]: catalog } } } as unknown as SidebarPrefs
}

/** A store whose writes are observable. */
function makeStore(catalog: unknown): { store: SidebarStore; writes: SidebarPrefs[] } {
  let prefs = prefsOf(catalog)
  // The real store publishes one cached snapshot object and rebuilds it only
  // when something changes; useSyncExternalStore requires exactly that
  // stability, so the fake caches too.
  let snapshot = { sessionId: 's1', state: undefined, prefs } as unknown as SidebarSnapshot
  const writes: SidebarPrefs[] = []
  const listeners = new Set<() => void>()
  const store = {
    getPrefs: () => prefs,
    setPrefs: (next: SidebarPrefs) => {
      prefs = next
      snapshot = { sessionId: 's1', state: undefined, prefs } as unknown as SidebarSnapshot
      writes.push(next)
      for (const listener of [...listeners]) listener()
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    getSnapshot: () => snapshot,
  } as unknown as SidebarStore
  return { store, writes }
}

/** Render the tab and return the container. */
function render(store: SidebarStore): HTMLDivElement {
  const face = { getSnapshot: () => LEDGER, subscribe: () => () => {} }
  const ctx = {
    sessions: { binding: () => ({ session: { projections: { faceOf: () => face } } }) },
  } as unknown as CordisContext
  const props = {
    ctx,
    store,
    scope: { sessionId: 's1' },
    tab: { id: 'price-monitor', type: 'price-monitor', title: 'cost' },
    visible: true,
  } as unknown as TabComponentProps
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  act(() => { root!.render(<PriceMonitorTab {...props} />) })
  return container
}

const clicks = (node: HTMLElement, selector: string): void => {
  const target = node.querySelector(selector)
  expect(target, selector).not.toBeNull()
  act(() => { (target as HTMLElement).click() })
}

describe('turn expansion', () => {
  it('reveals every attempt, its model, and the unpriced reason', () => {
    const { store } = makeStore(defaultSettings())
    const node = render(store)
    // Collapsed: the detail rows are absent and aria-expanded is false.
    const turn = node.querySelector('.dpm-turn') as HTMLElement
    expect(turn.getAttribute('aria-expanded')).toBe('false')
    expect(node.textContent).not.toContain(en['turns.attempt'])

    act(() => { turn.click() })
    const expanded = node.querySelector('.dpm-turn') as HTMLElement
    expect(expanded.getAttribute('aria-expanded')).toBe('true')
    // Both attempts render: the priced one with its model, the other with its
    // reason for staying out of the money.
    expect(node.textContent).toContain('deepseek-v4-flash')
    expect(node.textContent).toContain(en['turns.unpriced'])
    expect(node.textContent).toContain(en['reason.no-usage'])
    expect(node.textContent).toContain(en['turns.subtotal'])

    // Collapsing hides them again.
    act(() => { (node.querySelector('.dpm-turn') as HTMLElement).click() })
    expect((node.querySelector('.dpm-turn') as HTMLElement).getAttribute('aria-expanded')).toBe('false')
    expect(node.textContent).not.toContain(en['turns.subtotal'])
  })
})

describe('plan switching', () => {
  it('writes the whole catalog through the settings route and re-renders', async () => {
    const catalog = defaultSettings()
    const { store, writes } = makeStore(catalog)
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ value: {} }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    const node = render(store)
    const target = officialSeedPlans[1]!
    expect(node.textContent).toContain(officialSeedPlans[0]!.name)

    const chips = [...node.querySelectorAll('.dpm-chip')] as HTMLElement[]
    const chip = chips.find(element => element.textContent === target.name)
    expect(chip, target.name).toBeDefined()
    await act(async () => { chip!.click() })

    // One POST carrying the complete pluginSettings map, and the store adopted
    // the new selection.
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe('/sidebar/api/settings.update')
    expect(init.method).toBe('POST')
    const body = JSON.parse(String(init.body)) as { patch: { pluginSettings: Record<string, { catalog: { selectedPlanId: string } }> } }
    expect(body.patch.pluginSettings[SETTINGS_KEY]!.catalog.selectedPlanId).toBe(target.id)
    expect(writes).toHaveLength(1)
    expect(node.textContent).toContain(target.name)
    // The plan card now shows the selected plan's own rates.
    expect(node.textContent).toContain(`$${target.ratesPerMillion.offPeak.output}`)
  })

  it('surfaces a failed write instead of silently keeping the old selection', async () => {
    const { store } = makeStore(defaultSettings())
    vi.stubGlobal('fetch', vi.fn(async () => new Response('nope', { status: 500 })))
    const node = render(store)
    const chips = [...node.querySelectorAll('.dpm-chip')] as HTMLElement[]
    await act(async () => { chips[1]!.click() })
    expect(node.textContent).toContain('Saving the plan failed')
    expect(node.textContent).toContain('500')
  })
})

describe('plan settings panel', () => {
  it('selects a plan, states the pricing basis, and edits rates', () => {
    const updates: [string, unknown][] = []
    const props = {
      pluginSettings: { [CATALOG_KEY]: defaultSettings() },
      updatePluginSetting: (key: string, value: unknown) => updates.push([key, value]),
      close: () => {},
    } as unknown as SidebarSettingsRenderProps
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    act(() => { root!.render(<PricePlanSettings {...props} />) })

    // The selected plan is the pricing basis, and the panel says so.
    expect(container.textContent).toContain(en['settings.basis'])
    expect(container.textContent).toContain(en['settings.selected'])
    for (const plan of officialSeedPlans) expect(container.textContent).toContain(plan.name)
    // The retired controls are gone: no calculation mode, no model aliases.
    expect(container.querySelector('#dpm-mode')).toBeNull()
    expect(container.textContent).not.toContain('alias')
    expect(container.querySelector('#dpm-alias-from')).toBeNull()

    const select = container.querySelector('#dpm-selected') as HTMLSelectElement
    act(() => {
      select.value = officialSeedPlans[1]!.id
      select.dispatchEvent(new Event('change', { bubbles: true }))
    })
    expect(updates).toHaveLength(1)
    expect(updates[0]![0]).toBe(CATALOG_KEY)
    expect((updates[0]![1] as { selectedPlanId: string }).selectedPlanId).toBe(officialSeedPlans[1]!.id)
  })
})

describe('plan switching reprices the tab', () => {
  it('moves the hero, the breakdown, and the turn rows to the clicked plan', async () => {
    const { store } = makeStore(defaultSettings())
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ value: {} }), { status: 200 })))
    const node = render(store)
    const pro = officialSeedPlans[1]!
    const hero = (): string => (node.querySelector('.dpm-hero__value') as HTMLElement).textContent ?? ''
    const rows = (): string[] => [...node.querySelectorAll('.dpm-turn__cost')].map(element => element.textContent ?? '')
    const rates = (): string => (node.querySelector('.dpm-table') as HTMLElement).textContent ?? ''

    // 1M cache-miss tokens off-peak: $0.15 at the flash rates, $0.66 at pro's.
    expect(hero()).toBe('$0.150000')
    expect(rows()).toEqual(['$0.150000'])
    const flashRates = rates()

    const chips = [...node.querySelectorAll('.dpm-chip')] as HTMLElement[]
    await act(async () => { chips.find(element => element.textContent === pro.name)!.click() })

    expect(hero()).toBe('$0.660000')
    expect(rows()).toEqual(['$0.660000'])
    expect(rates()).not.toBe(flashRates)
    // The attempt with no reported usage stays out of the money either way.
    expect(node.textContent).toContain(en['total.known'])
    expect(node.textContent).toContain(en['reason.no-usage'])
  })
})
