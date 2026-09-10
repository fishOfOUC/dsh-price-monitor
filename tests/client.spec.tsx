/**
 * Client-half tests: activation (dictionary + tab registration, feature gate),
 * catalog reads from the sidebar prefs, and one rendered tab asserting that
 * the hero total equals the sum of the per-turn rows and that unpriceable
 * attempts surface as partial instead of zero.
 */

import { renderToStaticMarkup } from 'react-dom/server'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import type { Context as CordisContext } from '@deepseek-ai/cordis'
import type { ClientContext } from '../src/context-types.ts'
import type { SidebarPrefs, SidebarSnapshot, SidebarStore, TabComponentProps, TabDescriptor } from 'dsh-better-sidebar/client/service'
import { apply, TAB_ID } from '../src/client/index.tsx'
import { PriceMonitorTab } from '../src/client/PriceMonitorTab.tsx'
import { bindTranslate, en, NS, zh } from '../src/client/locales.ts'
import { catalogFromPrefs, CATALOG_KEY, SETTINGS_KEY } from '../src/client/settings-write.ts'
import { defaultSettings, officialSeedPlans } from '../src/pricing/index.ts'
import type { PriceMonitorUsageView } from '../src/projection-types.ts'
import type { PriceMonitorKey } from '../src/client/locales.ts'

/** Resolve a key from the English dictionary with `{name}` substitution. */
function english(key: PriceMonitorKey, params?: Record<string, unknown>): string {
  const template = en[key]
  if (params === undefined) return template
  return template.replace(/\{(\w+)\}/g, (match, name: string) => name in params ? String(params[name]) : match)
}

// Every render test uses the real English dictionary (the module binding is
// what the plugin installs at activation).
beforeAll(() => { bindTranslate(english) })

const LEDGER: PriceMonitorUsageView = {
  turns: [
    {
      turn: 1,
      startedAt: Date.UTC(2026, 8, 14, 1, 30), // Monday peak, inside the seed window
      endedAt: Date.UTC(2026, 8, 14, 1, 31),
      complete: true,
      attempts: [{
        id: '1:0:0',
        turn: 1,
        step: 0,
        attempt: 0,
        startedAt: Date.UTC(2026, 8, 14, 1, 30),
        settledAt: Date.UTC(2026, 8, 14, 1, 31),
        provider: 'deepseek-official',
        model: 'deepseek-v4-flash',
        uncachedInputTokens: 1_000_000,
        cacheReadTokens: 2_000_000,
        cacheWriteTokens: 0,
        outputTokens: 500_000,
        completeness: 'complete',
      }],
    },
    {
      turn: 2,
      startedAt: Date.UTC(2026, 8, 14, 20, 0), // off-peak
      endedAt: Date.UTC(2026, 8, 14, 20, 1),
      complete: true,
      attempts: [
        {
          id: '2:0:0',
          turn: 2,
          step: 0,
          attempt: 0,
          startedAt: Date.UTC(2026, 8, 14, 20, 0),
          settledAt: Date.UTC(2026, 8, 14, 20, 1),
          provider: 'deepseek-official',
          model: 'deepseek-v4-pro',
          uncachedInputTokens: 100_000,
          cacheReadTokens: 0,
          cacheWriteTokens: 0,
          outputTokens: 10_000,
          completeness: 'complete',
        },
        {
          // A gateway attempt the official plans cannot price.
          id: '2:1:0',
          turn: 2,
          step: 1,
          attempt: 0,
          startedAt: Date.UTC(2026, 8, 14, 20, 2),
          provider: 'other-gateway',
          model: 'mystery',
          completeness: 'complete',
        },
      ],
    },
  ],
}

/** A minimal store whose prefs carry this plugin's catalog. */
function storeWith(catalog: unknown): { store: SidebarStore; setPrefs: ReturnType<typeof vi.fn> } {
  let prefs = {
    pluginSettings: catalog === undefined ? {} : { [SETTINGS_KEY]: { [CATALOG_KEY]: catalog } },
  } as unknown as SidebarPrefs
  const listeners = new Set<() => void>()
  const setPrefs = vi.fn((next: SidebarPrefs) => {
    prefs = next
    for (const listener of [...listeners]) listener()
  })
  const store = {
    getPrefs: () => prefs,
    setPrefs,
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    getSnapshot: () => ({ sessionId: 's1', state: undefined, prefs }) as unknown as SidebarSnapshot,
  } as unknown as SidebarStore
  return { store, setPrefs }
}

