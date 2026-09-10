/**
 * The official DeepSeek price snapshot shipped with this plugin, so the tab
 * is usable offline on first launch. It is a reviewed point-in-time fact, not
 * a live price oracle: the UI shows the fetch date and a link to the source,
 * and the host route refreshes it (see stage D) into new immutable versions.
 *
 * Snapshot date 2026-09-10, source https://api-docs.deepseek.com/quick_start/pricing/,
 * all rates in USD per million tokens. Peak windows are UTC, Monday–Friday,
 * 01:00–04:00 and 06:00–10:00 (left-closed, right-open).
 *
 * The page lists two priced models — the flash model (DeepSeek-V4.1-Flash on
 * this snapshot) and the pro model — and one flash price. Vision is a
 * capability of that flash model rather than a separate price line, so one
 * plan covers the ids the flash model has been listed or reported under
 * ({@link FLASH_MODEL_IDS}). Availability and naming change without notice;
 * the refresh route is the way to re-read them.
 *
 * @module dsh-price-monitor/pricing/official-seed
 */
import type { PersistedSettings, PricingPlan } from './schema.ts';
/**
 * The flash model's ids: the page's current name, the id earlier pages and
 * harness builds reported it under, and the id sessions recorded while vision
 * was listed as its own price line used. One price tier, so one plan covers
 * them.
 */
export declare const FLASH_MODEL_IDS: readonly string[];
/** The shipped official plan catalog (one plan per model). */
export declare const officialSeedPlans: readonly PricingPlan[];
/** Default settings: the official snapshot with its first plan selected. */
export declare function defaultSettings(): PersistedSettings;
/**
 * Every id a page-listed model also answers to. The page names the flash model
 * by its current id; a deployment or an older session may report one of
 * {@link FLASH_MODEL_IDS} instead. A refresh-applied plan therefore keeps the
 * same coverage the shipped seed has, while its rates still come only from the
 * page.
 * @param model - the page's model id.
 * @returns the ids the plan should cover (the input alone when none is known).
 */
export declare function expandOfficialModelIds(model: string): string[];
