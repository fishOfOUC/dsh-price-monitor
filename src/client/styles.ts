/**
 * The tab's stylesheet, injected as one `<style>` element at plugin
 * activation and removed on disposal.
 *
 * Why a stylesheet string instead of a `*.module.css` import: the plugin is
 * built by plain tsdown, which does not compile CSS modules, and a stylesheet
 * import would make the client bundle depend on a build plugin the harness
 * web bundle does not impose. Class names carry a `dpm-` prefix so one global
 * sheet cannot collide with host or sibling-plugin styles.
 *
 * Colors come exclusively from DSH theme tokens, so light, dark, and any
 * future theme work without a second stylesheet.
 *
 * @module dsh-price-monitor/client/styles
 */

/** The style element id (a second injection is a no-op). */
const STYLE_ID = 'dsh-price-monitor-styles'

/** The tab's complete stylesheet. */
export const PRICE_MONITOR_CSS = `
.dpm-root {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  color: var(--dsw-alias-label-primary);
  font-family: var(--dsw-font-family);
  font-size: 12px;
  line-height: 1.5;
}
.dpm-root * { box-sizing: border-box; }
/* A weak default only: :where() gives this rule zero specificity, so every
   component and state class below (e.g. the selected chip's own text color)
   outranks it. A two-class button reset outranked them instead, which
   silently repainted a state rule's inherited color. */
.dpm-root :where(button) { font: inherit; color: inherit; }

.dpm-head {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 10px 12px;
  background: var(--dsw-alias-bg-layer-1);
  border-bottom: 1px solid var(--dsw-alias-border-l2);
}
.dpm-head__text { flex: 1; min-width: 0; }
.dpm-head__title { font-size: 13px; font-weight: 650; }
.dpm-head__sub {
  margin-top: 2px;
  font-size: 10px;
  color: var(--dsw-alias-label-tertiary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dpm-icon {
  flex: none;
  width: 24px;
  height: 24px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
}
.dpm-icon:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.dpm-icon:disabled { opacity: 0.5; cursor: default; }

.dpm-section {
  padding: 12px;
  border-bottom: 1px solid var(--dsw-alias-border-l1);
}
.dpm-section:last-child { border-bottom: 0; }
.dpm-section__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}
.dpm-section__title {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--dsw-alias-label-secondary);
}
.dpm-section__note { font-size: 10px; color: var(--dsw-alias-label-quaternary); }

.dpm-num { font-family: var(--ds-font-family-code); font-variant-numeric: tabular-nums; }
.dpm-right { text-align: right; }
.dpm-row { display: flex; align-items: baseline; gap: 8px; }

.dpm-hero { display: flex; align-items: baseline; gap: 6px; }
.dpm-hero__value { font-size: 26px; font-weight: 700; letter-spacing: -0.01em; }
.dpm-hero__aside {
  margin-left: auto;
  text-align: right;
  font-size: 10px;
  color: var(--dsw-alias-label-tertiary);
}
.dpm-hero__aside b { color: var(--dsw-alias-state-warn-primary); font-weight: 600; }

.dpm-stats { display: flex; gap: 6px; margin-top: 10px; }
.dpm-stat {
  flex: 1;
  min-width: 0;
  padding: 6px 8px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-2);
}
.dpm-stat__key { font-size: 9px; color: var(--dsw-alias-label-quaternary); }
.dpm-stat__value { margin-top: 1px; font-size: 12px; font-weight: 600; }

.dpm-note {
  margin-top: 8px;
  font-size: 10px;
  color: var(--dsw-alias-label-tertiary);
}
.dpm-note--warn { color: var(--dsw-alias-state-warn-primary); }
.dpm-note--error { color: var(--dsw-alias-state-error-primary); }

.dpm-stack {
  display: flex;
  height: 6px;
  margin-bottom: 8px;
  border-radius: 3px;
  overflow: hidden;
  background: var(--dsw-alias-bg-layer-3);
}
.dpm-stack span { display: block; height: 100%; }
.dpm-swatch-miss { background: var(--dsw-alias-state-business-primary); }
.dpm-swatch-hit { background: var(--dsw-alias-state-success-primary); }
.dpm-swatch-output { background: var(--dsw-alias-state-warn-primary); }

.dpm-break {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 5px 0;
}
.dpm-break + .dpm-break { border-top: 1px dashed var(--dsw-alias-border-l1); }
.dpm-dot { flex: none; width: 7px; height: 7px; border-radius: 50%; }
.dpm-break__label { flex: 1; min-width: 0; font-size: 11px; }
.dpm-break__tokens { font-size: 10px; color: var(--dsw-alias-label-tertiary); }
.dpm-break__cost { width: 74px; text-align: right; font-size: 12px; font-weight: 600; }

.dpm-plan {
  padding: 8px 10px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 10px;
  background: var(--dsw-alias-bg-layer-2);
}
.dpm-plan__top { display: flex; align-items: center; gap: 6px; }
.dpm-plan__name { font-size: 11px; font-weight: 650; }
.dpm-badge {
  padding: 1px 6px;
  border-radius: 20px;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.04em;
}
.dpm-badge--official { background: var(--dsw-alias-button-info-fill); color: var(--dsw-alias-label-primary-bluish); }
.dpm-badge--manual { background: var(--dsw-alias-bg-layer-3); color: var(--dsw-alias-state-warn-label); }
.dpm-plan__meta { margin-top: 2px; font-size: 9px; color: var(--dsw-alias-label-quaternary); }

.dpm-plan__group { margin-top: 6px; }
.dpm-plan__group + .dpm-plan__group { padding-top: 6px; border-top: 1px dashed var(--dsw-alias-border-l1); }
.dpm-plan__models { font-size: 9px; color: var(--dsw-alias-label-tertiary); overflow-wrap: anywhere; }

.dpm-entry {
  margin-top: 6px;
  padding: 6px 8px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 6px;
}

.dpm-table { width: 100%; margin-top: 6px; border-collapse: collapse; font-size: 10px; }
.dpm-table th {
  padding: 2px 0 3px;
  font-weight: 500;
  color: var(--dsw-alias-label-quaternary);
  text-align: right;
}
.dpm-table th:first-child { text-align: left; }
.dpm-table td {
  padding: 3px 0;
  border-top: 1px solid var(--dsw-alias-border-l1);
  text-align: right;
}
.dpm-table td:first-child { text-align: left; color: var(--dsw-alias-label-secondary); }

.dpm-chips { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
.dpm-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 9px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 20px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font-size: 10px;
  cursor: pointer;
}
.dpm-chip:hover { border-color: var(--dsw-alias-border-l4); }
.dpm-chip--on {
  /* The canonical DSH primary pairing (fill plus its foreground token). An
     "inverted label" token is NOT the inverse of label-primary in every theme;
     pairing them rendered a chip whose label was the same color as its fill. */
  background: var(--dsw-alias-button-primary-fill);
  border-color: var(--dsw-alias-button-primary-fill);
  color: var(--dsw-alias-label-primary-foreground);
  font-weight: 600;
}
.dpm-chip__x { padding: 0 1px; color: var(--dsw-alias-label-quaternary); }
.dpm-chip__x:hover { color: var(--dsw-alias-state-error-primary); }

.dpm-compare { margin-top: 8px; padding-top: 6px; border-top: 1px dashed var(--dsw-alias-border-l2); }
.dpm-compare__title { margin-bottom: 3px; font-size: 9px; color: var(--dsw-alias-label-quaternary); }
.dpm-compare__row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 2px 0;
  font-size: 10px;
  color: var(--dsw-alias-label-secondary);
}
.dpm-up { color: var(--dsw-alias-state-warn-primary); }
.dpm-down { color: var(--dsw-alias-state-success-primary); }

.dpm-turns { display: flex; flex-direction: column; }
.dpm-turn {
  display: block;
  width: 100%;
  padding: 7px 6px;
  margin: 0 -6px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  text-align: left;
  cursor: pointer;
}
.dpm-turn:hover { background: var(--dsw-alias-interactive-bg-hover); }
.dpm-turn + .dpm-turn { border-top: 1px solid var(--dsw-alias-border-l1); }
.dpm-turn__line { display: flex; align-items: baseline; gap: 6px; }
.dpm-turn__no { font-size: 11px; font-weight: 650; }
.dpm-turn__time { font-size: 9px; color: var(--dsw-alias-label-quaternary); }
.dpm-tier { padding: 0 5px; border-radius: 4px; font-size: 9px; }
.dpm-tier--peak { background: var(--dsw-alias-bg-layer-3); color: var(--dsw-alias-state-warn-label); }
.dpm-tier--off { background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-tertiary); }
.dpm-turn__cost { margin-left: auto; font-size: 12px; font-weight: 650; }
.dpm-turn__tokens {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 2px;
  font-size: 9px;
  color: var(--dsw-alias-label-tertiary);
}
.dpm-turn__tokens em { font-style: normal; color: var(--dsw-alias-label-quaternary); }
.dpm-turn__detail {
  margin-top: 6px;
  padding: 6px 8px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 7px;
  background: var(--dsw-alias-bg-layer-2);
}
.dpm-line {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 1px 0;
  font-size: 10px;
  color: var(--dsw-alias-label-secondary);
}
.dpm-line b { font-weight: 600; color: var(--dsw-alias-label-primary); }
.dpm-line--total { margin-top: 4px; padding-top: 4px; border-top: 1px dashed var(--dsw-alias-border-l2); }

.dpm-empty {
  padding: 18px 12px;
  text-align: center;
  color: var(--dsw-alias-label-tertiary);
}
.dpm-empty__hint { margin-top: 4px; font-size: 10px; color: var(--dsw-alias-label-quaternary); }

.dpm-dialog {
  margin-top: 8px;
  padding: 10px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 10px;
  background: var(--dsw-alias-bg-layer-2);
}
.dpm-dialog__title { font-size: 11px; font-weight: 650; margin-bottom: 4px; }
.dpm-buttons { display: flex; gap: 6px; margin-top: 10px; }
.dpm-button {
  flex: 1;
  padding: 6px 0;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
  cursor: pointer;
}
.dpm-button:hover { background: var(--dsw-alias-interactive-bg-hover); }
.dpm-button--primary {
  background: var(--dsw-alias-button-primary-fill);
  border-color: var(--dsw-alias-button-primary-fill);
  color: var(--dsw-alias-label-primary-foreground);
  font-weight: 600;
}
.dpm-button--primary:hover { background: var(--dsw-alias-button-primary-hover); }

.dpm-field { margin-bottom: 8px; }
.dpm-field__label { display: block; margin-bottom: 3px; font-size: 10px; color: var(--dsw-alias-label-secondary); }
.dpm-input {
  width: 100%;
  padding: 5px 7px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 11px;
}
.dpm-input:focus { outline: none; border-color: var(--dsw-alias-brand-primary); }
.dpm-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0 8px; }
.dpm-grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0 6px; }
.dpm-check { display: flex; align-items: center; gap: 6px; margin: 6px 0; font-size: 11px; color: var(--dsw-alias-label-secondary); }
.dpm-plan-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 0;
  border-top: 1px solid var(--dsw-alias-border-l1);
}
.dpm-plan-row:first-child { border-top: 0; }
.dpm-plan-row__name { flex: 1; min-width: 0; font-size: 11px; }
.dpm-plan-row__actions { display: flex; gap: 4px; }
.dpm-mini {
  padding: 2px 7px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 5px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font-size: 10px;
  cursor: pointer;
}
.dpm-mini:hover { background: var(--dsw-alias-interactive-bg-hover); }
`

/**
 * Inject the stylesheet once (idempotent by element id).
 *
 * Outside a browser (the client module evaluated by a non-DOM runtime, or a
 * server render) this is a no-op with a no-op disposer: the plugin registers
 * its tab regardless, and only the visual styling needs `document`.
 * @param doc - the document to inject into; defaults to the global one.
 * @returns a disposer removing the element this call injected (a no-op when one already existed or there is no document).
 */
export function injectPriceMonitorStyles(doc?: Document): () => void {
  const target = doc ?? (typeof document === 'undefined' ? undefined : document)
  if (target === undefined) return () => {}
  const existing = target.getElementById(STYLE_ID)
  if (existing !== null) return () => {}
  const style = target.createElement('style')
  style.id = STYLE_ID
  style.textContent = PRICE_MONITOR_CSS
  target.head.append(style)
  return () => {
    if (style.parentNode !== null) style.remove()
  }
}