/** Tab props with a session binding exposing the given ledger. */
function tabProps(store: SidebarStore, ledger: PriceMonitorUsageView): TabComponentProps {
  const face = {
    getSnapshot: () => ledger,
    subscribe: () => () => {},
  }
  const ctx = {
    sessions: { binding: () => ({ session: { projections: { faceOf: () => face } } }) },
  } as unknown as CordisContext
  return {
    ctx,
    store,
    scope: { sessionId: 's1' } as TabComponentProps['scope'],
    tab: { id: TAB_ID, type: TAB_ID, title: 'Session cost' },
    visible: true,
  } as TabComponentProps
}

/** All `$` amounts in a rendered markup string, as numbers. */
function amountsIn(markup: string): number[] {
  return [...markup.matchAll(/\$(\d+\.\d+)/g)].map(match => Number(match[1]))
}

/** The first amount inside the hero element (the session total). */
function heroTotal(markup: string): number {
  const hero = /dpm-hero__value">\$(\d+\.\d+)/.exec(markup)
  expect(hero, 'hero total rendered').not.toBeNull()
  return Number(hero![1])
}

/** Turn-row totals in render order, from their cost spans. */
function turnTotals(markup: string): number[] {
  return [...markup.matchAll(/dpm-turn__cost dpm-num(?:[^>]*)>\$(\d+\.\d+)/g)].map(match => Number(match[1]))
}

describe('client activation', () => {
  function fakeContext(features: readonly string[]): {
    ctx: CordisContext
    registered: TabDescriptor[]
    dictionaries: [string, Record<string, Record<string, string>>][]
  } {
    const registered: TabDescriptor[] = []
    const dictionaries: [string, Record<string, Record<string, string>>][] = []
    const ctx = {
      betterSidebar: {
        features,
        registerTab: (descriptor: TabDescriptor) => {
          registered.push(descriptor)
          return () => {}
        },
      },
      locale: {
        register: (ns: string, dicts: Record<string, Record<string, string>>) => {
          dictionaries.push([ns, dicts])
          return () => {}
        },
        bind: () => english as unknown as (key: string) => string,
        getSnapshot: () => ({ active: 'en', revision: 1 }),
        subscribe: () => () => {},
      },
      effect: (body: () => (() => void) | void) => {
        body()
        return () => {}
      },
    } as unknown as CordisContext
    return { ctx, registered, dictionaries }
  }

  it('registers the dictionary and a single-instance tab with a settings panel', () => {
    const { ctx, registered, dictionaries } = fakeContext(['pluginSettings', 'stateSubscription'])
    apply(ctx as unknown as ClientContext)
    expect(dictionaries).toHaveLength(1)
    expect(dictionaries[0]![0]).toBe(NS)
    expect(Object.keys(dictionaries[0]![1]!.zh ?? {})).toEqual(Object.keys(dictionaries[0]![1]!.en ?? {}))
    expect(registered).toHaveLength(1)
    expect(registered[0]!.id).toBe(TAB_ID)
    expect(registered[0]!.single).toBe(true)
    expect(registered[0]!.settings?.render).toBeTypeOf('function')
  })

  it('fails loud when the sidebar lacks a required feature', () => {
    const { ctx } = fakeContext(['badge'])
    expect(() => apply(ctx as unknown as ClientContext)).toThrow(/requires Better Sidebar features: pluginSettings, stateSubscription/)
  })

  it('keeps both dictionaries complete (bilingual balance)', () => {
    expect(Object.keys(zh).sort()).toEqual(Object.keys(en).sort())
  })
})

describe('catalog reads', () => {
  it('reads a stored catalog and ignores an unreadable one', () => {
    const catalog = defaultSettings()
    expect(catalogFromPrefs({ pluginSettings: { [SETTINGS_KEY]: { [CATALOG_KEY]: catalog } } } as unknown as SidebarPrefs)).toEqual(catalog)
    expect(catalogFromPrefs({ pluginSettings: {} } as unknown as SidebarPrefs)).toBeUndefined()
    expect(catalogFromPrefs({ pluginSettings: { [SETTINGS_KEY]: { [CATALOG_KEY]: { schemaVersion: 9 } } } } as unknown as SidebarPrefs)).toBeUndefined()
  })
})

