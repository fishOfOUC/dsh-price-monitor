/**
 * The refresh-confirmation panel: shows the field-level diff between the
 * bundled/last official catalog and the candidate the host route just fetched,
 * and applies it only when the user confirms. Applying appends new immutable
 * official plans (new ids); it never overwrites a previous version, so
 * historical comparisons keep working.
 *
 * @module dsh-price-monitor/client/OfficialDiffPanel
 */

import { useCallback, useEffect, useState } from 'react'
import type { SidebarStore } from 'dsh-better-sidebar/client/service'
import type { OfficialPricingCandidate, OfficialPricingDiff } from '../official-pricing.ts'
import { applyOfficialCandidate, expandOfficialModelIds, type PricingPlan } from '../pricing/index.ts'
import { t } from './locales.ts'
import { writeCatalog } from './settings-write.ts'

interface RefreshEnvelope {
  ok?: boolean
  candidate?: OfficialPricingCandidate
  diff?: OfficialPricingDiff
  error?: { message?: string }
}

/** Stable short hash prefix for a candidate (the plan id suffix). */
function hashPrefix(hash: string): string {
  return hash.slice(0, 8)
}

/** Turn one parsed candidate into immutable official plans (one per model). */
function plansFromCandidate(candidate: OfficialPricingCandidate): PricingPlan[] {
  const schedule = {
    timezone: 'UTC' as const,
    peakWeekdays: [1, 2, 3, 4, 5],
    peakWindows: candidate.peakWindows.map(window => [...window]) as [string, string][],
  }
  const observedOn = candidate.fetchedAt.slice(0, 10)
  return candidate.models.map(model => ({
    id: `official:${model.model}:${observedOn}:${hashPrefix(candidate.contentHash)}`,
    name: `${model.model} · official`,
    source: 'official' as const,
    provider: 'deepseek-official' as const,
    // The flash model is still matched by the ids it has been reported under
    // (the seed and a refreshed catalog must agree on coverage).
    modelIds: expandOfficialModelIds(model.model),
    currency: candidate.currency,
    // No declared start: a fetch learns today's rates, not when they began.
    // A later-fetched version supersedes this one by its observation time.
    schedule,
    ratesPerMillion: {
      offPeak: { cacheMiss: model.cacheMiss, cacheHit: model.cacheHit, output: model.output },
      peak: { cacheMiss: model.peakCacheMiss, cacheHit: model.peakCacheHit, output: model.peakOutput },
    },
    provenance: {
      url: candidate.sourceUrl,
      fetchedAt: candidate.fetchedAt,
      contentHash: candidate.contentHash,
    },
  }))
}

export interface OfficialDiffPanelProps {
  onClose: () => void
  /** The sidebar store the panel writes the confirmed catalog through. */
  store: SidebarStore
}

/**
 * Fetch the candidate from the host route and render its diff for confirmation.
 * @param props - the close callback and the store the confirmed catalog is written through.
 * @returns the confirmation panel.
 */
export function OfficialDiffPanel({ onClose, store }: OfficialDiffPanelProps): React.ReactElement {
  const [state, setState] = useState<{ kind: 'loading' } | { kind: 'ready'; candidate: OfficialPricingCandidate; diff: OfficialPricingDiff } | { kind: 'error'; message: string }>({ kind: 'loading' })
  const [writeError, setWriteError] = useState<string | null>(null)
  const [applied, setApplied] = useState(false)

  const load = useCallback(async (): Promise<void> => {
    setState({ kind: 'loading' })
    try {
      const response = await fetch('/price-monitor/api/official-pricing', { method: 'POST' })
      const envelope = await response.json() as RefreshEnvelope
      if (!response.ok || envelope.ok !== true || envelope.candidate === undefined || envelope.diff === undefined) {
        setState({ kind: 'error', message: envelope.error?.message ?? `HTTP ${response.status}` })
        return
      }
      setState({ kind: 'ready', candidate: envelope.candidate, diff: envelope.diff })
    } catch (error) {
      setState({ kind: 'error', message: error instanceof Error ? error.message : String(error) })
    }
  }, [])

  useEffect(() => { void load() }, [load])

  const apply = (candidate: OfficialPricingCandidate): void => {
    setWriteError(null)
    const plans = plansFromCandidate(candidate)
    void writeCatalog({ store }, current => applyOfficialCandidate(current, plans, candidate.fetchedAt))
      .then(() => setApplied(true))
      .catch((error: unknown) => setWriteError(error instanceof Error ? error.message : String(error)))
  }

  return (
    <section className="dpm-section">
      <div className="dpm-section__head">
        <span className="dpm-section__title">{t('refresh.title')}</span>
      </div>

      {state.kind === 'loading' && <p className="dpm-note">{t('action.refresh')}</p>}
      {state.kind === 'error' && <p className="dpm-note dpm-note--error">{t('error.refreshFailed', { message: state.message })}</p>}
      {writeError !== null && <p className="dpm-note dpm-note--error">{t('error.writeFailed', { message: writeError })}</p>}

      {state.kind === 'ready' && (
        <div className="dpm-dialog">
          <div className="dpm-dialog__title">{state.candidate.fetchedAt.slice(0, 19).replace('T', ' ')}</div>
          {state.diff.addedModels.length > 0 && (
            <p className="dpm-note dpm-note--warn">{t('refresh.added', { models: state.diff.addedModels.join(', ') })}</p>
          )}
          {state.diff.removedModels.length > 0 && (
            <p className="dpm-note dpm-note--warn">{t('refresh.removed', { models: state.diff.removedModels.join(', ') })}</p>
          )}
          {state.diff.changed.length > 0 && (
            <>
              <p className="dpm-note dpm-note--warn">{t('refresh.changed', { count: state.diff.changed.length })}</p>
              {state.diff.changed.map(entry => (
                <span className="dpm-line" key={`${entry.model}:${entry.field}`}>
                  <span>{`${entry.model} · ${entry.field}`}</span>
                  <span className="dpm-num">{`${entry.before ?? '—'} → ${entry.after}`}</span>
                </span>
              ))}
            </>
          )}
          {state.diff.changed.length === 0 && state.diff.addedModels.length === 0 && state.diff.removedModels.length === 0 && (
            <p className="dpm-note">{t('refresh.noChange')}</p>
          )}
          <p className="dpm-note">{t('refresh.hash', { hash: hashPrefix(state.candidate.contentHash) })}</p>
          {applied
            ? <p className="dpm-note">{t('settings.selected')}</p>
            : (
              <>
                <div className="dpm-buttons">
                  <button type="button" className="dpm-button" onClick={onClose}>{t('action.cancel')}</button>
                  <button
                    type="button"
                    className="dpm-button dpm-button--primary"
                    onClick={() => apply(state.candidate)}
                  >
                    {t('refresh.confirm')}
                  </button>
                </div>
                <p className="dpm-note">{t('refresh.applyNote')}</p>
              </>
            )}
        </div>
      )}
    </section>
  )
}
