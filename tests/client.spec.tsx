/**
 * Client-half tests: activation (dictionary + tab registration, feature gate),
 * catalog reads from the sidebar prefs, and rendered tabs asserting that the
 * hero total equals the sum of the per-turn rows, that switching the selected
 * plan reprices every amount, and that an unpriceable attempt surfaces as
 * partial instead of zero.
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
          // An attempt whose usage never arrived: no tokens to price at all,
          // so the total is partial whatever plan is selected.
          id: '2:1:0',
          turn: 2,
          step: 1,
          attempt: 0,
          startedAt: Date.UTC(2026, 8, 14, 20, 2),
          provider: 'deepseek-official',
          model: 'deepseek-v4-flash',
          completeness: 'usage-missing',
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

/** All money amounts in a rendered markup string, as numbers. */
function amountsIn(markup: string): number[] {
  return [...markup.matchAll(/[$¥](\d+\.\d+)/g)].map(match => Number(match[1]))
}

/** The first amount inside the hero element (the session total). */
function heroTotal(markup: string, symbol = '\\$'): number {
  const hero = new RegExp(`dpm-hero__value">${symbol}(\\d+\\.\\d+)`).exec(markup)
  expect(hero, 'hero total rendered').not.toBeNull()
  return Number(hero![1])
}

/** Turn-row totals in render order, from their cost spans. */
function turnTotals(markup: string): number[] {
  return [...markup.matchAll(/dpm-turn__cost dpm-num(?:[^>]*)>[$¥](\d+\.\d+)/g)].map(match => Number(match[1]))
}

/** The first rate in the plan card's rate table (its cache-miss cell). */
function rateTableOf(markup: string): string | undefined {
  return /dpm-table[\s\S]*?dpm-num">([$¥]\d+(?:\.\d+)?)</.exec(markup)?.[1]
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

  it('upgrades a stored v2 catalog instead of reporting it corrupt', () => {
    const plans = [...officialSeedPlans]
    // The generation-2 shape: one model-id list and one rate table per plan.
    const stored = {
      schemaVersion: 2,
      selectedPlanId: plans[1]!.id,
      plans: plans.map(plan => {
        const { entries, ...rest } = plan
        return {
          ...rest,
          modelIds: entries.flatMap(entry => entry.models),
          ratesPerMillion: { offPeak: entries[0]!.offPeak, ...entries[0]!.peak === undefined ? {} : { peak: entries[0]!.peak } },
        }
      }),
    }
    const catalog = catalogFromPrefs({ pluginSettings: { [SETTINGS_KEY]: { [CATALOG_KEY]: stored } } } as unknown as SidebarPrefs)
    expect(catalog?.schemaVersion).toBe(3)
    expect(catalog?.selectedPlanId).toBe(plans[1]!.id)
    expect(catalog?.plans.map(plan => plan.name)).toEqual(plans.map(plan => plan.name))
  })
})

