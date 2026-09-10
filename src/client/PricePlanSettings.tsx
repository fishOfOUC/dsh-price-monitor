/**
 * The plan settings panel shown in the sidebar's settings popup
 * (`settings.render`). It edits the same catalog the tab reads: selection,
 * manual plan create/duplicate/edit/delete, and the restore-built-ins action
 * for an unreadable stored blob.
 *
 * Official plans are read-only; the panel duplicates one into a manual plan
 * before any rate edit, and it refuses to delete the last remaining plan.
 * Writes go through the shared serialized catalog writer, so an edit made
 * here and one made in the tab cannot interleave.
 *
 * @module dsh-price-monitor/client/PricePlanSettings
 */

import { useState } from 'react'
import type { SidebarSettingsRenderProps } from 'dsh-better-sidebar/client/service'
import type { Currency, PlanEntry, RateBand } from '../pricing/index.ts'
import {
  defaultSettings,
  parsePersistedSettings,
  type PersistedSettings,
  type PricingPlan,
} from '../pricing/index.ts'
import { t as translate, type PriceMonitorKey, type Translate } from './locales.ts'
import { CATALOG_KEY, SETTINGS_KEY } from './settings-write.ts'
import { CURRENCIES, SYMBOL } from './money.ts'

/** One model group's row in the draft: the ids it covers and their rates. */
interface EntryDraft {
  models: string
  cacheMiss: string
  cacheHit: string
  output: string
  peakMiss: string
  peakHit: string
  peakOutput: string
}

/** A plan draft: an era with one row per model group it prices. */
interface Draft {
  id?: string
  name: string
  currency: Currency
  effectiveFrom: string
  effectiveTo: string
  peak: boolean
  entries: EntryDraft[]
}

function entryDraft(over: Partial<EntryDraft> = {}): EntryDraft {
  return { models: '', cacheMiss: '', cacheHit: '', output: '', peakMiss: '', peakHit: '', peakOutput: '', ...over }
}

const EMPTY_DRAFT: Draft = {
  name: '',
  currency: 'CNY',
  effectiveFrom: '',
  effectiveTo: '',
  peak: true,
  entries: [entryDraft({ models: 'deepseek-flash' })],
}

/** A decimal rate or undefined when the input is not a non-negative decimal. */
function parseRate(value: string): string | undefined {
  const trimmed = value.trim()
  return /^(0|[1-9]\d*)(\.\d+)?$/.test(trimmed) ? trimmed : undefined
}

/** One row's three rates for a band, or undefined when any input is not a rate. */
function rateBandOf(draft: EntryDraft, keys: readonly [keyof EntryDraft, keyof EntryDraft, keyof EntryDraft]): RateBand | undefined {
  const cacheMiss = parseRate(draft[keys[0]])
  const cacheHit = parseRate(draft[keys[1]])
  const output = parseRate(draft[keys[2]])
  if (cacheMiss === undefined || cacheHit === undefined || output === undefined) return undefined
  return { cacheMiss, cacheHit, output }
}

/** One draft row as a plan entry; undefined when any of its fields is invalid. */
function entryFromDraft(draft: EntryDraft, peak: boolean): PlanEntry | undefined {
  const models = draft.models.split(',').map(value => value.trim()).filter(value => value !== '')
  if (models.length === 0) return undefined
  const offPeak = rateBandOf(draft, ['cacheMiss', 'cacheHit', 'output'])
  if (offPeak === undefined) return undefined
  if (!peak) return { models, offPeak }
  const peakBand = rateBandOf(draft, ['peakMiss', 'peakHit', 'peakOutput'])
  if (peakBand === undefined) return undefined
  return { models, offPeak, peak: peakBand }
}

