/**
 * The price-monitor tab: session cost hero, three-bucket breakdown, plan card
 * with a same-tokens comparison, and the per-turn list with attempt details.
 *
 * Every amount comes from the single `usePriceView` computation — the hero,
 * the three summary rows, the comparison rows, and every turn row read that
 * one object, so per-turn amounts always add up to the hero exactly. Peak
 * tier labels and plan names are read off the same result (the engine records
 * the band and plan it actually priced with), never recomputed here, and an
 * attempt that cannot be priced stays visible with its reason instead of
 * becoming zero.
 *
 * @module dsh-price-monitor/client/PriceMonitorTab
 */

import { useMemo, useState } from 'react'
import { Decimal } from 'decimal.js'
import type { TabComponentProps } from 'dsh-better-sidebar/client/service'
import type {
  AttemptPricingReason,
  PersistedSettings,
  PricedAttempt,
  PriceView,
} from '../pricing/index.ts'
import { priceLedger } from '../pricing/index.ts'
import { clientContextOf } from '../context-types.ts'
import { t, type PriceMonitorKey, type Translate } from './locales.ts'
import { useCatalog, usePriceView, useSidebarPrefs, useUsageLedger } from './usePriceMonitor.ts'
import { writeCatalog } from './settings-write.ts'
import { OfficialDiffPanel } from './OfficialDiffPanel.tsx'

/** The three billed buckets, in display order. */
const BUCKETS = ['miss', 'hit', 'output'] as const
type Bucket = typeof BUCKETS[number]

const SWATCH: Record<Bucket, string> = {
  miss: 'dpm-swatch-miss',
  hit: 'dpm-swatch-hit',
  output: 'dpm-swatch-output',
}

const LABEL: Record<Bucket, PriceMonitorKey> = {
  miss: 'breakdown.miss',
  hit: 'breakdown.hit',
  output: 'breakdown.output',
}

