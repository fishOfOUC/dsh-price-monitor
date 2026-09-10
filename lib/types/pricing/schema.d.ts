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
/** A currency a set of published rates is denominated in. */
export declare const currencySchema: z.ZodEnum<{
    USD: "USD";
    CNY: "CNY";
}>;
export type Currency = z.infer<typeof currencySchema>;
/**
 * One group of models that share a rate table inside a plan: DeepSeek prices
 * several models in one era, and sometimes bills one model at another's rates
 * (a retired model whose requests are served by its successor), so a rate table
 * belongs to a set of ids rather than to a single model.
 */
export declare const planEntrySchema: z.ZodObject<{
    models: z.ZodArray<z.ZodString>;
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
/**
 * One pricing era: the rates one provider charged for a set of models over a
 * window. `source: 'official'` plans are immutable catalog entries the user
 * copies before editing; `source: 'manual'` plans are user-owned. Rates are per
 * million tokens, as decimal strings.
 *
 * A plan carries the currency its publisher printed, and no conversion is ever
 * applied: DeepSeek publishes the same rates as USD on the English page and as
 * CNY on the Chinese one, and the two are not the same numbers (the English
 * page rounds its conversion). An amount therefore always reads in the currency
 * of the plan that produced it.
 */
export declare const pricingPlanSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    source: z.ZodEnum<{
        official: "official";
        manual: "manual";
    }>;
    provider: z.ZodLiteral<"deepseek-official">;
    currency: z.ZodEnum<{
        USD: "USD";
        CNY: "CNY";
    }>;
    effectiveFrom: z.ZodOptional<z.ZodString>;
    effectiveTo: z.ZodOptional<z.ZodString>;
    schedule: z.ZodNullable<z.ZodObject<{
        timezone: z.ZodLiteral<"UTC">;
        peakWeekdays: z.ZodArray<z.ZodNumber>;
        peakWindows: z.ZodArray<z.ZodTuple<[z.ZodString, z.ZodString], null>>;
    }, z.core.$strict>>;
    provenance: z.ZodOptional<z.ZodObject<{
        url: z.ZodString;
        fetchedAt: z.ZodString;
        contentHash: z.ZodString;
    }, z.core.$strict>>;
    entries: z.ZodArray<z.ZodObject<{
        models: z.ZodArray<z.ZodString>;
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
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const pricingPlanSchemaStrict: ZodType<PricingPlan>;
/** One official/manual era plan (inferred from the schema). */
export type PricingPlan = z.infer<typeof pricingPlanSchema>;
export type PlanEntry = z.infer<typeof planEntrySchema>;
export type RateBand = z.infer<typeof rateBandSchema>;
export type PeakSchedule = z.infer<typeof peakScheduleSchema>;
/**
 * The single persisted settings blob under `pluginSettings['price-monitor'].catalog`.
 *
 * The selected plan is the whole pricing basis: it prices every attempt of the
 * session, so switching plans changes every amount the tab shows.
 *
 * Unknown keys are stripped, not rejected: every write goes through the
 * settings service as a patch whose plain objects merge recursively and whose
 * arrays replace wholesale, so a key this schema no longer declares stays in
 * the stored document forever. The retired generation-1 keys (`mode`,
 * `aliases`) and the generation-2 plan fields (`modelIds`, `ratesPerMillion`)
 * are therefore simply absent here, and a generation-1 or generation-2 blob
 * reads as the current one.
 */
export declare const persistedSettingsSchema: z.ZodObject<{
    schemaVersion: z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>]>;
    selectedPlanId: z.ZodString;
    plans: z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        source: z.ZodEnum<{
            official: "official";
            manual: "manual";
        }>;
        provider: z.ZodLiteral<"deepseek-official">;
        currency: z.ZodEnum<{
            USD: "USD";
            CNY: "CNY";
        }>;
        effectiveFrom: z.ZodOptional<z.ZodString>;
        effectiveTo: z.ZodOptional<z.ZodString>;
        schedule: z.ZodNullable<z.ZodObject<{
            timezone: z.ZodLiteral<"UTC">;
            peakWeekdays: z.ZodArray<z.ZodNumber>;
            peakWindows: z.ZodArray<z.ZodTuple<[z.ZodString, z.ZodString], null>>;
        }, z.core.$strict>>;
        provenance: z.ZodOptional<z.ZodObject<{
            url: z.ZodString;
            fetchedAt: z.ZodString;
            contentHash: z.ZodString;
        }, z.core.$strict>>;
        entries: z.ZodArray<z.ZodObject<{
            models: z.ZodArray<z.ZodString>;
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
        }, z.core.$strict>>;
    }, z.core.$strict>, z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        source: z.ZodEnum<{
            official: "official";
            manual: "manual";
        }>;
        provider: z.ZodLiteral<"deepseek-official">;
        currency: z.ZodEnum<{
            USD: "USD";
            CNY: "CNY";
        }>;
        effectiveFrom: z.ZodOptional<z.ZodString>;
        effectiveTo: z.ZodOptional<z.ZodString>;
        schedule: z.ZodNullable<z.ZodObject<{
            timezone: z.ZodLiteral<"UTC">;
            peakWeekdays: z.ZodArray<z.ZodNumber>;
            peakWindows: z.ZodArray<z.ZodTuple<[z.ZodString, z.ZodString], null>>;
        }, z.core.$strict>>;
        provenance: z.ZodOptional<z.ZodObject<{
            url: z.ZodString;
            fetchedAt: z.ZodString;
            contentHash: z.ZodString;
        }, z.core.$strict>>;
        modelIds: z.ZodArray<z.ZodString>;
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
    }, z.core.$strict>]>>;
    lastOfficialRefresh: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type PersistedSettings = Omit<z.infer<typeof persistedSettingsSchema>, 'schemaVersion' | 'plans'> & {
    /** The generation this build writes; earlier generations read as version 3. */
    readonly schemaVersion: 3;
    readonly plans: readonly PricingPlan[];
};
/**
 * Parse a stored settings blob; failures (an unreadable structure, a schema
 * generation this build does not know) yield undefined so the caller can offer
 * a reset instead of silently dropping the user's manual plans. Every readable
 * generation is normalized to the current one: a plan stored before a plan could
 * price several models becomes a one-entry plan, and official plans one fetch
 * produced become one era plan.
 * @param value - the persisted blob.
 * @returns the validated settings, normalized to the current schema version.
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