/** Build a plan from a draft; undefined when any field is invalid. */
function planFromDraft(draft: Draft, fallbackId: string): PricingPlan | undefined {
  const name = draft.name.trim()
  if (name === '') return undefined
  const entries: PlanEntry[] = []
  for (const row of draft.entries) {
    const entry = entryFromDraft(row, draft.peak)
    if (entry === undefined) return undefined
    entries.push(entry)
  }
  if (entries.length === 0) return undefined
  return {
    id: draft.id ?? fallbackId,
    name,
    source: 'manual',
    provider: 'deepseek-official',
    currency: draft.currency,
    entries,
    // The rate period is a label for the plan card, and either end may stand
    // alone: a superseded era knows when it ended, not when it began.
    ...draft.effectiveFrom.trim() === '' ? {} : { effectiveFrom: draft.effectiveFrom.trim() },
    ...draft.effectiveTo.trim() === '' ? {} : { effectiveTo: draft.effectiveTo.trim() },
    schedule: draft.peak
      ? {
        timezone: 'UTC',
        peakWeekdays: [1, 2, 3, 4, 5],
        peakWindows: [['01:00', '04:00'], ['06:00', '10:00']],
      }
      : null,
  }
}

/** A fresh draft describing an existing plan for editing. */
function draftOf(plan: PricingPlan): Draft {
  return {
    id: plan.source === 'official' ? undefined : plan.id,
    name: plan.source === 'official' ? `${plan.name} (copy)` : plan.name,
    currency: plan.currency,
    effectiveFrom: plan.effectiveFrom ?? '',
    effectiveTo: plan.effectiveTo ?? '',
    peak: plan.entries.some(entry => entry.peak !== undefined),
    entries: plan.entries.map(entry => entryDraft({
      models: entry.models.join(', '),
      cacheMiss: entry.offPeak.cacheMiss,
      cacheHit: entry.offPeak.cacheHit,
      output: entry.offPeak.output,
      peakMiss: entry.peak?.cacheMiss ?? '',
      peakHit: entry.peak?.cacheHit ?? '',
      peakOutput: entry.peak?.output ?? '',
    })),
  }
}

/** Read the current catalog out of the settings props' plugin blob. */
function catalogOf(props: SidebarSettingsRenderProps): { catalog: PersistedSettings; corrupt: boolean } {
  const raw = props.pluginSettings[CATALOG_KEY]
  const parsed = raw === undefined ? undefined : parsePersistedSettings(raw)
  return parsed === undefined
    ? { catalog: defaultSettings(), corrupt: raw !== undefined }
    : { catalog: parsed, corrupt: false }
}

/**
 * Render the plan settings panel.
 * @param props - settings render props (plugin blob plus the update helper).
 * @returns the settings panel.
 */
