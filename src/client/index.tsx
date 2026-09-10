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

import type { ClientContext } from '../context-types.ts'
import { bindTranslate, en, NS, zh } from './locales.ts'
import { injectPriceMonitorStyles } from './styles.ts'
import { PriceMonitorTab } from './PriceMonitorTab.tsx'
import { PricePlanSettings } from './PricePlanSettings.tsx'

export { PriceMonitorTab } from './PriceMonitorTab.tsx'
export { PricePlanSettings } from './PricePlanSettings.tsx'
export { NS } from './locales.ts'

/**
 * Capabilities this tab needs from the sidebar before it can work. The plugin
 * fails loud at activation when one is missing instead of rendering a broken
 * panel: `pluginSettings` is where the plan catalog lives, and
 * `stateSubscription` is how the tab observes it.
 */
const REQUIRED_FEATURES = ['pluginSettings', 'stateSubscription'] as const

/** Client service requirements (the sidebar registry, sessions, and locale). */
export const inject = ['betterSidebar', 'sessions', 'locale']

/** Tab descriptor id (also the `pluginSettings` key owner). */
export const TAB_ID = 'price-monitor'

/**
 * Client plugin body: bind the dictionary, inject the stylesheet, and register
 * the single-instance tab with its settings panel.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  const missing = REQUIRED_FEATURES.filter(feature => !ctx.betterSidebar.features.includes(feature))
  if (missing.length > 0) {
    throw new Error(`dsh-price-monitor requires Better Sidebar features: ${missing.join(', ')}`)
  }

  ctx.effect(() => injectPriceMonitorStyles(), 'dsh-price-monitor: stylesheet')
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-price-monitor: dictionaries')
  bindTranslate(ctx.locale.bind(NS))

  ctx.effect(() => ctx.betterSidebar.registerTab({
    id: TAB_ID,
    title: () => ctx.locale.bind(NS)('tab.title'),
    order: 55,
    single: true,
    settings: {
      render: props => PricePlanSettings(props),
    },
    component: props => PriceMonitorTab(props),
  }), 'dsh-price-monitor: sidebar tab')
}
