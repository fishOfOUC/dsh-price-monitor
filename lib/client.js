window.__ModuleLoader__.load({
	id: "dsh-price-monitor",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region src/client/locales.ts
		/**
		* Bilingual dictionary for the price-monitor tab and its settings panel.
		* Every user-visible string goes through this namespace (no hardcoded copy in
		* components). Keys are flat; `{name}` placeholders are substituted by the
		* locale runtime.
		*
		* @module dsh-price-monitor/client/locales
		*/
		/** The price-monitor locale namespace. */
		const NS = "priceMonitor";
		/** English dictionary (the required fallback locale). */
		const en = {
			"tab.title": "Session cost",
			"tab.subtitle": "Provider-reported tokens priced with the selected plan",
			"action.refresh": "Refresh official pricing",
			"action.settings": "Plan settings",
			"action.collapse": "Collapse",
			"action.apply": "Apply",
			"action.cancel": "Cancel",
			"action.save": "Save",
			"action.delete": "Delete",
			"action.copy": "Duplicate",
			"action.reset": "Restore built-in plans",
			"total.label": "Total cost",
			"total.known": "Known cost (partial)",
			"total.uncovered": "{count} attempts not priced",
			"total.covered": "All {count} attempts priced",
			"total.noAttempts": "No billed attempt in this session yet",
			"stat.tokens": "Total tokens",
			"stat.turns": "Turns",
			"stat.attempts": "Requests",
			"stat.average": "Per turn",
			"stat.hitRate": "Cache hit rate",
			"breakdown.title": "Cost breakdown",
			"breakdown.miss": "Input · cache miss",
			"breakdown.hit": "Input · cache hit",
			"breakdown.output": "Output",
			"breakdown.tokens": "{tokens} tok",
			"breakdown.peakNote": "{count} requests ran at peak",
			"breakdown.flatNote": "This plan has no peak tiers",
			"breakdown.noPeakRequests": "No request ran at peak hours",
			"breakdown.cacheWriteWarning": "{count} attempts reported cache-write tokens; this plan has no cache-write rate, so they are excluded.",
			"plan.title": "Pricing plan",
			"plan.badge.official": "Official",
			"plan.badge.manual": "Manual",
			"plan.source": "Source: {source}",
			"plan.effective": "Rates {from} → {to}",
			"plan.effectiveOpen": "Rates from {from}",
			"plan.ratePeriodUntil": "Rates until {to}",
			"plan.unknownStart": "Rate period start unknown · snapshot {at}",
			"plan.perMillion": "per 1M tokens",
			"plan.peakColumn": "Peak",
			"plan.offPeakColumn": "Off-peak",
			"plan.rateColumn": "Rate",
			"plan.syncedAt": "Synced {time}",
			"plan.neverSynced": "Bundled snapshot",
			"plan.compare": "Same tokens under each plan",
			"plan.selected": "Selected",
			"turns.title": "Per-turn usage",
			"turns.hint": "Click a row for the attempt breakdown",
			"turns.turn": "Turn {turn}",
			"turns.peak": "Peak",
			"turns.offPeak": "Off-peak",
			"turns.attempt": "attempt {attempt}",
			"turns.subtotal": "Subtotal",
			"turns.noRoute": "no model",
			"turns.unpriced": "not priced",
			"turns.complete": "complete",
			"turns.partial": "partial",
			"turns.open": "running",
			"empty.noUsage": "This session has no provider-reported usage yet.",
			"empty.noUsageHint": "Send a message, then reopen this tab.",
			"empty.noPlan": "No pricing plan is configured.",
			"empty.noPlanHint": "Add a plan in the plan settings.",
			"reason.no-usage": "no usage reported",
			"reason.invalid": "usage failed validation",
			"reason.no-plan": "no plan selected",
			"reason.no-split": "cache buckets missing",
			"reason.cache-write": "cache-write tokens have no rate",
			"error.settingsCorrupt": "Stored plan settings could not be read; built-in plans are shown.",
			"error.refreshFailed": "Official refresh failed: {message}",
			"error.refreshParse": "The official page changed unexpectedly; the last catalog was kept.",
			"error.writeFailed": "Saving the plan failed: {message}",
			"refresh.title": "Official pricing diff",
			"refresh.added": "Added models: {models}",
			"refresh.removed": "Removed models: {models}",
			"refresh.changed": "{count} rates changed",
			"refresh.noChange": "No change against the bundled snapshot.",
			"refresh.hash": "Content hash {hash}",
			"refresh.confirm": "Apply as new official versions",
			"settings.title": "Price monitor plans",
			"settings.hint": "Official plans are read-only; duplicate one to edit its rates.",
			"settings.selected": "Selected plan",
			"settings.basis": "Every request of the session is priced at the selected plan’s rates.",
			"settings.plans": "Plans",
			"settings.add": "Add plan",
			"settings.editTitle": "Edit plan",
			"settings.edit": "Edit",
			"settings.name": "Name",
			"settings.models": "Models (comma separated)",
			"settings.currency": "Currency",
			"settings.effectiveFrom": "Rate period from",
			"settings.effectiveTo": "Rate period until",
			"settings.ratePeriodHint": "The rate period only labels the plan card; leave either end empty when it is unknown. It never changes an amount.",
			"settings.peakTiers": "Peak/off-peak tiers",
			"settings.cacheMiss": "Cache miss",
			"settings.cacheHit": "Cache hit",
			"settings.output": "Output",
			"settings.peakMiss": "Peak miss",
			"settings.peakHit": "Peak hit",
			"settings.peakOutput": "Peak output",
			"settings.currencyNote": "A plan keeps the currency its publisher printed: DeepSeek publishes USD in English and CNY in Chinese, and the two are not the same numbers. Nothing is converted, so an amount always reads in the selected plan’s currency.",
			"settings.deleteConfirm": "Delete this plan?",
			"settings.lastPlan": "The last remaining plan cannot be deleted.",
			"settings.invalidRates": "Every rate must be a non-negative decimal."
		};
		/** Chinese dictionary (same key set as {@link en}). */
		const zh = {
			"tab.title": "会话费用",
			"tab.subtitle": "按所选方案为模型上报的 Token 计价",
			"action.refresh": "刷新官网价格",
			"action.settings": "方案设置",
			"action.collapse": "收起",
			"action.apply": "应用",
			"action.cancel": "取消",
			"action.save": "保存",
			"action.delete": "删除",
			"action.copy": "复制",
			"action.reset": "恢复内置方案",
			"total.label": "总费用",
			"total.known": "已知费用（部分可计算）",
			"total.uncovered": "{count} 次请求未计价",
			"total.covered": "{count} 次请求全部计价",
			"total.noAttempts": "本会话还没有可计费的请求",
			"stat.tokens": "总 tokens",
			"stat.turns": "轮次",
			"stat.attempts": "请求数",
			"stat.average": "单轮均值",
			"stat.hitRate": "缓存命中率",
			"breakdown.title": "费用拆解",
			"breakdown.miss": "输入 · 缓存未命中",
			"breakdown.hit": "输入 · 缓存命中",
			"breakdown.output": "输出",
			"breakdown.tokens": "{tokens} tok",
			"breakdown.peakNote": "{count} 次请求落在高峰时段",
			"breakdown.flatNote": "该方案不分峰谷",
			"breakdown.noPeakRequests": "没有请求落在高峰时段",
			"breakdown.cacheWriteWarning": "{count} 次请求上报了缓存写入 Token；该方案没有缓存写入单价，已排除在总额外。",
			"plan.title": "计价方案",
			"plan.badge.official": "官方",
			"plan.badge.manual": "手工",
			"plan.source": "来源：{source}",
			"plan.effective": "费率适用期 {from} → {to}",
			"plan.effectiveOpen": "{from} 起适用",
			"plan.ratePeriodUntil": "费率适用至 {to}",
			"plan.unknownStart": "费率起始未知 · 快照于 {at}",
			"plan.perMillion": "每 100 万 tokens",
			"plan.peakColumn": "高峰",
			"plan.offPeakColumn": "空闲",
			"plan.rateColumn": "单价",
			"plan.syncedAt": "同步于 {time}",
			"plan.neverSynced": "随包快照",
			"plan.compare": "同一批 Token 在各方案下的费用",
			"plan.selected": "当前",
			"turns.title": "逐轮消耗",
			"turns.hint": "点击行展开请求明细",
			"turns.turn": "第 {turn} 轮",
			"turns.peak": "峰",
			"turns.offPeak": "谷",
			"turns.attempt": "第 {attempt} 次请求",
			"turns.subtotal": "小计",
			"turns.noRoute": "无模型",
			"turns.unpriced": "未计价",
			"turns.complete": "完整",
			"turns.partial": "部分",
			"turns.open": "进行中",
			"empty.noUsage": "本会话还没有模型上报的 usage。",
			"empty.noUsageHint": "发送一条消息后重新打开本页。",
			"empty.noPlan": "尚未配置计价方案。",
			"empty.noPlanHint": "请在方案设置中添加方案。",
			"reason.no-usage": "未上报 usage",
			"reason.invalid": "usage 未通过校验",
			"reason.no-plan": "未选择计价方案",
			"reason.no-split": "缺少缓存分桶",
			"reason.cache-write": "缓存写入 Token 没有单价",
			"error.settingsCorrupt": "已保存的方案设置无法解析，当前显示内置方案。",
			"error.refreshFailed": "官网刷新失败：{message}",
			"error.refreshParse": "官网页面结构发生变化，已保留上次成功方案。",
			"error.writeFailed": "方案保存失败：{message}",
			"refresh.title": "官网价格差异",
			"refresh.added": "新增模型：{models}",
			"refresh.removed": "移除模型：{models}",
			"refresh.changed": "{count} 项价格变化",
			"refresh.noChange": "与随包快照相比没有变化。",
			"refresh.hash": "内容 hash {hash}",
			"refresh.confirm": "确认为新的官方版本",
			"settings.title": "费用监控方案",
			"settings.hint": "官方方案只读；需要修改时先复制为手工方案。",
			"settings.selected": "当前方案",
			"settings.basis": "本会话的全部请求都按当前所选方案的单价计价。",
			"settings.plans": "方案列表",
			"settings.add": "新增方案",
			"settings.editTitle": "编辑方案",
			"settings.edit": "编辑",
			"settings.name": "方案名称",
			"settings.models": "模型（逗号分隔）",
			"settings.currency": "货币",
			"settings.effectiveFrom": "费率适用期（起）",
			"settings.effectiveTo": "费率适用期（止）",
			"settings.ratePeriodHint": "费率适用期只用于方案卡片的说明，不影响任何金额；起止日期未知时留空。",
			"settings.peakTiers": "区分高峰/空闲",
			"settings.cacheMiss": "缓存未命中",
			"settings.cacheHit": "缓存命中",
			"settings.output": "输出",
			"settings.peakMiss": "高峰·未命中",
			"settings.peakHit": "高峰·命中",
			"settings.peakOutput": "高峰·输出",
			"settings.currencyNote": "方案保留官方公布的原始货币：DeepSeek 英文页用美元、中文页用人民币，两者并不是同一组数字。插件不做汇率换算，金额始终按所选方案的货币显示。",
			"settings.deleteConfirm": "确定删除该方案？",
			"settings.lastPlan": "最后一个方案不能删除。",
			"settings.invalidRates": "每一项单价都必须是非负十进制数。"
		};
		/**
		* The activate-time binding shared by every component in this plugin.
		*
		* The plugin's `apply()` binds the namespace through
		* `ctx.locale.bind(NS)` before any tab or settings panel can render, so the
		* components read one stable function without threading it through props the
		* sidebar does not define. Before that binding the fallback returns the key
		* itself — visible rather than silent — and is unreachable in a correctly
		* activated plugin (registration happens in the same synchronous body).
		*/
		let bound = (key) => key;
		/**
		* Install the namespace-bound translate function.
		* @param translate - the function `ctx.locale.bind(NS)` returned.
		*/
		function bindTranslate(translate) {
			bound = translate;
		}
		/**
		* Translate one key in the price-monitor namespace.
		* @param key - dictionary key.
		* @param params - `{name}` placeholder values.
		* @returns the active locale's text.
		*/
		function t(key, params) {
			return bound(key, params);
		}
		//#endregion
		//#region src/client/styles.ts
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
		const STYLE_ID = "dsh-price-monitor-styles";
		/** The tab's complete stylesheet. */
		const PRICE_MONITOR_CSS = `
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
`;
		/**
		* Inject the stylesheet once (idempotent by element id).
		*
		* Outside a browser (the client module evaluated by a non-DOM runtime, or a
		* server render) this is a no-op with a no-op disposer: the plugin registers
		* its tab regardless, and only the visual styling needs `document`.
		* @param doc - the document to inject into; defaults to the global one.
		* @returns a disposer removing the element this call injected (a no-op when one already existed or there is no document).
		*/
		function injectPriceMonitorStyles(doc) {
			const target = doc ?? (typeof document === "undefined" ? void 0 : document);
			if (target === void 0) return () => {};
			if (target.getElementById(STYLE_ID) !== null) return () => {};
			const style = target.createElement("style");
			style.id = STYLE_ID;
			style.textContent = PRICE_MONITOR_CSS;
			target.head.append(style);
			return () => {
				if (style.parentNode !== null) style.remove();
			};
		}
		//#endregion
		//#region node_modules/.pnpm/decimal.js@10.6.0/node_modules/decimal.js/decimal.mjs
		/*!
		*  decimal.js v10.6.0
		*  An arbitrary-precision Decimal type for JavaScript.
		*  https://github.com/MikeMcl/decimal.js
		*  Copyright (c) 2025 Michael Mclaughlin <M8ch88l@gmail.com>
		*  MIT Licence
		*/
		var EXP_LIMIT = 9e15;
		var MAX_DIGITS = 1e9;
		var NUMERALS = "0123456789abcdef";
		var LN10 = "2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058";
		var PI = "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789";
		var DEFAULTS = {
			precision: 20,
			rounding: 4,
			modulo: 1,
			toExpNeg: -7,
			toExpPos: 21,
			minE: -EXP_LIMIT,
			maxE: EXP_LIMIT,
			crypto: false
		};
		var inexact;
		var quadrant;
		var external = true;
		var decimalError = "[DecimalError] ";
		var invalidArgument = decimalError + "Invalid argument: ";
		var precisionLimitExceeded = decimalError + "Precision limit exceeded";
		var cryptoUnavailable = decimalError + "crypto unavailable";
		var tag = "[object Decimal]";
		var mathfloor = Math.floor;
		var mathpow = Math.pow;
		var isBinary = /^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i;
		var isHex = /^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i;
		var isOctal = /^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i;
		var isDecimal = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;
		var BASE = 1e7;
		var LOG_BASE = 7;
		var MAX_SAFE_INTEGER = 9007199254740991;
		var LN10_PRECISION = LN10.length - 1;
		var PI_PRECISION = PI.length - 1;
		var P = { toStringTag: tag };
		P.absoluteValue = P.abs = function() {
			var x = new this.constructor(this);
			if (x.s < 0) x.s = 1;
			return finalise(x);
		};
		P.ceil = function() {
			return finalise(new this.constructor(this), this.e + 1, 2);
		};
		P.clampedTo = P.clamp = function(min, max) {
			var k, x = this, Ctor = x.constructor;
			min = new Ctor(min);
			max = new Ctor(max);
			if (!min.s || !max.s) return new Ctor(NaN);
			if (min.gt(max)) throw Error(invalidArgument + max);
			k = x.cmp(min);
			return k < 0 ? min : x.cmp(max) > 0 ? max : new Ctor(x);
		};
		P.comparedTo = P.cmp = function(y) {
			var i, j, xdL, ydL, x = this, xd = x.d, yd = (y = new x.constructor(y)).d, xs = x.s, ys = y.s;
			if (!xd || !yd) return !xs || !ys ? NaN : xs !== ys ? xs : xd === yd ? 0 : !xd ^ xs < 0 ? 1 : -1;
			if (!xd[0] || !yd[0]) return xd[0] ? xs : yd[0] ? -ys : 0;
			if (xs !== ys) return xs;
			if (x.e !== y.e) return x.e > y.e ^ xs < 0 ? 1 : -1;
			xdL = xd.length;
			ydL = yd.length;
			for (i = 0, j = xdL < ydL ? xdL : ydL; i < j; ++i) if (xd[i] !== yd[i]) return xd[i] > yd[i] ^ xs < 0 ? 1 : -1;
			return xdL === ydL ? 0 : xdL > ydL ^ xs < 0 ? 1 : -1;
		};
		P.cosine = P.cos = function() {
			var pr, rm, x = this, Ctor = x.constructor;
			if (!x.d) return new Ctor(NaN);
			if (!x.d[0]) return new Ctor(1);
			pr = Ctor.precision;
			rm = Ctor.rounding;
			Ctor.precision = pr + Math.max(x.e, x.sd()) + LOG_BASE;
			Ctor.rounding = 1;
			x = cosine(Ctor, toLessThanHalfPi(Ctor, x));
			Ctor.precision = pr;
			Ctor.rounding = rm;
			return finalise(quadrant == 2 || quadrant == 3 ? x.neg() : x, pr, rm, true);
		};
		P.cubeRoot = P.cbrt = function() {
			var e, m, n, r, rep, s, sd, t, t3, t3plusx, x = this, Ctor = x.constructor;
			if (!x.isFinite() || x.isZero()) return new Ctor(x);
			external = false;
			s = x.s * mathpow(x.s * x, 1 / 3);
			if (!s || Math.abs(s) == 1 / 0) {
				n = digitsToString(x.d);
				e = x.e;
				if (s = (e - n.length + 1) % 3) n += s == 1 || s == -2 ? "0" : "00";
				s = mathpow(n, 1 / 3);
				e = mathfloor((e + 1) / 3) - (e % 3 == (e < 0 ? -1 : 2));
				if (s == 1 / 0) n = "5e" + e;
				else {
					n = s.toExponential();
					n = n.slice(0, n.indexOf("e") + 1) + e;
				}
				r = new Ctor(n);
				r.s = x.s;
			} else r = new Ctor(s.toString());
			sd = (e = Ctor.precision) + 3;
			for (;;) {
				t = r;
				t3 = t.times(t).times(t);
				t3plusx = t3.plus(x);
				r = divide(t3plusx.plus(x).times(t), t3plusx.plus(t3), sd + 2, 1);
				if (digitsToString(t.d).slice(0, sd) === (n = digitsToString(r.d)).slice(0, sd)) {
					n = n.slice(sd - 3, sd + 1);
					if (n == "9999" || !rep && n == "4999") {
						if (!rep) {
							finalise(t, e + 1, 0);
							if (t.times(t).times(t).eq(x)) {
								r = t;
								break;
							}
						}
						sd += 4;
						rep = 1;
					} else {
						if (!+n || !+n.slice(1) && n.charAt(0) == "5") {
							finalise(r, e + 1, 1);
							m = !r.times(r).times(r).eq(x);
						}
						break;
					}
				}
			}
			external = true;
			return finalise(r, e, Ctor.rounding, m);
		};
		P.decimalPlaces = P.dp = function() {
			var w, d = this.d, n = NaN;
			if (d) {
				w = d.length - 1;
				n = (w - mathfloor(this.e / LOG_BASE)) * LOG_BASE;
				w = d[w];
				if (w) for (; w % 10 == 0; w /= 10) n--;
				if (n < 0) n = 0;
			}
			return n;
		};
		P.dividedBy = P.div = function(y) {
			return divide(this, new this.constructor(y));
		};
		P.dividedToIntegerBy = P.divToInt = function(y) {
			var x = this, Ctor = x.constructor;
			return finalise(divide(x, new Ctor(y), 0, 1, 1), Ctor.precision, Ctor.rounding);
		};
		P.equals = P.eq = function(y) {
			return this.cmp(y) === 0;
		};
		P.floor = function() {
			return finalise(new this.constructor(this), this.e + 1, 3);
		};
		P.greaterThan = P.gt = function(y) {
			return this.cmp(y) > 0;
		};
		P.greaterThanOrEqualTo = P.gte = function(y) {
			var k = this.cmp(y);
			return k == 1 || k === 0;
		};
		P.hyperbolicCosine = P.cosh = function() {
			var k, n, pr, rm, len, x = this, Ctor = x.constructor, one = new Ctor(1);
			if (!x.isFinite()) return new Ctor(x.s ? 1 / 0 : NaN);
			if (x.isZero()) return one;
			pr = Ctor.precision;
			rm = Ctor.rounding;
			Ctor.precision = pr + Math.max(x.e, x.sd()) + 4;
			Ctor.rounding = 1;
			len = x.d.length;
			if (len < 32) {
				k = Math.ceil(len / 3);
				n = (1 / tinyPow(4, k)).toString();
			} else {
				k = 16;
				n = "2.3283064365386962890625e-10";
			}
			x = taylorSeries(Ctor, 1, x.times(n), new Ctor(1), true);
			var cosh2_x, i = k, d8 = new Ctor(8);
			for (; i--;) {
				cosh2_x = x.times(x);
				x = one.minus(cosh2_x.times(d8.minus(cosh2_x.times(d8))));
			}
			return finalise(x, Ctor.precision = pr, Ctor.rounding = rm, true);
		};
		P.hyperbolicSine = P.sinh = function() {
			var k, pr, rm, len, x = this, Ctor = x.constructor;
			if (!x.isFinite() || x.isZero()) return new Ctor(x);
			pr = Ctor.precision;
			rm = Ctor.rounding;
			Ctor.precision = pr + Math.max(x.e, x.sd()) + 4;
			Ctor.rounding = 1;
			len = x.d.length;
			if (len < 3) x = taylorSeries(Ctor, 2, x, x, true);
			else {
				k = 1.4 * Math.sqrt(len);
				k = k > 16 ? 16 : k | 0;
				x = x.times(1 / tinyPow(5, k));
				x = taylorSeries(Ctor, 2, x, x, true);
				var sinh2_x, d5 = new Ctor(5), d16 = new Ctor(16), d20 = new Ctor(20);
				for (; k--;) {
					sinh2_x = x.times(x);
					x = x.times(d5.plus(sinh2_x.times(d16.times(sinh2_x).plus(d20))));
				}
			}
			Ctor.precision = pr;
			Ctor.rounding = rm;
			return finalise(x, pr, rm, true);
		};
		P.hyperbolicTangent = P.tanh = function() {
			var pr, rm, x = this, Ctor = x.constructor;
			if (!x.isFinite()) return new Ctor(x.s);
			if (x.isZero()) return new Ctor(x);
			pr = Ctor.precision;
			rm = Ctor.rounding;
			Ctor.precision = pr + 7;
			Ctor.rounding = 1;
			return divide(x.sinh(), x.cosh(), Ctor.precision = pr, Ctor.rounding = rm);
		};
		P.inverseCosine = P.acos = function() {
			var x = this, Ctor = x.constructor, k = x.abs().cmp(1), pr = Ctor.precision, rm = Ctor.rounding;
			if (k !== -1) return k === 0 ? x.isNeg() ? getPi(Ctor, pr, rm) : new Ctor(0) : new Ctor(NaN);
			if (x.isZero()) return getPi(Ctor, pr + 4, rm).times(.5);
			Ctor.precision = pr + 6;
			Ctor.rounding = 1;
			x = new Ctor(1).minus(x).div(x.plus(1)).sqrt().atan();
			Ctor.precision = pr;
			Ctor.rounding = rm;
			return x.times(2);
		};
		P.inverseHyperbolicCosine = P.acosh = function() {
			var pr, rm, x = this, Ctor = x.constructor;
			if (x.lte(1)) return new Ctor(x.eq(1) ? 0 : NaN);
			if (!x.isFinite()) return new Ctor(x);
			pr = Ctor.precision;
			rm = Ctor.rounding;
			Ctor.precision = pr + Math.max(Math.abs(x.e), x.sd()) + 4;
			Ctor.rounding = 1;
			external = false;
			x = x.times(x).minus(1).sqrt().plus(x);
			external = true;
			Ctor.precision = pr;
			Ctor.rounding = rm;
			return x.ln();
		};
		P.inverseHyperbolicSine = P.asinh = function() {
			var pr, rm, x = this, Ctor = x.constructor;
			if (!x.isFinite() || x.isZero()) return new Ctor(x);
			pr = Ctor.precision;
			rm = Ctor.rounding;
			Ctor.precision = pr + 2 * Math.max(Math.abs(x.e), x.sd()) + 6;
			Ctor.rounding = 1;
			external = false;
			x = x.times(x).plus(1).sqrt().plus(x);
			external = true;
			Ctor.precision = pr;
			Ctor.rounding = rm;
			return x.ln();
		};
		P.inverseHyperbolicTangent = P.atanh = function() {
			var pr, rm, wpr, xsd, x = this, Ctor = x.constructor;
			if (!x.isFinite()) return new Ctor(NaN);
			if (x.e >= 0) return new Ctor(x.abs().eq(1) ? x.s / 0 : x.isZero() ? x : NaN);
			pr = Ctor.precision;
			rm = Ctor.rounding;
			xsd = x.sd();
			if (Math.max(xsd, pr) < 2 * -x.e - 1) return finalise(new Ctor(x), pr, rm, true);
			Ctor.precision = wpr = xsd - x.e;
			x = divide(x.plus(1), new Ctor(1).minus(x), wpr + pr, 1);
			Ctor.precision = pr + 4;
			Ctor.rounding = 1;
			x = x.ln();
			Ctor.precision = pr;
			Ctor.rounding = rm;
			return x.times(.5);
		};
		P.inverseSine = P.asin = function() {
			var halfPi, k, pr, rm, x = this, Ctor = x.constructor;
			if (x.isZero()) return new Ctor(x);
			k = x.abs().cmp(1);
			pr = Ctor.precision;
			rm = Ctor.rounding;
			if (k !== -1) {
				if (k === 0) {
					halfPi = getPi(Ctor, pr + 4, rm).times(.5);
					halfPi.s = x.s;
					return halfPi;
				}
				return new Ctor(NaN);
			}
			Ctor.precision = pr + 6;
			Ctor.rounding = 1;
			x = x.div(new Ctor(1).minus(x.times(x)).sqrt().plus(1)).atan();
			Ctor.precision = pr;
			Ctor.rounding = rm;
			return x.times(2);
		};
		P.inverseTangent = P.atan = function() {
			var i, j, k, n, px, t, r, wpr, x2, x = this, Ctor = x.constructor, pr = Ctor.precision, rm = Ctor.rounding;
			if (!x.isFinite()) {
				if (!x.s) return new Ctor(NaN);
				if (pr + 4 <= PI_PRECISION) {
					r = getPi(Ctor, pr + 4, rm).times(.5);
					r.s = x.s;
					return r;
				}
			} else if (x.isZero()) return new Ctor(x);
			else if (x.abs().eq(1) && pr + 4 <= PI_PRECISION) {
				r = getPi(Ctor, pr + 4, rm).times(.25);
				r.s = x.s;
				return r;
			}
			Ctor.precision = wpr = pr + 10;
			Ctor.rounding = 1;
			k = Math.min(28, wpr / LOG_BASE + 2 | 0);
			for (i = k; i; --i) x = x.div(x.times(x).plus(1).sqrt().plus(1));
			external = false;
			j = Math.ceil(wpr / LOG_BASE);
			n = 1;
			x2 = x.times(x);
			r = new Ctor(x);
			px = x;
			for (; i !== -1;) {
				px = px.times(x2);
				t = r.minus(px.div(n += 2));
				px = px.times(x2);
				r = t.plus(px.div(n += 2));
				if (r.d[j] !== void 0) for (i = j; r.d[i] === t.d[i] && i--;);
			}
			if (k) r = r.times(2 << k - 1);
			external = true;
			return finalise(r, Ctor.precision = pr, Ctor.rounding = rm, true);
		};
		P.isFinite = function() {
			return !!this.d;
		};
		P.isInteger = P.isInt = function() {
			return !!this.d && mathfloor(this.e / LOG_BASE) > this.d.length - 2;
		};
		P.isNaN = function() {
			return !this.s;
		};
		P.isNegative = P.isNeg = function() {
			return this.s < 0;
		};
		P.isPositive = P.isPos = function() {
			return this.s > 0;
		};
		P.isZero = function() {
			return !!this.d && this.d[0] === 0;
		};
		P.lessThan = P.lt = function(y) {
			return this.cmp(y) < 0;
		};
		P.lessThanOrEqualTo = P.lte = function(y) {
			return this.cmp(y) < 1;
		};
		P.logarithm = P.log = function(base) {
			var isBase10, d, denominator, k, inf, num, sd, r, arg = this, Ctor = arg.constructor, pr = Ctor.precision, rm = Ctor.rounding, guard = 5;
			if (base == null) {
				base = new Ctor(10);
				isBase10 = true;
			} else {
				base = new Ctor(base);
				d = base.d;
				if (base.s < 0 || !d || !d[0] || base.eq(1)) return new Ctor(NaN);
				isBase10 = base.eq(10);
			}
			d = arg.d;
			if (arg.s < 0 || !d || !d[0] || arg.eq(1)) return new Ctor(d && !d[0] ? -1 / 0 : arg.s != 1 ? NaN : d ? 0 : 1 / 0);
			if (isBase10) {
				if (d.length > 1) inf = true;
				else {
					for (k = d[0]; k % 10 === 0;) k /= 10;
					inf = k !== 1;
				}
			}
			external = false;
			sd = pr + guard;
			num = naturalLogarithm(arg, sd);
			denominator = isBase10 ? getLn10(Ctor, sd + 10) : naturalLogarithm(base, sd);
			r = divide(num, denominator, sd, 1);
			if (checkRoundingDigits(r.d, k = pr, rm)) do {
				sd += 10;
				num = naturalLogarithm(arg, sd);
				denominator = isBase10 ? getLn10(Ctor, sd + 10) : naturalLogarithm(base, sd);
				r = divide(num, denominator, sd, 1);
				if (!inf) {
					if (+digitsToString(r.d).slice(k + 1, k + 15) + 1 == 0x5af3107a4000) r = finalise(r, pr + 1, 0);
					break;
				}
			} while (checkRoundingDigits(r.d, k += 10, rm));
			external = true;
			return finalise(r, pr, rm);
		};
		P.minus = P.sub = function(y) {
			var d, e, i, j, k, len, pr, rm, xd, xe, xLTy, yd, x = this, Ctor = x.constructor;
			y = new Ctor(y);
			if (!x.d || !y.d) {
				if (!x.s || !y.s) y = new Ctor(NaN);
				else if (x.d) y.s = -y.s;
				else y = new Ctor(y.d || x.s !== y.s ? x : NaN);
				return y;
			}
			if (x.s != y.s) {
				y.s = -y.s;
				return x.plus(y);
			}
			xd = x.d;
			yd = y.d;
			pr = Ctor.precision;
			rm = Ctor.rounding;
			if (!xd[0] || !yd[0]) {
				if (yd[0]) y.s = -y.s;
				else if (xd[0]) y = new Ctor(x);
				else return new Ctor(rm === 3 ? -0 : 0);
				return external ? finalise(y, pr, rm) : y;
			}
			e = mathfloor(y.e / LOG_BASE);
			xe = mathfloor(x.e / LOG_BASE);
			xd = xd.slice();
			k = xe - e;
			if (k) {
				xLTy = k < 0;
				if (xLTy) {
					d = xd;
					k = -k;
					len = yd.length;
				} else {
					d = yd;
					e = xe;
					len = xd.length;
				}
				i = Math.max(Math.ceil(pr / LOG_BASE), len) + 2;
				if (k > i) {
					k = i;
					d.length = 1;
				}
				d.reverse();
				for (i = k; i--;) d.push(0);
				d.reverse();
			} else {
				i = xd.length;
				len = yd.length;
				xLTy = i < len;
				if (xLTy) len = i;
				for (i = 0; i < len; i++) if (xd[i] != yd[i]) {
					xLTy = xd[i] < yd[i];
					break;
				}
				k = 0;
			}
			if (xLTy) {
				d = xd;
				xd = yd;
				yd = d;
				y.s = -y.s;
			}
			len = xd.length;
			for (i = yd.length - len; i > 0; --i) xd[len++] = 0;
			for (i = yd.length; i > k;) {
				if (xd[--i] < yd[i]) {
					for (j = i; j && xd[--j] === 0;) xd[j] = BASE - 1;
					--xd[j];
					xd[i] += BASE;
				}
				xd[i] -= yd[i];
			}
			for (; xd[--len] === 0;) xd.pop();
			for (; xd[0] === 0; xd.shift()) --e;
			if (!xd[0]) return new Ctor(rm === 3 ? -0 : 0);
			y.d = xd;
			y.e = getBase10Exponent(xd, e);
			return external ? finalise(y, pr, rm) : y;
		};
		P.modulo = P.mod = function(y) {
			var q, x = this, Ctor = x.constructor;
			y = new Ctor(y);
			if (!x.d || !y.s || y.d && !y.d[0]) return new Ctor(NaN);
			if (!y.d || x.d && !x.d[0]) return finalise(new Ctor(x), Ctor.precision, Ctor.rounding);
			external = false;
			if (Ctor.modulo == 9) {
				q = divide(x, y.abs(), 0, 3, 1);
				q.s *= y.s;
			} else q = divide(x, y, 0, Ctor.modulo, 1);
			q = q.times(y);
			external = true;
			return x.minus(q);
		};
		P.naturalExponential = P.exp = function() {
			return naturalExponential(this);
		};
		P.naturalLogarithm = P.ln = function() {
			return naturalLogarithm(this);
		};
		P.negated = P.neg = function() {
			var x = new this.constructor(this);
			x.s = -x.s;
			return finalise(x);
		};
		P.plus = P.add = function(y) {
			var carry, d, e, i, k, len, pr, rm, xd, yd, x = this, Ctor = x.constructor;
			y = new Ctor(y);
			if (!x.d || !y.d) {
				if (!x.s || !y.s) y = new Ctor(NaN);
				else if (!x.d) y = new Ctor(y.d || x.s === y.s ? x : NaN);
				return y;
			}
			if (x.s != y.s) {
				y.s = -y.s;
				return x.minus(y);
			}
			xd = x.d;
			yd = y.d;
			pr = Ctor.precision;
			rm = Ctor.rounding;
			if (!xd[0] || !yd[0]) {
				if (!yd[0]) y = new Ctor(x);
				return external ? finalise(y, pr, rm) : y;
			}
			k = mathfloor(x.e / LOG_BASE);
			e = mathfloor(y.e / LOG_BASE);
			xd = xd.slice();
			i = k - e;
			if (i) {
				if (i < 0) {
					d = xd;
					i = -i;
					len = yd.length;
				} else {
					d = yd;
					e = k;
					len = xd.length;
				}
				k = Math.ceil(pr / LOG_BASE);
				len = k > len ? k + 1 : len + 1;
				if (i > len) {
					i = len;
					d.length = 1;
				}
				d.reverse();
				for (; i--;) d.push(0);
				d.reverse();
			}
			len = xd.length;
			i = yd.length;
			if (len - i < 0) {
				i = len;
				d = yd;
				yd = xd;
				xd = d;
			}
			for (carry = 0; i;) {
				carry = (xd[--i] = xd[i] + yd[i] + carry) / BASE | 0;
				xd[i] %= BASE;
			}
			if (carry) {
				xd.unshift(carry);
				++e;
			}
			for (len = xd.length; xd[--len] == 0;) xd.pop();
			y.d = xd;
			y.e = getBase10Exponent(xd, e);
			return external ? finalise(y, pr, rm) : y;
		};
		P.precision = P.sd = function(z) {
			var k, x = this;
			if (z !== void 0 && z !== !!z && z !== 1 && z !== 0) throw Error(invalidArgument + z);
			if (x.d) {
				k = getPrecision(x.d);
				if (z && x.e + 1 > k) k = x.e + 1;
			} else k = NaN;
			return k;
		};
		P.round = function() {
			var x = this, Ctor = x.constructor;
			return finalise(new Ctor(x), x.e + 1, Ctor.rounding);
		};
		P.sine = P.sin = function() {
			var pr, rm, x = this, Ctor = x.constructor;
			if (!x.isFinite()) return new Ctor(NaN);
			if (x.isZero()) return new Ctor(x);
			pr = Ctor.precision;
			rm = Ctor.rounding;
			Ctor.precision = pr + Math.max(x.e, x.sd()) + LOG_BASE;
			Ctor.rounding = 1;
			x = sine(Ctor, toLessThanHalfPi(Ctor, x));
			Ctor.precision = pr;
			Ctor.rounding = rm;
			return finalise(quadrant > 2 ? x.neg() : x, pr, rm, true);
		};
		P.squareRoot = P.sqrt = function() {
			var m, n, sd, r, rep, t, x = this, d = x.d, e = x.e, s = x.s, Ctor = x.constructor;
			if (s !== 1 || !d || !d[0]) return new Ctor(!s || s < 0 && (!d || d[0]) ? NaN : d ? x : 1 / 0);
			external = false;
			s = Math.sqrt(+x);
			if (s == 0 || s == 1 / 0) {
				n = digitsToString(d);
				if ((n.length + e) % 2 == 0) n += "0";
				s = Math.sqrt(n);
				e = mathfloor((e + 1) / 2) - (e < 0 || e % 2);
				if (s == 1 / 0) n = "5e" + e;
				else {
					n = s.toExponential();
					n = n.slice(0, n.indexOf("e") + 1) + e;
				}
				r = new Ctor(n);
			} else r = new Ctor(s.toString());
			sd = (e = Ctor.precision) + 3;
			for (;;) {
				t = r;
				r = t.plus(divide(x, t, sd + 2, 1)).times(.5);
				if (digitsToString(t.d).slice(0, sd) === (n = digitsToString(r.d)).slice(0, sd)) {
					n = n.slice(sd - 3, sd + 1);
					if (n == "9999" || !rep && n == "4999") {
						if (!rep) {
							finalise(t, e + 1, 0);
							if (t.times(t).eq(x)) {
								r = t;
								break;
							}
						}
						sd += 4;
						rep = 1;
					} else {
						if (!+n || !+n.slice(1) && n.charAt(0) == "5") {
							finalise(r, e + 1, 1);
							m = !r.times(r).eq(x);
						}
						break;
					}
				}
			}
			external = true;
			return finalise(r, e, Ctor.rounding, m);
		};
		P.tangent = P.tan = function() {
			var pr, rm, x = this, Ctor = x.constructor;
			if (!x.isFinite()) return new Ctor(NaN);
			if (x.isZero()) return new Ctor(x);
			pr = Ctor.precision;
			rm = Ctor.rounding;
			Ctor.precision = pr + 10;
			Ctor.rounding = 1;
			x = x.sin();
			x.s = 1;
			x = divide(x, new Ctor(1).minus(x.times(x)).sqrt(), pr + 10, 0);
			Ctor.precision = pr;
			Ctor.rounding = rm;
			return finalise(quadrant == 2 || quadrant == 4 ? x.neg() : x, pr, rm, true);
		};
		P.times = P.mul = function(y) {
			var carry, e, i, k, r, rL, t, xdL, ydL, x = this, Ctor = x.constructor, xd = x.d, yd = (y = new Ctor(y)).d;
			y.s *= x.s;
			if (!xd || !xd[0] || !yd || !yd[0]) return new Ctor(!y.s || xd && !xd[0] && !yd || yd && !yd[0] && !xd ? NaN : !xd || !yd ? y.s / 0 : y.s * 0);
			e = mathfloor(x.e / LOG_BASE) + mathfloor(y.e / LOG_BASE);
			xdL = xd.length;
			ydL = yd.length;
			if (xdL < ydL) {
				r = xd;
				xd = yd;
				yd = r;
				rL = xdL;
				xdL = ydL;
				ydL = rL;
			}
			r = [];
			rL = xdL + ydL;
			for (i = rL; i--;) r.push(0);
			for (i = ydL; --i >= 0;) {
				carry = 0;
				for (k = xdL + i; k > i;) {
					t = r[k] + yd[i] * xd[k - i - 1] + carry;
					r[k--] = t % BASE | 0;
					carry = t / BASE | 0;
				}
				r[k] = (r[k] + carry) % BASE | 0;
			}
			for (; !r[--rL];) r.pop();
			if (carry) ++e;
			else r.shift();
			y.d = r;
			y.e = getBase10Exponent(r, e);
			return external ? finalise(y, Ctor.precision, Ctor.rounding) : y;
		};
		P.toBinary = function(sd, rm) {
			return toStringBinary(this, 2, sd, rm);
		};
		P.toDecimalPlaces = P.toDP = function(dp, rm) {
			var x = this, Ctor = x.constructor;
			x = new Ctor(x);
			if (dp === void 0) return x;
			checkInt32(dp, 0, MAX_DIGITS);
			if (rm === void 0) rm = Ctor.rounding;
			else checkInt32(rm, 0, 8);
			return finalise(x, dp + x.e + 1, rm);
		};
		P.toExponential = function(dp, rm) {
			var str, x = this, Ctor = x.constructor;
			if (dp === void 0) str = finiteToString(x, true);
			else {
				checkInt32(dp, 0, MAX_DIGITS);
				if (rm === void 0) rm = Ctor.rounding;
				else checkInt32(rm, 0, 8);
				x = finalise(new Ctor(x), dp + 1, rm);
				str = finiteToString(x, true, dp + 1);
			}
			return x.isNeg() && !x.isZero() ? "-" + str : str;
		};
		P.toFixed = function(dp, rm) {
			var str, y, x = this, Ctor = x.constructor;
			if (dp === void 0) str = finiteToString(x);
			else {
				checkInt32(dp, 0, MAX_DIGITS);
				if (rm === void 0) rm = Ctor.rounding;
				else checkInt32(rm, 0, 8);
				y = finalise(new Ctor(x), dp + x.e + 1, rm);
				str = finiteToString(y, false, dp + y.e + 1);
			}
			return x.isNeg() && !x.isZero() ? "-" + str : str;
		};
		P.toFraction = function(maxD) {
			var d, d0, d1, d2, e, k, n, n0, n1, pr, q, r, x = this, xd = x.d, Ctor = x.constructor;
			if (!xd) return new Ctor(x);
			n1 = d0 = new Ctor(1);
			d1 = n0 = new Ctor(0);
			d = new Ctor(d1);
			e = d.e = getPrecision(xd) - x.e - 1;
			k = e % LOG_BASE;
			d.d[0] = mathpow(10, k < 0 ? LOG_BASE + k : k);
			if (maxD == null) maxD = e > 0 ? d : n1;
			else {
				n = new Ctor(maxD);
				if (!n.isInt() || n.lt(n1)) throw Error(invalidArgument + n);
				maxD = n.gt(d) ? e > 0 ? d : n1 : n;
			}
			external = false;
			n = new Ctor(digitsToString(xd));
			pr = Ctor.precision;
			Ctor.precision = e = xd.length * LOG_BASE * 2;
			for (;;) {
				q = divide(n, d, 0, 1, 1);
				d2 = d0.plus(q.times(d1));
				if (d2.cmp(maxD) == 1) break;
				d0 = d1;
				d1 = d2;
				d2 = n1;
				n1 = n0.plus(q.times(d2));
				n0 = d2;
				d2 = d;
				d = n.minus(q.times(d2));
				n = d2;
			}
			d2 = divide(maxD.minus(d0), d1, 0, 1, 1);
			n0 = n0.plus(d2.times(n1));
			d0 = d0.plus(d2.times(d1));
			n0.s = n1.s = x.s;
			r = divide(n1, d1, e, 1).minus(x).abs().cmp(divide(n0, d0, e, 1).minus(x).abs()) < 1 ? [n1, d1] : [n0, d0];
			Ctor.precision = pr;
			external = true;
			return r;
		};
		P.toHexadecimal = P.toHex = function(sd, rm) {
			return toStringBinary(this, 16, sd, rm);
		};
		P.toNearest = function(y, rm) {
			var x = this, Ctor = x.constructor;
			x = new Ctor(x);
			if (y == null) {
				if (!x.d) return x;
				y = new Ctor(1);
				rm = Ctor.rounding;
			} else {
				y = new Ctor(y);
				if (rm === void 0) rm = Ctor.rounding;
				else checkInt32(rm, 0, 8);
				if (!x.d) return y.s ? x : y;
				if (!y.d) {
					if (y.s) y.s = x.s;
					return y;
				}
			}
			if (y.d[0]) {
				external = false;
				x = divide(x, y, 0, rm, 1).times(y);
				external = true;
				finalise(x);
			} else {
				y.s = x.s;
				x = y;
			}
			return x;
		};
		P.toNumber = function() {
			return +this;
		};
		P.toOctal = function(sd, rm) {
			return toStringBinary(this, 8, sd, rm);
		};
		P.toPower = P.pow = function(y) {
			var e, k, pr, r, rm, s, x = this, Ctor = x.constructor, yn = +(y = new Ctor(y));
			if (!x.d || !y.d || !x.d[0] || !y.d[0]) return new Ctor(mathpow(+x, yn));
			x = new Ctor(x);
			if (x.eq(1)) return x;
			pr = Ctor.precision;
			rm = Ctor.rounding;
			if (y.eq(1)) return finalise(x, pr, rm);
			e = mathfloor(y.e / LOG_BASE);
			if (e >= y.d.length - 1 && (k = yn < 0 ? -yn : yn) <= MAX_SAFE_INTEGER) {
				r = intPow(Ctor, x, k, pr);
				return y.s < 0 ? new Ctor(1).div(r) : finalise(r, pr, rm);
			}
			s = x.s;
			if (s < 0) {
				if (e < y.d.length - 1) return new Ctor(NaN);
				if ((y.d[e] & 1) == 0) s = 1;
				if (x.e == 0 && x.d[0] == 1 && x.d.length == 1) {
					x.s = s;
					return x;
				}
			}
			k = mathpow(+x, yn);
			e = k == 0 || !isFinite(k) ? mathfloor(yn * (Math.log("0." + digitsToString(x.d)) / Math.LN10 + x.e + 1)) : new Ctor(k + "").e;
			if (e > Ctor.maxE + 1 || e < Ctor.minE - 1) return new Ctor(e > 0 ? s / 0 : 0);
			external = false;
			Ctor.rounding = x.s = 1;
			k = Math.min(12, (e + "").length);
			r = naturalExponential(y.times(naturalLogarithm(x, pr + k)), pr);
			if (r.d) {
				r = finalise(r, pr + 5, 1);
				if (checkRoundingDigits(r.d, pr, rm)) {
					e = pr + 10;
					r = finalise(naturalExponential(y.times(naturalLogarithm(x, e + k)), e), e + 5, 1);
					if (+digitsToString(r.d).slice(pr + 1, pr + 15) + 1 == 0x5af3107a4000) r = finalise(r, pr + 1, 0);
				}
			}
			r.s = s;
			external = true;
			Ctor.rounding = rm;
			return finalise(r, pr, rm);
		};
		P.toPrecision = function(sd, rm) {
			var str, x = this, Ctor = x.constructor;
			if (sd === void 0) str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
			else {
				checkInt32(sd, 1, MAX_DIGITS);
				if (rm === void 0) rm = Ctor.rounding;
				else checkInt32(rm, 0, 8);
				x = finalise(new Ctor(x), sd, rm);
				str = finiteToString(x, sd <= x.e || x.e <= Ctor.toExpNeg, sd);
			}
			return x.isNeg() && !x.isZero() ? "-" + str : str;
		};
		P.toSignificantDigits = P.toSD = function(sd, rm) {
			var x = this, Ctor = x.constructor;
			if (sd === void 0) {
				sd = Ctor.precision;
				rm = Ctor.rounding;
			} else {
				checkInt32(sd, 1, MAX_DIGITS);
				if (rm === void 0) rm = Ctor.rounding;
				else checkInt32(rm, 0, 8);
			}
			return finalise(new Ctor(x), sd, rm);
		};
		P.toString = function() {
			var x = this, Ctor = x.constructor, str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
			return x.isNeg() && !x.isZero() ? "-" + str : str;
		};
		P.truncated = P.trunc = function() {
			return finalise(new this.constructor(this), this.e + 1, 1);
		};
		P.valueOf = P.toJSON = function() {
			var x = this, Ctor = x.constructor, str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
			return x.isNeg() ? "-" + str : str;
		};
		function digitsToString(d) {
			var i, k, ws, indexOfLastWord = d.length - 1, str = "", w = d[0];
			if (indexOfLastWord > 0) {
				str += w;
				for (i = 1; i < indexOfLastWord; i++) {
					ws = d[i] + "";
					k = LOG_BASE - ws.length;
					if (k) str += getZeroString(k);
					str += ws;
				}
				w = d[i];
				ws = w + "";
				k = LOG_BASE - ws.length;
				if (k) str += getZeroString(k);
			} else if (w === 0) return "0";
			for (; w % 10 === 0;) w /= 10;
			return str + w;
		}
		function checkInt32(i, min, max) {
			if (i !== ~~i || i < min || i > max) throw Error(invalidArgument + i);
		}
		function checkRoundingDigits(d, i, rm, repeating) {
			var di, k = d[0], r, rd;
			for (; k >= 10; k /= 10) --i;
			if (--i < 0) {
				i += LOG_BASE;
				di = 0;
			} else {
				di = Math.ceil((i + 1) / LOG_BASE);
				i %= LOG_BASE;
			}
			k = mathpow(10, LOG_BASE - i);
			rd = d[di] % k | 0;
			if (repeating == null) {
				if (i < 3) {
					if (i == 0) rd = rd / 100 | 0;
					else if (i == 1) rd = rd / 10 | 0;
					r = rm < 4 && rd == 99999 || rm > 3 && rd == 49999 || rd == 5e4 || rd == 0;
				} else r = (rm < 4 && rd + 1 == k || rm > 3 && rd + 1 == k / 2) && (d[di + 1] / k / 100 | 0) == mathpow(10, i - 2) - 1 || (rd == k / 2 || rd == 0) && (d[di + 1] / k / 100 | 0) == 0;
			} else if (i < 4) {
				if (i == 0) rd = rd / 1e3 | 0;
				else if (i == 1) rd = rd / 100 | 0;
				else if (i == 2) rd = rd / 10 | 0;
				r = (repeating || rm < 4) && rd == 9999 || !repeating && rm > 3 && rd == 4999;
			} else r = ((repeating || rm < 4) && rd + 1 == k || !repeating && rm > 3 && rd + 1 == k / 2) && (d[di + 1] / k / 1e3 | 0) == mathpow(10, i - 3) - 1;
			return r;
		}
		function convertBase(str, baseIn, baseOut) {
			var j, arr = [0], arrL, i = 0, strL = str.length;
			for (; i < strL;) {
				for (arrL = arr.length; arrL--;) arr[arrL] *= baseIn;
				arr[0] += NUMERALS.indexOf(str.charAt(i++));
				for (j = 0; j < arr.length; j++) if (arr[j] > baseOut - 1) {
					if (arr[j + 1] === void 0) arr[j + 1] = 0;
					arr[j + 1] += arr[j] / baseOut | 0;
					arr[j] %= baseOut;
				}
			}
			return arr.reverse();
		}
		function cosine(Ctor, x) {
			var k, len, y;
			if (x.isZero()) return x;
			len = x.d.length;
			if (len < 32) {
				k = Math.ceil(len / 3);
				y = (1 / tinyPow(4, k)).toString();
			} else {
				k = 16;
				y = "2.3283064365386962890625e-10";
			}
			Ctor.precision += k;
			x = taylorSeries(Ctor, 1, x.times(y), new Ctor(1));
			for (var i = k; i--;) {
				var cos2x = x.times(x);
				x = cos2x.times(cos2x).minus(cos2x).times(8).plus(1);
			}
			Ctor.precision -= k;
			return x;
		}
		var divide = (function() {
			function multiplyInteger(x, k, base) {
				var temp, carry = 0, i = x.length;
				for (x = x.slice(); i--;) {
					temp = x[i] * k + carry;
					x[i] = temp % base | 0;
					carry = temp / base | 0;
				}
				if (carry) x.unshift(carry);
				return x;
			}
			function compare(a, b, aL, bL) {
				var i, r;
				if (aL != bL) r = aL > bL ? 1 : -1;
				else for (i = r = 0; i < aL; i++) if (a[i] != b[i]) {
					r = a[i] > b[i] ? 1 : -1;
					break;
				}
				return r;
			}
			function subtract(a, b, aL, base) {
				var i = 0;
				for (; aL--;) {
					a[aL] -= i;
					i = a[aL] < b[aL] ? 1 : 0;
					a[aL] = i * base + a[aL] - b[aL];
				}
				for (; !a[0] && a.length > 1;) a.shift();
			}
			return function(x, y, pr, rm, dp, base) {
				var cmp, e, i, k, logBase, more, prod, prodL, q, qd, rem, remL, rem0, sd, t, xi, xL, yd0, yL, yz, Ctor = x.constructor, sign = x.s == y.s ? 1 : -1, xd = x.d, yd = y.d;
				if (!xd || !xd[0] || !yd || !yd[0]) return new Ctor(!x.s || !y.s || (xd ? yd && xd[0] == yd[0] : !yd) ? NaN : xd && xd[0] == 0 || !yd ? sign * 0 : sign / 0);
				if (base) {
					logBase = 1;
					e = x.e - y.e;
				} else {
					base = BASE;
					logBase = LOG_BASE;
					e = mathfloor(x.e / logBase) - mathfloor(y.e / logBase);
				}
				yL = yd.length;
				xL = xd.length;
				q = new Ctor(sign);
				qd = q.d = [];
				for (i = 0; yd[i] == (xd[i] || 0); i++);
				if (yd[i] > (xd[i] || 0)) e--;
				if (pr == null) {
					sd = pr = Ctor.precision;
					rm = Ctor.rounding;
				} else if (dp) sd = pr + (x.e - y.e) + 1;
				else sd = pr;
				if (sd < 0) {
					qd.push(1);
					more = true;
				} else {
					sd = sd / logBase + 2 | 0;
					i = 0;
					if (yL == 1) {
						k = 0;
						yd = yd[0];
						sd++;
						for (; (i < xL || k) && sd--; i++) {
							t = k * base + (xd[i] || 0);
							qd[i] = t / yd | 0;
							k = t % yd | 0;
						}
						more = k || i < xL;
					} else {
						k = base / (yd[0] + 1) | 0;
						if (k > 1) {
							yd = multiplyInteger(yd, k, base);
							xd = multiplyInteger(xd, k, base);
							yL = yd.length;
							xL = xd.length;
						}
						xi = yL;
						rem = xd.slice(0, yL);
						remL = rem.length;
						for (; remL < yL;) rem[remL++] = 0;
						yz = yd.slice();
						yz.unshift(0);
						yd0 = yd[0];
						if (yd[1] >= base / 2) ++yd0;
						do {
							k = 0;
							cmp = compare(yd, rem, yL, remL);
							if (cmp < 0) {
								rem0 = rem[0];
								if (yL != remL) rem0 = rem0 * base + (rem[1] || 0);
								k = rem0 / yd0 | 0;
								if (k > 1) {
									if (k >= base) k = base - 1;
									prod = multiplyInteger(yd, k, base);
									prodL = prod.length;
									remL = rem.length;
									cmp = compare(prod, rem, prodL, remL);
									if (cmp == 1) {
										k--;
										subtract(prod, yL < prodL ? yz : yd, prodL, base);
									}
								} else {
									if (k == 0) cmp = k = 1;
									prod = yd.slice();
								}
								prodL = prod.length;
								if (prodL < remL) prod.unshift(0);
								subtract(rem, prod, remL, base);
								if (cmp == -1) {
									remL = rem.length;
									cmp = compare(yd, rem, yL, remL);
									if (cmp < 1) {
										k++;
										subtract(rem, yL < remL ? yz : yd, remL, base);
									}
								}
								remL = rem.length;
							} else if (cmp === 0) {
								k++;
								rem = [0];
							}
							qd[i++] = k;
							if (cmp && rem[0]) rem[remL++] = xd[xi] || 0;
							else {
								rem = [xd[xi]];
								remL = 1;
							}
						} while ((xi++ < xL || rem[0] !== void 0) && sd--);
						more = rem[0] !== void 0;
					}
					if (!qd[0]) qd.shift();
				}
				if (logBase == 1) {
					q.e = e;
					inexact = more;
				} else {
					for (i = 1, k = qd[0]; k >= 10; k /= 10) i++;
					q.e = i + e * logBase - 1;
					finalise(q, dp ? pr + q.e + 1 : pr, rm, more);
				}
				return q;
			};
		})();
		function finalise(x, sd, rm, isTruncated) {
			var digits, i, j, k, rd, roundUp, w, xd, xdi, Ctor = x.constructor;
			out: if (sd != null) {
				xd = x.d;
				if (!xd) return x;
				for (digits = 1, k = xd[0]; k >= 10; k /= 10) digits++;
				i = sd - digits;
				if (i < 0) {
					i += LOG_BASE;
					j = sd;
					w = xd[xdi = 0];
					rd = w / mathpow(10, digits - j - 1) % 10 | 0;
				} else {
					xdi = Math.ceil((i + 1) / LOG_BASE);
					k = xd.length;
					if (xdi >= k) {
						if (isTruncated) {
							for (; k++ <= xdi;) xd.push(0);
							w = rd = 0;
							digits = 1;
							i %= LOG_BASE;
							j = i - LOG_BASE + 1;
						} else break out;
					} else {
						w = k = xd[xdi];
						for (digits = 1; k >= 10; k /= 10) digits++;
						i %= LOG_BASE;
						j = i - LOG_BASE + digits;
						rd = j < 0 ? 0 : w / mathpow(10, digits - j - 1) % 10 | 0;
					}
				}
				isTruncated = isTruncated || sd < 0 || xd[xdi + 1] !== void 0 || (j < 0 ? w : w % mathpow(10, digits - j - 1));
				roundUp = rm < 4 ? (rd || isTruncated) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : rd > 5 || rd == 5 && (rm == 4 || isTruncated || rm == 6 && (i > 0 ? j > 0 ? w / mathpow(10, digits - j) : 0 : xd[xdi - 1]) % 10 & 1 || rm == (x.s < 0 ? 8 : 7));
				if (sd < 1 || !xd[0]) {
					xd.length = 0;
					if (roundUp) {
						sd -= x.e + 1;
						xd[0] = mathpow(10, (LOG_BASE - sd % LOG_BASE) % LOG_BASE);
						x.e = -sd || 0;
					} else xd[0] = x.e = 0;
					return x;
				}
				if (i == 0) {
					xd.length = xdi;
					k = 1;
					xdi--;
				} else {
					xd.length = xdi + 1;
					k = mathpow(10, LOG_BASE - i);
					xd[xdi] = j > 0 ? (w / mathpow(10, digits - j) % mathpow(10, j) | 0) * k : 0;
				}
				if (roundUp) for (;;) if (xdi == 0) {
					for (i = 1, j = xd[0]; j >= 10; j /= 10) i++;
					j = xd[0] += k;
					for (k = 1; j >= 10; j /= 10) k++;
					if (i != k) {
						x.e++;
						if (xd[0] == BASE) xd[0] = 1;
					}
					break;
				} else {
					xd[xdi] += k;
					if (xd[xdi] != BASE) break;
					xd[xdi--] = 0;
					k = 1;
				}
				for (i = xd.length; xd[--i] === 0;) xd.pop();
			}
			if (external) {
				if (x.e > Ctor.maxE) {
					x.d = null;
					x.e = NaN;
				} else if (x.e < Ctor.minE) {
					x.e = 0;
					x.d = [0];
				}
			}
			return x;
		}
		function finiteToString(x, isExp, sd) {
			if (!x.isFinite()) return nonFiniteToString(x);
			var k, e = x.e, str = digitsToString(x.d), len = str.length;
			if (isExp) {
				if (sd && (k = sd - len) > 0) str = str.charAt(0) + "." + str.slice(1) + getZeroString(k);
				else if (len > 1) str = str.charAt(0) + "." + str.slice(1);
				str = str + (x.e < 0 ? "e" : "e+") + x.e;
			} else if (e < 0) {
				str = "0." + getZeroString(-e - 1) + str;
				if (sd && (k = sd - len) > 0) str += getZeroString(k);
			} else if (e >= len) {
				str += getZeroString(e + 1 - len);
				if (sd && (k = sd - e - 1) > 0) str = str + "." + getZeroString(k);
			} else {
				if ((k = e + 1) < len) str = str.slice(0, k) + "." + str.slice(k);
				if (sd && (k = sd - len) > 0) {
					if (e + 1 === len) str += ".";
					str += getZeroString(k);
				}
			}
			return str;
		}
		function getBase10Exponent(digits, e) {
			var w = digits[0];
			for (e *= LOG_BASE; w >= 10; w /= 10) e++;
			return e;
		}
		function getLn10(Ctor, sd, pr) {
			if (sd > LN10_PRECISION) {
				external = true;
				if (pr) Ctor.precision = pr;
				throw Error(precisionLimitExceeded);
			}
			return finalise(new Ctor(LN10), sd, 1, true);
		}
		function getPi(Ctor, sd, rm) {
			if (sd > PI_PRECISION) throw Error(precisionLimitExceeded);
			return finalise(new Ctor(PI), sd, rm, true);
		}
		function getPrecision(digits) {
			var w = digits.length - 1, len = w * LOG_BASE + 1;
			w = digits[w];
			if (w) {
				for (; w % 10 == 0; w /= 10) len--;
				for (w = digits[0]; w >= 10; w /= 10) len++;
			}
			return len;
		}
		function getZeroString(k) {
			var zs = "";
			for (; k--;) zs += "0";
			return zs;
		}
		function intPow(Ctor, x, n, pr) {
			var isTruncated, r = new Ctor(1), k = Math.ceil(pr / LOG_BASE + 4);
			external = false;
			for (;;) {
				if (n % 2) {
					r = r.times(x);
					if (truncate(r.d, k)) isTruncated = true;
				}
				n = mathfloor(n / 2);
				if (n === 0) {
					n = r.d.length - 1;
					if (isTruncated && r.d[n] === 0) ++r.d[n];
					break;
				}
				x = x.times(x);
				truncate(x.d, k);
			}
			external = true;
			return r;
		}
		function isOdd(n) {
			return n.d[n.d.length - 1] & 1;
		}
		function maxOrMin(Ctor, args, n) {
			var k, y, x = new Ctor(args[0]), i = 0;
			for (; ++i < args.length;) {
				y = new Ctor(args[i]);
				if (!y.s) {
					x = y;
					break;
				}
				k = x.cmp(y);
				if (k === n || k === 0 && x.s === n) x = y;
			}
			return x;
		}
		function naturalExponential(x, sd) {
			var denominator, guard, j, pow, sum, t, wpr, rep = 0, i = 0, k = 0, Ctor = x.constructor, rm = Ctor.rounding, pr = Ctor.precision;
			if (!x.d || !x.d[0] || x.e > 17) return new Ctor(x.d ? !x.d[0] ? 1 : x.s < 0 ? 0 : 1 / 0 : x.s ? x.s < 0 ? 0 : x : NaN);
			if (sd == null) {
				external = false;
				wpr = pr;
			} else wpr = sd;
			t = new Ctor(.03125);
			while (x.e > -2) {
				x = x.times(t);
				k += 5;
			}
			guard = Math.log(mathpow(2, k)) / Math.LN10 * 2 + 5 | 0;
			wpr += guard;
			denominator = pow = sum = new Ctor(1);
			Ctor.precision = wpr;
			for (;;) {
				pow = finalise(pow.times(x), wpr, 1);
				denominator = denominator.times(++i);
				t = sum.plus(divide(pow, denominator, wpr, 1));
				if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum.d).slice(0, wpr)) {
					j = k;
					while (j--) sum = finalise(sum.times(sum), wpr, 1);
					if (sd == null) {
						if (rep < 3 && checkRoundingDigits(sum.d, wpr - guard, rm, rep)) {
							Ctor.precision = wpr += 10;
							denominator = pow = t = new Ctor(1);
							i = 0;
							rep++;
						} else return finalise(sum, Ctor.precision = pr, rm, external = true);
					} else {
						Ctor.precision = pr;
						return sum;
					}
				}
				sum = t;
			}
		}
		function naturalLogarithm(y, sd) {
			var c, c0, denominator, e, numerator, rep, sum, t, wpr, x1, x2, n = 1, guard = 10, x = y, xd = x.d, Ctor = x.constructor, rm = Ctor.rounding, pr = Ctor.precision;
			if (x.s < 0 || !xd || !xd[0] || !x.e && xd[0] == 1 && xd.length == 1) return new Ctor(xd && !xd[0] ? -1 / 0 : x.s != 1 ? NaN : xd ? 0 : x);
			if (sd == null) {
				external = false;
				wpr = pr;
			} else wpr = sd;
			Ctor.precision = wpr += guard;
			c = digitsToString(xd);
			c0 = c.charAt(0);
			if (Math.abs(e = x.e) < 0x5543df729c000) {
				while (c0 < 7 && c0 != 1 || c0 == 1 && c.charAt(1) > 3) {
					x = x.times(y);
					c = digitsToString(x.d);
					c0 = c.charAt(0);
					n++;
				}
				e = x.e;
				if (c0 > 1) {
					x = new Ctor("0." + c);
					e++;
				} else x = new Ctor(c0 + "." + c.slice(1));
			} else {
				t = getLn10(Ctor, wpr + 2, pr).times(e + "");
				x = naturalLogarithm(new Ctor(c0 + "." + c.slice(1)), wpr - guard).plus(t);
				Ctor.precision = pr;
				return sd == null ? finalise(x, pr, rm, external = true) : x;
			}
			x1 = x;
			sum = numerator = x = divide(x.minus(1), x.plus(1), wpr, 1);
			x2 = finalise(x.times(x), wpr, 1);
			denominator = 3;
			for (;;) {
				numerator = finalise(numerator.times(x2), wpr, 1);
				t = sum.plus(divide(numerator, new Ctor(denominator), wpr, 1));
				if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum.d).slice(0, wpr)) {
					sum = sum.times(2);
					if (e !== 0) sum = sum.plus(getLn10(Ctor, wpr + 2, pr).times(e + ""));
					sum = divide(sum, new Ctor(n), wpr, 1);
					if (sd == null) {
						if (checkRoundingDigits(sum.d, wpr - guard, rm, rep)) {
							Ctor.precision = wpr += guard;
							t = numerator = x = divide(x1.minus(1), x1.plus(1), wpr, 1);
							x2 = finalise(x.times(x), wpr, 1);
							denominator = rep = 1;
						} else return finalise(sum, Ctor.precision = pr, rm, external = true);
					} else {
						Ctor.precision = pr;
						return sum;
					}
				}
				sum = t;
				denominator += 2;
			}
		}
		function nonFiniteToString(x) {
			return String(x.s * x.s / 0);
		}
		function parseDecimal(x, str) {
			var e, i, len;
			if ((e = str.indexOf(".")) > -1) str = str.replace(".", "");
			if ((i = str.search(/e/i)) > 0) {
				if (e < 0) e = i;
				e += +str.slice(i + 1);
				str = str.substring(0, i);
			} else if (e < 0) e = str.length;
			for (i = 0; str.charCodeAt(i) === 48; i++);
			for (len = str.length; str.charCodeAt(len - 1) === 48; --len);
			str = str.slice(i, len);
			if (str) {
				len -= i;
				x.e = e = e - i - 1;
				x.d = [];
				i = (e + 1) % LOG_BASE;
				if (e < 0) i += LOG_BASE;
				if (i < len) {
					if (i) x.d.push(+str.slice(0, i));
					for (len -= LOG_BASE; i < len;) x.d.push(+str.slice(i, i += LOG_BASE));
					str = str.slice(i);
					i = LOG_BASE - str.length;
				} else i -= len;
				for (; i--;) str += "0";
				x.d.push(+str);
				if (external) {
					if (x.e > x.constructor.maxE) {
						x.d = null;
						x.e = NaN;
					} else if (x.e < x.constructor.minE) {
						x.e = 0;
						x.d = [0];
					}
				}
			} else {
				x.e = 0;
				x.d = [0];
			}
			return x;
		}
		function parseOther(x, str) {
			var base, Ctor, divisor, i, isFloat, len, p, xd, xe;
			if (str.indexOf("_") > -1) {
				str = str.replace(/(\d)_(?=\d)/g, "$1");
				if (isDecimal.test(str)) return parseDecimal(x, str);
			} else if (str === "Infinity" || str === "NaN") {
				if (!+str) x.s = NaN;
				x.e = NaN;
				x.d = null;
				return x;
			}
			if (isHex.test(str)) {
				base = 16;
				str = str.toLowerCase();
			} else if (isBinary.test(str)) base = 2;
			else if (isOctal.test(str)) base = 8;
			else throw Error(invalidArgument + str);
			i = str.search(/p/i);
			if (i > 0) {
				p = +str.slice(i + 1);
				str = str.substring(2, i);
			} else str = str.slice(2);
			i = str.indexOf(".");
			isFloat = i >= 0;
			Ctor = x.constructor;
			if (isFloat) {
				str = str.replace(".", "");
				len = str.length;
				i = len - i;
				divisor = intPow(Ctor, new Ctor(base), i, i * 2);
			}
			xd = convertBase(str, base, BASE);
			xe = xd.length - 1;
			for (i = xe; xd[i] === 0; --i) xd.pop();
			if (i < 0) return new Ctor(x.s * 0);
			x.e = getBase10Exponent(xd, xe);
			x.d = xd;
			external = false;
			if (isFloat) x = divide(x, divisor, len * 4);
			if (p) x = x.times(Math.abs(p) < 54 ? mathpow(2, p) : Decimal.pow(2, p));
			external = true;
			return x;
		}
		function sine(Ctor, x) {
			var k, len = x.d.length;
			if (len < 3) return x.isZero() ? x : taylorSeries(Ctor, 2, x, x);
			k = 1.4 * Math.sqrt(len);
			k = k > 16 ? 16 : k | 0;
			x = x.times(1 / tinyPow(5, k));
			x = taylorSeries(Ctor, 2, x, x);
			var sin2_x, d5 = new Ctor(5), d16 = new Ctor(16), d20 = new Ctor(20);
			for (; k--;) {
				sin2_x = x.times(x);
				x = x.times(d5.plus(sin2_x.times(d16.times(sin2_x).minus(d20))));
			}
			return x;
		}
		function taylorSeries(Ctor, n, x, y, isHyperbolic) {
			var j, t, u, x2, i = 1, pr = Ctor.precision, k = Math.ceil(pr / LOG_BASE);
			external = false;
			x2 = x.times(x);
			u = new Ctor(y);
			for (;;) {
				t = divide(u.times(x2), new Ctor(n++ * n++), pr, 1);
				u = isHyperbolic ? y.plus(t) : y.minus(t);
				y = divide(t.times(x2), new Ctor(n++ * n++), pr, 1);
				t = u.plus(y);
				if (t.d[k] !== void 0) {
					for (j = k; t.d[j] === u.d[j] && j--;);
					if (j == -1) break;
				}
				j = u;
				u = y;
				y = t;
				t = j;
				i++;
			}
			external = true;
			t.d.length = k + 1;
			return t;
		}
		function tinyPow(b, e) {
			var n = b;
			while (--e) n *= b;
			return n;
		}
		function toLessThanHalfPi(Ctor, x) {
			var t, isNeg = x.s < 0, pi = getPi(Ctor, Ctor.precision, 1), halfPi = pi.times(.5);
			x = x.abs();
			if (x.lte(halfPi)) {
				quadrant = isNeg ? 4 : 1;
				return x;
			}
			t = x.divToInt(pi);
			if (t.isZero()) quadrant = isNeg ? 3 : 2;
			else {
				x = x.minus(t.times(pi));
				if (x.lte(halfPi)) {
					quadrant = isOdd(t) ? isNeg ? 2 : 3 : isNeg ? 4 : 1;
					return x;
				}
				quadrant = isOdd(t) ? isNeg ? 1 : 4 : isNeg ? 3 : 2;
			}
			return x.minus(pi).abs();
		}
		function toStringBinary(x, baseOut, sd, rm) {
			var base, e, i, k, len, roundUp, str, xd, y, Ctor = x.constructor, isExp = sd !== void 0;
			if (isExp) {
				checkInt32(sd, 1, MAX_DIGITS);
				if (rm === void 0) rm = Ctor.rounding;
				else checkInt32(rm, 0, 8);
			} else {
				sd = Ctor.precision;
				rm = Ctor.rounding;
			}
			if (!x.isFinite()) str = nonFiniteToString(x);
			else {
				str = finiteToString(x);
				i = str.indexOf(".");
				if (isExp) {
					base = 2;
					if (baseOut == 16) sd = sd * 4 - 3;
					else if (baseOut == 8) sd = sd * 3 - 2;
				} else base = baseOut;
				if (i >= 0) {
					str = str.replace(".", "");
					y = new Ctor(1);
					y.e = str.length - i;
					y.d = convertBase(finiteToString(y), 10, base);
					y.e = y.d.length;
				}
				xd = convertBase(str, 10, base);
				e = len = xd.length;
				for (; xd[--len] == 0;) xd.pop();
				if (!xd[0]) str = isExp ? "0p+0" : "0";
				else {
					if (i < 0) e--;
					else {
						x = new Ctor(x);
						x.d = xd;
						x.e = e;
						x = divide(x, y, sd, rm, 0, base);
						xd = x.d;
						e = x.e;
						roundUp = inexact;
					}
					i = xd[sd];
					k = base / 2;
					roundUp = roundUp || xd[sd + 1] !== void 0;
					roundUp = rm < 4 ? (i !== void 0 || roundUp) && (rm === 0 || rm === (x.s < 0 ? 3 : 2)) : i > k || i === k && (rm === 4 || roundUp || rm === 6 && xd[sd - 1] & 1 || rm === (x.s < 0 ? 8 : 7));
					xd.length = sd;
					if (roundUp) for (; ++xd[--sd] > base - 1;) {
						xd[sd] = 0;
						if (!sd) {
							++e;
							xd.unshift(1);
						}
					}
					for (len = xd.length; !xd[len - 1]; --len);
					for (i = 0, str = ""; i < len; i++) str += NUMERALS.charAt(xd[i]);
					if (isExp) {
						if (len > 1) {
							if (baseOut == 16 || baseOut == 8) {
								i = baseOut == 16 ? 4 : 3;
								for (--len; len % i; len++) str += "0";
								xd = convertBase(str, base, baseOut);
								for (len = xd.length; !xd[len - 1]; --len);
								for (i = 1, str = "1."; i < len; i++) str += NUMERALS.charAt(xd[i]);
							} else str = str.charAt(0) + "." + str.slice(1);
						}
						str = str + (e < 0 ? "p" : "p+") + e;
					} else if (e < 0) {
						for (; ++e;) str = "0" + str;
						str = "0." + str;
					} else if (++e > len) for (e -= len; e--;) str += "0";
					else if (e < len) str = str.slice(0, e) + "." + str.slice(e);
				}
				str = (baseOut == 16 ? "0x" : baseOut == 2 ? "0b" : baseOut == 8 ? "0o" : "") + str;
			}
			return x.s < 0 ? "-" + str : str;
		}
		function truncate(arr, len) {
			if (arr.length > len) {
				arr.length = len;
				return true;
			}
		}
		function abs(x) {
			return new this(x).abs();
		}
		function acos(x) {
			return new this(x).acos();
		}
		function acosh(x) {
			return new this(x).acosh();
		}
		function add(x, y) {
			return new this(x).plus(y);
		}
		function asin(x) {
			return new this(x).asin();
		}
		function asinh(x) {
			return new this(x).asinh();
		}
		function atan(x) {
			return new this(x).atan();
		}
		function atanh(x) {
			return new this(x).atanh();
		}
		function atan2(y, x) {
			y = new this(y);
			x = new this(x);
			var r, pr = this.precision, rm = this.rounding, wpr = pr + 4;
			if (!y.s || !x.s) r = new this(NaN);
			else if (!y.d && !x.d) {
				r = getPi(this, wpr, 1).times(x.s > 0 ? .25 : .75);
				r.s = y.s;
			} else if (!x.d || y.isZero()) {
				r = x.s < 0 ? getPi(this, pr, rm) : new this(0);
				r.s = y.s;
			} else if (!y.d || x.isZero()) {
				r = getPi(this, wpr, 1).times(.5);
				r.s = y.s;
			} else if (x.s < 0) {
				this.precision = wpr;
				this.rounding = 1;
				r = this.atan(divide(y, x, wpr, 1));
				x = getPi(this, wpr, 1);
				this.precision = pr;
				this.rounding = rm;
				r = y.s < 0 ? r.minus(x) : r.plus(x);
			} else r = this.atan(divide(y, x, wpr, 1));
			return r;
		}
		function cbrt(x) {
			return new this(x).cbrt();
		}
		function ceil(x) {
			return finalise(x = new this(x), x.e + 1, 2);
		}
		function clamp(x, min, max) {
			return new this(x).clamp(min, max);
		}
		function config$1(obj) {
			if (!obj || typeof obj !== "object") throw Error(decimalError + "Object expected");
			var i, p, v, useDefaults = obj.defaults === true, ps = [
				"precision",
				1,
				MAX_DIGITS,
				"rounding",
				0,
				8,
				"toExpNeg",
				-EXP_LIMIT,
				0,
				"toExpPos",
				0,
				EXP_LIMIT,
				"maxE",
				0,
				EXP_LIMIT,
				"minE",
				-EXP_LIMIT,
				0,
				"modulo",
				0,
				9
			];
			for (i = 0; i < ps.length; i += 3) {
				if (p = ps[i], useDefaults) this[p] = DEFAULTS[p];
				if ((v = obj[p]) !== void 0) {
					if (mathfloor(v) === v && v >= ps[i + 1] && v <= ps[i + 2]) this[p] = v;
					else throw Error(invalidArgument + p + ": " + v);
				}
			}
			if (p = "crypto", useDefaults) this[p] = DEFAULTS[p];
			if ((v = obj[p]) !== void 0) {
				if (v === true || v === false || v === 0 || v === 1) {
					if (v) {
						if (typeof crypto != "undefined" && crypto && (crypto.getRandomValues || crypto.randomBytes)) this[p] = true;
						else throw Error(cryptoUnavailable);
					} else this[p] = false;
				} else throw Error(invalidArgument + p + ": " + v);
			}
			return this;
		}
		function cos(x) {
			return new this(x).cos();
		}
		function cosh(x) {
			return new this(x).cosh();
		}
		function clone$1(obj) {
			var i, p, ps;
			function Decimal(v) {
				var e, i, t, x = this;
				if (!(x instanceof Decimal)) return new Decimal(v);
				x.constructor = Decimal;
				if (isDecimalInstance(v)) {
					x.s = v.s;
					if (external) {
						if (!v.d || v.e > Decimal.maxE) {
							x.e = NaN;
							x.d = null;
						} else if (v.e < Decimal.minE) {
							x.e = 0;
							x.d = [0];
						} else {
							x.e = v.e;
							x.d = v.d.slice();
						}
					} else {
						x.e = v.e;
						x.d = v.d ? v.d.slice() : v.d;
					}
					return;
				}
				t = typeof v;
				if (t === "number") {
					if (v === 0) {
						x.s = 1 / v < 0 ? -1 : 1;
						x.e = 0;
						x.d = [0];
						return;
					}
					if (v < 0) {
						v = -v;
						x.s = -1;
					} else x.s = 1;
					if (v === ~~v && v < 1e7) {
						for (e = 0, i = v; i >= 10; i /= 10) e++;
						if (external) {
							if (e > Decimal.maxE) {
								x.e = NaN;
								x.d = null;
							} else if (e < Decimal.minE) {
								x.e = 0;
								x.d = [0];
							} else {
								x.e = e;
								x.d = [v];
							}
						} else {
							x.e = e;
							x.d = [v];
						}
						return;
					}
					if (v * 0 !== 0) {
						if (!v) x.s = NaN;
						x.e = NaN;
						x.d = null;
						return;
					}
					return parseDecimal(x, v.toString());
				}
				if (t === "string") {
					if ((i = v.charCodeAt(0)) === 45) {
						v = v.slice(1);
						x.s = -1;
					} else {
						if (i === 43) v = v.slice(1);
						x.s = 1;
					}
					return isDecimal.test(v) ? parseDecimal(x, v) : parseOther(x, v);
				}
				if (t === "bigint") {
					if (v < 0) {
						v = -v;
						x.s = -1;
					} else x.s = 1;
					return parseDecimal(x, v.toString());
				}
				throw Error(invalidArgument + v);
			}
			Decimal.prototype = P;
			Decimal.ROUND_UP = 0;
			Decimal.ROUND_DOWN = 1;
			Decimal.ROUND_CEIL = 2;
			Decimal.ROUND_FLOOR = 3;
			Decimal.ROUND_HALF_UP = 4;
			Decimal.ROUND_HALF_DOWN = 5;
			Decimal.ROUND_HALF_EVEN = 6;
			Decimal.ROUND_HALF_CEIL = 7;
			Decimal.ROUND_HALF_FLOOR = 8;
			Decimal.EUCLID = 9;
			Decimal.config = Decimal.set = config$1;
			Decimal.clone = clone$1;
			Decimal.isDecimal = isDecimalInstance;
			Decimal.abs = abs;
			Decimal.acos = acos;
			Decimal.acosh = acosh;
			Decimal.add = add;
			Decimal.asin = asin;
			Decimal.asinh = asinh;
			Decimal.atan = atan;
			Decimal.atanh = atanh;
			Decimal.atan2 = atan2;
			Decimal.cbrt = cbrt;
			Decimal.ceil = ceil;
			Decimal.clamp = clamp;
			Decimal.cos = cos;
			Decimal.cosh = cosh;
			Decimal.div = div;
			Decimal.exp = exp;
			Decimal.floor = floor;
			Decimal.hypot = hypot;
			Decimal.ln = ln;
			Decimal.log = log;
			Decimal.log10 = log10;
			Decimal.log2 = log2;
			Decimal.max = max;
			Decimal.min = min;
			Decimal.mod = mod;
			Decimal.mul = mul;
			Decimal.pow = pow;
			Decimal.random = random;
			Decimal.round = round;
			Decimal.sign = sign;
			Decimal.sin = sin;
			Decimal.sinh = sinh;
			Decimal.sqrt = sqrt;
			Decimal.sub = sub;
			Decimal.sum = sum;
			Decimal.tan = tan;
			Decimal.tanh = tanh;
			Decimal.trunc = trunc;
			if (obj === void 0) obj = {};
			if (obj) {
				if (obj.defaults !== true) {
					ps = [
						"precision",
						"rounding",
						"toExpNeg",
						"toExpPos",
						"maxE",
						"minE",
						"modulo",
						"crypto"
					];
					for (i = 0; i < ps.length;) if (!obj.hasOwnProperty(p = ps[i++])) obj[p] = this[p];
				}
			}
			Decimal.config(obj);
			return Decimal;
		}
		function div(x, y) {
			return new this(x).div(y);
		}
		function exp(x) {
			return new this(x).exp();
		}
		function floor(x) {
			return finalise(x = new this(x), x.e + 1, 3);
		}
		function hypot() {
			var i, n, t = new this(0);
			external = false;
			for (i = 0; i < arguments.length;) {
				n = new this(arguments[i++]);
				if (!n.d) {
					if (n.s) {
						external = true;
						return new this(1 / 0);
					}
					t = n;
				} else if (t.d) t = t.plus(n.times(n));
			}
			external = true;
			return t.sqrt();
		}
		function isDecimalInstance(obj) {
			return obj instanceof Decimal || obj && obj.toStringTag === tag || false;
		}
		function ln(x) {
			return new this(x).ln();
		}
		function log(x, y) {
			return new this(x).log(y);
		}
		function log2(x) {
			return new this(x).log(2);
		}
		function log10(x) {
			return new this(x).log(10);
		}
		function max() {
			return maxOrMin(this, arguments, -1);
		}
		function min() {
			return maxOrMin(this, arguments, 1);
		}
		function mod(x, y) {
			return new this(x).mod(y);
		}
		function mul(x, y) {
			return new this(x).mul(y);
		}
		function pow(x, y) {
			return new this(x).pow(y);
		}
		function random(sd) {
			var d, e, k, n, i = 0, r = new this(1), rd = [];
			if (sd === void 0) sd = this.precision;
			else checkInt32(sd, 1, MAX_DIGITS);
			k = Math.ceil(sd / LOG_BASE);
			if (!this.crypto) for (; i < k;) rd[i++] = Math.random() * 1e7 | 0;
			else if (crypto.getRandomValues) {
				d = crypto.getRandomValues(new Uint32Array(k));
				for (; i < k;) {
					n = d[i];
					if (n >= 429e7) d[i] = crypto.getRandomValues(/* @__PURE__ */ new Uint32Array(1))[0];
					else rd[i++] = n % 1e7;
				}
			} else if (crypto.randomBytes) {
				d = crypto.randomBytes(k *= 4);
				for (; i < k;) {
					n = d[i] + (d[i + 1] << 8) + (d[i + 2] << 16) + ((d[i + 3] & 127) << 24);
					if (n >= 214e7) crypto.randomBytes(4).copy(d, i);
					else {
						rd.push(n % 1e7);
						i += 4;
					}
				}
				i = k / 4;
			} else throw Error(cryptoUnavailable);
			k = rd[--i];
			sd %= LOG_BASE;
			if (k && sd) {
				n = mathpow(10, LOG_BASE - sd);
				rd[i] = (k / n | 0) * n;
			}
			for (; rd[i] === 0; i--) rd.pop();
			if (i < 0) {
				e = 0;
				rd = [0];
			} else {
				e = -1;
				for (; rd[0] === 0; e -= LOG_BASE) rd.shift();
				for (k = 1, n = rd[0]; n >= 10; n /= 10) k++;
				if (k < LOG_BASE) e -= LOG_BASE - k;
			}
			r.e = e;
			r.d = rd;
			return r;
		}
		function round(x) {
			return finalise(x = new this(x), x.e + 1, this.rounding);
		}
		function sign(x) {
			x = new this(x);
			return x.d ? x.d[0] ? x.s : 0 * x.s : x.s || NaN;
		}
		function sin(x) {
			return new this(x).sin();
		}
		function sinh(x) {
			return new this(x).sinh();
		}
		function sqrt(x) {
			return new this(x).sqrt();
		}
		function sub(x, y) {
			return new this(x).sub(y);
		}
		function sum() {
			var i = 0, args = arguments, x = new this(args[i]);
			external = false;
			for (; x.s && ++i < args.length;) x = x.plus(args[i]);
			external = true;
			return finalise(x, this.precision, this.rounding);
		}
		function tan(x) {
			return new this(x).tan();
		}
		function tanh(x) {
			return new this(x).tanh();
		}
		function trunc(x) {
			return finalise(x = new this(x), x.e + 1, 1);
		}
		P[Symbol.for("nodejs.util.inspect.custom")] = P.toString;
		P[Symbol.toStringTag] = "Decimal";
		var Decimal = P.constructor = clone$1(DEFAULTS);
		LN10 = new Decimal(LN10);
		PI = new Decimal(PI);
		//#endregion
		//#region node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/util.js
		function getEnumValues(entries) {
			const numericValues = Object.values(entries).filter((v) => typeof v === "number");
			return Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
		}
		function joinValues(array, separator = "|") {
			return array.map((val) => stringifyPrimitive(val)).join(separator);
		}
		function jsonStringifyReplacer(_, value) {
			if (typeof value === "bigint") return value.toString();
			return value;
		}
		function cached(getter) {
			return { get value() {
				{
					const value = getter();
					Object.defineProperty(this, "value", { value });
					return value;
				}
			} };
		}
		function nullish(input) {
			return input === null || input === void 0;
		}
		function cleanRegex(source) {
			const start = source.startsWith("^") ? 1 : 0;
			const end = source.endsWith("$") ? source.length - 1 : source.length;
			return source.slice(start, end);
		}
		function floatSafeRemainder(val, step) {
			const ratio = val / step;
			const roundedRatio = Math.round(ratio);
			const tolerance = 4 * Number.EPSILON * Math.max(Math.abs(ratio), 1);
			if (Math.abs(ratio - roundedRatio) < tolerance) return 0;
			return ratio - roundedRatio;
		}
		function assignProp(target, prop, value) {
			Object.defineProperty(target, prop, {
				value,
				writable: true,
				enumerable: true,
				configurable: true
			});
		}
		function mergeDefs(...defs) {
			const mergedDescriptors = {};
			for (const def of defs) {
				const descriptors = Object.getOwnPropertyDescriptors(def);
				Object.assign(mergedDescriptors, descriptors);
			}
			return Object.defineProperties({}, mergedDescriptors);
		}
		function esc(str) {
			return JSON.stringify(str);
		}
		function slugify(input) {
			return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
		}
		const captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
		function isObject(data) {
			return typeof data === "object" && data !== null && !Array.isArray(data);
		}
		const allowsEval = /* @__PURE__*/ cached(() => {
			if (globalConfig.jitless) return false;
			if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) return false;
			try {
				new Function("");
				return true;
			} catch (_) {
				return false;
			}
		});
		function isPlainObject(o) {
			if (isObject(o) === false) return false;
			const ctor = o.constructor;
			if (ctor === void 0) return true;
			if (typeof ctor !== "function") return true;
			const prot = ctor.prototype;
			if (isObject(prot) === false) return false;
			if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) return false;
			return true;
		}
		function shallowClone(o) {
			if (isPlainObject(o)) return { ...o };
			if (Array.isArray(o)) return [...o];
			if (o instanceof Map) return new Map(o);
			if (o instanceof Set) return new Set(o);
			return o;
		}
		const propertyKeyTypes = /* @__PURE__*/ new Set([
			"string",
			"number",
			"symbol"
		]);
		function escapeRegex(str) {
			return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		}
		function clone(inst, def, params) {
			const cl = new inst._zod.constr(def ?? inst._zod.def);
			if (!def || params?.parent) cl._zod.parent = inst;
			return cl;
		}
		function normalizeParams(_params) {
			const params = _params;
			if (!params) return {};
			if (typeof params === "string") return { error: () => params };
			if (params?.message !== void 0) {
				if (params?.error !== void 0) throw new Error("Cannot specify both `message` and `error` params");
				params.error = params.message;
			}
			delete params.message;
			if (typeof params.error === "string") return {
				...params,
				error: () => params.error
			};
			return params;
		}
		function stringifyPrimitive(value) {
			if (typeof value === "bigint") return value.toString() + "n";
			if (typeof value === "string") return `"${value}"`;
			return `${value}`;
		}
		function optionalKeys(shape) {
			return Object.keys(shape).filter((k) => {
				return shape[k]._zod.optin !== void 0 && shape[k]._zod.optout === "optional";
			});
		}
		const NUMBER_FORMAT_RANGES = /*@__PURE__*/ (() => ({
			safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
			int32: [-2147483648, 2147483647],
			uint32: [0, 4294967295],
			float32: [-34028234663852886e22, 34028234663852886e22],
			float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
		}))();
		function pick(schema, mask) {
			const currDef = schema._zod.def;
			const checks = currDef.checks;
			if (checks && checks.length > 0) throw new Error(".pick() cannot be used on object schemas containing refinements");
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const newShape = {};
					for (const key of Reflect.ownKeys(mask)) {
						if (!Object.prototype.hasOwnProperty.call(currDef.shape, key)) throw new Error(`Unrecognized key: "${String(key)}"`);
						if (!mask[key]) continue;
						assignProp(newShape, key, currDef.shape[key]);
					}
					assignProp(this, "shape", newShape);
					return newShape;
				},
				checks: []
			}));
		}
		function omit(schema, mask) {
			const currDef = schema._zod.def;
			const checks = currDef.checks;
			if (checks && checks.length > 0) throw new Error(".omit() cannot be used on object schemas containing refinements");
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const newShape = { ...schema._zod.def.shape };
					for (const key of Reflect.ownKeys(mask)) {
						if (!Object.prototype.hasOwnProperty.call(currDef.shape, key)) throw new Error(`Unrecognized key: "${String(key)}"`);
						if (!mask[key]) continue;
						delete newShape[key];
					}
					assignProp(this, "shape", newShape);
					return newShape;
				},
				checks: []
			}));
		}
		function extend(schema, shape) {
			if (!isPlainObject(shape)) throw new Error("Invalid input to extend: expected a plain object");
			const checks = schema._zod.def.checks;
			if (checks && checks.length > 0) {
				const existingShape = schema._zod.def.shape;
				for (const key of Reflect.ownKeys(shape)) if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
			}
			return clone(schema, mergeDefs(schema._zod.def, { get shape() {
				const _shape = {
					...schema._zod.def.shape,
					...shape
				};
				assignProp(this, "shape", _shape);
				return _shape;
			} }));
		}
		function safeExtend(schema, shape) {
			if (!isPlainObject(shape)) throw new Error("Invalid input to safeExtend: expected a plain object");
			return clone(schema, mergeDefs(schema._zod.def, { get shape() {
				const _shape = {
					...schema._zod.def.shape,
					...shape
				};
				assignProp(this, "shape", _shape);
				return _shape;
			} }));
		}
		function merge(a, b) {
			if (!b?._zod?.def) throw new Error("Invalid input to merge: expected an object schema. To merge a plain shape, use `.extend()`.");
			if (a._zod.def.checks?.length) throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
			return clone(a, mergeDefs(a._zod.def, {
				get shape() {
					const _shape = {
						...a._zod.def.shape,
						...b._zod.def.shape
					};
					assignProp(this, "shape", _shape);
					return _shape;
				},
				get catchall() {
					return b._zod.def.catchall;
				},
				checks: b._zod.def.checks ?? []
			}));
		}
		function partial(Class, schema, mask, name = "partial") {
			const checks = schema._zod.def.checks;
			if (checks && checks.length > 0) throw new Error(`.${name}() cannot be used on object schemas containing refinements`);
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const oldShape = schema._zod.def.shape;
					const shape = { ...oldShape };
					if (mask) for (const key of Reflect.ownKeys(mask)) {
						if (!Object.prototype.hasOwnProperty.call(oldShape, key)) throw new Error(`Unrecognized key: "${String(key)}"`);
						if (!mask[key]) continue;
						shape[key] = Class ? new Class({
							type: "optional",
							innerType: oldShape[key]
						}) : oldShape[key];
					}
					else for (const key of Reflect.ownKeys(oldShape)) shape[key] = Class ? new Class({
						type: "optional",
						innerType: oldShape[key]
					}) : oldShape[key];
					assignProp(this, "shape", shape);
					return shape;
				},
				checks: []
			}));
		}
		function required(Class, schema, mask) {
			return clone(schema, mergeDefs(schema._zod.def, { get shape() {
				const oldShape = schema._zod.def.shape;
				const shape = { ...oldShape };
				if (mask) for (const key of Reflect.ownKeys(mask)) {
					if (!Object.prototype.hasOwnProperty.call(shape, key)) throw new Error(`Unrecognized key: "${String(key)}"`);
					if (!mask[key]) continue;
					shape[key] = new Class({
						type: "nonoptional",
						innerType: oldShape[key]
					});
				}
				else for (const key of Reflect.ownKeys(oldShape)) shape[key] = new Class({
					type: "nonoptional",
					innerType: oldShape[key]
				});
				assignProp(this, "shape", shape);
				return shape;
			} }));
		}
		function aborted(x, startIndex = 0) {
			if (x.aborted === true) return true;
			for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue !== true) return true;
			return false;
		}
		function explicitlyAborted(x, startIndex = 0) {
			if (x.aborted === true) return true;
			for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue === false) return true;
			return false;
		}
		function prefixIssues(path, issues) {
			return issues.map((iss) => {
				var _a;
				(_a = iss).path ?? (_a.path = []);
				iss.path.unshift(path);
				return iss;
			});
		}
		function unwrapMessage(message) {
			return typeof message === "string" ? message : message?.message;
		}
		function attachSchema(issues, start, inst) {
			var _a;
			for (let i = start; i < issues.length; i++) (_a = issues[i]).schema ?? (_a.schema = inst);
		}
		function finalizeIssue(iss, ctx, config) {
			var _a;
			const traits = iss.inst?._zod?.traits;
			if (traits?.has("$ZodType")) {
				if (traits.has("$ZodCheck")) (_a = iss).schema ?? (_a.schema = iss.inst);
				else iss.schema = iss.inst;
			}
			const schemaError = iss.schema !== iss.inst ? iss.schema?._zod.def?.error : void 0;
			const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(schemaError?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
			const { inst: _inst, schema: _schema, continue: _continue, input: _input, ...rest } = iss;
			rest.path ?? (rest.path = []);
			rest.message = message;
			if (ctx?.reportInput) rest.input = _input;
			return rest;
		}
		const highSurrogate = /[\uD800-\uDBFF]/;
		function codePointLength(str) {
			const units = str.length;
			if (!highSurrogate.test(str)) return units;
			let count = units;
			for (let i = 0; i < units - 1; i++) if ((str.charCodeAt(i) & 64512) === 55296 && (str.charCodeAt(i + 1) & 64512) === 56320) {
				count--;
				i++;
			}
			return count;
		}
		function getLengthableOrigin(input) {
			if (Array.isArray(input)) return "array";
			if (typeof input === "string") return "string";
			return "unknown";
		}
		function parsedType(data) {
			const t = typeof data;
			switch (t) {
				case "number": return Number.isNaN(data) ? "nan" : "number";
				case "object": {
					if (data === null) return "null";
					if (Array.isArray(data)) return "array";
					const obj = data;
					if (obj && Object.getPrototypeOf(obj) !== Object.prototype && "constructor" in obj && obj.constructor) return obj.constructor.name;
				}
			}
			return t;
		}
		function issue(...args) {
			const [iss, input, inst] = args;
			if (typeof iss === "string") return {
				message: iss,
				code: "custom",
				input,
				inst
			};
			return { ...iss };
		}
		/**
		* Installs a trait's members on its prototype. Each value builds that member for the instance on first read; the built value shadows the accessor as an own property, so a detached `const { parse } = schema` keeps working.
		*
		* Call this from a `proto` initializer, which runs once per prototype — never per instance.
		*/
		function members(proto, table) {
			for (const key in table) {
				const desc = Object.getOwnPropertyDescriptor(table, key);
				if (desc.get) Object.defineProperty(proto, key, {
					...desc,
					enumerable: false
				});
				else defineBound(proto, key, desc.value);
			}
		}
		/** Shadows a prototype member with an own value, so a getter that builds from the instance runs once. */
		function own(inst, key, value, enumerable = true) {
			Object.defineProperty(inst, key, {
				configurable: true,
				writable: true,
				enumerable,
				value
			});
			return value;
		}
		/** Like {@link own}, for a member that was never an own data property and has to stay out of `Object.keys`. */
		function hide(inst, key, value) {
			return own(inst, key, value, false);
		}
		function defineBound(proto, key, fn) {
			Object.defineProperty(proto, key, {
				configurable: true,
				get() {
					return this == null ? fn : own(this, key, fn.bind(this));
				},
				set(value) {
					own(this, key, value);
				}
			});
		}
		/** Returns the prototype to install on, or `undefined` if this group is already installed on it. */
		function claim(inst, sentinel) {
			const proto = Object.getPrototypeOf(inst);
			return sentinel in proto ? void 0 : proto;
		}
		let installing;
		let broke = false;
		const breaker = {
			configurable: true,
			get() {
				broke = true;
			}
		};
		/**
		* Installs a lazily-derived internal on the `_zod` prototype of `inst`'s
		* constructor, computed from the internals object itself and cached there on
		* first read. One accessor per constructor rather than one per instance.
		*/
		function defineLazyInternal(inst, key, compute) {
			const proto = Object.getPrototypeOf(inst._zod);
			if (key in proto && installing !== inst._zod) {
				installing = void 0;
				return;
			}
			installing = inst._zod;
			Object.defineProperty(proto, key, {
				configurable: true,
				get() {
					Object.defineProperty(this, key, breaker);
					const outer = broke;
					broke = false;
					try {
						const value = compute(this);
						if (broke) delete this[key];
						else Object.defineProperty(this, key, {
							configurable: true,
							writable: true,
							value
						});
						broke = broke || outer;
						return value;
					} catch (err) {
						delete this[key];
						broke = broke || outer;
						throw err;
					}
				},
				set(value) {
					Object.defineProperty(this, key, {
						configurable: true,
						writable: true,
						value
					});
				}
			});
		}
		/**
		* Installs `key` on `inst`'s prototype, computed by `make` on first read and cached there as an own
		* data property. One accessor per constructor rather than one per instance, because an own accessor
		* puts every instance after the first into v8 dictionary mode. The key doubles as the sentinel.
		*/
		function installLazyProp(inst, key, make, enumerable) {
			const proto = claim(inst, key);
			if (!proto) return;
			Object.defineProperty(proto, key, {
				configurable: true,
				get() {
					const desc = {
						configurable: true,
						writable: true,
						enumerable,
						value: void 0
					};
					Object.defineProperty(this, key, desc);
					desc.value = make(this);
					Object.defineProperty(this, key, desc);
					return desc.value;
				},
				set(value) {
					Object.defineProperty(this, key, {
						configurable: true,
						writable: true,
						enumerable,
						value
					});
				}
			});
		}
		/** Marks the thunk `_catch` synthesises for a constant catch value. `Function.length` cannot tell that thunk from a user callback — rest and defaulted parameters both report arity 0 — and a user callback reads `ctx.error`, whose issues only finalize correctly against the caller's per-parse error map. Provenance can say what arity cannot. A plain string key rather than `Symbol.for`, whose call at module scope no bundler can prove pure — the same shape that anchored `urlCanParse` into every build. */
		const CONSTANT_CATCH = "~constantCatch";
		/** Wraps a constant catch value in a thunk tagged with {@link CONSTANT_CATCH}. */
		function constantCatch(value) {
			const fn = () => value;
			fn[CONSTANT_CATCH] = true;
			return fn;
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/core.js
		var _a$1;
		const _zodDesc$1 = {
			value: void 0,
			enumerable: false
		};
		let _E = "captureStackTrace" in Error ? Error : null;
		function newError(Definition) {
			const E = _E;
			if (E) {
				const saved = E.stackTraceLimit;
				if (typeof saved === "number") {
					try {
						E.stackTraceLimit = 0;
					} catch {
						_E = null;
						return new Definition();
					}
					try {
						return new Definition();
					} finally {
						E.stackTraceLimit = saved;
					}
				}
			}
			return new Definition();
		}
		function $constructor(name, initializer, proto, params) {
			const zodProto = {};
			function Internals(def) {
				this.def = def;
				this.constr = _;
				this.traits = /* @__PURE__ */ new Set();
			}
			Internals.prototype = zodProto;
			const protoMembers = proto;
			const initialized = protoMembers && /* @__PURE__ */ new WeakSet();
			function init(inst, def) {
				if (!inst._zod) {
					_zodDesc$1.value = new Internals(def);
					try {
						Object.defineProperty(inst, "_zod", _zodDesc$1);
					} finally {
						_zodDesc$1.value = void 0;
					}
				}
				if (inst._zod.traits.has(name)) return;
				inst._zod.traits.add(name);
				initializer(inst, def);
				if (initialized) {
					const own = Object.getPrototypeOf(inst);
					const ctorProto = inst._zod.constr.prototype;
					let up = own;
					while (up && up !== ctorProto) up = Object.getPrototypeOf(up);
					const target = up ?? own;
					if (!initialized.has(target)) {
						initialized.add(target);
						members(target, protoMembers);
					}
				}
				const proto = _.prototype;
				for (const k in proto) {
					if (!Object.prototype.hasOwnProperty.call(proto, k)) continue;
					if (!(k in inst)) inst[k] = proto[k].bind(inst);
				}
			}
			const Parent = params?.Parent ?? Object;
			class Definition extends Parent {}
			Object.defineProperty(Definition, "name", { value: name });
			function _(def) {
				const inst = params?.Parent ? newError(Definition) : this;
				init(inst, def);
				const deferred = inst._zod.deferred;
				if (deferred) {
					for (const fn of deferred) fn();
					inst._zod.deferred = void 0;
				}
				const pp = globalThis.__zod_globalConfig?.postProcessor;
				if (pp) pp(inst);
				return inst;
			}
			Object.defineProperty(_, "init", { value: init });
			Object.defineProperty(_, Symbol.hasInstance, { value: (inst) => {
				if (params?.Parent && inst instanceof params.Parent) return true;
				return inst?._zod?.traits?.has(name);
			} });
			Object.defineProperty(_, "name", { value: name });
			return _;
		}
		var $ZodAsyncError = class extends Error {
			constructor() {
				super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
			}
		};
		var $ZodEncodeError = class extends Error {
			constructor(name) {
				super(`Encountered unidirectional transform during encode: ${name}`);
				this.name = "ZodEncodeError";
			}
		};
		(_a$1 = globalThis).__zod_globalConfig ?? (_a$1.__zod_globalConfig = {});
		const globalConfig = globalThis.__zod_globalConfig;
		function config(newConfig) {
			if (newConfig) Object.assign(globalConfig, newConfig);
			return globalConfig;
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/errors.js
		function _getMessage() {
			const internals = this._zod;
			internals.message ?? (internals.message = JSON.stringify(internals.def, jsonStringifyReplacer, 2));
			return internals.message;
		}
		function _setMessage(value) {
			this._zod.message = value;
		}
		const _messageDesc = {
			get: _getMessage,
			set: _setMessage,
			enumerable: true,
			configurable: true
		};
		const _zodDesc = {
			value: void 0,
			enumerable: false
		};
		const _issuesDesc = {
			value: void 0,
			enumerable: false
		};
		const _installedToString = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
		const initializer$1 = (inst, def) => {
			inst.name = "$ZodError";
			_zodDesc.value = inst._zod;
			Object.defineProperty(inst, "_zod", _zodDesc);
			_issuesDesc.value = def;
			Object.defineProperty(inst, "issues", _issuesDesc);
			_zodDesc.value = void 0;
			_issuesDesc.value = void 0;
			Object.defineProperty(inst, "message", _messageDesc);
			const proto = Object.getPrototypeOf(inst);
			if (!_installedToString.has(proto)) {
				_installedToString.add(proto);
				Object.defineProperty(proto, "toString", {
					configurable: true,
					enumerable: false,
					get() {
						const value = () => this.message;
						Object.defineProperty(this, "toString", {
							value,
							configurable: true,
							writable: true
						});
						return value;
					},
					set(value) {
						Object.defineProperty(this, "toString", {
							value,
							configurable: true,
							writable: true
						});
					}
				});
			}
		};
		const $ZodError = $constructor("$ZodError", initializer$1);
		const $ZodRealError = $constructor("$ZodError", initializer$1, void 0, { Parent: Error });
		/** Get-or-create `obj[key]` as an own data property. A path segment naming an inherited member
		* ("toString", "constructor") would otherwise read through to the prototype, and assigning
		* "__proto__" would hit the setter instead of creating a key. */
		function node(obj, key, make) {
			if (!Object.prototype.hasOwnProperty.call(obj, key)) {
				if (key === "__proto__") Object.defineProperty(obj, key, {
					value: make(),
					writable: true,
					enumerable: true,
					configurable: true
				});
				else obj[key] = make();
			}
			return obj[key];
		}
		function flattenError(error, mapper = (issue) => issue.message) {
			const fieldErrors = {};
			const formErrors = [];
			for (const sub of error.issues) if (sub.path.length > 0) node(fieldErrors, sub.path[0], () => []).push(mapper(sub));
			else formErrors.push(mapper(sub));
			return {
				formErrors,
				fieldErrors
			};
		}
		function formatError(error, mapper = (issue) => issue.message) {
			const fieldErrors = { _errors: [] };
			const processError = (error, path = []) => {
				for (const issue of error.issues) if (issue.code === "invalid_union" && issue.errors.length) issue.errors.map((issues) => processError({ issues }, [...path, ...issue.path]));
				else if (issue.code === "invalid_key") processError({ issues: issue.issues }, [...path, ...issue.path]);
				else if (issue.code === "invalid_element") processError({ issues: issue.issues }, [...path, ...issue.path]);
				else {
					const fullpath = [...path, ...issue.path];
					if (fullpath.length === 0) fieldErrors._errors.push(mapper(issue));
					else {
						let curr = fieldErrors;
						let i = 0;
						while (i < fullpath.length) {
							const el = fullpath[i];
							const terminal = i === fullpath.length - 1;
							if (el === "_errors") {
								if (terminal) curr._errors.push(mapper(issue));
								i++;
								continue;
							}
							if (!Object.prototype.hasOwnProperty.call(curr, el)) Object.defineProperty(curr, el, {
								value: { _errors: [] },
								enumerable: true,
								writable: true,
								configurable: true
							});
							const node = curr[el];
							if (terminal) node._errors.push(mapper(issue));
							curr = node;
							i++;
						}
					}
				}
			};
			processError(error);
			return fieldErrors;
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/parse.js
		function finalizeParams(callee, params) {
			return {
				callee: params?.callee ?? callee,
				Err: params?.Err
			};
		}
		const _parse = (_Err) => {
			const fn = (schema, value, _ctx, _params) => {
				const ctx = _ctx ? {
					..._ctx,
					async: false
				} : { async: false };
				const result = schema._zod.run({
					value,
					issues: []
				}, ctx);
				if (result instanceof Promise) throw new $ZodAsyncError();
				if (result.issues.length) {
					const e = new ((_params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
					captureStackTrace(e, _params?.callee ?? fn);
					throw e;
				}
				return result.value;
			};
			return fn;
		};
		const _parseAsync = (_Err) => {
			const fn = async (schema, value, _ctx, params) => {
				const ctx = _ctx ? {
					..._ctx,
					async: true
				} : { async: true };
				let result = schema._zod.run({
					value,
					issues: []
				}, ctx);
				if (result instanceof Promise) result = await result;
				if (result.issues.length) {
					const e = new ((params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
					captureStackTrace(e, params?.callee ?? fn);
					throw e;
				}
				return result.value;
			};
			return fn;
		};
		const _safeParse = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				async: false
			} : { async: false };
			const result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) throw new $ZodAsyncError();
			return result.issues.length ? {
				success: false,
				error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
			} : {
				success: true,
				data: result.value
			};
		};
		const safeParse$1 = /* @__PURE__*/ _safeParse($ZodRealError);
		const _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				async: true
			} : { async: true };
			let result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) result = await result;
			return result.issues.length ? {
				success: false,
				error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
			} : {
				success: true,
				data: result.value
			};
		};
		const safeParseAsync$1 = /* @__PURE__*/ _safeParseAsync($ZodRealError);
		const _encode = (_Err) => {
			const parse = _parse(_Err);
			const fn = (schema, value, _ctx, _params) => {
				const ctx = _ctx ? {
					..._ctx,
					direction: "backward"
				} : { direction: "backward" };
				return parse(schema, value, ctx, finalizeParams(fn, _params));
			};
			return fn;
		};
		const _decode = (_Err) => {
			const parse = _parse(_Err);
			const fn = (schema, value, _ctx, _params) => {
				return parse(schema, value, _ctx, finalizeParams(fn, _params));
			};
			return fn;
		};
		const _encodeAsync = (_Err) => {
			const parseAsync = _parseAsync(_Err);
			const fn = async (schema, value, _ctx, _params) => {
				const ctx = _ctx ? {
					..._ctx,
					direction: "backward"
				} : { direction: "backward" };
				return await parseAsync(schema, value, ctx, finalizeParams(fn, _params));
			};
			return fn;
		};
		const _decodeAsync = (_Err) => {
			const parseAsync = _parseAsync(_Err);
			const fn = async (schema, value, _ctx, _params) => {
				return await parseAsync(schema, value, _ctx, finalizeParams(fn, _params));
			};
			return fn;
		};
		const _safeEncode = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _safeParse(_Err)(schema, value, ctx);
		};
		const _safeDecode = (_Err) => (schema, value, _ctx) => {
			return _safeParse(_Err)(schema, value, _ctx);
		};
		const _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _safeParseAsync(_Err)(schema, value, ctx);
		};
		const _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
			return _safeParseAsync(_Err)(schema, value, _ctx);
		};
		//#endregion
		//#region node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/regexes.js
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link cuid2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const cuid = /^[cC][0-9a-z]{6,}$/;
		const cuid2 = /^[0-9a-z]+$/;
		const ulid = /^[0-7][0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{25}$/;
		const xid = /^[0-9a-vA-V]{20}$/;
		const ksuid = /^[A-Za-z0-9]{27}$/;
		const nanoid = /^[a-zA-Z0-9_-]{21}$/;
		function nanoidOfLength(length) {
			return new RegExp(`^[a-zA-Z0-9_-]{${length}}$`);
		}
		/** ISO 8601-1 duration regex. Does not support the 8601-2 extensions like negative durations or fractional/negative components. */
		const duration = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
		/** A regex for any UUID-like identifier: 8-4-4-4-12 hex pattern */
		const guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
		/** Returns a regex for validating an RFC 9562/4122 UUID.
		*
		* @param version Optionally specify a version 1-8. If no version is specified, all versions are supported. */
		const uuid = (version) => {
			if (!version) return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
			return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
		};
		/** Practical email validation */
		const email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
		const _emoji$1 = `^[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$`;
		function emoji() {
			return new RegExp(_emoji$1, "u");
		}
		const ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
		const ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
		const cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
		const cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
		const base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
		const base64url = /^[A-Za-z0-9_-]*$/;
		const httpProtocol = /^https?$/;
		const e164 = /^\+[1-9]\d{6,14}$/;
		const dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
		/** Anchors a pattern source. The interpolation lives here rather than at the call site because
		* esbuild will not drop a `@__PURE__` call whose own argument interpolates a variable, but it
		* will drop `anchor(dateSource)`. Keeping it inline pinned `date` into every bundle. */
		function anchor(source) {
			return new RegExp(`^${source}$`);
		}
		const date = /*@__PURE__*/ anchor(dateSource);
		function timeSource(args) {
			const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
			return typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : args.seconds ? `${hhmm}:[0-5]\\d(?:\\.\\d+)?` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
		}
		function time(args) {
			return new RegExp(`^${timeSource(args)}$`);
		}
		function datetime(args) {
			const opts = ["Z"];
			if (args.offset) opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
			const qualified = `${timeSource({
				precision: args.precision,
				seconds: true
			})}(?:${opts.join("|")})`;
			const timeRegex = args.local ? `${qualified}|${timeSource({ precision: args.precision })}` : qualified;
			return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
		}
		const string$1 = (params) => {
			const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
			return new RegExp(`^${regex}$`);
		};
		const integer = /^-?\d+$/;
		const number$1 = /^-?\d+(?:\.\d+)?$/;
		const lowercase = /^[^A-Z]*$/;
		const uppercase = /^[^a-z]*$/;
		//#endregion
		//#region node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/checks.js
		const $ZodCheck = /*@__PURE__*/ $constructor("$ZodCheck", (inst, def) => {
			var _a;
			inst._zod ?? (inst._zod = {});
			inst._zod.def = def;
			(_a = inst._zod).onattach ?? (_a.onattach = []);
		});
		/** Default `when` for length-based checks: run only on non-nullish values with a `length`. */
		const _whenHasLength = (payload) => {
			const val = payload.value;
			return !nullish(val) && val.length !== void 0;
		};
		const numericOriginMap = {
			number: "number",
			bigint: "bigint",
			object: "date"
		};
		const $ZodCheckLessThan = /*@__PURE__*/ $constructor("$ZodCheckLessThan", (inst, def) => {
			$ZodCheck.init(inst, def);
			const origin = numericOriginMap[typeof def.value];
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
				if (def.value < curr) {
					if (def.inclusive) bag.maximum = def.value;
					else bag.exclusiveMaximum = def.value;
				}
			});
			inst._zod.check = (payload) => {
				if (def.inclusive ? payload.value <= def.value : payload.value < def.value) return;
				payload.issues.push({
					origin: numericOriginMap[typeof payload.value] ?? origin,
					code: "too_big",
					maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
					input: payload.value,
					inclusive: def.inclusive,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckGreaterThan = /*@__PURE__*/ $constructor("$ZodCheckGreaterThan", (inst, def) => {
			$ZodCheck.init(inst, def);
			const origin = numericOriginMap[typeof def.value];
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
				if (def.value > curr) {
					if (def.inclusive) bag.minimum = def.value;
					else bag.exclusiveMinimum = def.value;
				}
			});
			inst._zod.check = (payload) => {
				if (def.inclusive ? payload.value >= def.value : payload.value > def.value) return;
				payload.issues.push({
					origin: numericOriginMap[typeof payload.value] ?? origin,
					code: "too_small",
					minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
					input: payload.value,
					inclusive: def.inclusive,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMultipleOf = /*@__PURE__*/ $constructor("$ZodCheckMultipleOf", (inst, def) => {
			$ZodCheck.init(inst, def);
			inst._zod.onattach.push((inst) => {
				var _a;
				(_a = inst._zod.bag).multipleOf ?? (_a.multipleOf = def.value);
			});
			inst._zod.check = (payload) => {
				if (typeof payload.value !== typeof def.value) throw new Error("Cannot mix number and bigint in multiple_of check.");
				if (typeof payload.value === "bigint" ? def.value !== BigInt(0) && payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0) return;
				payload.issues.push({
					origin: typeof payload.value,
					code: "not_multiple_of",
					divisor: def.value,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckNumberFormat = /*@__PURE__*/ $constructor("$ZodCheckNumberFormat", (inst, def) => {
			$ZodCheck.init(inst, def);
			def.format = def.format || "float64";
			const isInt = def.format?.includes("int");
			const origin = isInt ? "int" : "number";
			const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.format = def.format;
				bag.minimum = minimum;
				bag.maximum = maximum;
				if (isInt) bag.pattern = integer;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				if (isInt) {
					if (!Number.isInteger(input)) {
						payload.issues.push({
							expected: origin,
							format: def.format,
							code: "invalid_type",
							continue: false,
							input,
							inst
						});
						return;
					}
					if (!Number.isSafeInteger(input)) {
						if (input > 0) payload.issues.push({
							input,
							code: "too_big",
							maximum: Number.MAX_SAFE_INTEGER,
							note: "Integers must be within the safe integer range.",
							inst,
							origin,
							inclusive: true,
							continue: !def.abort
						});
						else payload.issues.push({
							input,
							code: "too_small",
							minimum: Number.MIN_SAFE_INTEGER,
							note: "Integers must be within the safe integer range.",
							inst,
							origin,
							inclusive: true,
							continue: !def.abort
						});
						return;
					}
				}
				if (input < minimum) payload.issues.push({
					origin: "number",
					input,
					code: "too_small",
					minimum,
					inclusive: true,
					inst,
					continue: !def.abort
				});
				if (input > maximum) payload.issues.push({
					origin: "number",
					input,
					code: "too_big",
					maximum,
					inclusive: true,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMaxLength = /*@__PURE__*/ $constructor("$ZodCheckMaxLength", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = _whenHasLength);
			inst._zod.onattach.push((inst) => {
				const curr = inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
				if (def.maximum < curr) inst._zod.bag.maximum = def.maximum;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				const units = input.length;
				if ((typeof input === "string" && units > def.maximum ? codePointLength(input) : units) <= def.maximum) return;
				const origin = getLengthableOrigin(input);
				payload.issues.push({
					origin,
					code: "too_big",
					maximum: def.maximum,
					inclusive: true,
					input,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMinLength = /*@__PURE__*/ $constructor("$ZodCheckMinLength", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = _whenHasLength);
			inst._zod.onattach.push((inst) => {
				const curr = inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
				if (def.minimum > curr) inst._zod.bag.minimum = def.minimum;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				const units = input.length;
				if ((typeof input === "string" && units >= def.minimum && units < def.minimum * 2 ? codePointLength(input) : units) >= def.minimum) return;
				const origin = getLengthableOrigin(input);
				payload.issues.push({
					origin,
					code: "too_small",
					minimum: def.minimum,
					inclusive: true,
					input,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckLengthEquals = /*@__PURE__*/ $constructor("$ZodCheckLengthEquals", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = _whenHasLength);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.minimum = def.length;
				bag.maximum = def.length;
				bag.length = def.length;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				const units = input.length;
				const length = typeof input === "string" && units >= def.length && units <= def.length * 2 ? codePointLength(input) : units;
				if (length === def.length) return;
				const origin = getLengthableOrigin(input);
				const tooBig = length > def.length;
				payload.issues.push({
					origin,
					...tooBig ? {
						code: "too_big",
						maximum: def.length
					} : {
						code: "too_small",
						minimum: def.length
					},
					inclusive: true,
					exact: true,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckStringFormat = /*@__PURE__*/ $constructor("$ZodCheckStringFormat", (inst, def) => {
			var _a, _b;
			$ZodCheck.init(inst, def);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.format = def.format;
				if (def.pattern) {
					bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
					bag.patterns.add(def.pattern);
				}
			});
			if (def.pattern) (_a = inst._zod).check ?? (_a.check = (payload) => {
				def.pattern.lastIndex = 0;
				if (def.pattern.test(payload.value)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: def.format,
					input: payload.value,
					...def.pattern ? { pattern: def.pattern.toString() } : {},
					inst,
					continue: !def.abort
				});
			});
			else (_b = inst._zod).check ?? (_b.check = () => {});
		});
		const $ZodCheckRegex = /*@__PURE__*/ $constructor("$ZodCheckRegex", (inst, def) => {
			$ZodCheckStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				def.pattern.lastIndex = 0;
				if (def.pattern.test(payload.value)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "regex",
					input: payload.value,
					pattern: def.pattern.toString(),
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckLowerCase = /*@__PURE__*/ $constructor("$ZodCheckLowerCase", (inst, def) => {
			def.pattern ?? (def.pattern = lowercase);
			$ZodCheckStringFormat.init(inst, def);
		});
		const $ZodCheckUpperCase = /*@__PURE__*/ $constructor("$ZodCheckUpperCase", (inst, def) => {
			def.pattern ?? (def.pattern = uppercase);
			$ZodCheckStringFormat.init(inst, def);
		});
		const $ZodCheckIncludes = /*@__PURE__*/ $constructor("$ZodCheckIncludes", (inst, def) => {
			$ZodCheck.init(inst, def);
			const escapedRegex = escapeRegex(def.includes);
			const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position},}${escapedRegex}` : escapedRegex);
			def.pattern = pattern;
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(pattern);
			});
			inst._zod.check = (payload) => {
				if (payload.value.includes(def.includes, def.position)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "includes",
					includes: def.includes,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckStartsWith = /*@__PURE__*/ $constructor("$ZodCheckStartsWith", (inst, def) => {
			$ZodCheck.init(inst, def);
			const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
			def.pattern ?? (def.pattern = pattern);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(pattern);
			});
			inst._zod.check = (payload) => {
				if (payload.value.startsWith(def.prefix)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "starts_with",
					prefix: def.prefix,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckEndsWith = /*@__PURE__*/ $constructor("$ZodCheckEndsWith", (inst, def) => {
			$ZodCheck.init(inst, def);
			const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
			def.pattern ?? (def.pattern = pattern);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(pattern);
			});
			inst._zod.check = (payload) => {
				if (payload.value.endsWith(def.suffix)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "ends_with",
					suffix: def.suffix,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckOverwrite = /*@__PURE__*/ $constructor("$ZodCheckOverwrite", (inst, def) => {
			$ZodCheck.init(inst, def);
			inst._zod.check = (payload) => {
				payload.value = def.tx(payload.value);
			};
		});
		//#endregion
		//#region node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/doc.js
		var Doc = class {
			constructor(args = [], closed = {}) {
				this.content = [];
				this.indent = 0;
				this.args = args;
				this.closed = closed;
			}
			indented(fn) {
				this.indent += 1;
				fn(this);
				this.indent -= 1;
			}
			write(arg) {
				if (typeof arg === "function") {
					arg(this, { execution: "sync" });
					arg(this, { execution: "async" });
					return;
				}
				const lines = arg.split("\n").filter((x) => x);
				const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
				const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
				for (const line of dedented) this.content.push(line);
			}
			compile() {
				const F = Function;
				const content = this?.content ?? [``];
				return new F(...Object.keys(this.closed), `return function (${this.args.join(", ")}) {\n${content.join("\n")}\n};`)(...Object.values(this.closed));
			}
		};
		//#endregion
		//#region node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/versions.js
		const version = {
			major: 4,
			minor: 5,
			patch: 4
		};
		//#endregion
		//#region node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/schemas.js
		const $ZodType = /*@__PURE__*/ $constructor("$ZodType", (inst, def) => {
			var _a;
			inst ?? (inst = {});
			inst._zod.def = def;
			inst._zod.bag = inst._zod.bag || {};
			inst._zod.version = version;
			const defChecks = inst._zod.def.checks;
			const checks = inst._zod.traits.has("$ZodCheck") ? [inst, ...defChecks ?? []] : defChecks?.length ? [...defChecks] : [];
			for (const ch of checks) for (const fn of ch._zod.onattach) fn(inst);
			if (checks.length === 0) {
				(_a = inst._zod).deferred ?? (_a.deferred = []);
				inst._zod.deferred?.push(() => {
					inst._zod.run = inst._zod.parse;
				});
			} else {
				const runChecks = (payload, checks, ctx) => {
					if (payload.memo) return payload;
					let isAborted = aborted(payload);
					let asyncResult;
					for (const ch of checks) {
						if (ch._zod.def.when) {
							if (explicitlyAborted(payload)) continue;
							if (!ch._zod.def.when(payload)) continue;
						} else if (isAborted) continue;
						const currLen = payload.issues.length;
						const _ = ch._zod.check(payload);
						if (_ instanceof Promise && ctx?.async === false) throw new $ZodAsyncError();
						if (asyncResult || _ instanceof Promise) asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
							await _;
							if (payload.issues.length === currLen) return;
							attachSchema(payload.issues, currLen, inst);
							if (!isAborted) isAborted = aborted(payload, currLen);
						});
						else {
							if (payload.issues.length === currLen) continue;
							attachSchema(payload.issues, currLen, inst);
							if (!isAborted) isAborted = aborted(payload, currLen);
						}
					}
					if (asyncResult) return asyncResult.then(() => {
						return payload;
					});
					return payload;
				};
				const handleCanaryResult = (canary, payload, ctx) => {
					if (aborted(canary)) {
						canary.aborted = true;
						return canary;
					}
					const checkResult = runChecks(payload, checks, ctx);
					if (checkResult instanceof Promise) {
						if (ctx.async === false) throw new $ZodAsyncError();
						return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
					}
					return inst._zod.parse(checkResult, ctx);
				};
				inst._zod.run = (payload, ctx) => {
					if (ctx.skipChecks) return inst._zod.parse(payload, ctx);
					if (ctx.direction === "backward") {
						const canary = inst._zod.parse({
							value: payload.value,
							issues: []
						}, {
							...ctx,
							skipChecks: true
						});
						if (canary instanceof Promise) return canary.then((canary) => {
							return handleCanaryResult(canary, payload, ctx);
						});
						return handleCanaryResult(canary, payload, ctx);
					}
					const result = inst._zod.parse(payload, ctx);
					if (result instanceof Promise) {
						if (ctx.async === false) throw new $ZodAsyncError();
						return result.then((result) => runChecks(result, checks, ctx));
					}
					return runChecks(result, checks, ctx);
				};
			}
		}, {
			get "~standard"() {
				return hide(this, "~standard", standardProps(this));
			},
			set "~standard"(value) {
				own(this, "~standard", value);
			}
		});
		/** The Standard Schema surface for `inst`. Shared so wrappers can extend it without forcing it. */
		const toStandardResult = (r) => r.success ? { value: r.data } : { issues: r.error?.issues };
		function standardProps(inst) {
			return {
				validate: (value) => {
					try {
						return toStandardResult(safeParse$1(inst, value));
					} catch (_) {
						return safeParseAsync$1(inst, value).then(toStandardResult);
					}
				},
				vendor: "zod",
				version: 1
			};
		}
		const $ZodString = /*@__PURE__*/ $constructor("$ZodString", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string$1(inst._zod.bag);
			inst._zod.parse = (payload, _) => {
				if (def.coerce) try {
					payload.value = String(payload.value);
				} catch (_) {}
				if (typeof payload.value === "string") return payload;
				payload.issues.push({
					expected: "string",
					code: "invalid_type",
					input: payload.value,
					inst
				});
				return payload;
			};
		});
		const $ZodStringFormat = /*@__PURE__*/ $constructor("$ZodStringFormat", (inst, def) => {
			$ZodCheckStringFormat.init(inst, def);
			$ZodString.init(inst, def);
		});
		const $ZodGUID = /*@__PURE__*/ $constructor("$ZodGUID", (inst, def) => {
			def.pattern ?? (def.pattern = guid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodUUID = /*@__PURE__*/ $constructor("$ZodUUID", (inst, def) => {
			if (def.version) {
				const v = {
					v1: 1,
					v2: 2,
					v3: 3,
					v4: 4,
					v5: 5,
					v6: 6,
					v7: 7,
					v8: 8
				}[def.version];
				if (v === void 0) throw new Error(`Invalid UUID version: "${def.version}"`);
				def.pattern ?? (def.pattern = uuid(v));
			} else def.pattern ?? (def.pattern = uuid());
			$ZodStringFormat.init(inst, def);
		});
		const $ZodEmail = /*@__PURE__*/ $constructor("$ZodEmail", (inst, def) => {
			def.pattern ?? (def.pattern = email);
			$ZodStringFormat.init(inst, def);
		});
		/** Parses a URL for `$ZodURL`, applying the one guard the URL constructor cannot express. Returns the parsed URL, or a code naming the stage that rejected it — the runtime needs that distinction to pick an issue note, and compiled code only needs to know it is not a URL. */
		function parseURLObject(trimmed, def) {
			if (!def.normalize && def.protocol?.source === httpProtocol.source && !/^https?:\/\//i.test(trimmed)) return 1;
			try {
				return new URL(trimmed);
			} catch {
				return 2;
			}
		}
		const asciiTabOrNewline = /[\t\n\r]/g;
		/** The URL parser deletes every ASCII tab, LF and CR from its input before it parses, so `new URL("https://exa\nmple.com")` reports on `example.com`. Applying the same deletion to the returned value closes the half of that divergence which can move the host; the parser's other rewrite, stripping C0 controls at the edges, cannot. */
		function stripTabAndNewline(value) {
			return value.replace(asciiTabOrNewline, "");
		}
		function urlHostnameOk(url, hostname) {
			hostname.lastIndex = 0;
			return hostname.test(url.hostname);
		}
		function urlProtocolOk(url, protocol) {
			protocol.lastIndex = 0;
			return protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol);
		}
		const $ZodURL = /*@__PURE__*/ $constructor("$ZodURL", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				try {
					const trimmed = payload.value.trim();
					const url = parseURLObject(trimmed, def);
					if (url === 1) {
						payload.issues.push({
							code: "invalid_format",
							format: "url",
							note: "Invalid URL format",
							input: payload.value,
							inst,
							continue: !def.abort
						});
						return;
					}
					if (url === 2) {
						payload.issues.push({
							code: "invalid_format",
							format: "url",
							input: payload.value,
							inst,
							continue: !def.abort
						});
						return;
					}
					if (def.hostname && !urlHostnameOk(url, def.hostname)) payload.issues.push({
						code: "invalid_format",
						format: "url",
						note: "Invalid hostname",
						pattern: def.hostname.source,
						input: payload.value,
						inst,
						continue: !def.abort
					});
					if (def.protocol && !urlProtocolOk(url, def.protocol)) payload.issues.push({
						code: "invalid_format",
						format: "url",
						note: "Invalid protocol",
						pattern: def.protocol.source,
						input: payload.value,
						inst,
						continue: !def.abort
					});
					payload.value = def.normalize ? url.href : stripTabAndNewline(trimmed);
					return;
				} catch (_) {
					payload.issues.push({
						code: "invalid_format",
						format: "url",
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
			};
		});
		const $ZodEmoji = /*@__PURE__*/ $constructor("$ZodEmoji", (inst, def) => {
			def.pattern ?? (def.pattern = emoji());
			$ZodStringFormat.init(inst, def);
		});
		const $ZodNanoID = /*@__PURE__*/ $constructor("$ZodNanoID", (inst, def) => {
			if (def.length !== void 0 && (!Number.isInteger(def.length) || def.length < 1)) throw new Error(`Invalid nanoid length: ${def.length}`);
			def.pattern ?? (def.pattern = def.length === void 0 ? nanoid : nanoidOfLength(def.length));
			$ZodStringFormat.init(inst, def);
		});
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link $ZodCUID2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const $ZodCUID = /*@__PURE__*/ $constructor("$ZodCUID", (inst, def) => {
			def.pattern ?? (def.pattern = cuid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodCUID2 = /*@__PURE__*/ $constructor("$ZodCUID2", (inst, def) => {
			def.pattern ?? (def.pattern = cuid2);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodULID = /*@__PURE__*/ $constructor("$ZodULID", (inst, def) => {
			def.pattern ?? (def.pattern = ulid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodXID = /*@__PURE__*/ $constructor("$ZodXID", (inst, def) => {
			def.pattern ?? (def.pattern = xid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodKSUID = /*@__PURE__*/ $constructor("$ZodKSUID", (inst, def) => {
			def.pattern ?? (def.pattern = ksuid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODateTime = /*@__PURE__*/ $constructor("$ZodISODateTime", (inst, def) => {
			def.pattern ?? (def.pattern = datetime(def));
			$ZodStringFormat.init(inst, def);
			if (def.local || def.precision === -1) {
				inst._zod.bag.laxFormat = true;
				inst._zod.onattach.push((s) => {
					s._zod.bag.laxFormat = true;
				});
			}
		});
		const $ZodISODate = /*@__PURE__*/ $constructor("$ZodISODate", (inst, def) => {
			def.pattern ?? (def.pattern = date);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISOTime = /*@__PURE__*/ $constructor("$ZodISOTime", (inst, def) => {
			def.pattern ?? (def.pattern = time(def));
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODuration = /*@__PURE__*/ $constructor("$ZodISODuration", (inst, def) => {
			def.pattern ?? (def.pattern = duration);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodIPv4 = /*@__PURE__*/ $constructor("$ZodIPv4", (inst, def) => {
			def.pattern ?? (def.pattern = ipv4);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.format = `ipv4`;
		});
		/** An IPv6 address is written with hex digits, colons and dots, and nothing else. The guard is what makes the check below an IPv6 check: `new URL("http://[...]")` parses an authority, not an address, so `@` and `\` re-delimit it and `"::@1\\"` validates against the host `0.0.0.1`. The URL parser also deletes ASCII tab, LF and CR rather than failing, which is how `"::1\n"` validated as `::1`. */
		const ipv6Alphabet = /^[0-9a-fA-F:.]+$/;
		function isValidIPv6(value) {
			if (!ipv6Alphabet.test(value)) return false;
			try {
				new URL(`http://[${value}]`);
				return true;
			} catch {
				return false;
			}
		}
		const $ZodIPv6 = /*@__PURE__*/ $constructor("$ZodIPv6", (inst, def) => {
			def.pattern ?? (def.pattern = ipv6);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.format = `ipv6`;
			inst._zod.check = (payload) => {
				if (!isValidIPv6(payload.value)) payload.issues.push({
					code: "invalid_format",
					format: "ipv6",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCIDRv4 = /*@__PURE__*/ $constructor("$ZodCIDRv4", (inst, def) => {
			def.pattern ?? (def.pattern = cidrv4);
			$ZodStringFormat.init(inst, def);
		});
		function isValidCIDRv6(value) {
			const parts = value.split("/");
			if (parts.length !== 2) return false;
			const [address, prefix] = parts;
			if (!prefix) return false;
			const prefixNum = Number(prefix);
			if (`${prefixNum}` !== prefix) return false;
			if (prefixNum < 0 || prefixNum > 128) return false;
			return isValidIPv6(address);
		}
		const $ZodCIDRv6 = /*@__PURE__*/ $constructor("$ZodCIDRv6", (inst, def) => {
			def.pattern ?? (def.pattern = cidrv6);
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				if (!isValidCIDRv6(payload.value)) payload.issues.push({
					code: "invalid_format",
					format: "cidrv6",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		function isValidBase64(data) {
			if (data === "") return true;
			if (/\s/.test(data)) return false;
			if (data.length % 4 !== 0) return false;
			try {
				atob(data);
				return true;
			} catch {
				return false;
			}
		}
		const $ZodBase64 = /*@__PURE__*/ $constructor("$ZodBase64", (inst, def) => {
			def.pattern ?? (def.pattern = base64);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.contentEncoding = "base64";
			inst._zod.check = (payload) => {
				if (isValidBase64(payload.value)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "base64",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		function isValidBase64URL(data) {
			if (!base64url.test(data)) return false;
			const base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
			return isValidBase64(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
		}
		const $ZodBase64URL = /*@__PURE__*/ $constructor("$ZodBase64URL", (inst, def) => {
			def.pattern ?? (def.pattern = base64url);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.contentEncoding = "base64url";
			inst._zod.check = (payload) => {
				if (isValidBase64URL(payload.value)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "base64url",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodE164 = /*@__PURE__*/ $constructor("$ZodE164", (inst, def) => {
			def.pattern ?? (def.pattern = e164);
			$ZodStringFormat.init(inst, def);
		});
		function isValidJWT(token, algorithm = null) {
			try {
				const tokensParts = token.split(".");
				if (tokensParts.length !== 3) return false;
				const [header] = tokensParts;
				if (!header) return false;
				const parsedHeader = JSON.parse(atob(header));
				if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT") return false;
				if (!parsedHeader.alg) return false;
				if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm)) return false;
				return true;
			} catch {
				return false;
			}
		}
		const $ZodJWT = /*@__PURE__*/ $constructor("$ZodJWT", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				if (isValidJWT(payload.value, def.alg)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "jwt",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodNumber = /*@__PURE__*/ $constructor("$ZodNumber", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = inst._zod.bag.pattern ?? number$1;
			inst._zod.parse = (payload, _ctx) => {
				if (def.coerce) try {
					payload.value = Number(payload.value);
				} catch (_) {}
				const input = payload.value;
				if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) return payload;
				const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? String(input) : void 0 : void 0;
				payload.issues.push({
					expected: "number",
					code: "invalid_type",
					input,
					inst,
					...received ? { received } : {}
				});
				return payload;
			};
		});
		const $ZodNumberFormat = /*@__PURE__*/ $constructor("$ZodNumberFormat", (inst, def) => {
			$ZodCheckNumberFormat.init(inst, def);
			$ZodNumber.init(inst, def);
		});
		const $ZodUnknown = /*@__PURE__*/ $constructor("$ZodUnknown", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload) => payload;
		});
		const $ZodNever = /*@__PURE__*/ $constructor("$ZodNever", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, _ctx) => {
				payload.issues.push({
					expected: "never",
					code: "invalid_type",
					input: payload.value,
					inst
				});
				return payload;
			};
		});
		function handleArrayResult(result, final, index) {
			if (result.issues.length) final.issues.push(...prefixIssues(index, result.issues));
			final.value[index] = result.value;
		}
		const $ZodArray = /*@__PURE__*/ $constructor("$ZodArray", (inst, def) => {
			$ZodType.init(inst, def);
			const memo = globalConfig.memoizer;
			memo?.attach(inst);
			inst._zod.parse = (payload, ctx) => {
				const input = payload.value;
				if (!Array.isArray(input)) {
					payload.issues.push({
						expected: "array",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				payload.value = memo ? memo.alloc(inst, payload, Array(input.length), ctx) : Array(input.length);
				const proms = [];
				for (let i = 0; i < input.length; i++) {
					const item = input[i];
					const result = def.element._zod.run({
						value: item,
						issues: []
					}, ctx);
					if (result instanceof Promise) proms.push(result.then((result) => handleArrayResult(result, payload, i)));
					else handleArrayResult(result, payload, i);
				}
				if (proms.length) return Promise.all(proms).then(() => payload);
				return payload;
			};
		});
		function handlePropertyResult(result, final, key, input, optin, optout) {
			const isPresent = key in input;
			const isOptionalOut = optout === "optional";
			if (!isPresent && isOptionalOut && optin === "optional") return;
			if (result.issues.length) {
				if (optin !== void 0 && isOptionalOut && !isPresent) return;
				final.issues.push(...prefixIssues(key, result.issues));
			}
			if (!isPresent && optin === void 0) {
				if (!result.issues.length) final.issues.push({
					code: "invalid_type",
					expected: "nonoptional",
					input: void 0,
					path: [key]
				});
				return;
			}
			if (result.value === void 0) {
				if (isPresent) final.value[key] = void 0;
			} else final.value[key] = result.value;
		}
		const NO_SYMBOL_KEYS = [];
		function normalizeDef(def) {
			const keys = Object.keys(def.shape);
			const ownSymbols = Object.getOwnPropertySymbols(def.shape);
			const symbolKeys = ownSymbols.length ? ownSymbols : NO_SYMBOL_KEYS;
			const allKeys = symbolKeys.length ? [...keys, ...symbolKeys] : keys;
			for (const k of allKeys) if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${String(k)}": expected a Zod schema`);
			const okeys = optionalKeys(def.shape);
			return {
				...def,
				allKeys,
				symbolKeys,
				keySet: new Set(keys),
				numKeys: keys.length,
				optionalKeys: new Set(okeys)
			};
		}
		function handleCatchall(proms, input, payload, ctx, def, inst) {
			const unrecognized = [];
			const keySet = def.keySet;
			const _catchall = def.catchall._zod;
			const t = _catchall.def.type;
			const optin = _catchall.optin;
			const optout = _catchall.optout;
			for (const key in input) {
				if (keySet.has(key)) continue;
				if (key === "__proto__") {
					if (t === "never") unrecognized.push(key);
					continue;
				}
				if (t === "never") {
					unrecognized.push(key);
					continue;
				}
				const r = _catchall.run({
					value: input[key],
					issues: []
				}, ctx);
				if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, optin, optout)));
				else handlePropertyResult(r, payload, key, input, optin, optout);
			}
			if (unrecognized.length) payload.issues.push({
				code: "unrecognized_keys",
				keys: unrecognized,
				input,
				inst,
				continue: true
			});
			if (!proms.length) return payload;
			return Promise.all(proms).then(() => {
				return payload;
			});
		}
		const propShapes = /* @__PURE__ */ new WeakMap();
		const $ZodObject = /*@__PURE__*/ $constructor("$ZodObject", (inst, def) => {
			$ZodType.init(inst, def);
			if (!Object.getOwnPropertyDescriptor(def, "shape")?.get) {
				const sh = def.shape;
				propShapes.set(def, sh);
				Object.defineProperty(def, "shape", { get: () => {
					const newSh = { ...sh };
					Object.defineProperty(def, "shape", { value: newSh });
					propShapes.set(def, newSh);
					return newSh;
				} });
			}
			const _normalized = cached(() => normalizeDef(def));
			defineLazyInternal(inst, "propValues", (zod) => {
				const shape = zod.def.shape;
				const propValues = {};
				for (const key in shape) {
					const field = shape[key]._zod;
					if (field.values) {
						if (!Object.prototype.hasOwnProperty.call(propValues, key)) assignProp(propValues, key, /* @__PURE__ */ new Set());
						for (const v of field.values) propValues[key].add(v);
						if (field.optin !== void 0) propValues[key].add(void 0);
					}
				}
				return propValues;
			});
			const isObject$1 = isObject;
			const catchall = def.catchall;
			let value;
			const memo = globalConfig.memoizer;
			memo?.attach(inst);
			inst._zod.parse = (payload, ctx) => {
				value ?? (value = _normalized.value);
				const input = payload.value;
				if (!isObject$1(input)) {
					payload.issues.push({
						expected: "object",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				payload.value = memo ? memo.alloc(inst, payload, {}, ctx) : {};
				const proms = [];
				const shape = value.shape;
				for (const key of value.allKeys) {
					if (key === "__proto__") continue;
					const el = shape[key];
					const optin = el._zod.optin;
					const optout = el._zod.optout;
					const r = el._zod.run({
						value: input[key],
						issues: []
					}, ctx);
					if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, optin, optout)));
					else handlePropertyResult(r, payload, key, input, optin, optout);
				}
				if (!catchall) return proms.length ? Promise.all(proms).then(() => payload) : payload;
				return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
			};
		});
		const $ZodObjectJIT = /*@__PURE__*/ $constructor("$ZodObjectJIT", (inst, def) => {
			$ZodObject.init(inst, def);
			const superParse = inst._zod.parse;
			const _normalized = cached(() => normalizeDef(def));
			const memo = globalConfig.memoizer;
			const generateFastpass = (shape) => {
				const normalized = _normalized.value;
				const syms = normalized.symbolKeys;
				const doc = new Doc(["payload", "ctx"], {
					shape,
					inst,
					memo,
					syms
				});
				const parseStr = (k) => `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
				const prefixStr = (id, k) => `
          for (let i = 0; i < ${id}.issues.length; i++) {
            const iss = ${id}.issues[i];
            iss.path = iss.path ? [${k}, ...iss.path] : [${k}];
            payload.issues.push(iss);
          }`;
				doc.write(`const input = payload.value;`);
				const ids = Object.create(null);
				let counter = 0;
				for (const key of normalized.allKeys) ids[key] = `key_${counter++}`;
				doc.write(memo ? `const newResult = memo.alloc(inst, payload, {}, ctx);` : `const newResult = {};`);
				for (const key of normalized.allKeys) {
					if (key === "__proto__") continue;
					const id = ids[key];
					const k = typeof key === "symbol" ? `syms[${syms.indexOf(key)}]` : esc(key);
					const isPresent = `${k} in input`;
					const schema = shape[key];
					const optin = schema?._zod?.optin;
					const isOptionalIn = optin !== void 0;
					const isOptionalOut = schema?._zod?.optout === "optional";
					doc.write(`const ${id} = ${parseStr(k)};`);
					if (isOptionalIn && isOptionalOut) {
						const assign = optin === "optional" ? `${id}_present` : `${id}.value !== undefined || ${id}_present`;
						doc.write(`
        const ${id}_present = ${isPresent};
        if (!${id}.issues.length || ${id}_present) {
          if (${id}.issues.length) {${prefixStr(id, k)}
          }

          if (${assign}) {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
					} else if (!isOptionalIn) doc.write(`
        const ${id}_present = ${isPresent};
        if (${id}.issues.length) {${prefixStr(id, k)}
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
        }

        if (${id}_present) {
          newResult[${k}] = ${id}.value;
        }

      `);
					else doc.write(`
        if (${id}.issues.length) {${prefixStr(id, k)}
        }
        
        if (${id}.value === undefined) {
          if (${isPresent}) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }

      `);
				}
				doc.write(`payload.value = newResult;`);
				doc.write(`return payload;`);
				return doc.compile();
			};
			let fastpass;
			const isObject$2 = isObject;
			const jit = !globalConfig.jitless;
			const fastEnabled = jit && allowsEval.value;
			const catchall = def.catchall;
			let value;
			inst._zod.parse = (payload, ctx) => {
				value ?? (value = _normalized.value);
				const input = payload.value;
				if (!isObject$2(input)) {
					payload.issues.push({
						expected: "object",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
					if (!fastpass) fastpass = generateFastpass(def.shape);
					payload = fastpass(payload, ctx);
					if (!catchall) return payload;
					return handleCatchall([], input, payload, ctx, value, inst);
				}
				return superParse(payload, ctx);
			};
		});
		function handleUnionResults(results, final, inst, ctx) {
			for (const result of results) if (result.issues.length === 0) {
				final.value = result.value;
				return final;
			}
			const nonaborted = results.filter((r) => !aborted(r));
			if (nonaborted.length === 1) {
				final.value = nonaborted[0].value;
				return nonaborted[0];
			}
			final.issues.push({
				code: "invalid_union",
				input: final.value,
				inst,
				errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
			});
			return final;
		}
		const $ZodUnion = /*@__PURE__*/ $constructor("$ZodUnion", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazyInternal(inst, "optin", (zod) => zod.def.options.some((o) => o._zod.optin === "defaulted") ? "defaulted" : zod.def.options.some((o) => o._zod.optin !== void 0) ? "optional" : void 0);
			defineLazyInternal(inst, "optout", (zod) => zod.def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
			defineLazyInternal(inst, "values", (zod) => {
				if (zod.def.options.every((o) => o._zod.values)) return new Set(zod.def.options.flatMap((option) => Array.from(option._zod.values)));
			});
			defineLazyInternal(inst, "pattern", (zod) => {
				if (zod.def.options.every((o) => o._zod.pattern)) {
					const patterns = zod.def.options.map((o) => o._zod.pattern);
					return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
				}
			});
			const first = def.options.length === 1 ? def.options[0]._zod.run : null;
			inst._zod.parse = (payload, ctx) => {
				if (first) return first(payload, ctx);
				let async = false;
				const results = [];
				for (const option of def.options) {
					const result = option._zod.run({
						value: payload.value,
						issues: []
					}, ctx);
					if (result instanceof Promise) {
						results.push(result);
						async = true;
					} else {
						if (result.issues.length === 0) return result;
						results.push(result);
					}
				}
				if (!async) return handleUnionResults(results, payload, inst, ctx);
				return Promise.all(results).then((results) => {
					return handleUnionResults(results, payload, inst, ctx);
				});
			};
		});
		const $ZodIntersection = /*@__PURE__*/ $constructor("$ZodIntersection", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, ctx) => {
				const input = payload.value;
				const left = def.left._zod.run({
					value: input,
					issues: []
				}, ctx);
				const right = def.right._zod.run({
					value: input,
					issues: []
				}, ctx);
				if (left instanceof Promise || right instanceof Promise) return Promise.all([left, right]).then(([left, right]) => {
					return handleIntersectionResults(payload, left, right);
				});
				return handleIntersectionResults(payload, left, right);
			};
		});
		function mergeValues(a, b) {
			if (a === b) return {
				valid: true,
				data: a
			};
			if (a instanceof Date && b instanceof Date && +a === +b) return {
				valid: true,
				data: a
			};
			if (isPlainObject(a) && isPlainObject(b)) {
				const bKeys = Object.keys(b);
				const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
				const newObj = {
					...a,
					...b
				};
				if (Object.prototype.hasOwnProperty.call(newObj, "__proto__")) delete newObj.__proto__;
				for (const key of sharedKeys) {
					if (key === "__proto__") continue;
					const sharedValue = mergeValues(a[key], b[key]);
					if (!sharedValue.valid) return {
						valid: false,
						mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
					};
					newObj[key] = sharedValue.data;
				}
				return {
					valid: true,
					data: newObj
				};
			}
			if (Array.isArray(a) && Array.isArray(b)) {
				if (a.length !== b.length) return {
					valid: false,
					mergeErrorPath: []
				};
				const newArray = [];
				for (let index = 0; index < a.length; index++) {
					const itemA = a[index];
					const itemB = b[index];
					const sharedValue = mergeValues(itemA, itemB);
					if (!sharedValue.valid) return {
						valid: false,
						mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
					};
					newArray.push(sharedValue.data);
				}
				return {
					valid: true,
					data: newArray
				};
			}
			return {
				valid: false,
				mergeErrorPath: []
			};
		}
		function handleIntersectionResults(result, left, right) {
			const unrecKeys = /* @__PURE__ */ new Map();
			let unrecIssue;
			const keyIssues = /* @__PURE__ */ new Map();
			const collect = (iss, side) => {
				let keys;
				if (iss.code === "unrecognized_keys" && !iss.path?.length) {
					unrecIssue ?? (unrecIssue = iss);
					keys = iss.keys;
				} else if (iss.code === "invalid_key" && iss.origin === "record" && iss.path?.length === 1) {
					const k = String(iss.path[0]);
					if (!keyIssues.has(k)) keyIssues.set(k, iss);
					keys = [k];
				} else return false;
				for (const k of keys) {
					if (!unrecKeys.has(k)) unrecKeys.set(k, {});
					unrecKeys.get(k)[side] = true;
				}
				return true;
			};
			for (const iss of left.issues) if (!collect(iss, "l")) result.issues.push(iss);
			for (const iss of right.issues) if (!collect(iss, "r")) result.issues.push(iss);
			const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
			if (bothKeys.length) {
				const aggregated = unrecIssue ? bothKeys.filter((k) => unrecIssue.keys.includes(k)) : [];
				if (aggregated.length) result.issues.push({
					...unrecIssue,
					keys: aggregated
				});
				for (const k of bothKeys) if (!aggregated.includes(k) && keyIssues.has(k)) result.issues.push(keyIssues.get(k));
			}
			const merged = mergeValues(left.value, right.value);
			if (!merged.valid) {
				if (aborted(result)) return result;
				throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
			}
			result.value = merged.data;
			return result;
		}
		const $ZodTuple = /*@__PURE__*/ $constructor("$ZodTuple", (inst, def) => {
			$ZodType.init(inst, def);
			const items = def.items;
			const memo = globalConfig.memoizer;
			memo?.attach(inst);
			inst._zod.parse = (payload, ctx) => {
				const input = payload.value;
				if (!Array.isArray(input)) {
					payload.issues.push({
						input,
						inst,
						expected: "tuple",
						code: "invalid_type"
					});
					return payload;
				}
				payload.value = memo ? memo.alloc(inst, payload, [], ctx) : [];
				const proms = [];
				const optinStart = getTupleOptStart(items, "optin");
				const optoutStart = getTupleOptStart(items, "optout");
				if (!def.rest) {
					if (input.length < optinStart) {
						payload.issues.push({
							code: "too_small",
							minimum: optinStart,
							inclusive: true,
							input,
							inst,
							origin: "array"
						});
						return payload;
					}
					if (input.length > items.length) payload.issues.push({
						code: "too_big",
						maximum: items.length,
						inclusive: true,
						input,
						inst,
						origin: "array"
					});
				}
				const itemResults = new Array(items.length);
				for (let i = 0; i < items.length; i++) {
					const r = items[i]._zod.run({
						value: input[i],
						issues: []
					}, ctx);
					if (r instanceof Promise) proms.push(r.then((rr) => {
						itemResults[i] = rr;
					}));
					else itemResults[i] = r;
				}
				if (def.rest) {
					let i = items.length - 1;
					const rest = input.slice(items.length);
					for (const el of rest) {
						i++;
						const result = def.rest._zod.run({
							value: el,
							issues: []
						}, ctx);
						if (result instanceof Promise) proms.push(result.then((r) => handleTupleResult(r, payload, i)));
						else handleTupleResult(result, payload, i);
					}
				}
				if (proms.length) return Promise.all(proms).then(() => handleTupleResults(itemResults, payload, items, input, optoutStart));
				return handleTupleResults(itemResults, payload, items, input, optoutStart);
			};
		});
		function getTupleOptStart(items, key) {
			for (let i = items.length - 1; i >= 0; i--) if (!(key === "optin" ? items[i]._zod.optin !== void 0 : items[i]._zod.optout === "optional")) return i + 1;
			return 0;
		}
		function handleTupleResult(result, final, index) {
			if (result.issues.length) final.issues.push(...prefixIssues(index, result.issues));
			final.value[index] = result.value;
		}
		function handleTupleResults(itemResults, final, items, input, optoutStart) {
			for (let i = 0; i < items.length; i++) {
				const r = itemResults[i];
				const isPresent = i < input.length;
				if (!isPresent && i >= optoutStart && items[i]._zod.optin === "optional") {
					final.value.length = i;
					break;
				}
				if (r.issues.length) {
					if (!isPresent && i >= optoutStart) {
						final.value.length = i;
						break;
					}
					final.issues.push(...prefixIssues(i, r.issues));
				}
				final.value[i] = r.value;
			}
			for (let i = final.value.length - 1; i >= input.length; i--) if (items[i]._zod.optout === "optional" && final.value[i] === void 0) final.value.length = i;
			else break;
			return final;
		}
		const $ZodEnum = /*@__PURE__*/ $constructor("$ZodEnum", (inst, def) => {
			$ZodType.init(inst, def);
			const values = getEnumValues(def.entries);
			const valuesSet = new Set(values);
			inst._zod.values = valuesSet;
			const patternValues = values.filter((k) => propertyKeyTypes.has(typeof k));
			inst._zod.pattern = new RegExp(patternValues.length ? `^(${patternValues.map((o) => escapeRegex(o.toString())).join("|")})$` : "^[^\\s\\S]$");
			inst._zod.parse = (payload, _ctx) => {
				const input = payload.value;
				if (valuesSet.has(input)) return payload;
				payload.issues.push({
					code: "invalid_value",
					values,
					input,
					inst
				});
				return payload;
			};
		});
		const $ZodLiteral = /*@__PURE__*/ $constructor("$ZodLiteral", (inst, def) => {
			$ZodType.init(inst, def);
			const values = new Set(def.values);
			inst._zod.values = values;
			inst._zod.pattern = new RegExp(def.values.length ? `^(${def.values.map((o) => typeof o === "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o)).join("|")})$` : "^[^\\s\\S]$");
			inst._zod.parse = (payload, _ctx) => {
				const input = payload.value;
				if (values.has(input)) return payload;
				payload.issues.push({
					code: "invalid_value",
					values: def.values,
					input,
					inst
				});
				return payload;
			};
		});
		const $ZodTransform = /*@__PURE__*/ $constructor("$ZodTransform", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			globalConfig.memoizer?.guard(inst);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
				const _out = def.transform(payload.value, payload);
				if (ctx.async) return (_out instanceof Promise ? _out : Promise.resolve(_out)).then((output) => {
					payload.value = output;
					return payload;
				});
				if (_out instanceof Promise) throw new $ZodAsyncError();
				payload.value = _out;
				return payload;
			};
		});
		function handleOptionalResult(payload, result) {
			payload.value = result.issues.length ? void 0 : result.value;
			return payload;
		}
		const $ZodOptional = /*@__PURE__*/ $constructor("$ZodOptional", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional");
			inst._zod.optout = "optional";
			defineLazyInternal(inst, "values", (zod) => {
				const values = zod.def.innerType._zod.values;
				return values ? /* @__PURE__ */ new Set([...values, void 0]) : void 0;
			});
			defineLazyInternal(inst, "pattern", (zod) => {
				const pattern = zod.def.innerType._zod.pattern;
				return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				if (payload.value === void 0) {
					if (def.innerType._zod.optin !== "defaulted") return payload;
					const result = def.innerType._zod.run({
						value: payload.value,
						issues: []
					}, ctx);
					if (result instanceof Promise) return result.then((result) => handleOptionalResult(payload, result));
					return handleOptionalResult(payload, result);
				}
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodExactOptional = /*@__PURE__*/ $constructor("$ZodExactOptional", (inst, def) => {
			$ZodOptional.init(inst, def);
			defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
			defineLazyInternal(inst, "pattern", (zod) => zod.def.innerType._zod.pattern);
			inst._zod.parse = (payload, ctx) => {
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodNullable = /*@__PURE__*/ $constructor("$ZodNullable", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin);
			defineLazyInternal(inst, "optout", (zod) => zod.def.innerType._zod.optout);
			defineLazyInternal(inst, "pattern", (zod) => {
				const pattern = zod.def.innerType._zod.pattern;
				return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
			});
			defineLazyInternal(inst, "values", (zod) => {
				return zod.def.innerType._zod.values ? /* @__PURE__ */ new Set([...zod.def.innerType._zod.values, null]) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				if (payload.value === null) return payload;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodDefault = /*@__PURE__*/ $constructor("$ZodDefault", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "defaulted";
			defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				if (payload.value === void 0) {
					payload.value = def.defaultValue;
					/**
					* $ZodDefault returns the default value immediately in forward direction.
					* It doesn't pass the default value into the validator ("prefault"). There's no reason to pass the default value through validation. The validity of the default is enforced by TypeScript statically. Otherwise, it's the responsibility of the user to ensure the default is valid. In the case of pipes with divergent in/out types, you can specify the default on the `in` schema of your ZodPipe to set a "prefault" for the pipe.   */
					return payload;
				}
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => handleDefaultResult(result, def));
				return handleDefaultResult(result, def);
			};
		});
		function handleDefaultResult(payload, def) {
			if (payload.value === void 0) payload.value = def.defaultValue;
			return payload;
		}
		const $ZodPrefault = /*@__PURE__*/ $constructor("$ZodPrefault", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "defaulted";
			defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				if (payload.value === void 0) payload.value = def.defaultValue;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodNonOptional = /*@__PURE__*/ $constructor("$ZodNonOptional", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazyInternal(inst, "values", (zod) => {
				const v = zod.def.innerType._zod.values;
				return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => handleNonOptionalResult(result, inst));
				return handleNonOptionalResult(result, inst);
			};
		});
		function handleNonOptionalResult(payload, inst) {
			if (!payload.issues.length && payload.value === void 0) payload.issues.push({
				code: "invalid_type",
				expected: "nonoptional",
				input: payload.value,
				inst
			});
			return payload;
		}
		function handleCatchResult(payload, result, def, ctx) {
			if (!result.issues.length) {
				payload.value = result.value;
				if (result.memo) payload.memo = true;
				return payload;
			}
			payload.value = def.catchValue({
				...result,
				value: payload.value,
				error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
				input: payload.value
			});
			return payload;
		}
		const $ZodCatch = /*@__PURE__*/ $constructor("$ZodCatch", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional");
			defineLazyInternal(inst, "optout", (zod) => zod.def.innerType._zod.optout);
			defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				const result = def.innerType._zod.run({
					value: payload.value,
					issues: []
				}, ctx);
				if (result instanceof Promise) return result.then((result) => handleCatchResult(payload, result, def, ctx));
				return handleCatchResult(payload, result, def, ctx);
			};
		});
		const $ZodPipe = /*@__PURE__*/ $constructor("$ZodPipe", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazyInternal(inst, "values", (zod) => zod.def.in._zod.values);
			defineLazyInternal(inst, "optin", (zod) => zod.def.in._zod.optin);
			defineLazyInternal(inst, "optout", (zod) => zod.def.out._zod.optout);
			defineLazyInternal(inst, "propValues", (zod) => zod.def.in._zod.propValues);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") {
					const right = def.out._zod.run(payload, ctx);
					if (right instanceof Promise) return right.then((right) => handlePipeResult(right, def.in, ctx));
					return handlePipeResult(right, def.in, ctx);
				}
				const left = def.in._zod.run(payload, ctx);
				if (left instanceof Promise) return left.then((left) => handlePipeResult(left, def.out, ctx));
				return handlePipeResult(left, def.out, ctx);
			};
		});
		function handlePipeResult(left, next, ctx) {
			if (left.issues.some((iss) => iss.code !== "unrecognized_keys")) {
				left.aborted = true;
				return left;
			}
			return next._zod.run({
				value: left.value,
				issues: left.issues
			}, ctx);
		}
		const $ZodReadonly = /*@__PURE__*/ $constructor("$ZodReadonly", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazyInternal(inst, "propValues", (zod) => zod.def.innerType._zod.propValues);
			defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
			defineLazyInternal(inst, "optin", (zod) => zod.def.innerType?._zod?.optin);
			defineLazyInternal(inst, "optout", (zod) => zod.def.innerType?._zod?.optout);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then(handleReadonlyResult);
				return handleReadonlyResult(result);
			};
		});
		function handleReadonlyResult(payload) {
			if (!payload.memo) payload.value = Object.freeze(payload.value);
			return payload;
		}
		const $ZodCustom = /*@__PURE__*/ $constructor("$ZodCustom", (inst, def) => {
			$ZodCheck.init(inst, def);
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, _) => {
				return payload;
			};
			inst._zod.check = (payload) => {
				const input = payload.value;
				const r = def.fn(input);
				if (r instanceof Promise) return r.then((r) => handleRefineResult(r, payload, input, inst));
				handleRefineResult(r, payload, input, inst);
			};
		});
		function handleRefineResult(result, payload, input, inst) {
			if (!result) {
				const _iss = {
					code: "custom",
					input,
					inst,
					path: [...inst._zod.def.path ?? []],
					continue: !inst._zod.def.abort
				};
				if (inst._zod.def.params) _iss.params = inst._zod.def.params;
				payload.issues.push(issue(_iss));
			}
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/memoizer.js
		var $ZodCyclicError = class extends Error {
			constructor() {
				super(`Cannot parse a reference cycle that closes through a transform`);
				this.name = "ZodCyclicError";
			}
		};
		/** Keyed off the context object every schema in one parse call already shares. */
		const STATE = "~memo";
		const NO_ISSUES = [];
		function cloneIssues(issues) {
			return issues.map((iss) => iss.path ? {
				...iss,
				path: iss.path.slice()
			} : { ...iss });
		}
		const recursive = /*@__PURE__*/ new WeakMap();
		/** Whether this schema's subtree contains a cycle, so one parse can re-enter it. */
		function isRecursive(inst, stack) {
			const cached = recursive.get(inst);
			if (cached !== void 0) return cached;
			if (stack.has(inst)) return true;
			stack.add(inst);
			let result = false;
			const check = (child) => {
				if (!result && child?._zod && isRecursive(child, stack)) result = true;
			};
			const def = inst._zod.def;
			switch (def.type) {
				case "object":
					for (const key of Reflect.ownKeys(def.shape)) check(def.shape[key]);
					check(def.catchall);
					break;
				case "array":
					check(def.element);
					break;
				case "tuple":
					for (const el of def.items) check(el);
					check(def.rest);
					break;
				case "record":
				case "map":
					check(def.keyType);
					check(def.valueType);
					break;
				case "set":
					check(def.valueType);
					break;
				case "union":
					for (const el of def.options) check(el);
					break;
				case "intersection":
					check(def.left);
					check(def.right);
					break;
				case "optional":
				case "nullable":
				case "default":
				case "prefault":
				case "catch":
				case "readonly":
				case "nonoptional":
				case "promise":
				case "success":
					check(def.innerType);
					break;
				case "pipe":
					check(def.in);
					check(def.out);
					break;
				case "function":
					check(def.input);
					check(def.output);
					break;
				case "lazy":
					check(inst._zod.innerType);
					break;
				case "template_literal":
				case "string":
				case "number":
				case "int":
				case "boolean":
				case "bigint":
				case "symbol":
				case "undefined":
				case "null":
				case "void":
				case "never":
				case "any":
				case "unknown":
				case "date":
				case "nan":
				case "enum":
				case "literal":
				case "file":
				case "transform":
				case "custom": break;
				default: for (const key in def) {
					const desc = Object.getOwnPropertyDescriptor(def, key);
					if (!desc || desc.get) continue;
					const value = desc.value;
					if (!value || typeof value !== "object") continue;
					if (value._zod) check(value);
					else if (Array.isArray(value)) for (const el of value) check(el);
				}
			}
			stack.delete(inst);
			recursive.set(inst, result);
			return result;
		}
		function bucketFor(state, inst) {
			let bucket = state.buckets.get(inst);
			if (!bucket) {
				bucket = /* @__PURE__ */ new Map();
				state.buckets.set(inst, bucket);
			}
			return bucket;
		}
		let handoff;
		const open = [];
		const memo = {
			alloc(_inst, payload, empty) {
				const bucket = handoff;
				if (!bucket) return empty;
				handoff = void 0;
				const entry = {
					value: empty,
					issues: null
				};
				bucket.set(payload.value, entry);
				open.push(entry);
				return empty;
			},
			guard(inst) {
				var _a;
				(_a = inst._zod).deferred ?? (_a.deferred = []);
				inst._zod.deferred.push(() => {
					const base = inst._zod.parse;
					const wrapped = (payload, ctx) => {
						if (ctx.direction !== "backward" && isBackEdge(ctx, payload.value)) throw new $ZodCyclicError();
						return base(payload, ctx);
					};
					inst._zod.parse = wrapped;
					if (inst._zod.run === base) inst._zod.run = wrapped;
				});
			},
			attach(inst) {
				var _a;
				let isRecursiveInst;
				let lastCtx;
				let lastBucket;
				(_a = inst._zod).deferred ?? (_a.deferred = []);
				inst._zod.deferred.push(() => {
					const base = inst._zod.parse;
					const wrapped = (payload, ctx) => {
						if (isRecursiveInst === void 0) {
							isRecursiveInst = isRecursive(inst, /* @__PURE__ */ new Set());
							if (!isRecursiveInst) {
								inst._zod.parse = base;
								if (inst._zod.run === wrapped) inst._zod.run = base;
								return base(payload, ctx);
							}
						}
						const input = payload.value;
						if (input === null || typeof input !== "object") return base(payload, ctx);
						let state = ctx[STATE];
						if (!state) {
							state = {
								buckets: /* @__PURE__ */ new Map(),
								backEdges: void 0
							};
							ctx[STATE] = state;
						}
						let bucket;
						if (lastCtx === ctx) bucket = lastBucket;
						else {
							bucket = bucketFor(state, inst);
							lastCtx = ctx;
							lastBucket = bucket;
						}
						const hit = bucket.get(input);
						if (hit) {
							payload.value = hit.value;
							if (hit.issues) {
								if (hit.issues.length) payload.issues.push(...cloneIssues(hit.issues));
							} else {
								payload.memo = true;
								state.backEdges ?? (state.backEdges = /* @__PURE__ */ new Set());
								state.backEdges.add(hit.value);
							}
							return payload;
						}
						handoff = bucket;
						const depth = open.length;
						const result = base(payload, ctx);
						handoff = void 0;
						const entry = open.length > depth ? open.pop() : void 0;
						if (result instanceof Promise) return result.then((r) => {
							if (entry) entry.issues = r.issues.length ? cloneIssues(r.issues) : NO_ISSUES;
							return r;
						});
						if (entry) entry.issues = result.issues.length ? cloneIssues(result.issues) : NO_ISSUES;
						return result;
					};
					inst._zod.parse = wrapped;
					if (inst._zod.run === base) inst._zod.run = wrapped;
				});
			}
		};
		/** The memoizer that gives containers cycle support. `zod` installs it by default; `zod/mini` opts in with `config({ memoizer: memoizer() })`. */
		function memoizer() {
			return memo;
		}
		/** Whether this value is a node a back-edge resolved to before it finished. */
		function isBackEdge(ctx, value) {
			const backEdges = ctx[STATE]?.backEdges;
			return backEdges !== void 0 && value !== null && typeof value === "object" && backEdges.has(value);
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/locales/en.js
		const error = () => {
			const Sizable = {
				string: {
					unit: "characters",
					verb: "to have"
				},
				file: {
					unit: "bytes",
					verb: "to have"
				},
				array: {
					unit: "items",
					verb: "to have"
				},
				set: {
					unit: "items",
					verb: "to have"
				},
				map: {
					unit: "entries",
					verb: "to have"
				}
			};
			function getSizing(origin) {
				return Sizable[origin] ?? null;
			}
			const FormatDictionary = {
				regex: "input",
				email: "email address",
				url: "URL",
				emoji: "emoji",
				uuid: "UUID",
				uuidv4: "UUIDv4",
				uuidv6: "UUIDv6",
				nanoid: "nanoid",
				guid: "GUID",
				cuid: "cuid",
				cuid2: "cuid2",
				ulid: "ULID",
				xid: "XID",
				ksuid: "KSUID",
				datetime: "ISO datetime",
				date: "ISO date",
				time: "ISO time",
				duration: "ISO duration",
				ipv4: "IPv4 address",
				ipv6: "IPv6 address",
				mac: "MAC address",
				cidrv4: "IPv4 range",
				cidrv6: "IPv6 range",
				base64: "base64-encoded string",
				base64url: "base64url-encoded string",
				json_string: "JSON string",
				e164: "E.164 number",
				credit_card: "credit card number",
				jwt: "JWT",
				template_literal: "input"
			};
			const TypeDictionary = { nan: "NaN" };
			function getTypeName(type, input) {
				if (type === "number" && typeof input === "number" && !Number.isFinite(input)) return String(input);
				return TypeDictionary[type] ?? type;
			}
			return (issue) => {
				switch (issue.code) {
					case "invalid_type": return `Invalid input: expected ${getTypeName(issue.expected)}, received ${getTypeName(parsedType(issue.input), issue.input)}`;
					case "invalid_value":
						if (issue.values.length === 1) return `Invalid input: expected ${stringifyPrimitive(issue.values[0])}`;
						return `Invalid option: expected one of ${joinValues(issue.values, "|")}`;
					case "too_big": {
						const adj = issue.exact ? "exactly " : issue.inclusive ? "<=" : "<";
						const sizing = getSizing(issue.origin);
						if (sizing) return `Too big: expected ${issue.origin ?? "value"} to have ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elements"}`;
						return `Too big: expected ${issue.origin ?? "value"} to be ${adj}${issue.maximum.toString()}`;
					}
					case "too_small": {
						const adj = issue.exact ? "exactly " : issue.inclusive ? ">=" : ">";
						const sizing = getSizing(issue.origin);
						if (sizing) return `Too small: expected ${issue.origin} to have ${adj}${issue.minimum.toString()} ${sizing.unit}`;
						return `Too small: expected ${issue.origin} to be ${adj}${issue.minimum.toString()}`;
					}
					case "invalid_format": {
						const _issue = issue;
						if (_issue.format === "starts_with") return `Invalid string: must start with "${_issue.prefix}"`;
						if (_issue.format === "ends_with") return `Invalid string: must end with "${_issue.suffix}"`;
						if (_issue.format === "includes") return `Invalid string: must include "${_issue.includes}"`;
						if (_issue.format === "regex") return `Invalid string: must match pattern ${_issue.pattern}`;
						return `Invalid ${FormatDictionary[_issue.format] ?? issue.format}`;
					}
					case "not_multiple_of": return `Invalid number: must be a multiple of ${issue.divisor}`;
					case "unrecognized_keys": return `Unrecognized key${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
					case "invalid_key": return `Invalid key in ${issue.origin}`;
					case "invalid_union":
						if (issue.options && Array.isArray(issue.options) && issue.options.length > 0) return `Invalid discriminator value. Expected ${issue.options.map((o) => `'${o}'`).join(" | ")}`;
						if (issue.inclusive === false) return "Invalid input: more than one option matched";
						return "Invalid input";
					case "invalid_element": return `Invalid value in ${issue.origin}`;
					default: return `Invalid input`;
				}
			};
		};
		function en_default() {
			return { localeError: error() };
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/registries.js
		var _a;
		var $ZodRegistry = class {
			constructor() {
				this._map = /* @__PURE__ */ new WeakMap();
				this._idmap = /* @__PURE__ */ new Map();
			}
			add(schema, ..._meta) {
				const meta = _meta[0];
				this._map.set(schema, meta);
				if (meta && typeof meta === "object" && "id" in meta) this._idmap.set(meta.id, schema);
				return this;
			}
			clear() {
				this._map = /* @__PURE__ */ new WeakMap();
				this._idmap = /* @__PURE__ */ new Map();
				return this;
			}
			remove(schema) {
				const meta = this._map.get(schema);
				if (meta && typeof meta === "object" && "id" in meta) this._idmap.delete(meta.id);
				this._map.delete(schema);
				return this;
			}
			get(schema) {
				const p = schema._zod.parent;
				if (p) {
					const pm = { ...this.get(p) ?? {} };
					delete pm.id;
					const f = {
						...pm,
						...this._map.get(schema)
					};
					return Object.keys(f).length ? f : void 0;
				}
				return this._map.get(schema);
			}
			has(schema) {
				return this._map.has(schema);
			}
		};
		function registry() {
			return new $ZodRegistry();
		}
		(_a = globalThis).__zod_globalRegistry ?? (_a.__zod_globalRegistry = registry());
		const globalRegistry = globalThis.__zod_globalRegistry;
		//#endregion
		//#region node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/api.js
		// @__NO_SIDE_EFFECTS__
		function _string(Class, params) {
			return new Class({
				type: "string",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _email(Class, params) {
			return new Class({
				type: "string",
				format: "email",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _guid(Class, params) {
			return new Class({
				type: "string",
				format: "guid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuid(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv4(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v4",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv6(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v6",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv7(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v7",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _url(Class, params) {
			return new Class({
				type: "string",
				format: "url",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _emoji(Class, params) {
			return new Class({
				type: "string",
				format: "emoji",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _nanoid(Class, params) {
			return new Class({
				type: "string",
				format: "nanoid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link _cuid2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		// @__NO_SIDE_EFFECTS__
		function _cuid(Class, params) {
			return new Class({
				type: "string",
				format: "cuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cuid2(Class, params) {
			return new Class({
				type: "string",
				format: "cuid2",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ulid(Class, params) {
			return new Class({
				type: "string",
				format: "ulid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _xid(Class, params) {
			return new Class({
				type: "string",
				format: "xid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ksuid(Class, params) {
			return new Class({
				type: "string",
				format: "ksuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ipv4(Class, params) {
			return new Class({
				type: "string",
				format: "ipv4",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ipv6(Class, params) {
			return new Class({
				type: "string",
				format: "ipv6",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cidrv4(Class, params) {
			return new Class({
				type: "string",
				format: "cidrv4",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cidrv6(Class, params) {
			return new Class({
				type: "string",
				format: "cidrv6",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _base64(Class, params) {
			return new Class({
				type: "string",
				format: "base64",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _base64url(Class, params) {
			return new Class({
				type: "string",
				format: "base64url",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _e164(Class, params) {
			return new Class({
				type: "string",
				format: "e164",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _jwt(Class, params) {
			return new Class({
				type: "string",
				format: "jwt",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDateTime(Class, params) {
			return new Class({
				type: "string",
				format: "datetime",
				check: "string_format",
				offset: false,
				local: false,
				precision: null,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDate(Class, params) {
			return new Class({
				type: "string",
				format: "date",
				check: "string_format",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoTime(Class, params) {
			return new Class({
				type: "string",
				format: "time",
				check: "string_format",
				precision: null,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDuration(Class, params) {
			return new Class({
				type: "string",
				format: "duration",
				check: "string_format",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _number(Class, params) {
			return new Class({
				type: "number",
				checks: [],
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _int(Class, params) {
			return new Class({
				type: "number",
				check: "number_format",
				abort: false,
				format: "safeint",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _unknown(Class) {
			return new Class({ type: "unknown" });
		}
		// @__NO_SIDE_EFFECTS__
		function _never(Class, params) {
			return new Class({
				type: "never",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lt(value, params) {
			return new $ZodCheckLessThan({
				check: "less_than",
				...normalizeParams(params),
				value,
				inclusive: false
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lte(value, params) {
			return new $ZodCheckLessThan({
				check: "less_than",
				...normalizeParams(params),
				value,
				inclusive: true
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _gt(value, params) {
			return new $ZodCheckGreaterThan({
				check: "greater_than",
				...normalizeParams(params),
				value,
				inclusive: false
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _gte(value, params) {
			return new $ZodCheckGreaterThan({
				check: "greater_than",
				...normalizeParams(params),
				value,
				inclusive: true
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _multipleOf(value, params) {
			return new $ZodCheckMultipleOf({
				check: "multiple_of",
				...normalizeParams(params),
				value
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _maxLength(maximum, params) {
			return new $ZodCheckMaxLength({
				check: "max_length",
				...normalizeParams(params),
				maximum
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _minLength(minimum, params) {
			return new $ZodCheckMinLength({
				check: "min_length",
				...normalizeParams(params),
				minimum
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _length(length, params) {
			return new $ZodCheckLengthEquals({
				check: "length_equals",
				...normalizeParams(params),
				length
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _regex(pattern, params) {
			return new $ZodCheckRegex({
				check: "string_format",
				format: "regex",
				...normalizeParams(params),
				pattern
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lowercase(params) {
			return new $ZodCheckLowerCase({
				check: "string_format",
				format: "lowercase",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uppercase(params) {
			return new $ZodCheckUpperCase({
				check: "string_format",
				format: "uppercase",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _includes(includes, params) {
			return new $ZodCheckIncludes({
				check: "string_format",
				format: "includes",
				...normalizeParams(params),
				includes
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _startsWith(prefix, params) {
			return new $ZodCheckStartsWith({
				check: "string_format",
				format: "starts_with",
				...normalizeParams(params),
				prefix
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _endsWith(suffix, params) {
			return new $ZodCheckEndsWith({
				check: "string_format",
				format: "ends_with",
				...normalizeParams(params),
				suffix
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _overwrite(tx) {
			return new $ZodCheckOverwrite({
				check: "overwrite",
				tx
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _normalize(form) {
			return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
		}
		// @__NO_SIDE_EFFECTS__
		function _trim() {
			return /* @__PURE__ */ _overwrite((input) => input.trim());
		}
		// @__NO_SIDE_EFFECTS__
		function _toLowerCase() {
			return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
		}
		// @__NO_SIDE_EFFECTS__
		function _toUpperCase() {
			return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
		}
		// @__NO_SIDE_EFFECTS__
		function _slugify() {
			return /* @__PURE__ */ _overwrite((input) => slugify(input));
		}
		// @__NO_SIDE_EFFECTS__
		function _array(Class, element, params) {
			return new Class({
				type: "array",
				element,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _refine(Class, fn, _params) {
			return new Class({
				type: "custom",
				check: "custom",
				fn,
				...normalizeParams(_params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _superRefine(fn, params) {
			const ch = /* @__PURE__ */ _check((payload) => {
				payload.addIssue = (issue$2) => {
					if (typeof issue$2 === "string") payload.issues.push(issue(issue$2, payload.value, ch._zod.def));
					else {
						const _issue = issue$2;
						if (_issue.fatal) _issue.continue = false;
						_issue.code ?? (_issue.code = "custom");
						if (!("input" in _issue)) _issue.input = payload.value;
						_issue.inst ?? (_issue.inst = ch);
						_issue.continue ?? (_issue.continue = !ch._zod.def.abort);
						payload.issues.push(issue(_issue));
					}
				};
				return fn(payload.value, payload);
			}, params);
			return ch;
		}
		// @__NO_SIDE_EFFECTS__
		function _check(fn, params) {
			const ch = new $ZodCheck({
				check: "custom",
				...normalizeParams(params)
			});
			ch._zod.check = fn;
			return ch;
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/to-json-schema.js
		function assignProps(target, ...sources) {
			for (const source of sources) for (const key of Reflect.ownKeys(source)) if (Object.prototype.propertyIsEnumerable.call(source, key)) assignProp(target, key, source[key]);
			return target;
		}
		function initializeContext(params) {
			let target = params?.target ?? "draft-2020-12";
			if (target === "draft-4") target = "draft-04";
			if (target === "draft-7") target = "draft-07";
			return {
				processors: params.processors ?? {},
				metadataRegistry: params?.metadata ?? globalRegistry,
				target,
				unrepresentable: params?.unrepresentable ?? "throw",
				override: params?.override ?? (() => {}),
				io: params?.io ?? "output",
				counter: 0,
				seen: /* @__PURE__ */ new Map(),
				sharedDefsExtractedFor: void 0,
				sharedEmitDoneFor: void 0,
				cycles: params?.cycles ?? "ref",
				reused: params?.reused ?? "inline",
				intersections: [],
				deferred: [],
				external: params?.external ?? void 0
			};
		}
		/**
		* Applies the `unrepresentable` setting at a site that has no JSON Schema equivalent. Throws
		* `message` unless the setting (or the handler's return value) says otherwise. Returns `true` if a
		* custom JSON Schema was written into `json`, in which case the caller must not write its own.
		*/
		function handleUnrepresentable(schema, ctx, json, params, message) {
			const result = typeof ctx.unrepresentable === "function" ? ctx.unrepresentable({
				zodSchema: schema,
				path: params.path,
				message
			}) : ctx.unrepresentable;
			if (result === "any") return false;
			if (result === void 0 || result === "throw") throw new Error(message);
			Object.assign(json, result);
			return true;
		}
		function process(schema, ctx, _params = {
			path: [],
			schemaPath: []
		}) {
			var _a;
			const def = schema._zod.def;
			const seen = ctx.seen.get(schema);
			if (seen) {
				seen.count++;
				if (_params.schemaPath.includes(schema)) seen.cycle = _params.path;
				return seen.schema;
			}
			const result = {
				schema: {},
				count: 1,
				cycle: void 0,
				path: _params.path
			};
			ctx.seen.set(schema, result);
			ctx.sharedDefsExtractedFor = void 0;
			ctx.sharedEmitDoneFor = void 0;
			const overrideSchema = schema._zod.toJSONSchema?.();
			if (overrideSchema) result.schema = overrideSchema;
			else {
				const params = {
					..._params,
					schemaPath: [..._params.schemaPath, schema],
					path: _params.path
				};
				if (schema._zod.processJSONSchema) schema._zod.processJSONSchema(ctx, result.schema, params);
				else {
					const _json = result.schema;
					const processor = ctx.processors[def.type];
					if (!processor) throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
					processor(schema, ctx, _json, params);
				}
				const parent = schema._zod.parent;
				if (parent) {
					if (!result.ref) result.ref = parent;
					process(parent, ctx, params);
					ctx.seen.get(parent).isParent = true;
				}
			}
			const meta = ctx.metadataRegistry.get(schema);
			if (meta) assignProps(result.schema, meta);
			if (ctx.io === "input" && isTransforming(schema)) {
				delete result.schema.examples;
				delete result.schema.default;
			}
			if (ctx.io === "input" && "_prefault" in result.schema) (_a = result.schema).default ?? (_a.default = result.schema._prefault);
			delete result.schema._prefault;
			return ctx.seen.get(schema).schema;
		}
		function encodeJSONPointerSegment(segment) {
			return segment.replace(/~/g, "~0").replace(/\//g, "~1");
		}
		function extractDefs(ctx, schema) {
			const root = ctx.seen.get(schema);
			if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
			if (ctx.external && ctx.sharedDefsExtractedFor === ctx.external) return;
			const idToSchema = /* @__PURE__ */ new Map();
			for (const entry of ctx.seen.entries()) {
				const id = ctx.metadataRegistry.get(entry[0])?.id;
				if (id) {
					const existing = idToSchema.get(id);
					if (existing && existing !== entry[0]) throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
					idToSchema.set(id, entry[0]);
				}
			}
			const makeURI = (entry) => {
				const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
				if (ctx.external) {
					const externalId = ctx.external.registry.get(entry[0])?.id;
					const uriGenerator = ctx.external.uri ?? ((id) => id);
					if (externalId) return { ref: uriGenerator(externalId) };
					const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
					entry[1].defId = id;
					return {
						defId: id,
						ref: `${uriGenerator("__shared")}#/${defsSegment}/${encodeJSONPointerSegment(id)}`
					};
				}
				const uriPrefix = `#`;
				const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
				if (entry[1] === root && !entry[1].schema.id) return { ref: uriPrefix };
				const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
				return {
					defId,
					ref: defUriPrefix + encodeJSONPointerSegment(defId)
				};
			};
			const extractToDef = (entry) => {
				if (entry[1].schema.$ref) return;
				const seen = entry[1];
				const { ref, defId } = makeURI(entry);
				seen.def = { ...seen.schema };
				if (defId) seen.defId = defId;
				const schema = seen.schema;
				for (const key in schema) delete schema[key];
				schema.$ref = ref;
			};
			if (ctx.cycles === "throw") for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (seen.cycle) throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
			}
			for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (schema === entry[0]) {
					extractToDef(entry);
					continue;
				}
				if (ctx.external) {
					const ext = ctx.external.registry.get(entry[0])?.id;
					if (schema !== entry[0] && ext) {
						extractToDef(entry);
						continue;
					}
				}
				if (ctx.metadataRegistry.get(entry[0])?.id) {
					extractToDef(entry);
					continue;
				}
				if (seen.cycle) {
					extractToDef(entry);
					continue;
				}
				if (seen.count > 1) {
					if (ctx.reused === "ref") {
						extractToDef(entry);
						continue;
					}
				}
			}
			if (ctx.external) ctx.sharedDefsExtractedFor = ctx.external;
		}
		/** Rewrites `anyOf: [{type: "a"}, {type: "b"}]` to `type: ["a", "b"]`, which every JSON Schema draft treats as equivalent and most consumers render far better for the nullable case. Only branches that are a bare type assertion qualify — anything carrying a constraint, `$ref`, `const` or metadata is left alone. Runs after `flattenRef`, so a branch an override decorated or `$defs` extraction turned into a `$ref` is no longer bare and correctly stays in `anyOf`. `oneOf` is excluded: `integer` and `number` overlap, so "exactly one" and "at least one" are not the same there. OpenAPI 3.0 is excluded: its `type` must be a single string. */
		function compactTypeUnion(schema) {
			const options = schema.anyOf;
			if (!Array.isArray(options) || options.length === 0 || schema.type !== void 0) return;
			const types = [];
			for (const option of options) {
				if (!option || typeof option !== "object") return;
				compactTypeUnion(option);
				const keys = Object.keys(option);
				if (keys.length !== 1 || keys[0] !== "type") return;
				const type = option.type;
				for (const member of Array.isArray(type) ? type : [type]) {
					if (typeof member !== "string") return;
					if (!types.includes(member)) types.push(member);
				}
			}
			delete schema.anyOf;
			schema.type = types.length === 1 ? types[0] : types;
		}
		/** Keywords `foldIntersection` knows how to combine. Anything else — `$ref`, `patternProperties`,
		* an annotation like `description` — makes a member unfoldable, so a constraint this does not
		* understand leaves the `allOf` alone instead of being silently dropped or misattributed. */
		const FOLDABLE_KEYS = /* @__PURE__ */ new Set([
			"type",
			"properties",
			"required",
			"additionalProperties"
		]);
		const UNION_KEYS = ["oneOf", "anyOf"];
		/** A member's constraint on a key it does not declare itself. A `catchall` states one; `false`, an absent `additionalProperties`, and the empty schema a loose object emits state nothing. */
		function undeclaredConstraint(member) {
			const extra = member.additionalProperties;
			if (extra === void 0 || extra === false || typeof extra !== "object" || extra === null) return null;
			return Object.keys(extra).length ? extra : null;
		}
		/** Combines object members into the single object they describe together, or returns `null` if any of them carries a keyword outside {@link FOLDABLE_KEYS}. */
		function foldObjects(members) {
			const objects = [];
			for (const member of members) {
				if (typeof member !== "object" || member.type !== "object") return null;
				for (const key in member) if (!FOLDABLE_KEYS.has(key)) return null;
				objects.push(member);
			}
			const properties = {};
			const required = /* @__PURE__ */ new Set();
			for (const object of objects) {
				for (const key in object.properties) {
					if (Object.prototype.hasOwnProperty.call(properties, key)) continue;
					const parts = [];
					for (const other of objects) {
						const part = other.properties?.[key] ?? undeclaredConstraint(other);
						if (part === null || part === void 0) continue;
						if (!parts.some((seen) => JSON.stringify(seen) === JSON.stringify(part))) parts.push(part);
					}
					assignProp(properties, key, parts.length === 1 ? parts[0] : foldObjects(parts) ?? { allOf: parts });
				}
				for (const key of object.required ?? []) required.add(key);
			}
			const folded = {
				type: "object",
				properties
			};
			if (required.size) folded.required = [...required];
			if (objects.every((object) => object.additionalProperties === false)) folded.additionalProperties = false;
			else {
				const constraints = [];
				for (const object of objects) {
					const constraint = undeclaredConstraint(object);
					if (constraint && !constraints.some((seen) => JSON.stringify(seen) === JSON.stringify(constraint))) constraints.push(constraint);
				}
				if (constraints.length === 1) folded.additionalProperties = constraints[0];
				else if (constraints.length > 1) folded.additionalProperties = { allOf: constraints };
			}
			return folded;
		}
		/** `additionalProperties` in an `allOf` member sees only that member's own `properties`, so two
		* closed object members reject each other's keys and the schema validates nothing. Zod's parser
		* pools the key sets instead — `handleIntersectionResults` reports a key as unrecognized only when
		* *every* side rejects it — so the emitted schema has to pool them too, and folding the members
		* into one object is the encoding that says so on every target.
		*
		* This runs from `finalize`, after `extractDefs`, which is what keeps it clear of the `$ref`
		* machinery: a member extracted into `$defs` is already a `$ref` by now and declines to fold, so it
		* keeps its reference and its own closedness rather than being inlined as a stale copy. */
		function foldIntersection(json) {
			const allOf = json.allOf;
			if (!Array.isArray(allOf) || allOf.length < 2) return;
			for (const key of FOLDABLE_KEYS) if (key in json) return;
			const unions = allOf.filter((m) => UNION_KEYS.some((k) => Array.isArray(m[k])));
			let folded = null;
			if (!unions.length) folded = foldObjects(allOf);
			else {
				const union = unions[0];
				const keyword = UNION_KEYS.find((k) => Array.isArray(union[k]));
				if (Object.keys(union).length !== 1) return;
				const rest = allOf.filter((m) => m !== union);
				const branches = union[keyword].map((branch) => foldObjects([...rest, branch]));
				if (branches.some((b) => !b)) return;
				folded = { [keyword]: branches };
			}
			if (!folded) return;
			delete json.allOf;
			assignProps(json, folded);
		}
		function finalize(ctx, schema) {
			const root = ctx.seen.get(schema);
			if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
			const flattenRef = (zodSchema) => {
				const seen = ctx.seen.get(zodSchema);
				if (seen.ref === null) return;
				const schema = seen.def ?? seen.schema;
				const _cached = { ...schema };
				const ref = seen.ref;
				seen.ref = null;
				if (ref) {
					flattenRef(ref);
					const refSeen = ctx.seen.get(ref);
					const refSchema = refSeen.schema;
					if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
						schema.allOf = schema.allOf ?? [];
						schema.allOf.push(refSchema);
					} else assignProps(schema, refSchema);
					assignProps(schema, _cached);
					if (zodSchema._zod.parent === ref) for (const key in schema) {
						if (key === "$ref" || key === "allOf") continue;
						if (!(key in _cached)) delete schema[key];
					}
					if (refSchema.$ref && refSeen.def) for (const key in schema) {
						if (key === "$ref" || key === "allOf") continue;
						if (key in refSeen.def && JSON.stringify(schema[key]) === JSON.stringify(refSeen.def[key])) delete schema[key];
					}
				}
				const parent = zodSchema._zod.parent;
				if (parent && parent !== ref) {
					flattenRef(parent);
					const parentSeen = ctx.seen.get(parent);
					if (parentSeen?.schema.$ref) {
						schema.$ref = parentSeen.schema.$ref;
						if (parentSeen.def) for (const key in schema) {
							if (key === "$ref" || key === "allOf") continue;
							if (key in parentSeen.def && JSON.stringify(schema[key]) === JSON.stringify(parentSeen.def[key])) delete schema[key];
						}
					}
				}
				ctx.override({
					zodSchema,
					jsonSchema: schema,
					path: seen.path ?? []
				});
			};
			if (!ctx.external || ctx.sharedEmitDoneFor !== ctx.external) {
				for (const entry of [...ctx.seen.entries()].reverse()) flattenRef(entry[0]);
				if (ctx.target !== "openapi-3.0") for (const entry of ctx.seen.entries()) compactTypeUnion(entry[1].def ?? entry[1].schema);
				for (const rewrite of ctx.deferred) rewrite();
				if (ctx.intersections.length) {
					const carriers = /* @__PURE__ */ new Map();
					for (const seen of ctx.seen.values()) for (const json of [seen.schema, seen.def]) {
						const allOf = json?.allOf;
						if (!Array.isArray(allOf)) continue;
						const existing = carriers.get(allOf);
						if (existing) existing.push(json);
						else carriers.set(allOf, [json]);
					}
					for (const allOf of ctx.intersections) for (const json of carriers.get(allOf) ?? []) foldIntersection(json);
				}
			}
			const result = {};
			if (ctx.target === "draft-2020-12") result.$schema = "https://json-schema.org/draft/2020-12/schema";
			else if (ctx.target === "draft-07") result.$schema = "http://json-schema.org/draft-07/schema#";
			else if (ctx.target === "draft-04") result.$schema = "http://json-schema.org/draft-04/schema#";
			else if (ctx.target === "openapi-3.0") {}
			if (ctx.external?.uri) {
				const id = ctx.external.registry.get(schema)?.id;
				if (!id) throw new Error("Schema is missing an `id` property");
				result.$id = ctx.external.uri(id);
			}
			assignProps(result, root.defId ? root.schema : root.def ?? root.schema);
			const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
			if (rootMetaId !== void 0 && result.id === rootMetaId) delete result.id;
			const defs = ctx.external?.defs ?? {};
			if (!ctx.external || ctx.sharedEmitDoneFor !== ctx.external) for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (seen.def && seen.defId) {
					if (seen.def.id === seen.defId) delete seen.def.id;
					assignProp(defs, seen.defId, seen.def);
				}
			}
			if (ctx.external) ctx.sharedEmitDoneFor = ctx.external;
			if (ctx.external) {} else if (Object.keys(defs).length > 0) {
				if (ctx.target === "draft-2020-12") result.$defs = defs;
				else result.definitions = defs;
			}
			try {
				const finalized = JSON.parse(JSON.stringify(result));
				Object.defineProperty(finalized, "~standard", {
					value: {
						...schema["~standard"],
						jsonSchema: {
							input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
							output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
						}
					},
					enumerable: false,
					writable: false
				});
				return finalized;
			} catch (_err) {
				throw new Error("Error converting schema to JSON.");
			}
		}
		function isTransforming(_schema, _ctx) {
			const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
			if (ctx.seen.has(_schema)) return false;
			ctx.seen.add(_schema);
			const def = _schema._zod.def;
			if (def.type === "transform") return true;
			if (def.type === "array") return isTransforming(def.element, ctx);
			if (def.type === "set") return isTransforming(def.valueType, ctx);
			if (def.type === "lazy") return isTransforming(def.getter(), ctx);
			if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault" || def.type === "catch") return isTransforming(def.innerType, ctx);
			if (def.type === "intersection") return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
			if (def.type === "record" || def.type === "map") return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
			if (def.type === "pipe") {
				if (_schema._zod.traits.has("$ZodCodec")) return true;
				return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
			}
			if (def.type === "object") {
				for (const key in def.shape) if (isTransforming(def.shape[key], ctx)) return true;
				return false;
			}
			if (def.type === "union") {
				for (const option of def.options) if (isTransforming(option, ctx)) return true;
				return false;
			}
			if (def.type === "tuple") {
				for (const item of def.items) if (isTransforming(item, ctx)) return true;
				if (def.rest && isTransforming(def.rest, ctx)) return true;
				return false;
			}
			return false;
		}
		/**
		* Creates a toJSONSchema method for a schema instance.
		* This encapsulates the logic of initializing context, processing, extracting defs, and finalizing.
		*/
		const createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
			const ctx = initializeContext({
				...params,
				processors
			});
			process(schema, ctx);
			extractDefs(ctx, schema);
			return finalize(ctx, schema);
		};
		const createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
			const { libraryOptions, target } = params ?? {};
			const ctx = initializeContext({
				...libraryOptions ?? {},
				target,
				io,
				processors
			});
			process(schema, ctx);
			extractDefs(ctx, schema);
			return finalize(ctx, schema);
		};
		//#endregion
		//#region node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/json-schema-processors.js
		const formatMap = {
			guid: "uuid",
			url: "uri",
			datetime: "date-time",
			json_string: "json-string",
			regex: ""
		};
		const stringProcessor = (schema, ctx, _json, _params) => {
			const json = _json;
			json.type = "string";
			const { minimum, maximum, format, patterns, contentEncoding, laxFormat } = schema._zod.bag;
			if (typeof minimum === "number") json.minLength = minimum;
			if (typeof maximum === "number") json.maxLength = maximum;
			if (format) {
				json.format = formatMap[format] ?? format;
				if (json.format === "") delete json.format;
				if (format === "time" || laxFormat) delete json.format;
			}
			if (contentEncoding) json.contentEncoding = contentEncoding;
			if (patterns && patterns.size > 0) {
				const patternList = [...patterns];
				if (patternList.length === 1) json.pattern = patternList[0].source;
				else if (patternList.length > 1) json.allOf = [...patternList.map((regex) => ({
					...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
					pattern: regex.source
				}))];
			}
		};
		const numberProcessor = (schema, ctx, _json, params) => {
			const json = _json;
			const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
			if (typeof format === "string" && format.includes("int")) json.type = "integer";
			else json.type = "number";
			const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
			const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
			const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
			if (exMin) {
				if (legacy) {
					json.minimum = exclusiveMinimum;
					json.exclusiveMinimum = true;
				} else json.exclusiveMinimum = exclusiveMinimum;
			} else if (typeof minimum === "number") json.minimum = minimum;
			if (exMax) {
				if (legacy) {
					json.maximum = exclusiveMaximum;
					json.exclusiveMaximum = true;
				} else json.exclusiveMaximum = exclusiveMaximum;
			} else if (typeof maximum === "number") json.maximum = maximum;
			if (typeof multipleOf === "number") {
				if (Number.isFinite(multipleOf) && multipleOf !== 0) json.multipleOf = Math.abs(multipleOf);
				else handleUnrepresentable(schema, ctx, json, params, `A multipleOf divisor of ${multipleOf} cannot be represented in JSON Schema`);
			}
		};
		const neverProcessor = (_schema, _ctx, json, _params) => {
			json.not = {};
		};
		const enumProcessor = (schema, _ctx, json, _params) => {
			const def = schema._zod.def;
			const values = getEnumValues(def.entries);
			if (values.length === 0) {
				json.not = {};
				return;
			}
			if (values.every((v) => typeof v === "number")) json.type = "number";
			if (values.every((v) => typeof v === "string")) json.type = "string";
			json.enum = values;
		};
		const literalProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			if (def.values.length === 0) {
				json.not = {};
				return;
			}
			const vals = [];
			for (const val of def.values) if (val === void 0) {
				if (handleUnrepresentable(schema, ctx, json, params, "Literal `undefined` cannot be represented in JSON Schema")) return;
			} else if (typeof val === "bigint") {
				if (handleUnrepresentable(schema, ctx, json, params, "BigInt literals cannot be represented in JSON Schema")) return;
				vals.push(Number(val));
			} else vals.push(val);
			if (vals.length === 0) {} else if (vals.length === 1) {
				const val = vals[0];
				json.type = val === null ? "null" : typeof val;
				if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") json.enum = [val];
				else json.const = val;
			} else {
				if (vals.every((v) => typeof v === "number")) json.type = "number";
				if (vals.every((v) => typeof v === "string")) json.type = "string";
				if (vals.every((v) => typeof v === "boolean")) json.type = "boolean";
				if (vals.every((v) => v === null)) json.type = "null";
				json.enum = vals;
			}
		};
		const customProcessor = (schema, ctx, json, params) => {
			handleUnrepresentable(schema, ctx, json, params, "Custom types cannot be represented in JSON Schema");
		};
		const transformProcessor = (schema, ctx, json, params) => {
			handleUnrepresentable(schema, ctx, json, params, "Transforms cannot be represented in JSON Schema");
		};
		const arrayProcessor = (schema, ctx, _json, params) => {
			const json = _json;
			const def = schema._zod.def;
			const { minimum, maximum } = schema._zod.bag;
			if (typeof minimum === "number") json.minItems = minimum;
			if (typeof maximum === "number") json.maxItems = maximum;
			json.type = "array";
			json.items = process(def.element, ctx, {
				...params,
				path: [...params.path, "items"]
			});
		};
		function inputOptin(schema) {
			const def = schema._zod.def;
			if (def.type === "pipe" && def.in._zod.traits.has("$ZodTransform")) return inputOptin(def.out);
			if (def.type === "catch") return inputOptin(def.innerType);
			return schema._zod.optin;
		}
		const objectProcessor = (schema, ctx, _json, params) => {
			const json = _json;
			const def = schema._zod.def;
			const shape = def.shape;
			if (Object.getOwnPropertySymbols(shape).length && handleUnrepresentable(schema, ctx, json, params, "Symbol keys cannot be represented in JSON Schema")) return;
			json.type = "object";
			json.properties = {};
			for (const key in shape) assignProp(json.properties, key, process(shape[key], ctx, {
				...params,
				path: [
					...params.path,
					"properties",
					key
				]
			}));
			const allKeys = new Set(Object.keys(shape));
			const requiredKeys = new Set([...allKeys].filter((key) => {
				const field = def.shape[key];
				if (ctx.io === "input") return inputOptin(field) === void 0;
				else return field._zod.optout === void 0;
			}));
			if (requiredKeys.size > 0) json.required = Array.from(requiredKeys);
			if (def.catchall?._zod.def.type === "never") json.additionalProperties = false;
			else if (!def.catchall) {
				if (ctx.io === "output") json.additionalProperties = false;
			} else if (def.catchall) json.additionalProperties = process(def.catchall, ctx, {
				...params,
				path: [...params.path, "additionalProperties"]
			});
		};
		const unionProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const isExclusive = def.inclusive === false;
			const options = def.options.map((x, i) => process(x, ctx, {
				...params,
				path: [
					...params.path,
					isExclusive ? "oneOf" : "anyOf",
					i
				]
			}));
			if (isExclusive) json.oneOf = options;
			else json.anyOf = options;
		};
		const intersectionProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const a = process(def.left, ctx, {
				...params,
				path: [
					...params.path,
					"allOf",
					0
				]
			});
			const b = process(def.right, ctx, {
				...params,
				path: [
					...params.path,
					"allOf",
					1
				]
			});
			const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
			const allOf = [...isSimpleIntersection(a) ? a.allOf : [a], ...isSimpleIntersection(b) ? b.allOf : [b]];
			json.allOf = allOf;
			ctx.intersections.push(allOf);
		};
		const tupleProcessor = (schema, ctx, _json, params) => {
			const json = _json;
			const def = schema._zod.def;
			json.type = "array";
			const prefixPath = ctx.target === "draft-2020-12" ? "prefixItems" : "items";
			const restPath = ctx.target === "draft-2020-12" ? "items" : ctx.target === "openapi-3.0" ? "items" : "additionalItems";
			const prefixItems = def.items.map((x, i) => process(x, ctx, {
				...params,
				path: [
					...params.path,
					prefixPath,
					i
				]
			}));
			const rest = def.rest ? process(def.rest, ctx, {
				...params,
				path: [
					...params.path,
					restPath,
					...ctx.target === "openapi-3.0" ? [def.items.length] : []
				]
			}) : null;
			let minItems = def.items.length;
			while (minItems > 0) {
				const item = def.items[minItems - 1];
				if (!(ctx.io === "input" ? inputOptin(item) !== void 0 : item._zod.optout === "optional")) break;
				minItems--;
			}
			const maxItems = def.items.length;
			const isClosed = !def.rest;
			if (ctx.target === "draft-2020-12") {
				json.prefixItems = prefixItems;
				if (isClosed) json.items = false;
				else if (rest) json.items = rest;
				if (minItems > 0) json.minItems = minItems;
				if (isClosed) json.maxItems = maxItems;
			} else if (ctx.target === "openapi-3.0") {
				json.items = { anyOf: prefixItems };
				if (rest) json.items.anyOf.push(rest);
				if (minItems > 0) json.minItems = minItems;
				if (isClosed) json.maxItems = maxItems;
			} else {
				json.items = prefixItems;
				if (isClosed) json.additionalItems = false;
				else if (rest) json.additionalItems = rest;
				if (minItems > 0) json.minItems = minItems;
				if (isClosed) json.maxItems = maxItems;
			}
			const { minimum, maximum } = schema._zod.bag;
			if (typeof minimum === "number") json.minItems = minimum;
			if (typeof maximum === "number") json.maxItems = maximum;
		};
		const nullableProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const inner = process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			if (ctx.target === "openapi-3.0") {
				seen.ref = def.innerType;
				json.nullable = true;
			} else json.anyOf = [inner, { type: "null" }];
		};
		const nonoptionalProcessor = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
		};
		/** Round-trips a default value through JSON so the emitted schema is guaranteed to be valid JSON.
		* A BigInt has no reliable encoding, so it goes through `unrepresentable` like any other
		* unrepresentable value. Returns a sentinel when the caller must not write a default of its own. */
		const UNREPRESENTABLE_DEFAULT = Symbol();
		function serializeDefaultValue(value, schema, ctx, json, params) {
			let unrepresentable = false;
			const serialized = JSON.stringify(value, (_, val) => {
				if (typeof val !== "bigint") return val;
				unrepresentable = true;
				return null;
			});
			if (!unrepresentable) return JSON.parse(serialized);
			handleUnrepresentable(schema, ctx, json, params, "BigInt defaults cannot be represented in JSON Schema");
			return UNREPRESENTABLE_DEFAULT;
		}
		const defaultProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			const value = serializeDefaultValue(def.defaultValue, schema, ctx, json, params);
			if (value !== UNREPRESENTABLE_DEFAULT) json.default = value;
		};
		const prefaultProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			if (ctx.io !== "input") return;
			const value = serializeDefaultValue(def.defaultValue, schema, ctx, json, params);
			if (value !== UNREPRESENTABLE_DEFAULT) json._prefault = value;
		};
		const catchProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			let catchValue;
			try {
				catchValue = def.catchValue(void 0);
			} catch {
				handleUnrepresentable(schema, ctx, json, params, "Dynamic catch values are not supported in JSON Schema");
				return;
			}
			json.default = catchValue;
		};
		const pipeProcessor = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			const inIsTransform = def.in._zod.traits.has("$ZodTransform");
			const innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
			process(innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = innerType;
		};
		const readonlyProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			json.readOnly = true;
		};
		const optionalProcessor = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
		};
		//#endregion
		//#region node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/classic/errors.js
		const _installedErrorProtos = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
		function _lazyMethod(proto, key, make) {
			Object.defineProperty(proto, key, {
				configurable: true,
				enumerable: false,
				get() {
					const value = make(this);
					Object.defineProperty(this, key, {
						value,
						configurable: true,
						writable: true
					});
					return value;
				},
				set(value) {
					Object.defineProperty(this, key, {
						value,
						configurable: true,
						writable: true
					});
				}
			});
		}
		const initializer = (inst, issues) => {
			$ZodError.init(inst, issues);
			inst.name = "ZodError";
			const proto = Object.getPrototypeOf(inst);
			if (_installedErrorProtos.has(proto)) return;
			_installedErrorProtos.add(proto);
			_lazyMethod(proto, "format", (self) => (mapper) => formatError(self, mapper));
			_lazyMethod(proto, "flatten", (self) => (mapper) => flattenError(self, mapper));
			_lazyMethod(proto, "addIssue", (self) => (issue) => {
				self.issues.push(issue);
				self.message = JSON.stringify(self.issues, jsonStringifyReplacer, 2);
			});
			_lazyMethod(proto, "addIssues", (self) => (issues) => {
				self.issues.push(...issues);
				self.message = JSON.stringify(self.issues, jsonStringifyReplacer, 2);
			});
			Object.defineProperty(proto, "isEmpty", {
				configurable: true,
				enumerable: false,
				get() {
					return this.issues.length === 0;
				}
			});
		};
		const ZodRealError = /*@__PURE__*/ $constructor("ZodError", initializer, void 0, { Parent: Error });
		//#endregion
		//#region node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/classic/parse.js
		const parse = /* @__PURE__ */ _parse(ZodRealError);
		const parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
		const safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
		const safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);
		const encode = /* @__PURE__ */ _encode(ZodRealError);
		const decode = /* @__PURE__ */ _decode(ZodRealError);
		const encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
		const decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
		const safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
		const safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
		const safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
		const safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);
		//#endregion
		//#region node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/classic/schemas.js
		function _ensureDefaultLocale() {
			if (!globalConfig.localeError) config(en_default());
		}
		function _ensureDefaultMemoizer() {
			if (!globalConfig.memoizer) config({ memoizer: memoizer() });
		}
		const ZodType = /*@__PURE__*/ $constructor("ZodType", (inst, def) => {
			_ensureDefaultLocale();
			$ZodType.init(inst, def);
			inst.def = def;
			inst.type = def.type;
			return inst;
		}, {
			check(...chks) {
				const def = this.def;
				return this.clone(mergeDefs(def, { checks: [...def.checks ?? [], ...chks.map((ch) => typeof ch === "function" ? { _zod: {
					check: ch,
					def: { check: "custom" },
					onattach: []
				} } : ch)] }), { parent: true });
			},
			with(...chks) {
				return this.check(...chks);
			},
			clone(def, params) {
				return clone(this, def, params);
			},
			brand() {
				return this;
			},
			register(reg, meta) {
				reg.add(this, meta);
				return this;
			},
			refine(check, params) {
				return this.check(refine(check, params));
			},
			superRefine(refinement, params) {
				return this.check(superRefine(refinement, params));
			},
			overwrite(fn) {
				return this.check(/* @__PURE__ */ _overwrite(fn));
			},
			optional() {
				return optional(this);
			},
			exactOptional() {
				return exactOptional(this);
			},
			nullable() {
				return nullable(this);
			},
			nullish() {
				return optional(nullable(this));
			},
			nonoptional(params) {
				return nonoptional(this, params);
			},
			array() {
				return array(this);
			},
			or(arg) {
				return union([this, arg]);
			},
			and(arg) {
				return intersection(this, arg);
			},
			transform(tx) {
				return pipe(this, transform(tx));
			},
			default(d) {
				return _default(this, d);
			},
			prefault(d) {
				return prefault(this, d);
			},
			catch(params) {
				return _catch(this, params);
			},
			pipe(target) {
				return pipe(this, target);
			},
			readonly() {
				return readonly(this);
			},
			describe(description) {
				const cl = this.clone();
				globalRegistry.add(cl, { description });
				return cl;
			},
			meta(...args) {
				if (args.length === 0) return globalRegistry.get(this);
				const cl = this.clone();
				globalRegistry.add(cl, args[0]);
				return cl;
			},
			isOptional() {
				return this.safeParse(void 0).success;
			},
			isNullable() {
				return this.safeParse(null).success;
			},
			apply(fn, ...args) {
				return args.length === 0 ? fn(this) : fn(this, ...args);
			},
			get "~standard"() {
				return hide(this, "~standard", {
					...standardProps(this),
					jsonSchema: {
						input: createStandardJSONSchemaMethod(this, "input"),
						output: createStandardJSONSchemaMethod(this, "output")
					}
				});
			},
			set "~standard"(value) {
				own(this, "~standard", value);
			},
			parse: function _parse(data, params) {
				return parse(this, data, params, { callee: _parse });
			},
			parseAsync: async function _parseAsync(data, params) {
				return await parseAsync(this, data, params, { callee: _parseAsync });
			},
			safeParse(data, params) {
				return safeParse(this, data, params);
			},
			async safeParseAsync(data, params) {
				return safeParseAsync(this, data, params);
			},
			get spa() {
				return this?.safeParseAsync;
			},
			set spa(value) {
				own(this, "spa", value);
			},
			encode: function _encode(data, params) {
				return encode(this, data, params, { callee: _encode });
			},
			decode: function _decode(data, params) {
				return decode(this, data, params, { callee: _decode });
			},
			encodeAsync: async function _encodeAsync(data, params) {
				return await encodeAsync(this, data, params, { callee: _encodeAsync });
			},
			decodeAsync: async function _decodeAsync(data, params) {
				return await decodeAsync(this, data, params, { callee: _decodeAsync });
			},
			safeEncode(data, params) {
				return safeEncode(this, data, params);
			},
			safeDecode(data, params) {
				return safeDecode(this, data, params);
			},
			async safeEncodeAsync(data, params) {
				return safeEncodeAsync(this, data, params);
			},
			async safeDecodeAsync(data, params) {
				return safeDecodeAsync(this, data, params);
			},
			toJSONSchema(params) {
				return createToJSONSchemaMethod(this, {})(params);
			},
			get description() {
				return globalRegistry.get(this)?.description;
			},
			get _def() {
				return this._zod.def;
			}
		});
		/** @internal */
		const _ZodString = /*@__PURE__*/ $constructor("_ZodString", (inst, def) => {
			$ZodString.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
			const bag = inst._zod.bag;
			inst.format = bag.format ?? null;
			inst.minLength = bag.minimum ?? null;
			inst.maxLength = bag.maximum ?? null;
		}, {
			regex(...args) {
				return this.check(/* @__PURE__ */ _regex(...args));
			},
			includes(...args) {
				return this.check(/* @__PURE__ */ _includes(...args));
			},
			startsWith(...args) {
				return this.check(/* @__PURE__ */ _startsWith(...args));
			},
			endsWith(...args) {
				return this.check(/* @__PURE__ */ _endsWith(...args));
			},
			min(...args) {
				return this.check(/* @__PURE__ */ _minLength(...args));
			},
			max(...args) {
				return this.check(/* @__PURE__ */ _maxLength(...args));
			},
			length(...args) {
				return this.check(/* @__PURE__ */ _length(...args));
			},
			nonempty(...args) {
				return this.check(/* @__PURE__ */ _minLength(1, ...args));
			},
			lowercase(params) {
				return this.check(/* @__PURE__ */ _lowercase(params));
			},
			uppercase(params) {
				return this.check(/* @__PURE__ */ _uppercase(params));
			},
			trim() {
				return this.check(/* @__PURE__ */ _trim());
			},
			normalize(...args) {
				return this.check(/* @__PURE__ */ _normalize(...args));
			},
			toLowerCase() {
				return this.check(/* @__PURE__ */ _toLowerCase());
			},
			toUpperCase() {
				return this.check(/* @__PURE__ */ _toUpperCase());
			},
			slugify() {
				return this.check(/* @__PURE__ */ _slugify());
			}
		});
		const ZodString = /*@__PURE__*/ $constructor("ZodString", (inst, def) => {
			$ZodString.init(inst, def);
			_ZodString.init(inst, def);
		}, {
			email(params) {
				return this.check(/* @__PURE__ */ _email(ZodEmail, params));
			},
			url(params) {
				return this.check(/* @__PURE__ */ _url(ZodURL, params));
			},
			jwt(params) {
				return this.check(/* @__PURE__ */ _jwt(ZodJWT, params));
			},
			emoji(params) {
				return this.check(/* @__PURE__ */ _emoji(ZodEmoji, params));
			},
			guid(params) {
				return this.check(/* @__PURE__ */ _guid(ZodGUID, params));
			},
			uuid(params) {
				return this.check(/* @__PURE__ */ _uuid(ZodUUID, params));
			},
			uuidv4(params) {
				return this.check(/* @__PURE__ */ _uuidv4(ZodUUID, params));
			},
			uuidv6(params) {
				return this.check(/* @__PURE__ */ _uuidv6(ZodUUID, params));
			},
			uuidv7(params) {
				return this.check(/* @__PURE__ */ _uuidv7(ZodUUID, params));
			},
			nanoid(params) {
				return this.check(/* @__PURE__ */ _nanoid(ZodNanoID, params));
			},
			cuid(params) {
				return this.check(/* @__PURE__ */ _cuid(ZodCUID, params));
			},
			cuid2(params) {
				return this.check(/* @__PURE__ */ _cuid2(ZodCUID2, params));
			},
			ulid(params) {
				return this.check(/* @__PURE__ */ _ulid(ZodULID, params));
			},
			base64(params) {
				return this.check(/* @__PURE__ */ _base64(ZodBase64, params));
			},
			base64url(params) {
				return this.check(/* @__PURE__ */ _base64url(ZodBase64URL, params));
			},
			xid(params) {
				return this.check(/* @__PURE__ */ _xid(ZodXID, params));
			},
			ksuid(params) {
				return this.check(/* @__PURE__ */ _ksuid(ZodKSUID, params));
			},
			ipv4(params) {
				return this.check(/* @__PURE__ */ _ipv4(ZodIPv4, params));
			},
			ipv6(params) {
				return this.check(/* @__PURE__ */ _ipv6(ZodIPv6, params));
			},
			cidrv4(params) {
				return this.check(/* @__PURE__ */ _cidrv4(ZodCIDRv4, params));
			},
			cidrv6(params) {
				return this.check(/* @__PURE__ */ _cidrv6(ZodCIDRv6, params));
			},
			e164(params) {
				return this.check(/* @__PURE__ */ _e164(ZodE164, params));
			},
			datetime(params) {
				return this.check(/* @__PURE__ */ _isoDateTime(ZodISODateTime, params));
			},
			date(params) {
				return this.check(/* @__PURE__ */ _isoDate(ZodISODate, params));
			},
			time(params) {
				return this.check(/* @__PURE__ */ _isoTime(ZodISOTime, params));
			},
			duration(params) {
				return this.check(/* @__PURE__ */ _isoDuration(ZodISODuration, params));
			}
		});
		function string(params) {
			return /* @__PURE__ */ _string(ZodString, params);
		}
		const ZodStringFormat = /*@__PURE__*/ $constructor("ZodStringFormat", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			_ZodString.init(inst, def);
		});
		const ZodISODateTime = /*@__PURE__*/ $constructor("ZodISODateTime", (inst, def) => {
			$ZodISODateTime.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodISODate = /*@__PURE__*/ $constructor("ZodISODate", (inst, def) => {
			$ZodISODate.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodISOTime = /*@__PURE__*/ $constructor("ZodISOTime", (inst, def) => {
			$ZodISOTime.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodISODuration = /*@__PURE__*/ $constructor("ZodISODuration", (inst, def) => {
			$ZodISODuration.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodEmail = /*@__PURE__*/ $constructor("ZodEmail", (inst, def) => {
			$ZodEmail.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodGUID = /*@__PURE__*/ $constructor("ZodGUID", (inst, def) => {
			$ZodGUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodUUID = /*@__PURE__*/ $constructor("ZodUUID", (inst, def) => {
			$ZodUUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodURL = /*@__PURE__*/ $constructor("ZodURL", (inst, def) => {
			$ZodURL.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodEmoji = /*@__PURE__*/ $constructor("ZodEmoji", (inst, def) => {
			$ZodEmoji.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodNanoID = /*@__PURE__*/ $constructor("ZodNanoID", (inst, def) => {
			$ZodNanoID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link ZodCUID2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const ZodCUID = /*@__PURE__*/ $constructor("ZodCUID", (inst, def) => {
			$ZodCUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCUID2 = /*@__PURE__*/ $constructor("ZodCUID2", (inst, def) => {
			$ZodCUID2.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodULID = /*@__PURE__*/ $constructor("ZodULID", (inst, def) => {
			$ZodULID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodXID = /*@__PURE__*/ $constructor("ZodXID", (inst, def) => {
			$ZodXID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodKSUID = /*@__PURE__*/ $constructor("ZodKSUID", (inst, def) => {
			$ZodKSUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodIPv4 = /*@__PURE__*/ $constructor("ZodIPv4", (inst, def) => {
			$ZodIPv4.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodIPv6 = /*@__PURE__*/ $constructor("ZodIPv6", (inst, def) => {
			$ZodIPv6.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCIDRv4 = /*@__PURE__*/ $constructor("ZodCIDRv4", (inst, def) => {
			$ZodCIDRv4.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCIDRv6 = /*@__PURE__*/ $constructor("ZodCIDRv6", (inst, def) => {
			$ZodCIDRv6.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodBase64 = /*@__PURE__*/ $constructor("ZodBase64", (inst, def) => {
			$ZodBase64.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodBase64URL = /*@__PURE__*/ $constructor("ZodBase64URL", (inst, def) => {
			$ZodBase64URL.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodE164 = /*@__PURE__*/ $constructor("ZodE164", (inst, def) => {
			$ZodE164.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodJWT = /*@__PURE__*/ $constructor("ZodJWT", (inst, def) => {
			$ZodJWT.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodNumber = /*@__PURE__*/ $constructor("ZodNumber", (inst, def) => {
			$ZodNumber.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params);
			const bag = inst._zod.bag;
			inst.minValue = Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
			inst.maxValue = Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
			inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? .5);
			inst.isFinite = true;
			inst.format = bag.format ?? null;
		}, {
			gt(value, params) {
				return this.check(/* @__PURE__ */ _gt(value, params));
			},
			gte(value, params) {
				return this.check(/* @__PURE__ */ _gte(value, params));
			},
			min(value, params) {
				return this.check(/* @__PURE__ */ _gte(value, params));
			},
			lt(value, params) {
				return this.check(/* @__PURE__ */ _lt(value, params));
			},
			lte(value, params) {
				return this.check(/* @__PURE__ */ _lte(value, params));
			},
			max(value, params) {
				return this.check(/* @__PURE__ */ _lte(value, params));
			},
			int(params) {
				return this.check(int(params));
			},
			safe(params) {
				return this.check(int(params));
			},
			positive(params) {
				return this.check(/* @__PURE__ */ _gt(0, params));
			},
			nonnegative(params) {
				return this.check(/* @__PURE__ */ _gte(0, params));
			},
			negative(params) {
				return this.check(/* @__PURE__ */ _lt(0, params));
			},
			nonpositive(params) {
				return this.check(/* @__PURE__ */ _lte(0, params));
			},
			multipleOf(value, params) {
				return this.check(/* @__PURE__ */ _multipleOf(value, params));
			},
			step(value, params) {
				return this.check(/* @__PURE__ */ _multipleOf(value, params));
			},
			finite() {
				return this;
			}
		});
		function number(params) {
			return /* @__PURE__ */ _number(ZodNumber, params);
		}
		const ZodNumberFormat = /*@__PURE__*/ $constructor("ZodNumberFormat", (inst, def) => {
			$ZodNumberFormat.init(inst, def);
			ZodNumber.init(inst, def);
		});
		function int(params) {
			return /* @__PURE__ */ _int(ZodNumberFormat, params);
		}
		const ZodUnknown = /*@__PURE__*/ $constructor("ZodUnknown", (inst, def) => {
			$ZodUnknown.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => void 0;
		});
		function unknown() {
			return /* @__PURE__ */ _unknown(ZodUnknown);
		}
		const ZodNever = /*@__PURE__*/ $constructor("ZodNever", (inst, def) => {
			$ZodNever.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
		});
		function never(params) {
			return /* @__PURE__ */ _never(ZodNever, params);
		}
		const ZodArray = /*@__PURE__*/ $constructor("ZodArray", (inst, def) => {
			_ensureDefaultMemoizer();
			$ZodArray.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
			inst.element = def.element;
		}, {
			min(n, params) {
				return this.check(/* @__PURE__ */ _minLength(n, params));
			},
			nonempty(params) {
				return this.check(/* @__PURE__ */ _minLength(1, params));
			},
			max(n, params) {
				return this.check(/* @__PURE__ */ _maxLength(n, params));
			},
			length(n, params) {
				return this.check(/* @__PURE__ */ _length(n, params));
			},
			unwrap() {
				return this.element;
			}
		});
		function array(element, params) {
			return /* @__PURE__ */ _array(ZodArray, element, params);
		}
		const ZodObject = /*@__PURE__*/ $constructor("ZodObject", (inst, def) => {
			_ensureDefaultMemoizer();
			$ZodObjectJIT.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
			installLazyProp(inst, "shape", (self) => self._zod.def.shape, false);
		}, {
			keyof() {
				return _enum(Object.keys(this._zod.def.shape));
			},
			catchall(catchall) {
				return this.clone({
					...this._zod.def,
					catchall
				});
			},
			passthrough() {
				return this.clone({
					...this._zod.def,
					catchall: unknown()
				});
			},
			loose() {
				return this.clone({
					...this._zod.def,
					catchall: unknown()
				});
			},
			strict() {
				return this.clone({
					...this._zod.def,
					catchall: never()
				});
			},
			strip() {
				return this.clone({
					...this._zod.def,
					catchall: void 0
				});
			},
			extend(incoming) {
				return extend(this, incoming);
			},
			safeExtend(incoming) {
				return safeExtend(this, incoming);
			},
			merge(other) {
				return merge(this, other);
			},
			pick(mask) {
				return pick(this, mask);
			},
			omit(mask) {
				return omit(this, mask);
			},
			partial(...args) {
				return partial(ZodOptional, this, args[0]);
			},
			exactPartial(...args) {
				return partial(ZodExactOptional, this, args[0], "exactPartial");
			},
			required(...args) {
				return required(ZodNonOptional, this, args[0]);
			}
		});
		function object(shape, params) {
			const def = {
				type: "object",
				shape: shape ?? {},
				...normalizeParams(params)
			};
			return new ZodObject(def);
		}
		const ZodUnion = /*@__PURE__*/ $constructor("ZodUnion", (inst, def) => {
			$ZodUnion.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
			inst.options = def.options;
		});
		function union(options, params) {
			return new ZodUnion({
				type: "union",
				options,
				...normalizeParams(params)
			});
		}
		const ZodIntersection = /*@__PURE__*/ $constructor("ZodIntersection", (inst, def) => {
			$ZodIntersection.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
		});
		function intersection(left, right) {
			return new ZodIntersection({
				type: "intersection",
				left,
				right
			});
		}
		const ZodTuple = /*@__PURE__*/ $constructor("ZodTuple", (inst, def) => {
			_ensureDefaultMemoizer();
			$ZodTuple.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => tupleProcessor(inst, ctx, json, params);
		}, {
			rest(rest) {
				return this.clone({
					...this._zod.def,
					rest
				});
			},
			partial() {
				const def = this._zod.def;
				if (def.checks?.length) throw new Error(".partial() cannot be used on tuple schemas containing refinements");
				return this.clone({
					...def,
					items: def.items.map((item) => new ZodOptional({
						type: "optional",
						innerType: item
					}))
				});
			}
		});
		function tuple(items, _paramsOrRest, _params) {
			const hasRest = _paramsOrRest instanceof $ZodType;
			return new ZodTuple({
				type: "tuple",
				items,
				rest: hasRest ? _paramsOrRest : null,
				...normalizeParams(hasRest ? _params : _paramsOrRest)
			});
		}
		const ZodEnum = /*@__PURE__*/ $constructor("ZodEnum", (inst, def) => {
			$ZodEnum.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params);
			inst.enum = def.entries;
			inst.options = Object.values(def.entries);
			const keys = new Set(Object.keys(def.entries));
			inst.extract = (values, params) => {
				const newEntries = {};
				for (const value of values) if (keys.has(value)) newEntries[value] = def.entries[value];
				else throw new Error(`Key ${value} not found in enum`);
				return new ZodEnum({
					...def,
					checks: [],
					...normalizeParams(params),
					entries: newEntries
				});
			};
			inst.exclude = (values, params) => {
				const newEntries = { ...def.entries };
				for (const value of values) if (keys.has(value)) delete newEntries[value];
				else throw new Error(`Key ${value} not found in enum`);
				return new ZodEnum({
					...def,
					checks: [],
					...normalizeParams(params),
					entries: newEntries
				});
			};
		});
		function _enum(values, params) {
			const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
			return new ZodEnum({
				type: "enum",
				entries,
				...normalizeParams(params)
			});
		}
		const ZodLiteral = /*@__PURE__*/ $constructor("ZodLiteral", (inst, def) => {
			$ZodLiteral.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => literalProcessor(inst, ctx, json, params);
			inst.values = new Set(def.values);
			Object.defineProperty(inst, "value", { get() {
				if (def.values.length > 1) throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
				return def.values[0];
			} });
		});
		function literal(value, params) {
			return new ZodLiteral({
				type: "literal",
				values: Array.isArray(value) ? value : [value],
				...normalizeParams(params)
			});
		}
		const ZodTransform = /*@__PURE__*/ $constructor("ZodTransform", (inst, def) => {
			_ensureDefaultMemoizer();
			$ZodTransform.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params);
			inst._zod.parse = (payload, _ctx) => {
				if (_ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
				payload.addIssue = (issue$1) => {
					if (typeof issue$1 === "string") payload.issues.push(issue(issue$1, payload.value, def));
					else {
						const _issue = issue$1;
						if (_issue.fatal) _issue.continue = false;
						_issue.code ?? (_issue.code = "custom");
						if (!("input" in _issue)) _issue.input = payload.value;
						_issue.inst ?? (_issue.inst = inst);
						payload.issues.push(issue(_issue));
					}
				};
				const output = def.transform(payload.value, payload);
				if (output instanceof Promise) return output.then((output) => {
					payload.value = output;
					return payload;
				});
				payload.value = output;
				return payload;
			};
		});
		function transform(fn) {
			return new ZodTransform({
				type: "transform",
				transform: fn
			});
		}
		const ZodOptional = /*@__PURE__*/ $constructor("ZodOptional", (inst, def) => {
			$ZodOptional.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function optional(innerType) {
			return new ZodOptional({
				type: "optional",
				innerType
			});
		}
		const ZodExactOptional = /*@__PURE__*/ $constructor("ZodExactOptional", (inst, def) => {
			$ZodExactOptional.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function exactOptional(innerType) {
			return new ZodExactOptional({
				type: "optional",
				innerType
			});
		}
		const ZodNullable = /*@__PURE__*/ $constructor("ZodNullable", (inst, def) => {
			$ZodNullable.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function nullable(innerType) {
			return new ZodNullable({
				type: "nullable",
				innerType
			});
		}
		const ZodDefault = /*@__PURE__*/ $constructor("ZodDefault", (inst, def) => {
			$ZodDefault.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
			inst.removeDefault = inst.unwrap;
		});
		function _default(innerType, defaultValue) {
			return new ZodDefault({
				type: "default",
				innerType,
				get defaultValue() {
					return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
				}
			});
		}
		const ZodPrefault = /*@__PURE__*/ $constructor("ZodPrefault", (inst, def) => {
			$ZodPrefault.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function prefault(innerType, defaultValue) {
			return new ZodPrefault({
				type: "prefault",
				innerType,
				get defaultValue() {
					return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
				}
			});
		}
		const ZodNonOptional = /*@__PURE__*/ $constructor("ZodNonOptional", (inst, def) => {
			$ZodNonOptional.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function nonoptional(innerType, params) {
			return new ZodNonOptional({
				type: "nonoptional",
				innerType,
				...normalizeParams(params)
			});
		}
		const ZodCatch = /*@__PURE__*/ $constructor("ZodCatch", (inst, def) => {
			$ZodCatch.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
			inst.removeCatch = inst.unwrap;
		});
		function _catch(innerType, catchValue) {
			return new ZodCatch({
				type: "catch",
				innerType,
				catchValue: typeof catchValue === "function" ? catchValue : constantCatch(catchValue)
			});
		}
		const ZodPipe = /*@__PURE__*/ $constructor("ZodPipe", (inst, def) => {
			$ZodPipe.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
			inst.in = def.in;
			inst.out = def.out;
		});
		function pipe(in_, out) {
			return new ZodPipe({
				type: "pipe",
				in: in_,
				out
			});
		}
		const ZodReadonly = /*@__PURE__*/ $constructor("ZodReadonly", (inst, def) => {
			$ZodReadonly.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function readonly(innerType) {
			return new ZodReadonly({
				type: "readonly",
				innerType
			});
		}
		const ZodCustom = /*@__PURE__*/ $constructor("ZodCustom", (inst, def) => {
			$ZodCustom.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
		});
		function refine(fn, _params = {}) {
			return /* @__PURE__ */ _refine(ZodCustom, fn, _params);
		}
		function superRefine(fn, params) {
			return /* @__PURE__ */ _superRefine(fn, params);
		}
		//#endregion
		//#region src/pricing/schema.ts
		/**
		* Pricing-plan and persisted-settings vocabulary: strict zod schemas plus the
		* inferred types. Rates are decimal strings, never JS numbers; the pricing
		* engine converts them with decimal.js and never rounds intermediate values.
		*
		* @module dsh-price-monitor/pricing/schema
		*/
		/** A non-negative decimal string (integer or fixed-point, no exponent). */
		const decimalRate = string().regex(/^(0|[1-9]\d*)(\.\d+)?$/, "must be a non-negative decimal string");
		/** `HH:MM`, 24-hour clock, minutes 0–59. */
		const clock = string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "must be HH:MM");
		/** An ISO calendar date `YYYY-MM-DD`. */
		const isoDate = string().regex(/^\d{4}-\d{2}-\d{2}$/, "must be YYYY-MM-DD");
		const peakWindow = tuple([clock, clock]);
		/** The three billed buckets of one plan band, per million tokens, as decimal strings. */
		const rateBandSchema = object({
			cacheMiss: decimalRate,
			cacheHit: decimalRate,
			output: decimalRate
		}).strict();
		/** Peak schedule: UTC weekdays (ISO 1=Monday … 7=Sunday) and disjoint windows. */
		const peakScheduleSchema = object({
			timezone: literal("UTC"),
			peakWeekdays: array(number().int().min(1).max(7)).min(1),
			peakWindows: array(peakWindow).min(1)
		}).strict().superRefine((schedule, context) => {
			const parse = (value) => {
				const [hour, minute] = value.split(":").map(Number);
				return hour * 60 + minute;
			};
			let previous = -1;
			for (const [start, end] of schedule.peakWindows) {
				const from = parse(start);
				const to = parse(end);
				if (from >= to) context.addIssue({
					code: "custom",
					message: `peak window ${start}–${end} must start before it ends`
				});
				if (from <= previous) context.addIssue({
					code: "custom",
					message: `peak windows must be sorted and non-overlapping (${start}–${end})`
				});
				previous = to;
			}
		});
		const provenanceSchema = object({
			url: string(),
			fetchedAt: string(),
			contentHash: string()
		}).strict();
		/** A currency a set of published rates is denominated in. */
		const currencySchema = _enum(["USD", "CNY"]);
		/**
		* One pricing plan. `source: 'official'` plans are immutable catalog entries
		* the user copies before editing; `source: 'manual'` plans are user-owned.
		* Rates are per million tokens, as decimal strings.
		*
		* A plan carries the currency its publisher printed, and no conversion is ever
		* applied: DeepSeek publishes the same rates as USD on the English page and as
		* CNY on the Chinese one, and the two are not the same numbers (the English
		* page rounds its conversion). An amount therefore always reads in the
		* currency of the plan that produced it.
		*/
		const pricingPlanSchema = object({
			id: string().min(1),
			name: string().min(1),
			source: _enum(["official", "manual"]),
			provider: literal("deepseek-official"),
			modelIds: array(string().min(1)).min(1),
			currency: currencySchema,
			/**
			* The UTC dates this plan's rates applied, for the plan card's description.
			* Either end may be absent on its own: an official snapshot observes today's
			* rates and knows no start, while a superseded rate knows its end. The
			* period is a label only — the selected plan prices every attempt whatever
			* date it ran, so no amount depends on this window.
			*/
			effectiveFrom: isoDate.optional(),
			effectiveTo: isoDate.optional(),
			schedule: peakScheduleSchema.nullable(),
			ratesPerMillion: object({
				offPeak: rateBandSchema,
				peak: rateBandSchema.optional()
			}).strict(),
			provenance: provenanceSchema.optional()
		}).strict().superRefine((plan, context) => {
			if (plan.effectiveFrom !== void 0 && plan.effectiveTo !== void 0 && plan.effectiveTo <= plan.effectiveFrom) context.addIssue({
				code: "custom",
				message: "effectiveTo must be after effectiveFrom"
			});
			if (plan.schedule !== null !== (plan.ratesPerMillion.peak !== void 0)) context.addIssue({
				code: "custom",
				message: "peak band must be present exactly when a peak schedule is present"
			});
		});
		/**
		* The single persisted settings blob under `pluginSettings['price-monitor'].catalog`.
		*
		* The selected plan is the whole pricing basis: it prices every attempt of the
		* session, so switching plans changes every amount the tab shows.
		*
		* Unknown keys are stripped, not rejected: every write goes through the
		* settings service as a patch whose plain objects merge recursively and whose
		* arrays replace wholesale, so a key this schema no longer declares stays in
		* the stored document forever. A version 1 blob is therefore nothing more than
		* a version 2 blob with two retired keys, and both read here.
		*/
		const persistedSettingsSchema = object({
			schemaVersion: union([literal(1), literal(2)]),
			selectedPlanId: string().min(1),
			plans: array(pricingPlanSchema).min(1),
			lastOfficialRefresh: string().optional()
		});
		/**
		* Parse a stored settings blob; failures (an unreadable structure, a schema
		* generation this build does not know) yield undefined so the caller can offer
		* a reset instead of silently dropping the user's manual plans.
		* @param value - the persisted blob.
		* @returns the validated settings, normalized to the current schema version.
		*/
		function parsePersistedSettings(value) {
			const parsed = persistedSettingsSchema.safeParse(value);
			return parsed.success ? {
				...parsed.data,
				schemaVersion: 2
			} : void 0;
		}
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
		function applyOfficialCandidate(settings, officialPlans, fetchedAt) {
			const plans = [...settings.plans.filter((plan) => plan.source !== "official"), ...officialPlans];
			const selectedPlanId = plans.some((plan) => plan.id === settings.selectedPlanId) ? settings.selectedPlanId : officialPlans[0]?.id ?? plans[0]?.id ?? "";
			return {
				...settings,
				selectedPlanId,
				plans,
				lastOfficialRefresh: fetchedAt
			};
		}
		//#endregion
		//#region src/pricing/official-seed.ts
		const SOURCE_URL = "https://api-docs.deepseek.com/quick_start/pricing/";
		const SNAPSHOT_DATE = "2026-09-10";
		/** Shared peak schedule for every official model in this snapshot. */
		const OFFICIAL_SCHEDULE = {
			timezone: "UTC",
			peakWeekdays: [
				1,
				2,
				3,
				4,
				5
			],
			peakWindows: [["01:00", "04:00"], ["06:00", "10:00"]]
		};
		/**
		* The flash model's ids: the page's current name, the id earlier pages and
		* harness builds reported it under, and the id sessions recorded while vision
		* was listed as its own price line used. One price tier, so one plan covers
		* them.
		*/
		const FLASH_MODEL_IDS = [
			"deepseek-flash",
			"deepseek-v4-flash",
			"deepseek-v4-flash-vision-exp"
		];
		const MODELS = [{
			models: FLASH_MODEL_IDS,
			cacheHit: "0.003",
			cacheMiss: "0.15",
			output: "0.6",
			peakCacheHit: "0.006",
			peakCacheMiss: "0.3",
			peakOutput: "1.2"
		}, {
			models: ["deepseek-v4-pro"],
			cacheHit: "0.022",
			cacheMiss: "0.66",
			output: "1.98",
			peakCacheHit: "0.044",
			peakCacheMiss: "1.32",
			peakOutput: "3.96"
		}];
		/** Stable short content hash so a plan id is derived from its rates. */
		function hash8(text) {
			let hash = 5381;
			for (let index = 0; index < text.length; index += 1) hash = (hash << 5) + hash + text.charCodeAt(index) >>> 0;
			return hash.toString(16).padStart(8, "0");
		}
		function seedPlan(entry) {
			const content = [
				entry.cacheHit,
				entry.cacheMiss,
				entry.output,
				entry.peakCacheHit,
				entry.peakCacheMiss,
				entry.peakOutput
			].join("/");
			const [model] = entry.models;
			return {
				id: `official:${model}:${SNAPSHOT_DATE}:${hash8(content)}`,
				name: `${model} · official`,
				source: "official",
				provider: "deepseek-official",
				modelIds: [...entry.models],
				currency: "USD",
				schedule: OFFICIAL_SCHEDULE,
				ratesPerMillion: {
					offPeak: {
						cacheMiss: entry.cacheMiss,
						cacheHit: entry.cacheHit,
						output: entry.output
					},
					peak: {
						cacheMiss: entry.peakCacheMiss,
						cacheHit: entry.peakCacheHit,
						output: entry.peakOutput
					}
				},
				provenance: {
					url: SOURCE_URL,
					fetchedAt: `${SNAPSHOT_DATE}T00:00:00.000Z`,
					contentHash: `seed-snapshot-${SNAPSHOT_DATE}`
				}
			};
		}
		/** The shipped official plan catalog (one plan per model). */
		const officialSeedPlans = MODELS.map(seedPlan);
		/** Default settings: the official snapshot with its first plan selected. */
		function defaultSettings() {
			return {
				schemaVersion: 2,
				selectedPlanId: officialSeedPlans[0].id,
				plans: [...officialSeedPlans]
			};
		}
		/**
		* Every id a page-listed model also answers to. The page names the flash model
		* by its current id; a deployment or an older session may report one of
		* {@link FLASH_MODEL_IDS} instead. A refresh-applied plan therefore keeps the
		* same coverage the shipped seed has, while its rates still come only from the
		* page.
		* @param model - the page's model id.
		* @returns the ids the plan should cover (the input alone when none is known).
		*/
		function expandOfficialModelIds(model) {
			return FLASH_MODEL_IDS.includes(model) ? [...FLASH_MODEL_IDS] : [model];
		}
		//#endregion
		//#region src/pricing/engine.ts
		/**
		* Exact pricing engine. Rates travel as decimal strings, are converted to
		* `Decimal` once, and every product/sum stays `Decimal` until the display
		* boundary — no binary float ever carries an amount, and nothing is rounded
		* before the final aggregate.
		*
		* The selected plan is the sole pricing basis: it prices every attempt of the
		* session, so switching plans changes every amount, whether or not the attempt
		* ran on a model that plan names. Peak/off-peak is chosen from an attempt's
		* UTC start time. Aggregation order is attempt → turn → session, and each
		* layer carries the three cost buckets plus the total, so the per-turn rows
		* add up to the session card exactly.
		*
		* @module dsh-price-monitor/pricing/engine
		*/
		/** The number of minutes after UTC midnight for an epoch-ms timestamp. */
		function utcMinutes(epochMs) {
			const date = new Date(epochMs);
			return date.getUTCHours() * 60 + date.getUTCMinutes();
		}
		/** ISO weekday, 1 = Monday … 7 = Sunday. */
		function utcWeekday(epochMs) {
			return (new Date(epochMs).getUTCDay() + 6) % 7 + 1;
		}
		/** Minutes after UTC midnight for an `HH:MM` clock string. */
		function windowMinutes(clock) {
			const [hour, minute] = clock.split(":").map(Number);
			return hour * 60 + minute;
		}
		/** Whether a timestamp falls in a peak window of the schedule (left-closed, right-open). */
		function isPeak(schedule, epochMs) {
			if (!schedule.peakWeekdays.includes(utcWeekday(epochMs))) return false;
			const minutes = utcMinutes(epochMs);
			return schedule.peakWindows.some(([start, end]) => {
				return minutes >= windowMinutes(start) && minutes < windowMinutes(end);
			});
		}
		/** The effective rate band for one plan at a timestamp. */
		function bandFor(plan, epochMs) {
			if (plan.schedule !== null && isPeak(plan.schedule, epochMs) && plan.ratesPerMillion.peak !== void 0) return plan.ratesPerMillion.peak;
			return plan.ratesPerMillion.offPeak;
		}
		const ZERO = new Decimal(0);
		function sumCost(parts) {
			let miss = ZERO;
			let hit = ZERO;
			let output = ZERO;
			let total = ZERO;
			for (const part of parts) {
				miss = miss.plus(part.miss);
				hit = hit.plus(part.hit);
				output = output.plus(part.output);
				total = total.plus(part.total);
			}
			return {
				miss,
				hit,
				output,
				total
			};
		}
		/** The three cost buckets of one attempt under one plan's band, per million tokens. */
		function costOf(attempt, plan, epochMs) {
			const band = bandFor(plan, epochMs);
			const divisor = new Decimal(1e6);
			const miss = new Decimal(attempt.uncachedInputTokens ?? 0).mul(band.cacheMiss).div(divisor);
			const hit = new Decimal(attempt.cacheReadTokens ?? 0).mul(band.cacheHit).div(divisor);
			const output = new Decimal(attempt.outputTokens ?? 0).mul(band.output).div(divisor);
			return {
				miss,
				hit,
				output,
				total: miss.plus(hit).plus(output)
			};
		}
		/**
		* The token facts a price needs. An attempt whose usage was never reported,
		* failed validation, or reported cache-write tokens no plan has a rate for has
		* no priceable tokens at all, and one whose cache split cannot be separated
		* cannot use the split rates. Everything else about the attempt — its model,
		* its provider, whether a route was recorded — describes the request that
		* produced the tokens, not the rate they are being priced at.
		*/
		function tokenBlocker(attempt) {
			if (attempt.completeness === "usage-missing") return "no-usage";
			if (attempt.completeness === "invalid") return "invalid";
			if (attempt.cacheWriteTokens !== void 0 && attempt.cacheWriteTokens > 0) return "cache-write";
			if (attempt.cacheReadTokens === void 0) return "no-split";
		}
		/**
		* Price one attempt under the selected plan, or record why it cannot be priced.
		* @param attempt - the ledger row.
		* @param plan - the selected plan, or undefined when none is selected.
		* @returns the priced attempt, or the attempt with its reason.
		*/
		function priceAttempt(attempt, plan) {
			const blocker = tokenBlocker(attempt);
			if (blocker !== void 0) return {
				row: attempt,
				reason: blocker
			};
			if (plan === void 0) return {
				row: attempt,
				reason: "no-plan"
			};
			return {
				row: attempt,
				planId: plan.id,
				planName: plan.name,
				peak: plan.schedule !== null && isPeak(plan.schedule, attempt.startedAt),
				cost: costOf(attempt, plan, attempt.startedAt)
			};
		}
		/**
		* Price a whole ledger under the persisted settings.
		* @param ledger - the projection wire value.
		* @param settings - the persisted catalog and selection.
		* @returns the exact per-attempt/per-turn/session result.
		*/
		function priceLedger(ledger, settings) {
			const selectedPlan = settings.plans.find((plan) => plan.id === settings.selectedPlanId);
			const byReason = {
				"no-usage": 0,
				invalid: 0,
				"no-plan": 0,
				"no-split": 0,
				"cache-write": 0
			};
			let priced = 0;
			let uncovered = 0;
			const turns = [];
			for (const row of ledger.turns) {
				const attempts = row.attempts.map((attempt) => {
					const result = priceAttempt(attempt, selectedPlan);
					if (result.cost === void 0) {
						uncovered += 1;
						byReason[result.reason] += 1;
					} else priced += 1;
					return result;
				});
				const pricedAttempts = attempts.filter((entry) => entry.cost !== void 0);
				const costs = pricedAttempts.map((entry) => entry.cost);
				const uncachedInput = attempts.reduce((sum, entry) => sum + (entry.row.uncachedInputTokens ?? 0), 0);
				const cacheRead = attempts.reduce((sum, entry) => sum + (entry.row.cacheReadTokens ?? 0), 0);
				const output = attempts.reduce((sum, entry) => sum + (entry.row.outputTokens ?? 0), 0);
				turns.push({
					row,
					attempts,
					cost: sumCost(costs),
					tokens: {
						uncachedInput,
						cacheRead,
						output,
						total: uncachedInput + cacheRead + output
					},
					priced: pricedAttempts.length,
					peak: pricedAttempts.filter((entry) => entry.peak === true).length
				});
			}
			const peakTiered = selectedPlan !== void 0 && selectedPlan.schedule !== null && priced > 0;
			const cost = sumCost(turns.map((turn) => turn.cost));
			const uncachedInput = turns.reduce((sum, turn) => sum + turn.tokens.uncachedInput, 0);
			const cacheRead = turns.reduce((sum, turn) => sum + turn.tokens.cacheRead, 0);
			const output = turns.reduce((sum, turn) => sum + turn.tokens.output, 0);
			const tokens = {
				uncachedInput,
				cacheRead,
				output,
				total: uncachedInput + cacheRead + output
			};
			return {
				selectedPlanId: selectedPlan?.id,
				turns,
				cost,
				tokens,
				coverage: {
					priced,
					uncovered,
					byReason,
					peak: turns.reduce((sum, turn) => sum + turn.peak, 0),
					peakTiered
				}
			};
		}
		//#endregion
		//#region src/context-types.ts
		/**
		* Widen a cordis context into the client faces this plugin reads.
		*
		* Two reasons one conversion (through `unknown`) is the honest form here.
		* The sidebar's structural `Context` mirrors `sessions.binding` as the rename
		* verb only — it never reads projections — although the runtime object is the
		* Session Controller's client service, which has them. And the base cordis
		* `Context` in this program carries no client service augmentations at all:
		* this package mirrors the client services structurally (see the file header)
		* rather than importing every client package's declaration merge. Converting
		* once, here, keeps every consumer typed against the real reads instead of
		* scattering casts through the components.
		* @param ctx - a cordis context from the sidebar's tab/settings props.
		* @returns the same runtime context, typed for this plugin's reads.
		*/
		function clientContextOf(ctx) {
			return ctx;
		}
		//#endregion
		//#region src/client/settings-write.ts
		/** The pluginSettings key this plugin owns. */
		const SETTINGS_KEY = "price-monitor";
		/** The catalog slot inside this plugin's settings blob. */
		const CATALOG_KEY = "catalog";
		/** Read this plugin's catalog from a prefs snapshot, or undefined when absent/corrupt. */
		function catalogFromPrefs(prefs) {
			const blob = prefs.pluginSettings?.[SETTINGS_KEY];
			if (blob === void 0 || typeof blob !== "object" || blob === null) return void 0;
			return parseCatalog(blob[CATALOG_KEY]);
		}
		/**
		* Parse one stored catalog blob.
		* @param value - the persisted `catalog` value.
		* @returns the validated settings, or undefined when unreadable.
		*/
		function parseCatalog(value) {
			return parsePersistedSettings(value);
		}
		/** The catalog shown when nothing is stored yet. */
		function initialCatalog() {
			return defaultSettings();
		}
		let queue = Promise.resolve();
		/** POST one patch to the sidebar settings route and return the raw response envelope. */
		async function postSettingsPatch(patch, route) {
			const response = await fetch(`${route}/settings.update`, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ patch })
			});
			if (!response.ok) throw new Error(`settings route responded ${response.status}`);
			return await response.json();
		}
		/**
		* Read the authoritative catalog subtree out of a settings response, falling
		* back to the value this call sent when the envelope omits it.
		* @param envelope - the route's JSON response.
		* @param fallback - the catalog this call wrote.
		* @returns the catalog to adopt locally.
		*/
		function adoptCatalog(envelope, fallback) {
			const blob = (envelope?.value)?.pluginSettings?.[SETTINGS_KEY];
			return (blob === void 0 ? void 0 : parseCatalog(blob["catalog"])) ?? fallback;
		}
		/**
		* Persist one catalog edit. The updater runs against the freshest catalog read
		* from the prefs *at write time* (inside the queue), so a burst of edits
		* composes instead of overwriting.
		* @param deps - the sidebar store and optional route base.
		* @param update - pure catalog update.
		* @returns a promise settling when the write landed (or rejecting with the error).
		*/
		function writeCatalog(deps, update) {
			const route = deps.route ?? "/sidebar/api";
			const run = async () => {
				const prefs = deps.store.getPrefs();
				const next = update(catalogFromPrefs(prefs) ?? initialCatalog());
				const adopted = adoptCatalog(await postSettingsPatch({ pluginSettings: {
					...prefs.pluginSettings,
					[SETTINGS_KEY]: { [CATALOG_KEY]: next }
				} }, route), next);
				deps.store.setPrefs({
					...deps.store.getPrefs(),
					pluginSettings: {
						...deps.store.getPrefs().pluginSettings,
						[SETTINGS_KEY]: { [CATALOG_KEY]: adopted }
					}
				});
			};
			const chained = queue.then(run, run);
			queue = chained.catch(() => {});
			return chained;
		}
		//#endregion
		//#region src/client/usePriceMonitor.ts
		/**
		* React bindings for the price tab: the session ledger from the projection
		* face, the plan catalog from the sidebar prefs, and the memoized pricing
		* result every card and turn row reads from.
		*
		* Fallback functions are module-level stable references (React's
		* `useSyncExternalStore` requires a stable `getSnapshot`), and the hooks run
		* unconditionally — only the subscription target's identity changes, and only
		* when the session does.
		*
		* @module dsh-price-monitor/client/usePriceMonitor
		*/
		/** The empty ledger a session without the projection key reads. */
		const EMPTY_LEDGER = { turns: [] };
		const NOOP_SUBSCRIBE = () => () => {};
		const NO_LEDGER = () => EMPTY_LEDGER;
		/** Read one session's ledger through its projection face. */
		function readLedger(ctx, sessionId) {
			const face = ctx.sessions.binding?.(sessionId)?.session.projections.faceOf("priceMonitorUsage");
			if (face === void 0) return EMPTY_LEDGER;
			const value = face.getSnapshot();
			if (value === null || typeof value !== "object") return EMPTY_LEDGER;
			const turns = value.turns;
			return Array.isArray(turns) ? value : EMPTY_LEDGER;
		}
		/**
		* Subscribe to one session's per-attempt usage ledger.
		* @param ctx - client context (requires `sessions`).
		* @param sessionId - the tab scope's session id.
		* @returns the current ledger wire value (empty when the projection is absent).
		*/
		function useUsageLedger(ctx, sessionId) {
			const target = (0, react.useMemo)(() => {
				const face = ctx.sessions.binding?.(sessionId)?.session.projections.faceOf("priceMonitorUsage");
				if (face === void 0) return {
					subscribe: NOOP_SUBSCRIBE,
					read: NO_LEDGER
				};
				return {
					subscribe: (onChange) => face.subscribe(onChange),
					read: () => readLedger(ctx, sessionId)
				};
			}, [ctx, sessionId]);
			return (0, react.useSyncExternalStore)(target.subscribe, target.read, target.read);
		}
		/**
		* Subscribe to the sidebar's own prefs. The sidebar exposes no per-descriptor
		* face outside the settings popup, so the tab reads the shared snapshot (the
		* documented `subscribeState`/`getSnapshot` path).
		* @param store - the sidebar store the tab received.
		* @returns the live prefs, or undefined while they are not loaded.
		*/
		function useSidebarPrefs(store) {
			return (0, react.useSyncExternalStore)((onChange) => store.subscribe(onChange), () => store.getSnapshot(), () => store.getSnapshot()).prefs ?? void 0;
		}
		/**
		* Read this plugin's plan catalog from the live prefs, falling back to the
		* shipped official snapshot when nothing valid is stored.
		* @param prefs - the live prefs (undefined while loading).
		* @returns the catalog plus whether a stored blob existed but failed to parse.
		*/
		function useCatalog(prefs) {
			return (0, react.useMemo)(() => {
				if (prefs === void 0) return {
					catalog: initialCatalog(),
					corrupt: false
				};
				const stored = catalogFromPrefs(prefs);
				if (stored !== void 0) return {
					catalog: stored,
					corrupt: false
				};
				const blob = prefs.pluginSettings?.["price-monitor"];
				const present = blob !== void 0 && blob["catalog"] !== void 0;
				return {
					catalog: initialCatalog(),
					corrupt: present
				};
			}, [prefs]);
		}
		/**
		* Price the ledger under the catalog (memoized on both inputs, so every card
		* and row reads one shared computation).
		* @param ledger - the usage ledger.
		* @param catalog - the validated plan catalog.
		* @returns the exact pricing result.
		*/
		function usePriceView(ledger, catalog) {
			return (0, react.useMemo)(() => priceLedger(ledger, catalog), [ledger, catalog]);
		}
		//#endregion
		//#region src/client/money.ts
		/** The symbol of each supported currency. */
		const SYMBOL = {
			USD: "$",
			CNY: "¥"
		};
		/** Every supported currency, in display order. */
		const CURRENCIES = ["USD", "CNY"];
		/**
		* Format an amount in the currency of the plan that produced it, with adaptive
		* decimals so a small total keeps enough digits to stay readable.
		* @param value - the exact amount.
		* @param currency - the producing plan's currency.
		* @returns the display string.
		*/
		function formatCost(value, currency) {
			const absolute = value.abs();
			const decimals = absolute.gte(10) ? 4 : absolute.gte(.01) ? 6 : 8;
			return `${SYMBOL[currency]}${value.toFixed(decimals)}`;
		}
		/**
		* A signed percentage change of `current` against `reference`, or undefined
		* when there is nothing to compare — a zero reference, an identical amount, or
		* two different currencies, where a ratio would be meaningless.
		* @param current - the amount to describe.
		* @param reference - the amount it is compared against.
		* @param sameCurrency - whether both amounts share one currency.
		* @returns the signed percentage, or undefined.
		*/
		function formatDelta(current, reference, sameCurrency) {
			if (!sameCurrency || reference.isZero()) return void 0;
			const delta = current.div(reference).minus(1).mul(100);
			if (delta.isZero()) return void 0;
			return `${delta.isNegative() ? "−" : "+"}${delta.abs().toFixed(0)}%`;
		}
		//#endregion
		//#region src/client/OfficialDiffPanel.tsx
		/**
		* The refresh-confirmation panel: shows the field-level diff between the
		* bundled/last official catalog and the candidate the host route just fetched,
		* and applies it only when the user confirms. Applying appends new immutable
		* official plans (new ids); it never overwrites a previous version, so
		* historical comparisons keep working.
		*
		* @module dsh-price-monitor/client/OfficialDiffPanel
		*/
		/** Stable short hash prefix for a candidate (the plan id suffix). */
		function hashPrefix(hash) {
			return hash.slice(0, 8);
		}
		/** Turn one parsed candidate into immutable official plans (one per model). */
		function plansFromCandidate(candidate) {
			const schedule = {
				timezone: "UTC",
				peakWeekdays: [
					1,
					2,
					3,
					4,
					5
				],
				peakWindows: [["01:00", "04:00"], ["06:00", "10:00"]]
			};
			const observedOn = candidate.fetchedAt.slice(0, 10);
			return candidate.models.map((model) => ({
				id: `official:${model.model}:${observedOn}:${hashPrefix(candidate.contentHash)}`,
				name: `${model.model} · official`,
				source: "official",
				provider: "deepseek-official",
				modelIds: expandOfficialModelIds(model.model),
				currency: "USD",
				schedule,
				ratesPerMillion: {
					offPeak: {
						cacheMiss: model.cacheMiss,
						cacheHit: model.cacheHit,
						output: model.output
					},
					peak: {
						cacheMiss: model.peakCacheMiss,
						cacheHit: model.peakCacheHit,
						output: model.peakOutput
					}
				},
				provenance: {
					url: candidate.sourceUrl,
					fetchedAt: candidate.fetchedAt,
					contentHash: candidate.contentHash
				}
			}));
		}
		/**
		* Fetch the candidate from the host route and render its diff for confirmation.
		* @param props - the close callback and the store the confirmed catalog is written through.
		* @returns the confirmation panel.
		*/
		function OfficialDiffPanel({ onClose, store }) {
			const [state, setState] = (0, react.useState)({ kind: "loading" });
			const [writeError, setWriteError] = (0, react.useState)(null);
			const [applied, setApplied] = (0, react.useState)(false);
			const load = (0, react.useCallback)(async () => {
				setState({ kind: "loading" });
				try {
					const response = await fetch("/price-monitor/api/official-pricing", { method: "POST" });
					const envelope = await response.json();
					if (!response.ok || envelope.ok !== true || envelope.candidate === void 0 || envelope.diff === void 0) {
						setState({
							kind: "error",
							message: envelope.error?.message ?? `HTTP ${response.status}`
						});
						return;
					}
					setState({
						kind: "ready",
						candidate: envelope.candidate,
						diff: envelope.diff
					});
				} catch (error) {
					setState({
						kind: "error",
						message: error instanceof Error ? error.message : String(error)
					});
				}
			}, []);
			(0, react.useEffect)(() => {
				load();
			}, [load]);
			const apply = (candidate) => {
				setWriteError(null);
				const plans = plansFromCandidate(candidate);
				writeCatalog({ store }, (current) => applyOfficialCandidate(current, plans, candidate.fetchedAt)).then(() => setApplied(true)).catch((error) => setWriteError(error instanceof Error ? error.message : String(error)));
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: "dpm-section",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dpm-section__head",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dpm-section__title",
							children: t("refresh.title")
						})
					}),
					state.kind === "loading" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "dpm-note",
						children: t("action.refresh")
					}),
					state.kind === "error" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "dpm-note dpm-note--error",
						children: t("error.refreshFailed", { message: state.message })
					}),
					writeError !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "dpm-note dpm-note--error",
						children: t("error.writeFailed", { message: writeError })
					}),
					state.kind === "ready" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dpm-dialog",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "dpm-dialog__title",
								children: state.candidate.fetchedAt.slice(0, 19).replace("T", " ")
							}),
							state.diff.addedModels.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: "dpm-note dpm-note--warn",
								children: t("refresh.added", { models: state.diff.addedModels.join(", ") })
							}),
							state.diff.removedModels.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: "dpm-note dpm-note--warn",
								children: t("refresh.removed", { models: state.diff.removedModels.join(", ") })
							}),
							state.diff.changed.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: "dpm-note dpm-note--warn",
								children: t("refresh.changed", { count: state.diff.changed.length })
							}), state.diff.changed.map((entry) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: "dpm-line",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: `${entry.model} · ${entry.field}` }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dpm-num",
									children: `${entry.before ?? "—"} → ${entry.after}`
								})]
							}, `${entry.model}:${entry.field}`))] }),
							state.diff.changed.length === 0 && state.diff.addedModels.length === 0 && state.diff.removedModels.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: "dpm-note",
								children: t("refresh.noChange")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: "dpm-note",
								children: t("refresh.hash", { hash: hashPrefix(state.candidate.contentHash) })
							}),
							applied ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: "dpm-note",
								children: t("settings.selected")
							}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dpm-buttons",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: "dpm-button",
									onClick: onClose,
									children: t("action.cancel")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: "dpm-button dpm-button--primary",
									onClick: () => apply(state.candidate),
									children: t("refresh.confirm")
								})]
							})
						]
					})
				]
			});
		}
		//#endregion
		//#region src/client/PriceMonitorTab.tsx
		/**
		* The price-monitor tab: session cost hero, three-bucket breakdown, plan card
		* with a same-tokens comparison, and the per-turn list with attempt details.
		*
		* Every amount comes from the single `usePriceView` computation — the hero,
		* the three summary rows, the comparison rows, and every turn row read that
		* one object, so per-turn amounts always add up to the hero exactly, and
		* switching the selected plan reprices all of them together. Peak tier labels
		* and plan names are read off the same result (the engine records the band and
		* plan it actually priced with), never recomputed here, and an attempt that
		* cannot be priced stays visible with its reason instead of becoming zero.
		*
		* @module dsh-price-monitor/client/PriceMonitorTab
		*/
		/** The three billed buckets, in display order. */
		const BUCKETS = [
			"miss",
			"hit",
			"output"
		];
		const SWATCH = {
			miss: "dpm-swatch-miss",
			hit: "dpm-swatch-hit",
			output: "dpm-swatch-output"
		};
		const LABEL = {
			miss: "breakdown.miss",
			hit: "breakdown.hit",
			output: "breakdown.output"
		};
		/** Format a token count compactly (1.20M / 34.5k / 812). */
		function formatTokens(value) {
			if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
			if (value >= 1e3) return `${(value / 1e3).toFixed(1)}k`;
			return String(value);
		}
		/** Wall-clock `HH:MM` for one epoch-ms time. */
		function clockOf(epochMs) {
			const date = new Date(epochMs);
			return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
		}
		/**
		* Render the price-monitor tab body.
		* @param props - the sidebar tab props.
		* @returns the tab's React tree.
		*/
		function PriceMonitorTab({ ctx: sidebarCtx, store, scope, visible }) {
			const ledger = useUsageLedger(clientContextOf(sidebarCtx), scope.sessionId);
			const { catalog, corrupt } = useCatalog(useSidebarPrefs(store));
			const view = usePriceView(ledger, catalog);
			const [openTurn, setOpenTurn] = (0, react.useState)(null);
			const [showDiff, setShowDiff] = (0, react.useState)(false);
			const [writeError, setWriteError] = (0, react.useState)(null);
			const selectedPlan = catalog.plans.find((plan) => plan.id === catalog.selectedPlanId);
			const currency = selectedPlan?.currency ?? "USD";
			const turns = (0, react.useMemo)(() => [...view.turns].reverse(), [view.turns]);
			const attemptCount = view.coverage.priced + view.coverage.uncovered;
			const write = (update) => {
				setWriteError(null);
				writeCatalog({ store }, update).catch((error) => {
					setWriteError(error instanceof Error ? error.message : String(error));
				});
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dpm-root",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
						className: "dpm-head",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dpm-head__text",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "dpm-head__title",
								children: t("tab.title")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "dpm-head__sub",
								children: selectedPlan?.name ?? t("empty.noPlan")
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: "dpm-icon",
							title: t("action.refresh"),
							"aria-label": t("action.refresh"),
							disabled: showDiff || !visible,
							onClick: () => setShowDiff(true),
							children: "⟳"
						})]
					}),
					corrupt && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "dpm-note dpm-note--error",
						children: t("error.settingsCorrupt")
					}),
					writeError !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "dpm-note dpm-note--error",
						children: t("error.writeFailed", { message: writeError })
					}),
					attemptCount === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dpm-empty",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { children: t("empty.noUsage") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dpm-empty__hint",
							children: t("empty.noUsageHint")
						})]
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(HeroSection, {
							view,
							t,
							currency,
							attemptCount,
							turnCount: view.turns.length
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BreakdownSection, {
							view,
							t,
							currency
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(PlanSection, {
							view,
							t,
							catalog,
							ledger,
							onSelect: (planId) => write((current) => ({
								...current,
								selectedPlanId: planId
							}))
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(TurnsSection, {
							turns,
							t,
							currency,
							openTurn,
							onToggle: (index) => setOpenTurn(openTurn === index ? null : index)
						})
					] }),
					showDiff && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(OfficialDiffPanel, {
						store,
						onClose: () => setShowDiff(false)
					})
				]
			});
		}
		/** The hero card: total, coverage note, and the run statistics. */
		function HeroSection({ view, t, currency, attemptCount, turnCount }) {
			const partial = view.coverage.uncovered > 0;
			const average = turnCount === 0 ? new Decimal(0) : view.cost.total.div(turnCount);
			const promptTokens = view.tokens.uncachedInput + view.tokens.cacheRead;
			const hitRate = promptTokens === 0 ? void 0 : view.tokens.cacheRead / promptTokens;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: "dpm-section",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dpm-hero",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dpm-num dpm-hero__value",
							children: formatCost(view.cost.total, currency)
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dpm-hero__aside",
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { children: partial ? t("total.known") : t("total.label") })
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dpm-stats",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Stat, {
								label: t("stat.tokens"),
								value: formatTokens(view.tokens.total)
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Stat, {
								label: t("stat.turns"),
								value: String(turnCount)
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Stat, {
								label: t("stat.average"),
								value: formatCost(average, currency)
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Stat, {
								label: t("stat.hitRate"),
								value: hitRate === void 0 ? "—" : `${(hitRate * 100).toFixed(0)}%`
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "dpm-note",
						children: partial ? t("total.uncovered", { count: view.coverage.uncovered }) : t("total.covered", { count: attemptCount })
					}),
					partial && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "dpm-note dpm-note--warn",
						children: reasonsOf(view).map(([reason, count]) => `${t(`reason.${reason}`)} ×${count}`).join(" · ")
					})
				]
			});
		}
		/** Non-zero pricing-failure reasons, most frequent first. */
		function reasonsOf(view) {
			return Object.entries(view.coverage.byReason).filter(([, count]) => count > 0).sort((left, right) => right[1] - left[1]);
		}
		/** One statistic tile. */
		function Stat({ label, value }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dpm-stat",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "dpm-stat__key",
					children: label
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "dpm-stat__value dpm-num",
					children: value
				})]
			});
		}
		/** The three cost buckets with token counts and a share bar. */
		function BreakdownSection({ view, t, currency }) {
			const total = view.cost.total;
			const share = (bucket) => {
				if (total.isZero()) return "0";
				return ({
					miss: view.cost.miss,
					hit: view.cost.hit,
					output: view.cost.output
				}[bucket].div(total).toNumber() * 100).toFixed(2);
			};
			const tokens = {
				miss: view.tokens.uncachedInput,
				hit: view.tokens.cacheRead,
				output: view.tokens.output
			};
			const costs = {
				miss: view.cost.miss,
				hit: view.cost.hit,
				output: view.cost.output
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: "dpm-section",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dpm-section__head",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dpm-section__title",
							children: t("breakdown.title")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dpm-section__note",
							children: tierNote(view, t)
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dpm-stack",
						"aria-hidden": "true",
						children: BUCKETS.map((bucket) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: SWATCH[bucket],
							style: { width: `${share(bucket)}%` }
						}, bucket))
					}),
					BUCKETS.map((bucket) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dpm-break",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: `dpm-dot ${SWATCH[bucket]}`,
								"aria-hidden": "true"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dpm-break__label",
								children: t(LABEL[bucket])
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dpm-break__tokens dpm-num",
								children: t("breakdown.tokens", { tokens: formatTokens(tokens[bucket]) })
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dpm-break__cost dpm-num",
								children: formatCost(costs[bucket], currency)
							})
						]
					}, bucket)),
					view.coverage.byReason["cache-write"] > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "dpm-note dpm-note--warn",
						children: t("breakdown.cacheWriteWarning", { count: view.coverage.byReason["cache-write"] })
					})
				]
			});
		}
		/** The selected plan card, plan chips, rate-period line, and the comparison list. */
		function PlanSection({ view, t, catalog, ledger, onSelect }) {
			const selected = catalog.plans.find((plan) => plan.id === catalog.selectedPlanId);
			const comparisons = (0, react.useMemo)(() => catalog.plans.map((plan) => ({
				plan,
				total: priceLedger(ledger, {
					...catalog,
					selectedPlanId: plan.id
				}).cost.total
			})).sort((left, right) => right.total.comparedTo(left.total)), [catalog, ledger]);
			const base = comparisons.find((entry) => entry.plan.id === catalog.selectedPlanId)?.total ?? view.cost.total;
			const selectedCurrency = selected?.currency ?? "USD";
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: "dpm-section",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dpm-section__head",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dpm-section__title",
							children: t("plan.title")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dpm-section__note",
							children: catalog.lastOfficialRefresh === void 0 ? t("plan.neverSynced") : t("plan.syncedAt", { time: clockOf(Date.parse(catalog.lastOfficialRefresh)) })
						})]
					}),
					selected === void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "dpm-note dpm-note--warn",
						children: `${t("empty.noPlan")} ${t("empty.noPlanHint")}`
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dpm-plan",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dpm-plan__top",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dpm-plan__name",
									children: selected.name
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: `dpm-badge dpm-badge--${selected.source}`,
									children: t(`plan.badge.${selected.source}`)
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dpm-plan__meta",
								children: [effectiveLabel(selected, t), ` · ${SYMBOL[selected.currency]} ${t("plan.perMillion")}`]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("table", {
								className: "dpm-table",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("th", { children: t("plan.rateColumn") }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("th", { children: selected.ratesPerMillion.peak === void 0 ? t("plan.rateColumn") : t("plan.offPeakColumn") }),
									selected.ratesPerMillion.peak !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("th", { children: t("plan.peakColumn") })
								] }) }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("tbody", { children: BUCKETS.map((bucket) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("td", { children: t(LABEL[bucket]) }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("td", {
										className: "dpm-num",
										children: rateCell(selected, selected.ratesPerMillion.offPeak, bucket)
									}),
									selected.ratesPerMillion.peak !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("td", {
										className: "dpm-num",
										children: rateCell(selected, selected.ratesPerMillion.peak, bucket)
									})
								] }, bucket)) })]
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dpm-chips",
						role: "group",
						"aria-label": t("plan.title"),
						children: catalog.plans.map((plan) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: `dpm-chip${plan.id === catalog.selectedPlanId ? " dpm-chip--on" : ""}`,
							"aria-pressed": plan.id === catalog.selectedPlanId,
							onClick: () => onSelect(plan.id),
							children: plan.name
						}, plan.id))
					}),
					comparisons.length > 1 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dpm-compare",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dpm-compare__title",
							children: t("plan.compare")
						}), comparisons.map(({ plan, total }) => {
							const delta = formatDelta(total, base, plan.currency === selectedCurrency);
							const current = plan.id === catalog.selectedPlanId;
							return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dpm-compare__row",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: `${current ? "●" : "○"} ${plan.name}` }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: "dpm-num",
									children: [formatCost(total, plan.currency), !current && delta !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: total.gt(base) ? "dpm-up" : "dpm-down",
										children: ` ${delta}`
									})]
								})]
							}, plan.id);
						})]
					})
				]
			});
		}
		/**
		* The breakdown's tier note. It only speaks about peak tiers when something was
		* actually priced: with nothing priced, neither "no request ran at peak" nor
		* "this plan has no peak tiers" is a fact the view established.
		* @param view - the pricing result.
		* @param t - namespace translate function.
		* @returns the note, or undefined when the view supports no claim.
		*/
		function tierNote(view, t) {
			if (view.coverage.peak > 0) return t("breakdown.peakNote", { count: view.coverage.peak });
			if (view.coverage.priced === 0) return void 0;
			return view.coverage.peakTiered ? t("breakdown.noPeakRequests") : t("breakdown.flatNote");
		}
		/**
		* The plan card's rate-period line. A plan that declares no start says so and
		* names when its rates were observed, instead of implying a start date it
		* never had.
		*/
		function effectiveLabel(plan, t) {
			if (plan.effectiveFrom === void 0) {
				if (plan.effectiveTo !== void 0) return t("plan.ratePeriodUntil", { to: plan.effectiveTo });
				const observed = plan.provenance?.fetchedAt.slice(0, 10);
				return observed === void 0 ? t("plan.unknownStart", { at: "—" }) : t("plan.unknownStart", { at: observed });
			}
			return plan.effectiveTo === void 0 ? t("plan.effectiveOpen", { from: plan.effectiveFrom }) : t("plan.effective", {
				from: plan.effectiveFrom,
				to: plan.effectiveTo
			});
		}
		/** One plan rate cell, in that plan's own currency. */
		function rateCell(plan, band, bucket) {
			const value = bucket === "miss" ? band.cacheMiss : bucket === "hit" ? band.cacheHit : band.output;
			return `${SYMBOL[plan.currency]}${value}`;
		}
		/** The per-turn list with expandable attempt details. */
		function TurnsSection({ turns, t, currency, openTurn, onToggle }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: "dpm-section",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "dpm-section__head",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "dpm-section__title",
						children: t("turns.title")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "dpm-section__note",
						children: t("turns.hint")
					})]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "dpm-turns",
					children: turns.map((turn, index) => {
						const peak = turn.peak > 0;
						const open = openTurn === index;
						return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "dpm-turn",
							"aria-expanded": open,
							onClick: () => onToggle(index),
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: "dpm-turn__line",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "dpm-turn__no",
											children: t("turns.turn", { turn: turn.row.turn })
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "dpm-turn__time dpm-num",
											children: clockOf(turn.row.startedAt)
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: `dpm-tier dpm-tier--${peak ? "peak" : "off"}`,
											children: peak ? t("turns.peak") : t("turns.offPeak")
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "dpm-turn__cost dpm-num",
											children: turn.priced === 0 ? t("turns.unpriced") : formatCost(turn.cost.total, currency)
										})
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: "dpm-turn__tokens dpm-num",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("em", { children: t("breakdown.miss") }),
											" ",
											formatTokens(turn.tokens.uncachedInput)
										] }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("em", { children: t("breakdown.hit") }),
											" ",
											formatTokens(turn.tokens.cacheRead)
										] }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("em", { children: t("breakdown.output") }),
											" ",
											formatTokens(turn.tokens.output)
										] }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: turn.row.endedAt === void 0 ? t("turns.open") : turn.row.complete ? t("turns.complete") : t("turns.partial") })
									]
								}),
								open && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: "dpm-turn__detail",
									children: [turn.attempts.map((attempt) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AttemptRows, {
										attempt,
										t,
										currency
									}, attempt.row.id)), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
										className: "dpm-line dpm-line--total",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("turns.subtotal") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "dpm-num",
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: formatCost(turn.cost.total, currency) })
										})]
									})]
								})
							]
						}, turn.row.turn);
					})
				})]
			});
		}
		/** One attempt's three bucket lines, or its unpriced reason. */
		function AttemptRows({ attempt, t, currency }) {
			const label = `${t("turns.attempt", { attempt: attempt.row.attempt })} · ${attempt.row.model ?? t("turns.noRoute")}`;
			if (attempt.cost === void 0) {
				const reason = t(`reason.${attempt.reason}`);
				return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
					className: "dpm-line",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "dpm-num",
						children: `${t("turns.unpriced")} · ${reason}`
					})]
				});
			}
			const rows = [
				[
					"breakdown.miss",
					attempt.row.uncachedInputTokens ?? 0,
					attempt.cost.miss
				],
				[
					"breakdown.hit",
					attempt.row.cacheReadTokens ?? 0,
					attempt.cost.hit
				],
				[
					"breakdown.output",
					attempt.row.outputTokens ?? 0,
					attempt.cost.output
				]
			];
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
				className: "dpm-line",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "dpm-num",
					children: `${attempt.planName ?? ""}${attempt.peak === true ? ` · ${t("turns.peak")}` : ""}`
				})]
			}), rows.map(([key, tokens, cost]) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
				className: "dpm-line",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t(key) }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "dpm-num",
					children: `${formatTokens(tokens)} × ${formatCost(cost, currency)}`
				})]
			}, key))] });
		}
		//#endregion
		//#region src/client/PricePlanSettings.tsx
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
		const EMPTY_DRAFT = {
			name: "",
			models: "deepseek-flash",
			currency: "USD",
			effectiveFrom: "",
			effectiveTo: "",
			peak: true,
			cacheMiss: "0.22",
			cacheHit: "0.007",
			output: "0.66",
			peakMiss: "0.44",
			peakHit: "0.014",
			peakOutput: "1.32"
		};
		/** A decimal rate or undefined when the input is not a non-negative decimal. */
		function parseRate(value) {
			const trimmed = value.trim();
			return /^(0|[1-9]\d*)(\.\d+)?$/.test(trimmed) ? trimmed : void 0;
		}
		/** Build a plan from a draft; undefined when any field is invalid. */
		function planFromDraft(draft, fallbackId) {
			const name = draft.name.trim();
			if (name === "") return void 0;
			const modelIds = draft.models.split(",").map((value) => value.trim()).filter((value) => value !== "");
			if (modelIds.length === 0) return void 0;
			const offPeak = {
				cacheMiss: parseRate(draft.cacheMiss),
				cacheHit: parseRate(draft.cacheHit),
				output: parseRate(draft.output)
			};
			const peak = {
				cacheMiss: parseRate(draft.peakMiss),
				cacheHit: parseRate(draft.peakHit),
				output: parseRate(draft.peakOutput)
			};
			if (draft.peak && (peak.cacheMiss === void 0 || peak.cacheHit === void 0 || peak.output === void 0)) return;
			if (offPeak.cacheMiss === void 0 || offPeak.cacheHit === void 0 || offPeak.output === void 0) return;
			return {
				id: draft.id ?? fallbackId,
				name,
				source: "manual",
				provider: "deepseek-official",
				modelIds,
				currency: draft.currency,
				...draft.effectiveFrom.trim() === "" ? {} : { effectiveFrom: draft.effectiveFrom.trim() },
				...draft.effectiveTo.trim() === "" ? {} : { effectiveTo: draft.effectiveTo.trim() },
				schedule: draft.peak ? {
					timezone: "UTC",
					peakWeekdays: [
						1,
						2,
						3,
						4,
						5
					],
					peakWindows: [["01:00", "04:00"], ["06:00", "10:00"]]
				} : null,
				ratesPerMillion: draft.peak ? {
					offPeak,
					peak
				} : { offPeak }
			};
		}
		/** A fresh draft describing an existing plan for editing. */
		function draftOf(plan) {
			const peak = plan.ratesPerMillion.peak;
			return {
				id: plan.source === "official" ? void 0 : plan.id,
				name: plan.source === "official" ? `${plan.name} (copy)` : plan.name,
				models: plan.modelIds.join(", "),
				currency: plan.currency,
				effectiveFrom: plan.effectiveFrom ?? "",
				effectiveTo: plan.effectiveTo ?? "",
				peak: peak !== void 0,
				cacheMiss: plan.ratesPerMillion.offPeak.cacheMiss,
				cacheHit: plan.ratesPerMillion.offPeak.cacheHit,
				output: plan.ratesPerMillion.offPeak.output,
				peakMiss: peak?.cacheMiss ?? "0",
				peakHit: peak?.cacheHit ?? "0",
				peakOutput: peak?.output ?? "0"
			};
		}
		/** Read the current catalog out of the settings props' plugin blob. */
		function catalogOf(props) {
			const raw = props.pluginSettings[CATALOG_KEY];
			const parsed = raw === void 0 ? void 0 : parsePersistedSettings(raw);
			return parsed === void 0 ? {
				catalog: defaultSettings(),
				corrupt: raw !== void 0
			} : {
				catalog: parsed,
				corrupt: false
			};
		}
		/**
		* Render the plan settings panel.
		* @param props - settings render props (plugin blob plus the update helper).
		* @returns the settings panel.
		*/
		function PricePlanSettings(props) {
			const { catalog, corrupt } = catalogOf(props);
			const [draft, setDraft] = (0, react.useState)(null);
			const [error, setError] = (0, react.useState)(null);
			const commit = (next) => {
				setError(null);
				props.updatePluginSetting(CATALOG_KEY, next);
			};
			const edit = (update) => commit(update(catalog));
			const selectedCurrency = catalog.plans.find((plan) => plan.id === catalog.selectedPlanId)?.currency ?? "USD";
			const saveDraft = () => {
				if (draft === null) return;
				const id = draft.id ?? `manual:${Date.now().toString(36)}`;
				const plan = planFromDraft(draft, id);
				if (plan === void 0) {
					setError(t("settings.invalidRates"));
					return;
				}
				edit((current) => ({
					...current,
					plans: draft.id === void 0 ? [...current.plans, plan] : current.plans.map((existing) => existing.id === draft.id ? plan : existing),
					selectedPlanId: plan.id
				}));
				setDraft(null);
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
				corrupt && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: "dpm-note dpm-note--error",
					children: t("error.settingsCorrupt")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "dpm-buttons",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: "dpm-button",
						onClick: () => commit(defaultSettings()),
						children: t("action.reset")
					})
				})] }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "dpm-field",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
							className: "dpm-field__label",
							htmlFor: "dpm-selected",
							children: t("settings.selected")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
							id: "dpm-selected",
							className: "dpm-input",
							value: catalog.selectedPlanId,
							onChange: (event) => {
								edit((current) => ({
									...current,
									selectedPlanId: event.target.value
								}));
							},
							children: catalog.plans.map((plan) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
								value: plan.id,
								children: plan.name
							}, plan.id))
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "dpm-note",
							children: t("settings.basis")
						})
					]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "dpm-field__label",
					children: t("settings.plans")
				}),
				catalog.plans.map((plan) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "dpm-plan-row",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: "dpm-plan-row__name",
						children: [plan.name, /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: `dpm-badge dpm-badge--${plan.source}`,
							children: t(`plan.badge.${plan.source}`)
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: "dpm-plan-row__actions",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: "dpm-mini",
							onClick: () => setDraft(draftOf(plan)),
							children: plan.source === "official" ? t("action.copy") : t("settings.edit")
						}), plan.source === "manual" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: "dpm-mini",
							disabled: catalog.plans.length <= 1,
							onClick: () => {
								if (catalog.plans.length <= 1) return;
								edit((current) => {
									const plans = current.plans.filter((existing) => existing.id !== plan.id);
									return {
										...current,
										plans,
										selectedPlanId: plans.some((existing) => existing.id === current.selectedPlanId) ? current.selectedPlanId : plans[0].id
									};
								});
							},
							children: t("action.delete")
						})]
					})]
				}, plan.id)),
				catalog.plans.length <= 1 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: "dpm-note",
					children: t("settings.lastPlan")
				}),
				draft === null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "dpm-buttons",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: "dpm-button",
						onClick: () => setDraft({
							...EMPTY_DRAFT,
							currency: selectedCurrency
						}),
						children: t("settings.add")
					})
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(DraftEditor, {
					draft,
					t,
					onChange: setDraft,
					onCancel: () => {
						setDraft(null);
						setError(null);
					},
					onSave: saveDraft
				}),
				error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: "dpm-note dpm-note--error",
					children: error
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: "dpm-note",
					children: t("settings.hint")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: "dpm-note",
					children: t("settings.currencyNote")
				})
			] });
		}
		/** The manual-plan form. */
		function DraftEditor({ draft, t, onChange, onCancel, onSave }) {
			const field = (key, label, type = "text") => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dpm-field",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
					className: "dpm-field__label",
					htmlFor: `dpm-${key}`,
					children: t(label)
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
					id: `dpm-${key}`,
					className: "dpm-input",
					type,
					value: String(draft[key] ?? ""),
					onChange: (event) => onChange({
						...draft,
						[key]: event.target.value
					})
				})]
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dpm-dialog",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dpm-dialog__title",
						children: t(draft.id === void 0 ? "settings.add" : "settings.editTitle")
					}),
					field("name", "settings.name"),
					field("models", "settings.models"),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dpm-field",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
							className: "dpm-field__label",
							htmlFor: "dpm-currency",
							children: t("settings.currency")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
							id: "dpm-currency",
							className: "dpm-input",
							value: draft.currency,
							onChange: (event) => onChange({
								...draft,
								currency: event.target.value === "CNY" ? "CNY" : "USD"
							}),
							children: CURRENCIES.map((code) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
								value: code,
								children: `${code} (${SYMBOL[code]})`
							}, code))
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dpm-grid2",
						children: [field("effectiveFrom", "settings.effectiveFrom"), field("effectiveTo", "settings.effectiveTo")]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "dpm-note",
						children: t("settings.ratePeriodHint")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
						className: "dpm-check",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: draft.peak,
							onChange: (event) => onChange({
								...draft,
								peak: event.target.checked
							})
						}), t("settings.peakTiers")]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dpm-grid3",
						children: [
							field("cacheMiss", "settings.cacheMiss"),
							field("cacheHit", "settings.cacheHit"),
							field("output", "settings.output")
						]
					}),
					draft.peak && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dpm-grid3",
						children: [
							field("peakMiss", "settings.peakMiss"),
							field("peakHit", "settings.peakHit"),
							field("peakOutput", "settings.peakOutput")
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dpm-buttons",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: "dpm-button",
							onClick: onCancel,
							children: t("action.cancel")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: "dpm-button dpm-button--primary",
							onClick: onSave,
							children: t("action.save")
						})]
					})
				]
			});
		}
		//#endregion
		//#region src/client/index.tsx
		/**
		* Capabilities this tab needs from the sidebar before it can work. The plugin
		* fails loud at activation when one is missing instead of rendering a broken
		* panel: `pluginSettings` is where the plan catalog lives, and
		* `stateSubscription` is how the tab observes it.
		*/
		const REQUIRED_FEATURES = ["pluginSettings", "stateSubscription"];
		/** Client service requirements (the sidebar registry, sessions, and locale). */
		const inject = [
			"betterSidebar",
			"sessions",
			"locale"
		];
		/** Tab descriptor id (also the `pluginSettings` key owner). */
		const TAB_ID = "price-monitor";
		/**
		* Client plugin body: bind the dictionary, inject the stylesheet, and register
		* the single-instance tab with its settings panel.
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			const missing = REQUIRED_FEATURES.filter((feature) => !ctx.betterSidebar.features.includes(feature));
			if (missing.length > 0) throw new Error(`dsh-price-monitor requires Better Sidebar features: ${missing.join(", ")}`);
			ctx.effect(() => injectPriceMonitorStyles(), "dsh-price-monitor: stylesheet");
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "dsh-price-monitor: dictionaries");
			bindTranslate(ctx.locale.bind(NS));
			ctx.effect(() => ctx.betterSidebar.registerTab({
				id: TAB_ID,
				title: () => ctx.locale.bind(NS)("tab.title"),
				order: 55,
				single: true,
				settings: { render: (props) => PricePlanSettings(props) },
				component: (props) => PriceMonitorTab(props)
			}), "dsh-price-monitor: sidebar tab");
		}
		//#endregion
		exports.NS = NS;
		exports.PriceMonitorTab = PriceMonitorTab;
		exports.PricePlanSettings = PricePlanSettings;
		exports.TAB_ID = TAB_ID;
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
