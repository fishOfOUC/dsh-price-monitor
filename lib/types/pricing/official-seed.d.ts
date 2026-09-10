/**
 * The official DeepSeek price history shipped with this plugin, so the tab is
 * usable offline on first launch: one plan per pricing era, each carrying a
 * rate table per model group. It is a reviewed point-in-time fact, not a live
 * price oracle — the plan card shows each era's source and period, and the host
 * route refreshes the current era (see official-pricing-route.ts) into new
 * immutable versions.
 *
 * Reviewed 2026-09-10 against
 * https://api-docs.deepseek.com/zh-cn/quick_start/pricing/, all rates in CNY per
 * million tokens — the Chinese page prints the primary numbers and the English
 * page prints their rounded USD conversion, so this snapshot keeps the former
 * and converts nothing. Peak windows are UTC, Monday–Friday, 01:00–04:00 and
 * 06:00–10:00 (left-closed, right-open), which the page states as Beijing time
 * 09:00–12:00 and 14:00–18:00.
 *
 * The three eras are the flash model's published history: one flat price before
 * the 2026-08-17 increase, that increase's peak/off-peak tiers, and the cut in
 * force now. Vision is a capability of the flash model rather than a separate
 * price line, so one group covers the ids it has been listed or reported under
 * ({@link FLASH_MODEL_IDS}). The pro model belongs to the current era only:
 * the page states its requests are served by DeepSeek-V4.1-Flash and billed at
 * Flash prices from 2026-09-14, and earlier pro rates were never published in a
 * form this catalog recorded. Availability and naming change without notice;
 * the refresh route is the way to re-read them.
 *
 * @module dsh-price-monitor/pricing/official-seed
 */
import type { PersistedSettings, PricingPlan } from './schema.ts';
/**
 * The flash model's ids: the page's current name, the id earlier pages and
 * harness builds reported it under, and the id sessions recorded while vision
 * was listed as its own price line used. One price tier, so one group covers
 * them.
 */
export declare const FLASH_MODEL_IDS: readonly string[];
/** The pro model's ids, priced by the current era's own table. */
export declare const PRO_MODEL_IDS: readonly string[];
/** The shipped plan catalog: one plan per published flash-pricing era, oldest first. */
export declare const officialSeedPlans: readonly PricingPlan[];
/** Default settings: the shipped eras with the one in force selected. */
export declare function defaultSettings(): PersistedSettings;
/**
 * The shipped era in force: the one that declares no end. The refresh route
 * compares the live page against it, and applying a fetch replaces it.
 * @returns the current-era plan (the newest shipped plan when none declares an open end).
 */
export declare function currentEraPlan(): PricingPlan;
/**
 * Every id a page-listed model also answers to. The page names the flash model
 * by its current id; a deployment or an older session may report one of
 * {@link FLASH_MODEL_IDS} instead. A refresh-applied plan therefore keeps the
 * same coverage the shipped seed has, while its rates still come only from the
 * page.
 * @param model - the page's model id.
 * @returns the ids the group should cover (the input alone when none is known).
 */
export declare function expandOfficialModelIds(model: string): string[];
