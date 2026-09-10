/**
 * Pricing-plan and persisted-settings vocabulary: strict zod schemas plus the
 * inferred types. Rates are decimal strings, never JS numbers; the pricing
 * engine converts them with decimal.js and never rounds intermediate values.
 *
 * @module dsh-price-monitor/pricing/schema
 */
import { z, type ZodType } from 'zod';
/** The three billed buckets of one plan band, per million tokens, as decimal strings. */
export declare const rateBandSchema: z.ZodObject<{
    cacheMiss: z.ZodString;
    cacheHit: z.ZodString;
    output: z.ZodString;
}, z.core.$strict>;
/** Peak schedule: UTC weekdays (ISO 1=Monday … 7=Sunday) and disjoint windows. */
declare const peakScheduleSchema: z.ZodObject<{
    timezone: z.ZodLiteral<"UTC">;
    peakWeekdays: z.ZodArray<z.ZodNumber>;
    peakWindows: z.ZodArray<z.ZodTuple<[z.ZodString, z.ZodString], null>>;
}, z.core.$strict>;
export declare const provenanceSchema: z.ZodObject<{
    url: z.ZodString;
    fetchedAt: z.ZodString;
    contentHash: z.ZodString;
}, z.core.$strict>;
/**
 * One pricing plan. `source: 'official'` plans are immutable catalog entries
 * the user copies before editing; `source: 'manual'` plans are user-owned.
 * Rates are per million tokens, as decimal strings.
 */
export declare const pricingPlanSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    source: z.ZodEnum<{
        official: "official";
        manual: "manual";
    }>;
    provider: z.ZodLiteral<"deepseek-official">;
    modelIds: z.ZodArray<z.ZodString>;
    currency: z.ZodLiteral<"USD">;
    effectiveFrom: z.ZodOptional<z.ZodString>;
    effectiveTo: z.ZodOptional<z.ZodString>;
    schedule: z.ZodNullable<z.ZodObject<{
        timezone: z.ZodLiteral<"UTC">;
        peakWeekdays: z.ZodArray<z.ZodNumber>;
        peakWindows: z.ZodArray<z.ZodTuple<[z.ZodString, z.ZodString], null>>;
    }, z.core.$strict>>;
    ratesPerMillion: z.ZodObject<{
        offPeak: z.ZodObject<{
            cacheMiss: z.ZodString;
            cacheHit: z.ZodString;
            output: z.ZodString;
        }, z.core.$strict>;
        peak: z.ZodOptional<z.ZodObject<{
            cacheMiss: z.ZodString;
            cacheHit: z.ZodString;
            output: z.ZodString;
        }, z.core.$strict>>;
    }, z.core.$strict>;
    provenance: z.ZodOptional<z.ZodObject<{
        url: z.ZodString;
        fetchedAt: z.ZodString;
        contentHash: z.ZodString;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const pricingPlanSchemaStrict: ZodType<PricingPlan>;
/** One official/manual plan (inferred from the schema). */
export type PricingPlan = z.infer<typeof pricingPlanSchema>;
export type RateBand = z.infer<typeof rateBandSchema>;
export type PeakSchedule = z.infer<typeof peakScheduleSchema>;
/** Pricing mode: historical per-attempt plan, or reprice everything at one plan. */
export type PricingMode = 'effective' | 'reprice';
/**
 * The single persisted settings blob under `pluginSettings['price-monitor'].catalog`.
 *
 * `aliases` maps a deployment's own model id onto one named by a plan, so a
 * harness that exposes the same underlying model under a different id can be
 * priced without touching the read-only official plans or guessing an id into
 * the shipped snapshot. A target that no plan names simply stays unpriced.
 */
export declare const persistedSettingsSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    selectedPlanId: z.ZodString;
    mode: z.ZodEnum<{
        effective: "effective";
        reprice: "reprice";
    }>;
    plans: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        source: z.ZodEnum<{
            official: "official";
            manual: "manual";
        }>;
        provider: z.ZodLiteral<"deepseek-official">;
        modelIds: z.ZodArray<z.ZodString>;
        currency: z.ZodLiteral<"USD">;
        effectiveFrom: z.ZodOptional<z.ZodString>;
        effectiveTo: z.ZodOptional<z.ZodString>;
        schedule: z.ZodNullable<z.ZodObject<{
            timezone: z.ZodLiteral<"UTC">;
            peakWeekdays: z.ZodArray<z.ZodNumber>;
            peakWindows: z.ZodArray<z.ZodTuple<[z.ZodString, z.ZodString], null>>;
        }, z.core.$strict>>;
        ratesPerMillion: z.ZodObject<{
            offPeak: z.ZodObject<{
                cacheMiss: z.ZodString;
                cacheHit: z.ZodString;
                output: z.ZodString;
            }, z.core.$strict>;
            peak: z.ZodOptional<z.ZodObject<{
                cacheMiss: z.ZodString;
                cacheHit: z.ZodString;
                output: z.ZodString;
            }, z.core.$strict>>;
        }, z.core.$strict>;
        provenance: z.ZodOptional<z.ZodObject<{
            url: z.ZodString;
            fetchedAt: z.ZodString;
            contentHash: z.ZodString;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    aliases: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    lastOfficialRefresh: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export type PersistedSettings = z.infer<typeof persistedSettingsSchema>;
/**
 * Parse a stored settings blob; failures (corruption, unknown fields, an
 * older schema) yield undefined so the caller can offer a reset instead of
 * silently dropping the user's manual plans.
 * @param value - the persisted blob.
 * @returns the validated settings, or undefined when unreadable.
 */
export declare function parsePersistedSettings(value: unknown): PersistedSettings | undefined;
/**
 * Replace every official-source plan with a freshly fetched candidate set and
 * stamp the refresh time. Manual plans are preserved. The caller (the client)
 * runs this only after the user confirms a diff; the host route never writes
 * settings itself.
 * @param settings - current settings.
 * @param officialPlans - the confirmed candidate plans.
 * @param fetchedAt - ISO timestamp of the successful fetch.
 * @returns the updated settings; the selected plan id is kept when it still exists.
 */
export declare function applyOfficialCandidate(settings: PersistedSettings, officialPlans: readonly PricingPlan[], fetchedAt: string): PersistedSettings;
export {};
