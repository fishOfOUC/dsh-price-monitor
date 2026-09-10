/**
 * Pricing vocabulary barrel: schemas, the shipped official snapshot, and the
 * exact pricing engine. Imported by the client half and by the host route's
 * diff helper; contains no Node types.
 *
 * @module dsh-price-monitor/pricing
 */
export { applyOfficialCandidate, parsePersistedSettings, persistedSettingsSchema, pricingPlanSchema, rateBandSchema, type PeakSchedule, type PersistedSettings, type PricingMode, type PricingPlan, type RateBand, } from './schema.ts';
export { defaultSettings, expandOfficialModelIds, FLASH_MODEL_IDS, officialSeedPlans } from './official-seed.ts';
export { formatUsd, isPeak, planFor, priceLedger, type AttemptCost, type AttemptPricingReason, type PriceView, type PricedAttempt, type PricedTurn, } from './engine.ts';
