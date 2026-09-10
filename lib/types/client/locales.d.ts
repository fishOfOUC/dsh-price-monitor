/**
 * Bilingual dictionary for the price-monitor tab and its settings panel.
 * Every user-visible string goes through this namespace (no hardcoded copy in
 * components). Keys are flat; `{name}` placeholders are substituted by the
 * locale runtime.
 *
 * @module dsh-price-monitor/client/locales
 */
/** The price-monitor locale namespace. */
export declare const NS = "priceMonitor";
/** English dictionary (the required fallback locale). */
export declare const en: {
    readonly 'tab.title': "Session cost";
    readonly 'tab.subtitle': "Provider-reported tokens priced with the selected plan";
    readonly 'action.refresh': "Refresh official pricing";
    readonly 'action.settings': "Plan settings";
    readonly 'action.collapse': "Collapse";
    readonly 'action.apply': "Apply";
    readonly 'action.cancel': "Cancel";
    readonly 'action.save': "Save";
    readonly 'action.delete': "Delete";
    readonly 'action.copy': "Duplicate";
    readonly 'action.reset': "Restore built-in plans";
    readonly 'total.label': "Total cost";
    readonly 'total.known': "Known cost (partial)";
    readonly 'total.uncovered': "{count} attempts not priced";
    readonly 'total.covered': "All {count} attempts priced";
    readonly 'total.noAttempts': "No billed attempt in this session yet";
    readonly 'stat.tokens': "Total tokens";
    readonly 'stat.turns': "Turns";
    readonly 'stat.attempts': "Requests";
    readonly 'stat.average': "Per turn";
    readonly 'stat.hitRate': "Cache hit rate";
    readonly 'breakdown.title': "Cost breakdown";
    readonly 'breakdown.miss': "Input · cache miss";
    readonly 'breakdown.hit': "Input · cache hit";
    readonly 'breakdown.output': "Output";
    readonly 'breakdown.tokens': "{tokens} tok";
    readonly 'breakdown.peakNote': "{count} requests ran at peak";
    readonly 'breakdown.flatNote': "This plan has no peak tiers";
    readonly 'breakdown.noPeakRequests': "No request ran at peak hours";
    readonly 'breakdown.cacheWriteWarning': "{count} attempts reported cache-write tokens; this plan has no cache-write rate, so they are excluded.";
    readonly 'plan.title': "Pricing plan";
    readonly 'plan.badge.official': "Official";
    readonly 'plan.badge.manual': "Manual";
    readonly 'plan.source': "Source: {source}";
    readonly 'plan.effective': "Rates {from} → {to}";
    readonly 'plan.effectiveOpen': "Rates from {from}";
    readonly 'plan.unknownStart': "Rate period start unknown · snapshot {at}";
    readonly 'plan.perMillion': "per 1M tokens";
    readonly 'plan.peakColumn': "Peak";
    readonly 'plan.offPeakColumn': "Off-peak";
    readonly 'plan.rateColumn': "Rate";
    readonly 'plan.syncedAt': "Synced {time}";
    readonly 'plan.neverSynced': "Bundled snapshot";
    readonly 'plan.compare': "Same tokens under each plan";
    readonly 'plan.selected': "Selected";
    readonly 'turns.title': "Per-turn usage";
    readonly 'turns.hint': "Click a row for the attempt breakdown";
    readonly 'turns.turn': "Turn {turn}";
    readonly 'turns.peak': "Peak";
    readonly 'turns.offPeak': "Off-peak";
    readonly 'turns.attempt': "attempt {attempt}";
    readonly 'turns.subtotal': "Subtotal";
    readonly 'turns.noRoute': "no model";
    readonly 'turns.unpriced': "not priced";
    readonly 'turns.complete': "complete";
    readonly 'turns.partial': "partial";
    readonly 'turns.open': "running";
    readonly 'empty.noUsage': "This session has no provider-reported usage yet.";
    readonly 'empty.noUsageHint': "Send a message, then reopen this tab.";
    readonly 'empty.noPlan': "No pricing plan is configured.";
    readonly 'empty.noPlanHint': "Add a plan in the plan settings.";
    readonly 'reason.no-usage': "no usage reported";
    readonly 'reason.invalid': "usage failed validation";
    readonly 'reason.no-plan': "no plan selected";
    readonly 'reason.no-split': "cache buckets missing";
    readonly 'reason.cache-write': "cache-write tokens have no rate";
    readonly 'error.settingsCorrupt': "Stored plan settings could not be read; built-in plans are shown.";
    readonly 'error.refreshFailed': "Official refresh failed: {message}";
    readonly 'error.refreshParse': "The official page changed unexpectedly; the last catalog was kept.";
    readonly 'error.writeFailed': "Saving the plan failed: {message}";
    readonly 'refresh.title': "Official pricing diff";
    readonly 'refresh.added': "Added models: {models}";
    readonly 'refresh.removed': "Removed models: {models}";
    readonly 'refresh.changed': "{count} rates changed";
    readonly 'refresh.noChange': "No change against the bundled snapshot.";
    readonly 'refresh.hash': "Content hash {hash}";
    readonly 'refresh.confirm': "Apply as new official versions";
    readonly 'settings.title': "Price monitor plans";
    readonly 'settings.hint': "Official plans are read-only; duplicate one to edit its rates.";
    readonly 'settings.selected': "Selected plan";
    readonly 'settings.basis': "Every request of the session is priced at the selected plan’s rates.";
    readonly 'settings.plans': "Plans";
    readonly 'settings.add': "Add plan";
    readonly 'settings.edit': "Edit";
    readonly 'settings.name': "Name";
    readonly 'settings.models': "Models (comma separated)";
    readonly 'settings.effectiveFrom': "Rate period from";
    readonly 'settings.effectiveTo': "Rate period to (optional)";
    readonly 'settings.peakTiers': "Peak/off-peak tiers";
    readonly 'settings.cacheMiss': "Cache miss";
    readonly 'settings.cacheHit': "Cache hit";
    readonly 'settings.output': "Output";
    readonly 'settings.peakMiss': "Peak miss";
    readonly 'settings.peakHit': "Peak hit";
    readonly 'settings.peakOutput': "Peak output";
    readonly 'settings.usdNote': "Rates are USD per 1M tokens.";
    readonly 'settings.deleteConfirm': "Delete this plan?";
    readonly 'settings.lastPlan': "The last remaining plan cannot be deleted.";
    readonly 'settings.invalidRates': "Every rate must be a non-negative decimal.";
    readonly 'settings.unknownStart': "The rate period only labels the plan card; no amount depends on it. Leave the start empty when it is unknown.";
};
/** Chinese dictionary (same key set as {@link en}). */
export declare const zh: Record<keyof typeof en, string>;
/** The dictionary key union this namespace owns. */
export type PriceMonitorKey = keyof typeof en;
/** The namespace-bound translate function (reads the active locale at call time). */
export type Translate = (key: PriceMonitorKey, params?: Record<string, unknown>) => string;
/**
 * Install the namespace-bound translate function.
 * @param translate - the function `ctx.locale.bind(NS)` returned.
 */
export declare function bindTranslate(translate: Translate): void;
/**
 * Translate one key in the price-monitor namespace.
 * @param key - dictionary key.
 * @param params - `{name}` placeholder values.
 * @returns the active locale's text.
 */
export declare function t(key: PriceMonitorKey, params?: Record<string, unknown>): string;