export function PricePlanSettings(props: SidebarSettingsRenderProps): React.ReactElement {
  const { catalog, corrupt } = catalogOf(props)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [error, setError] = useState<string | null>(null)
  const commit = (next: PersistedSettings): void => {
    setError(null)
    props.updatePluginSetting(CATALOG_KEY, next)
  }
  const edit = (update: (current: PersistedSettings) => PersistedSettings): void => commit(update(catalog))
  // A new plan starts in the currency the user is already looking at.
  const selectedCurrency: Currency =
    catalog.plans.find(plan => plan.id === catalog.selectedPlanId)?.currency ?? 'USD'

  const saveDraft = (): void => {
    if (draft === null) return
    const id = draft.id ?? `manual:${Date.now().toString(36)}`
    const plan = planFromDraft(draft, id)
    if (plan === undefined) {
      setError(translate('settings.invalidRates'))
      return
    }
    edit(current => ({
      ...current,
      plans: draft.id === undefined
        ? [...current.plans, plan]
        : current.plans.map(existing => (existing.id === draft.id ? plan : existing)),
      selectedPlanId: plan.id,
    }))
    setDraft(null)
  }

  return (
    <div>
      {corrupt && (
        <>
          <p className="dpm-note dpm-note--error">{translate('error.settingsCorrupt')}</p>
          <div className="dpm-buttons">
            <button type="button" className="dpm-button" onClick={() => commit(defaultSettings())}>
              {translate('action.reset')}
            </button>
          </div>
        </>
      )}

      <div className="dpm-field">
        <label className="dpm-field__label" htmlFor="dpm-selected">{translate('settings.selected')}</label>
        <select
          id="dpm-selected"
          className="dpm-input"
          value={catalog.selectedPlanId}
          onChange={(event) => { edit(current => ({ ...current, selectedPlanId: event.target.value })) }}
        >
          {catalog.plans.map(plan => <option key={plan.id} value={plan.id}>{plan.name}</option>)}
        </select>
        <p className="dpm-note">{translate('settings.basis')}</p>
      </div>

      <div className="dpm-field__label">{translate('settings.plans')}</div>
      {catalog.plans.map(plan => (
        <div className="dpm-plan-row" key={plan.id}>
          <span className="dpm-plan-row__name">
            {plan.name}
            <span className={`dpm-badge dpm-badge--${plan.source}`}>
              {translate(`plan.badge.${plan.source}` as PriceMonitorKey)}
            </span>
          </span>
          <span className="dpm-plan-row__actions">
            <button type="button" className="dpm-mini" onClick={() => setDraft(draftOf(plan))}>
              {plan.source === 'official' ? translate('action.copy') : translate('settings.edit')}
            </button>
            {/* An official plan can be dropped too: it is one fetched era, and
                a refresh re-creates it after a copy has been named and kept. */}
            <button
              type="button"
              className="dpm-mini"
              disabled={catalog.plans.length <= 1}
              onClick={() => {
                if (catalog.plans.length <= 1) return
                edit(current => {
                  const plans = current.plans.filter(existing => existing.id !== plan.id)
                  return {
                    ...current,
                    plans,
                    selectedPlanId: plans.some(existing => existing.id === current.selectedPlanId)
                      ? current.selectedPlanId
                      : plans[0]!.id,
                  }
                })
              }}
            >
              {translate('action.delete')}
            </button>
          </span>
        </div>
      ))}
      {catalog.plans.length <= 1 && <p className="dpm-note">{translate('settings.lastPlan')}</p>}

      {draft === null
        ? (
          <div className="dpm-buttons">
            <button
              type="button"
              className="dpm-button"
              onClick={() => setDraft({ ...EMPTY_DRAFT, currency: selectedCurrency })}
            >
              {translate('settings.add')}
            </button>
          </div>
        )
        : <DraftEditor draft={draft} t={translate} onChange={setDraft} onCancel={() => { setDraft(null); setError(null) }} onSave={saveDraft} />}

      {error !== null && <p className="dpm-note dpm-note--error">{error}</p>}
      <p className="dpm-note">{translate('settings.hint')}</p>
      <p className="dpm-note">{translate('settings.currencyNote')}</p>
    </div>
  )
}

/**
 * The manual-plan form: the era's own fields, then one row per model group it
 * prices. A plan that prices several models (an era whose models differ in
 * rate, or one whose retired model is billed as its successor) needs one row
 * per group, so a row carries its own ids and its own rates.
 */
