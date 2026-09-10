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
import type { Currency } from '../pricing/index.ts'
import {
  defaultSettings,
  parsePersistedSettings,
  type PersistedSettings,
  type PricingPlan,
} from '../pricing/index.ts'
import { t as translate, type PriceMonitorKey, type Translate } from './locales.ts'
import { CATALOG_KEY, SETTINGS_KEY } from './settings-write.ts'
import { CURRENCIES, SYMBOL } from './money.ts'

/** An empty manual-plan draft (rates deliberately blank so a typo is visible). */
interface Draft {
  id?: string
  name: string
  models: string
  currency: Currency
  effectiveFrom: string
  effectiveTo: string
  peak: boolean
  cacheMiss: string
  cacheHit: string
  output: string
  peakMiss: string
  peakHit: string
  peakOutput: string
}

const EMPTY_DRAFT: Draft = {
  name: '',
  models: 'deepseek-flash',
  currency: 'USD',
  effectiveFrom: '',
  effectiveTo: '',
  peak: true,
  cacheMiss: '0.22',
  cacheHit: '0.007',
  output: '0.66',
  peakMiss: '0.44',
  peakHit: '0.014',
  peakOutput: '1.32',
}

/** A decimal rate or undefined when the input is not a non-negative decimal. */
function parseRate(value: string): string | undefined {
  const trimmed = value.trim()
  return /^(0|[1-9]\d*)(\.\d+)?$/.test(trimmed) ? trimmed : undefined
}

/** Build a plan from a draft; undefined when any field is invalid. */
function planFromDraft(draft: Draft, fallbackId: string): PricingPlan | undefined {
  const name = draft.name.trim()
  if (name === '') return undefined
  const modelIds = draft.models.split(',').map(value => value.trim()).filter(value => value !== '')
  if (modelIds.length === 0) return undefined
  const offPeak = {
    cacheMiss: parseRate(draft.cacheMiss),
    cacheHit: parseRate(draft.cacheHit),
    output: parseRate(draft.output),
  }
  const peak = {
    cacheMiss: parseRate(draft.peakMiss),
    cacheHit: parseRate(draft.peakHit),
    output: parseRate(draft.peakOutput),
  }
  if (draft.peak && (peak.cacheMiss === undefined || peak.cacheHit === undefined || peak.output === undefined)) {
    return undefined
  }
  if (offPeak.cacheMiss === undefined || offPeak.cacheHit === undefined || offPeak.output === undefined) {
    return undefined
  }
  return {
    id: draft.id ?? fallbackId,
    name,
    source: 'manual',
    provider: 'deepseek-official',
    modelIds,
    currency: draft.currency,
    // The rate period is a label for the plan card, and either end may stand
    // alone: a superseded rate knows when it ended, not when it began.
    ...draft.effectiveFrom.trim() === '' ? {} : { effectiveFrom: draft.effectiveFrom.trim() },
    ...draft.effectiveTo.trim() === '' ? {} : { effectiveTo: draft.effectiveTo.trim() },
    schedule: draft.peak
      ? {
        timezone: 'UTC',
        peakWeekdays: [1, 2, 3, 4, 5],
        peakWindows: [['01:00', '04:00'], ['06:00', '10:00']],
      }
      : null,
    ratesPerMillion: draft.peak ? { offPeak, peak } : { offPeak },
  } as PricingPlan
}

/** A fresh draft describing an existing plan for editing. */
function draftOf(plan: PricingPlan): Draft {
  const peak = plan.ratesPerMillion.peak
  return {
    id: plan.source === 'official' ? undefined : plan.id,
    name: plan.source === 'official' ? `${plan.name} (copy)` : plan.name,
    models: plan.modelIds.join(', '),
    currency: plan.currency,
    effectiveFrom: plan.effectiveFrom ?? '',
    effectiveTo: plan.effectiveTo ?? '',
    peak: peak !== undefined,
    cacheMiss: plan.ratesPerMillion.offPeak.cacheMiss,
    cacheHit: plan.ratesPerMillion.offPeak.cacheHit,
    output: plan.ratesPerMillion.offPeak.output,
    peakMiss: peak?.cacheMiss ?? '0',
    peakHit: peak?.cacheHit ?? '0',
    peakOutput: peak?.output ?? '0',
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
            {plan.source === 'manual' && (
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
            )}
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

/** The manual-plan form. */
function DraftEditor({ draft, t, onChange, onCancel, onSave }: {
  draft: Draft
  t: Translate
  onChange: (draft: Draft) => void
  onCancel: () => void
  onSave: () => void
}): React.ReactElement {
  const field = (key: keyof Draft, label: PriceMonitorKey, type = 'text'): React.ReactElement => (
    <div className="dpm-field">
      <label className="dpm-field__label" htmlFor={`dpm-${key}`}>{t(label)}</label>
      <input
        id={`dpm-${key}`}
        className="dpm-input"
        type={type}
        value={String(draft[key] ?? '')}
        onChange={(event) => onChange({ ...draft, [key]: event.target.value })}
      />
    </div>
  )
  return (
    <div className="dpm-dialog">
      <div className="dpm-dialog__title">{t(draft.id === undefined ? 'settings.add' : 'settings.editTitle')}</div>
      {field('name', 'settings.name')}
      {field('models', 'settings.models')}
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
        {/* Either end may stand alone: a superseded rate knows when it ended
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
      <div className="dpm-grid3">
        {field('cacheMiss', 'settings.cacheMiss')}
        {field('cacheHit', 'settings.cacheHit')}
        {field('output', 'settings.output')}
      </div>
      {draft.peak && (
        <div className="dpm-grid3">
          {field('peakMiss', 'settings.peakMiss')}
          {field('peakHit', 'settings.peakHit')}
          {field('peakOutput', 'settings.peakOutput')}
        </div>
      )}
      <div className="dpm-buttons">
        <button type="button" className="dpm-button" onClick={onCancel}>{t('action.cancel')}</button>
        <button type="button" className="dpm-button dpm-button--primary" onClick={onSave}>{t('action.save')}</button>
      </div>
    </div>
  )
}

export { SETTINGS_KEY }