describe('rendered tab', () => {
  it('renders the hero total as the exact sum of the per-turn rows', () => {
    const { store } = storeWith(defaultSettings())
    const markup = renderToStaticMarkup(<PriceMonitorTab {...tabProps(store, LEDGER)} />)
    const total = heroTotal(markup, '¥')
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
    expect(markup).toContain(`${en['reason.no-usage']} ×1`)
    // Both tiers appear across the two turns.
    expect(markup).toContain(en['turns.peak'])
    expect(markup).toContain(en['turns.offPeak'])
  })

  it('reprices the hero, the breakdown, and every turn row when the plan changes', () => {
    const plans = defaultSettings()
    const [before, , current] = officialSeedPlans
    const atBefore = renderToStaticMarkup(
      <PriceMonitorTab {...tabProps(storeWith({ ...plans, selectedPlanId: before!.id }).store, LEDGER)} />)
    const atCurrent = renderToStaticMarkup(
      <PriceMonitorTab {...tabProps(storeWith({ ...plans, selectedPlanId: current!.id }).store, LEDGER)} />)

    // Turn 1 (flash) runs in a peak window with 1M miss / 2M cache-read /
    // 0.5M output; turn 2 (pro) is off-peak with 0.1M miss / 10k output. The
    // flat pre-hike era prices both at its headline rates:
    // 1 + 2×0.02 + 0.5×2 + 0.1×1 + 0.01×2 = 2.16 yuan. The current era prices
    // the flash turn at 2 / 0.04 / 8 in peak and the pro turn at its own
    // 4.5 / 0.15 / 13.5 off-peak table:
    // 2 + 2×0.04 + 0.5×8 + 0.1×4.5 + 0.01×13.5 = 6.665 yuan.
    expect(heroTotal(atBefore, '¥')).toBeCloseTo(2.16, 8)
    expect(heroTotal(atCurrent, '¥')).toBeCloseTo(6.665, 8)
    // The breakdown, the rate table, and the turn rows move with it, not just
    // the hero.
    expect(amountsIn(atCurrent)).not.toEqual(amountsIn(atBefore))
    expect(turnTotals(atCurrent)).not.toEqual(turnTotals(atBefore))
    expect(rateTableOf(atBefore)).toBe('¥1')
    expect(rateTableOf(atCurrent)).toBe('¥1')
    // The current era prices two models, so its card carries one table each.
    expect(atCurrent).toContain(current!.entries[1]!.models[0])
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
    // The plan does have tiers; the session simply has no priceable attempt, so
    // neither tier sentence is a fact this view established.
    const unpriceable: PriceMonitorUsageView = {
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
          model: 'deepseek-v4-flash',
          uncachedInputTokens: 1_000,
          cacheReadTokens: 0,
          cacheWriteTokens: 0,
          outputTokens: 1,
          completeness: 'invalid',
        }],
      }],
    }
    const { store } = storeWith(defaultSettings())
    const markup = renderToStaticMarkup(<PriceMonitorTab {...tabProps(store, unpriceable)} />)
    expect(markup).not.toContain(en['breakdown.flatNote'])
    expect(markup).not.toContain(en['breakdown.noPeakRequests'])
    // The tokens are still reported as facts.
    expect(markup).toContain('1.0k')
  })

  it('renders every plan chip and the same-tokens comparison', () => {
    const { store } = storeWith(defaultSettings())
    const markup = renderToStaticMarkup(<PriceMonitorTab {...tabProps(store, LEDGER)} />)
    for (const plan of officialSeedPlans) expect(markup).toContain(plan.name)
    expect(markup).toContain(en['plan.compare'])
  })

  it('shows a plan’s amounts in its own currency and drops cross-currency ratios', () => {
    // The shipped plans are in yuan; a manual plan kept in dollars is what
    // makes this comparison span two currencies.
    const dollarFlash = { ...defaultSettings().plans[0]!, id: 'manual:usd', name: 'flash $', currency: 'USD' as const }
    const yuanFlash = {
      id: 'manual:yuan',
      name: 'flash 元',
      source: 'manual' as const,
      provider: 'deepseek-official' as const,
      modelIds: ['deepseek-flash'],
      currency: 'CNY' as const,
      schedule: null,
      ratesPerMillion: { offPeak: { cacheMiss: '1', cacheHit: '0.02', output: '4' } },
    }
    const catalog = { ...defaultSettings(), plans: [dollarFlash, yuanFlash], selectedPlanId: 'manual:yuan' }
    const markup = renderToStaticMarkup(<PriceMonitorTab {...tabProps(storeWith(catalog).store, LEDGER)} />)

    // A flat ¥1 / ¥0.02 / ¥4 plan over the fixture ledger: turn 1 contributes
    // 1×1 + 2×0.02 + 0.5×4 and turn 2 0.1×1 + 0.01×4, with the usage-less
    // attempt still excluded.
    expect(heroTotal(markup, '¥')).toBeCloseTo(1 + 2 * 0.02 + 0.5 * 4 + 0.1 + 0.01 * 4, 8)
    expect(markup).toContain('¥1')
    // The dollar plan is still listed, in its own currency.
    expect(markup).toContain('$')
    // The comparison spans two currencies, so it lists both totals without a
    // percentage that would divide yuan by dollars.
    expect(markup).toContain(`${en['plan.compare']}`)
    expect(markup).not.toMatch(/[+−]\d+%/)
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