function DraftEditor({ draft, t, onChange, onCancel, onSave }: {
  draft: Draft
  t: Translate
  onChange: (draft: Draft) => void
  onCancel: () => void
  onSave: () => void
}): React.ReactElement {
  const field = (key: 'name' | 'effectiveFrom' | 'effectiveTo', label: PriceMonitorKey): React.ReactElement => (
    <div className="dpm-field">
      <label className="dpm-field__label" htmlFor={`dpm-${key}`}>{t(label)}</label>
      <input
        id={`dpm-${key}`}
        className="dpm-input"
        type="text"
        value={draft[key]}
        onChange={(event) => onChange({ ...draft, [key]: event.target.value })}
      />
    </div>
  )
  const rateField = (
    index: number,
    key: keyof EntryDraft,
    label: PriceMonitorKey,
  ): React.ReactElement => (
    <div className="dpm-field">
      <label className="dpm-field__label" htmlFor={`dpm-${index}-${key}`}>{t(label)}</label>
      <input
        id={`dpm-${index}-${key}`}
        className="dpm-input"
        type="text"
        value={draft.entries[index]![key]}
        onChange={(event) => onChange({
          ...draft,
          entries: draft.entries.map((entry, position) =>
            position === index ? { ...entry, [key]: event.target.value } : entry),
        })}
      />
    </div>
  )
  const setEntry = (index: number, value: string): void => {
    onChange({
      ...draft,
      entries: draft.entries.map((entry, position) => position === index ? { ...entry, models: value } : entry),
    })
  }
  return (
    <div className="dpm-dialog">
      <div className="dpm-dialog__title">{t(draft.id === undefined ? 'settings.add' : 'settings.editTitle')}</div>
      {field('name', 'settings.name')}
      <div className="dpm-field">
        <label className="dpm-field__label" htmlFor="dpm-currency">{t('settings.currency')}</label>
        <select
          id="dpm-currency"
          className="dpm-input"
          value={draft.currency}
          onChange={(event) => onChange({ ...draft, currency: event.target.value === 'CNY' ? 'CNY' : 'USD' })}
        >
          {CURRENCIES.map(code => <option key={code} value={code}>{`${code} (${SYMBOL[code]})`}</option>)}
        </select>
      </div>
      <div className="dpm-grid2">
        {field('effectiveFrom', 'settings.effectiveFrom')}
        {/* Either end may stand alone: a superseded era knows when it ended
            without knowing when it began. */}
        {field('effectiveTo', 'settings.effectiveTo')}
      </div>
      <p className="dpm-note">{t('settings.ratePeriodHint')}</p>
      <label className="dpm-check">
        <input
          type="checkbox"
          checked={draft.peak}
          onChange={(event) => onChange({ ...draft, peak: event.target.checked })}
        />
        {t('settings.peakTiers')}
      </label>
      <p className="dpm-field__label">{t('settings.modelGroups')}</p>
      {draft.entries.map((entry, index) => (
        <div className="dpm-entry" key={index}>
          <div className="dpm-field">
            <label className="dpm-field__label" htmlFor={`dpm-${index}-models`}>{t('settings.models')}</label>
            <input
              id={`dpm-${index}-models`}
              className="dpm-input"
              type="text"
              value={entry.models}
              onChange={(event) => setEntry(index, event.target.value)}
            />
          </div>
          <div className="dpm-grid3">
            {rateField(index, 'cacheMiss', 'settings.cacheMiss')}
            {rateField(index, 'cacheHit', 'settings.cacheHit')}
            {rateField(index, 'output', 'settings.output')}
          </div>
          {draft.peak && (
            <div className="dpm-grid3">
              {rateField(index, 'peakMiss', 'settings.peakMiss')}
              {rateField(index, 'peakHit', 'settings.peakHit')}
              {rateField(index, 'peakOutput', 'settings.peakOutput')}
            </div>
          )}
          {draft.entries.length > 1 && (
            <div className="dpm-buttons">
              <button
                type="button"
                className="dpm-mini"
                onClick={() => onChange({
                  ...draft,
                  entries: draft.entries.filter((_, position) => position !== index),
                })}
              >
                {t('settings.removeGroup')}
              </button>
            </div>
          )}
        </div>
      ))}
      <div className="dpm-buttons">
        <button
          type="button"
          className="dpm-mini"
          onClick={() => onChange({ ...draft, entries: [...draft.entries, entryDraft()] })}
        >
          {t('settings.addGroup')}
        </button>
      </div>
      <div className="dpm-buttons">
        <button type="button" className="dpm-button" onClick={onCancel}>{t('action.cancel')}</button>
        <button type="button" className="dpm-button dpm-button--primary" onClick={onSave}>{t('action.save')}</button>
      </div>
    </div>
  )
}

export { SETTINGS_KEY }
