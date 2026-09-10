/**
 * The price-monitor tab: session cost hero, three-bucket breakdown, plan card
 * with a same-tokens comparison, and the per-turn list with attempt details.
 *
 * Every amount comes from the single `usePriceView` computation — the hero,
 * the three summary rows, the comparison rows, and every turn row read that
 * one object, so per-turn amounts always add up to the hero exactly. Peak
 * tier labels and plan names are read off the same result (the engine records
 * the band and plan it actually priced with), never recomputed here, and an
 * attempt that cannot be priced stays visible with its reason instead of
 * becoming zero.
 *
 * @module dsh-price-monitor/client/PriceMonitorTab
 */
import type { TabComponentProps } from 'dsh-better-sidebar/client/service';
/**
 * Render the price-monitor tab body.
 * @param props - the sidebar tab props.
 * @returns the tab's React tree.
 */
export declare function PriceMonitorTab({ ctx: sidebarCtx, store, scope, visible }: TabComponentProps): React.ReactElement;