/** Format a token count compactly (1.20M / 34.5k / 812). */
function formatTokens(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`
  return String(value)
}

/** Format USD with adaptive decimals: small totals keep enough digits to stay readable. */
function formatCost(value: Decimal): string {
  const absolute = value.abs()
  const decimals = absolute.gte(10) ? 4 : absolute.gte(0.01) ? 6 : 8
  return `$${value.toFixed(decimals)}`
}

/** A signed percentage change of `current` against `reference`. */
function formatDelta(current: Decimal, reference: Decimal): string | undefined {
  if (reference.isZero()) return undefined
  const delta = current.div(reference).minus(1).mul(100)
  if (delta.isZero()) return undefined
  return `${delta.isNegative() ? '−' : '+'}${delta.abs().toFixed(0)}%`
}

/** Wall-clock `HH:MM` for one epoch-ms time. */
function clockOf(epochMs: number): string {
  const date = new Date(epochMs)
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

/**
 * Render the price-monitor tab body.
 * @param props - the sidebar tab props.
 * @returns the tab's React tree.
 */
export function PriceMonitorTab({ ctx: sidebarCtx, store, scope, visible }: TabComponentProps): React.ReactElement {
  const ctx = clientContextOf(sidebarCtx)
  const ledger = useUsageLedger(ctx, scope.sessionId)
  const prefs = useSidebarPrefs(store)
  const { catalog, corrupt } = useCatalog(prefs)
  const view = usePriceView(ledger, catalog)
  const [openTurn, setOpenTurn] = useState<number | null>(null)
  const [showDiff, setShowDiff] = useState(false)
  const [writeError, setWriteError] = useState<string | null>(null)

  const selectedPlan = catalog.plans.find(plan => plan.id === catalog.selectedPlanId)
  // The anchor names the plan whose rates the counterfactual uses.
  const anchorPlanName = view.anchor === undefined
    ? undefined
    : catalog.plans.find(plan => plan.id === view.anchor!.planId)?.name
  const turns = useMemo(() => [...view.turns].reverse(), [view.turns])
  const attemptCount = view.coverage.priced + view.coverage.uncovered

  const write = (update: (current: PersistedSettings) => PersistedSettings): void => {
    setWriteError(null)
    void writeCatalog({ store }, update).catch((error: unknown) => {
      setWriteError(error instanceof Error ? error.message : String(error))
    })
  }

  return (
    <div className="dpm-root">
      <header className="dpm-head">
        <div className="dpm-head__text">
          <div className="dpm-head__title">{t('tab.title')}</div>
          <div className="dpm-head__sub">
            {`${selectedPlan?.name ?? t('empty.noPlan')} · ${t(`mode.${catalog.mode}` as PriceMonitorKey)}`}
          </div>
        </div>
        <button
          type="button"
          className="dpm-icon"
          title={t('action.refresh')}
          aria-label={t('action.refresh')}
          disabled={showDiff || !visible}
          onClick={() => setShowDiff(true)}
        >
          ⟳
        </button>
      </header>

      {corrupt && <p className="dpm-note dpm-note--error">{t('error.settingsCorrupt')}</p>}
      {writeError !== null && <p className="dpm-note dpm-note--error">{t('error.writeFailed', { message: writeError })}</p>}

      {attemptCount === 0
        ? (
          <div className="dpm-empty">
            <div>{t('empty.noUsage')}</div>
            <div className="dpm-empty__hint">{t('empty.noUsageHint')}</div>
          </div>
        )
        : (
          <>
            <HeroSection
              view={view} t={t} attemptCount={attemptCount} turnCount={view.turns.length}
              anchorPlanName={anchorPlanName}
            />
            <BreakdownSection view={view} t={t} />
            <PlanSection
              view={view} t={t} catalog={catalog}
              onSelect={planId => write(current => ({ ...current, selectedPlanId: planId }))}
              onMode={mode => write(current => ({ ...current, mode }))}
            />
            <TurnsSection
              turns={turns} t={t} openTurn={openTurn}
              onToggle={index => setOpenTurn(openTurn === index ? null : index)}
            />
          </>
        )}

      {showDiff && <OfficialDiffPanel store={store} onClose={() => setShowDiff(false)} />}
    </div>
  )
}

/** The hero card: total, coverage note, and the run statistics. */
function HeroSection({ view, t, attemptCount, turnCount, anchorPlanName }: {
  view: PriceView
  t: Translate
  attemptCount: number
  turnCount: number
  anchorPlanName: string | undefined
}): React.ReactElement {
  const partial = view.coverage.uncovered > 0
  const average = turnCount === 0 ? new Decimal(0) : view.cost.total.div(turnCount)
  const promptTokens = view.tokens.uncachedInput + view.tokens.cacheRead
  const hitRate = promptTokens === 0 ? undefined : view.tokens.cacheRead / promptTokens
  const delta = view.anchor === undefined ? undefined : formatDelta(view.cost.total, view.anchor.total)
  return (
    <section className="dpm-section">
      <div className="dpm-hero">
        <span className="dpm-num dpm-hero__value">{formatCost(view.cost.total)}</span>
        <span className="dpm-hero__aside">
          <div>{partial ? t('total.known') : t('total.label')}</div>
          {view.anchor !== undefined && delta !== undefined && (
            <div>
              <b>{delta}</b>
              {` ${t('total.anchor', {
                plan: anchorPlanName ?? '—',
                amount: formatCost(view.anchor.total),
              })}`}
            </div>
          )}
        </span>
      </div>
      <div className="dpm-stats">
        <Stat label={t('stat.tokens')} value={formatTokens(view.tokens.total)} />
        <Stat label={t('stat.turns')} value={String(turnCount)} />
        <Stat label={t('stat.average')} value={formatCost(average)} />
        <Stat label={t('stat.hitRate')} value={hitRate === undefined ? '—' : `${(hitRate * 100).toFixed(0)}%`} />
      </div>
      <p className="dpm-note">
        {partial
          ? t('total.uncovered', { count: view.coverage.uncovered })
          : t('total.covered', { count: attemptCount })}
      </p>
      {partial && (
        <p className="dpm-note dpm-note--warn">
          {reasonsOf(view).map(([reason, count]) => `${t(`reason.${reason}` as PriceMonitorKey)} ×${count}`).join(' · ')}
        </p>
      )}
    </section>
  )
}

/** Non-zero pricing-failure reasons, most frequent first. */
function reasonsOf(view: PriceView): [AttemptPricingReason, number][] {
  return (Object.entries(view.coverage.byReason) as [AttemptPricingReason, number][])
    .filter(([, count]) => count > 0)
    .sort((left, right) => right[1] - left[1])
}

/** One statistic tile. */
function Stat({ label, value }: { label: string; value: string }): React.ReactElement {
  return (
    <div className="dpm-stat">
      <div className="dpm-stat__key">{label}</div>
      <div className="dpm-stat__value dpm-num">{value}</div>
    </div>
  )
}

/** The three cost buckets with token counts and a share bar. */
function BreakdownSection({ view, t }: { view: PriceView; t: Translate }): React.ReactElement {
  const total = view.cost.total
  const share = (bucket: Bucket): string => {
    if (total.isZero()) return '0'
    const value: Record<Bucket, Decimal> = { miss: view.cost.miss, hit: view.cost.hit, output: view.cost.output }
    return (value[bucket].div(total).toNumber() * 100).toFixed(2)
  }
  const tokens: Record<Bucket, number> = {
    miss: view.tokens.uncachedInput,
    hit: view.tokens.cacheRead,
    output: view.tokens.output,
  }
  const costs: Record<Bucket, Decimal> = {
    miss: view.cost.miss,
    hit: view.cost.hit,
    output: view.cost.output,
  }
  return (
    <section className="dpm-section">
      <div className="dpm-section__head">
        <span className="dpm-section__title">{t('breakdown.title')}</span>
        <span className="dpm-section__note">
          {tierNote(view, t)}
        </span>
      </div>
      <div className="dpm-stack" aria-hidden="true">
        {BUCKETS.map(bucket => (
          <span key={bucket} className={SWATCH[bucket]} style={{ width: `${share(bucket)}%` }} />
        ))}
      </div>
      {BUCKETS.map(bucket => (
        <div className="dpm-break" key={bucket}>
          <span className={`dpm-dot ${SWATCH[bucket]}`} aria-hidden="true" />
          <span className="dpm-break__label">{t(LABEL[bucket])}</span>
          <span className="dpm-break__tokens dpm-num">{t('breakdown.tokens', { tokens: formatTokens(tokens[bucket]) })}</span>
          <span className="dpm-break__cost dpm-num">{formatCost(costs[bucket])}</span>
        </div>
      ))}
      {view.coverage.byReason['cache-write'] > 0 && (
        <p className="dpm-note dpm-note--warn">
          {t('breakdown.cacheWriteWarning', { count: view.coverage.byReason['cache-write'] })}
        </p>
      )}
    </section>
  )
}

/** The selected plan card, plan chips, mode switch, and the comparison list. */
function PlanSection({ view, t, catalog, onSelect, onMode }: {
  view: PriceView
  t: Translate
  catalog: PersistedSettings
  onSelect: (planId: string) => void
  onMode: (mode: PersistedSettings['mode']) => void
}): React.ReactElement {
  const selected = catalog.plans.find(plan => plan.id === catalog.selectedPlanId)
  // Same tokens, each plan's own rates: a simulated comparison, labelled as such.
  // The alias map rides along, so a deployment model id reprices under the plan
  // that owns its aliased id.
  const comparisons = useMemo(() => catalog.plans
    .map(plan => ({
      plan,
      total: priceLedger(viewSource(view), {
        ...catalog,
        selectedPlanId: plan.id,
        mode: 'reprice',
      }).cost.total,
    }))
    .sort((left, right) => right.total.comparedTo(left.total)), [catalog, view])
  return (
    <section className="dpm-section">
      <div className="dpm-section__head">
        <span className="dpm-section__title">{t('plan.title')}</span>
        <span className="dpm-section__note">
          {catalog.lastOfficialRefresh === undefined
            ? t('plan.neverSynced')
            : t('plan.syncedAt', { time: clockOf(Date.parse(catalog.lastOfficialRefresh)) })}
        </span>
      </div>

      {selected === undefined
        ? (
          <p className="dpm-note dpm-note--warn">
            {`${t('empty.noPlan')} ${t('empty.noPlanHint')}`}
          </p>
        )
        : (
          <div className="dpm-plan">
            <div className="dpm-plan__top">
              <span className="dpm-plan__name">{selected.name}</span>
              <span className={`dpm-badge dpm-badge--${selected.source}`}>
                {t(`plan.badge.${selected.source}` as PriceMonitorKey)}
              </span>
            </div>
            <div className="dpm-plan__meta">
              {effectiveLabel(selected, t)}
              {` · ${t('plan.perMillion')}`}
            </div>
            <table className="dpm-table">
              <thead>
                <tr>
                  <th>{t('plan.rateColumn')}</th>
                  <th>{selected.ratesPerMillion.peak === undefined ? t('plan.rateColumn') : t('plan.offPeakColumn')}</th>
                  {selected.ratesPerMillion.peak !== undefined && <th>{t('plan.peakColumn')}</th>}
                </tr>
              </thead>
              <tbody>
                {BUCKETS.map(bucket => (
                  <tr key={bucket}>
                    <td>{t(LABEL[bucket])}</td>
                    <td className="dpm-num">{rateCell(selected.ratesPerMillion.offPeak, bucket)}</td>
                    {selected.ratesPerMillion.peak !== undefined && (
                      <td className="dpm-num">{rateCell(selected.ratesPerMillion.peak, bucket)}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      <div className="dpm-chips" role="group" aria-label={t('plan.title')}>
        {catalog.plans.map(plan => (
          <button
            key={plan.id}
            type="button"
            className={`dpm-chip${plan.id === catalog.selectedPlanId ? ' dpm-chip--on' : ''}`}
            aria-pressed={plan.id === catalog.selectedPlanId}
            onClick={() => onSelect(plan.id)}
          >
            {plan.name}
          </button>
        ))}
        <button
          type="button"
          className={`dpm-chip${catalog.mode === 'reprice' ? ' dpm-chip--on' : ''}`}
          aria-pressed={catalog.mode === 'reprice'}
          title={catalog.mode === 'reprice' ? t('mode.repriceHint') : t('mode.effectiveHint')}
          onClick={() => onMode(catalog.mode === 'reprice' ? 'effective' : 'reprice')}
        >
          {t(`mode.${catalog.mode}` as PriceMonitorKey)}
        </button>
      </div>

      {comparisons.length > 1 && (
        <div className="dpm-compare">
          <div className="dpm-compare__title">{t('plan.compare')}</div>
          {comparisons.map(({ plan, total }) => {
            const delta = formatDelta(total, view.cost.total)
            const current = plan.id === catalog.selectedPlanId
            return (
              <div className="dpm-compare__row" key={plan.id}>
                <span>{`${current ? '●' : '○'} ${plan.name}`}</span>
                <span className="dpm-num">
                  {formatCost(total)}
                  {!current && delta !== undefined && (
                    <span className={total.gt(view.cost.total) ? 'dpm-up' : 'dpm-down'}>{` ${delta}`}</span>
                  )}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

/** The ledger behind a priced view (the comparison reprices exactly the priced turns). */
function viewSource(view: PriceView): { turns: PriceView['turns'][number]['row'][] } {
  return { turns: view.turns.map(turn => turn.row) }
}

/**
 * The breakdown's tier note. It only speaks about peak tiers when something was
 * actually priced: with nothing priced, neither "no request ran at peak" nor
 * "this plan has no peak tiers" is a fact the view established.
 * @param view - the pricing result.
 * @param t - namespace translate function.
 * @returns the note, or undefined when the view supports no claim.
 */
function tierNote(view: PriceView, t: Translate): string | undefined {
  if (view.coverage.peak > 0) return t('breakdown.peakNote', { count: view.coverage.peak })
  if (view.coverage.priced === 0) return undefined
  return view.coverage.peakTiered ? t('breakdown.noPeakRequests') : t('breakdown.flatNote')
}

/**
 * The plan card's effectivity line. A plan that declares no start says so and
 * names when its rates were observed, instead of implying a start date it
 * never had.
 */
function effectiveLabel(plan: PersistedSettings['plans'][number], t: Translate): string {
  if (plan.effectiveFrom === undefined) {
    const observed = plan.provenance?.fetchedAt.slice(0, 10)
    return observed === undefined
      ? t('plan.unknownStart', { at: '—' })
      : t('plan.unknownStart', { at: observed })
  }
  return plan.effectiveTo === undefined
    ? t('plan.effectiveOpen', { from: plan.effectiveFrom })
    : t('plan.effective', { from: plan.effectiveFrom, to: plan.effectiveTo })
}

/** One plan rate cell. */
function rateCell(band: { cacheMiss: string; cacheHit: string; output: string }, bucket: Bucket): string {
  const value = bucket === 'miss' ? band.cacheMiss : bucket === 'hit' ? band.cacheHit : band.output
  return `$${value}`
}

/** The per-turn list with expandable attempt details. */
function TurnsSection({ turns, t, openTurn, onToggle }: {
  turns: PriceView['turns']
  t: Translate
  openTurn: number | null
  onToggle: (index: number) => void
}): React.ReactElement {
  return (
    <section className="dpm-section">
      <div className="dpm-section__head">
        <span className="dpm-section__title">{t('turns.title')}</span>
        <span className="dpm-section__note">{t('turns.hint')}</span>
      </div>
      <div className="dpm-turns">
        {turns.map((turn, index) => {
          const peak = turn.peak > 0
          const open = openTurn === index
          return (
            <button
              key={turn.row.turn}
              type="button"
              className="dpm-turn"
              aria-expanded={open}
              onClick={() => onToggle(index)}
            >
              <span className="dpm-turn__line">
                <span className="dpm-turn__no">{t('turns.turn', { turn: turn.row.turn })}</span>
                <span className="dpm-turn__time dpm-num">{clockOf(turn.row.startedAt)}</span>
                <span className={`dpm-tier dpm-tier--${peak ? 'peak' : 'off'}`}>
                  {peak ? t('turns.peak') : t('turns.offPeak')}
                </span>
                <span className="dpm-turn__cost dpm-num">
                  {turn.priced === 0 ? t('turns.unpriced') : formatCost(turn.cost.total)}
                </span>
              </span>
              <span className="dpm-turn__tokens dpm-num">
                <span><em>{t('breakdown.miss')}</em> {formatTokens(turn.tokens.uncachedInput)}</span>
                <span><em>{t('breakdown.hit')}</em> {formatTokens(turn.tokens.cacheRead)}</span>
                <span><em>{t('breakdown.output')}</em> {formatTokens(turn.tokens.output)}</span>
                <span>
                  {turn.row.endedAt === undefined
                    ? t('turns.open')
                    : turn.row.complete ? t('turns.complete') : t('turns.partial')}
                </span>
              </span>
              {open && (
                <span className="dpm-turn__detail">
                  {turn.attempts.map(attempt => (
                    <AttemptRows key={attempt.row.id} attempt={attempt} t={t} />
                  ))}
                  <span className="dpm-line dpm-line--total">
                    <span>{t('turns.subtotal')}</span>
                    <span className="dpm-num"><b>{formatCost(turn.cost.total)}</b></span>
                  </span>
                </span>
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}

/** One attempt's three bucket lines, or its unpriced reason. */
function AttemptRows({ attempt, t }: { attempt: PricedAttempt; t: Translate }): React.ReactElement {
  const label = `${t('turns.attempt', { attempt: attempt.row.attempt })} · ${attempt.row.model ?? t('turns.noRoute')}`
  if (attempt.cost === undefined) {
    // An unpriced attempt still names its route: "which model had no plan" is
    // the actionable part of the message.
    const reason = t(`reason.${attempt.reason as AttemptPricingReason}` as PriceMonitorKey)
    return (
      <span className="dpm-line">
        <span>{label}</span>
        <span className="dpm-num">{`${t('turns.unpriced')} · ${reason}`}</span>
      </span>
    )
  }
  const rows: [PriceMonitorKey, number, Decimal][] = [
    ['breakdown.miss', attempt.row.uncachedInputTokens ?? 0, attempt.cost.miss],
    ['breakdown.hit', attempt.row.cacheReadTokens ?? 0, attempt.cost.hit],
    ['breakdown.output', attempt.row.outputTokens ?? 0, attempt.cost.output],
  ]
  return (
    <span>
      <span className="dpm-line">
        <span>{label}</span>
        <span className="dpm-num">
          {`${attempt.planName ?? ''}${attempt.peak === true ? ` · ${t('turns.peak')}` : ''}`}
        </span>
      </span>
      {rows.map(([key, tokens, cost]) => (
        <span className="dpm-line" key={key}>
          <span>{t(key)}</span>
          <span className="dpm-num">{`${formatTokens(tokens)} × ${formatCost(cost)}`}</span>
        </span>
      ))}
    </span>
  )
}
