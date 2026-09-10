/**
 * Strict parser for the DeepSeek official pricing page, plus the shared
 * candidate/diff vocabulary the client uses to preview a refresh before
 * applying it.
 *
 * The page is a Docusaurus table transposed so models are columns and pricing
 * categories are rows, with rowspan carrying the label cells down. The parser
 * reconstructs a rectangular grid, locates the model header and the three
 * priced categories (cache hit / cache miss / output) across the off-peak and
 * peak bands, and validates the structure strictly — a changed header, a
 * missing category, a malformed amount, a broken peak/off-peak 2x relation, or
 * a different peak-window footnote all fail, so a changed page can never be
 * half-imported over the last good catalog.
 *
 * This module is node-free: the host route adds hashing and the network fetch.
 *
 * @module dsh-price-monitor/official-pricing
 */
/** One parsed model's four rates (per million tokens, decimal strings). */
export interface OfficialModelRates {
    readonly model: string;
    readonly cacheHit: string;
    readonly cacheMiss: string;
    readonly output: string;
    readonly peakCacheHit: string;
    readonly peakCacheMiss: string;
    readonly peakOutput: string;
}
/** A validated parse result: one row per model plus the confirmed peak schedule. */
export interface ParsedOfficialPricing {
    readonly models: readonly OfficialModelRates[];
    readonly peakWindows: readonly [readonly [string, string], readonly [string, string]];
}
/** The candidate the host route returns for client preview. */
export interface OfficialPricingCandidate {
    readonly models: readonly OfficialModelRates[];
    readonly fetchedAt: string;
    readonly contentHash: string;
    readonly sourceUrl: string;
}
/** One field-level change between a previous and a candidate rate. */
export interface OfficialDiffEntry {
    readonly model: string;
    readonly field: keyof Omit<OfficialModelRates, 'model'>;
    readonly before?: string;
    readonly after: string;
}
/** Field-level diff between a previous catalog and the candidate. */
export interface OfficialPricingDiff {
    readonly addedModels: readonly string[];
    readonly removedModels: readonly string[];
    readonly changed: readonly OfficialDiffEntry[];
}
/**
 * Parse the official pricing page HTML into validated per-model rates and the
 * confirmed peak schedule. Returns undefined on any structural mismatch, so a
 * caller keeps the last good catalog.
 * @param html - the fetched page body.
 * @returns the validated parse, or undefined when the page changed unexpectedly.
 */
export declare function parseOfficialPricing(html: string): ParsedOfficialPricing | undefined;
/** Field-level diff between a previous official catalog and a candidate. */
export declare function diffOfficialPricing(previous: readonly OfficialModelRates[], candidate: readonly OfficialModelRates[]): OfficialPricingDiff;