describe('rendered tab', () => {
  it('renders the hero total as the exact sum of the per-turn rows', () => {
    const { store } = storeWith(defaultSettings())
    const markup = renderToStaticMarkup(<PriceMonitorTab {...tabProps(store, LEDGER)} />)
    const total = heroTotal(markup)
    const rows = turnTotals(markup)
    expect(rows).toHaveLength(2)
    const sum = rows.reduce((left, right) => left + right, 0)
    // Both sides are rounded to 8 decimals independently; they must agree to
    // the cent at worst, and the display precision is the only difference.
    expect(Math.abs(sum - total)).toBeLessThan(1e-8)
  })

  it('reports the partial state and tallies the unpriceable reason', () => {
    const { store } = storeWith(defaultSettings())
    const markup = renderToStaticMarkup(<PriceMonitorTab {...tabProps(store, LEDGER)} />)
    // The hero switches to the "known cost" wording and names the reason.
    expect(markup).toContain(en['total.known'])
    expect(markup).toContain(`${en['reason.not-official']} ×1`)
    // Both tiers appear across the two turns.
    expect(markup).toContain(en['turns.peak'])
    expect(markup).toContain(en['turns.offPeak'])
  })

  it('falls back to the bundled official snapshot and reports a corrupt blob', () => {
    const { store } = storeWith({ schemaVersion: 9, plans: [] })
    const markup = renderToStaticMarkup(<PriceMonitorTab {...tabProps(store, LEDGER)} />)
    expect(markup).toContain(officialSeedPlans[0]!.name)
    expect(markup).toContain(en['error.settingsCorrupt'])
  })

  it('renders an actionable empty state without a ledger', () => {
    const { store } = storeWith(defaultSettings())
    const markup = renderToStaticMarkup(<PriceMonitorTab {...tabProps(store, { turns: [] })} />)
    expect(markup).toContain(en['empty.noUsage'])
  })

  it('names an entirely off-peak session separately from a plan without tiers', () => {
    const { store } = storeWith(defaultSettings())
    const offPeakOnly: PriceMonitorUsageView = {
      turns: [{
        turn: 1,
        startedAt: Date.UTC(2026, 8, 14, 20, 0), // Monday 20:00 UTC: off-peak
        endedAt: Date.UTC(2026, 8, 14, 20, 1),
        complete: true,
        attempts: [{
          id: '1:0:0',
          turn: 1,
          step: 0,
          attempt: 0,
          startedAt: Date.UTC(2026, 8, 14, 20, 0),
          provider: 'deepseek-official',
          model: 'deepseek-v4-flash',
          uncachedInputTokens: 1_000,
          cacheReadTokens: 0,
          cacheWriteTokens: 0,
          outputTokens: 1,
          completeness: 'complete',
        }],
      }],
    }
    const markup = renderToStaticMarkup(<PriceMonitorTab {...tabProps(store, offPeakOnly)} />)
    // The plan does have peak tiers; the session simply saw none.
    expect(markup).toContain(en['breakdown.noPeakRequests'])
    expect(markup).not.toContain(en['breakdown.flatNote'])
  })

  it('makes no peak-tier claim when nothing was priced', () => {
    // The plan does have tiers; the session simply has no priced attempt, so
    // neither tier sentence is a fact this view established.
    const unmapped: PriceMonitorUsageView = {
      turns: [{
        turn: 1,
        startedAt: Date.UTC(2026, 8, 14, 12, 0),
        endedAt: Date.UTC(2026, 8, 14, 12, 1),
        complete: true,
        attempts: [{
          id: '1:0:0',
          turn: 1,
          step: 0,
          attempt: 0,
          startedAt: Date.UTC(2026, 8, 14, 12, 0),
          provider: 'deepseek-official',
          model: 'no-plan-names-this',
          uncachedInputTokens: 1_000,
          cacheReadTokens: 0,
          cacheWriteTokens: 0,
          outputTokens: 1,
          completeness: 'complete',
        }],
      }],
    }
    const { store } = storeWith(defaultSettings())
    const markup = renderToStaticMarkup(<PriceMonitorTab {...tabProps(store, unmapped)} />)
    expect(markup).not.toContain(en['breakdown.flatNote'])
    expect(markup).not.toContain(en['breakdown.noPeakRequests'])
    // The tokens are still reported as facts.
    expect(markup).toContain('1.0k')
  })

  it('renders every plan chip and the mode toggle', () => {
    const { store } = storeWith(defaultSettings())
    const markup = renderToStaticMarkup(<PriceMonitorTab {...tabProps(store, LEDGER)} />)
    for (const plan of officialSeedPlans) expect(markup).toContain(plan.name)
    expect(markup).toContain(en['mode.effective'])
    expect(markup).toContain(en['plan.compare'])
  })
})

describe('translate binding', () => {
  it('uses the bound namespace function for the tab title', () => {
    bindTranslate((key: keyof typeof en) => `x:${key}`)
    const { store } = storeWith(defaultSettings())
    const markup = renderToStaticMarkup(<PriceMonitorTab {...tabProps(store, LEDGER)} />)
    expect(markup).toContain('x:tab.title')
    bindTranslate(english)
  })
})
