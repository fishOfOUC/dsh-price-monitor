/**
 * Bilingual dictionary for the price-monitor tab and its settings panel.
 * Every user-visible string goes through this namespace (no hardcoded copy in
 * components). Keys are flat; `{name}` placeholders are substituted by the
 * locale runtime.
 *
 * @module dsh-price-monitor/client/locales
 */

/** The price-monitor locale namespace. */
export const NS = 'priceMonitor'

/** English dictionary (the required fallback locale). */
export const en = {
  'tab.title': 'Session cost',
  'tab.subtitle': 'Provider-reported tokens priced with the selected plan',

  'action.refresh': 'Refresh official pricing',
  'action.settings': 'Plan settings',
  'action.collapse': 'Collapse',
  'action.apply': 'Apply',
  'action.cancel': 'Cancel',
  'action.save': 'Save',
  'action.delete': 'Delete',
  'action.copy': 'Duplicate',
  'action.reset': 'Restore built-in plans',

  'total.label': 'Total cost',
  'total.known': 'Known cost (partial)',
  'total.anchor': 'at {plan}: {amount}',
  'total.uncovered': '{count} attempts not priced',
  'total.covered': 'All {count} attempts priced',
  'total.noAttempts': 'No billed attempt in this session yet',

  'mode.effective': 'As-of-time pricing',
  'mode.reprice': 'Reprice everything',
  'mode.effectiveHint': 'Each attempt uses the plan in force when it ran.',
  'mode.repriceHint': 'Simulated comparison: every matching attempt at the selected plan.',

  'stat.tokens': 'Total tokens',
  'stat.turns': 'Turns',
  'stat.attempts': 'Requests',
  'stat.average': 'Per turn',
  'stat.hitRate': 'Cache hit rate',

  'breakdown.title': 'Cost breakdown',
  'breakdown.miss': 'Input · cache miss',
  'breakdown.hit': 'Input · cache hit',
  'breakdown.output': 'Output',
  'breakdown.tokens': '{tokens} tok',
  'breakdown.peakNote': '{count} requests ran at peak',
  'breakdown.flatNote': 'This plan has no peak tiers',
  'breakdown.noPeakRequests': 'No request ran at peak hours',
  'breakdown.cacheWriteWarning': '{count} attempts reported cache-write tokens; this plan has no cache-write rate, so they are excluded.',

  'plan.title': 'Pricing plan',
  'plan.badge.official': 'Official',
  'plan.badge.manual': 'Manual',
  'plan.source': 'Source: {source}',
  'plan.effective': 'Effective {from} → {to}',
  'plan.effectiveOpen': 'Effective from {from}',
  'plan.unknownStart': 'Rate regime start unknown · snapshot {at}',
  'plan.perMillion': 'per 1M tokens',
  'plan.peakColumn': 'Peak',
  'plan.offPeakColumn': 'Off-peak',
  'plan.rateColumn': 'Rate',
  'plan.syncedAt': 'Synced {time}',
  'plan.neverSynced': 'Bundled snapshot',
  'plan.compare': 'Same tokens under each plan',
  'plan.selected': 'Selected',

  'turns.title': 'Per-turn usage',
  'turns.hint': 'Click a row for the attempt breakdown',
  'turns.turn': 'Turn {turn}',
  'turns.peak': 'Peak',
  'turns.offPeak': 'Off-peak',
  'turns.attempt': 'attempt {attempt}',
  'turns.subtotal': 'Subtotal',
  'turns.noRoute': 'no model',
  'turns.unpriced': 'not priced',
  'turns.complete': 'complete',
  'turns.partial': 'partial',
  'turns.open': 'running',

  'empty.noUsage': 'This session has no provider-reported usage yet.',
  'empty.noUsageHint': 'Send a message, then reopen this tab.',
  'empty.noPlan': 'No pricing plan is configured.',
  'empty.noPlanHint': 'Add a plan in the plan settings.',

  'reason.no-usage': 'no usage reported',
  'reason.invalid': 'usage failed validation',
  'reason.no-route': 'no route recorded',
  'reason.not-official': 'provider is not deepseek-official',
  'reason.no-plan': 'no matching plan',
  'reason.inactive-plan': 'no plan version in force at that time',
  'reason.no-split': 'cache buckets missing',
  'reason.cache-write': 'cache-write tokens have no rate',

  'error.settingsCorrupt': 'Stored plan settings could not be read; built-in plans are shown.',
  'error.refreshFailed': 'Official refresh failed: {message}',
  'error.refreshParse': 'The official page changed unexpectedly; the last catalog was kept.',
  'error.writeFailed': 'Saving the plan failed: {message}',

  'refresh.title': 'Official pricing diff',
  'refresh.added': 'Added models: {models}',
  'refresh.removed': 'Removed models: {models}',
  'refresh.changed': '{count} rates changed',
  'refresh.noChange': 'No change against the bundled snapshot.',
  'refresh.hash': 'Content hash {hash}',
  'refresh.confirm': 'Apply as new official versions',

  'settings.title': 'Price monitor plans',
  'settings.hint': 'Official plans are read-only; duplicate one to edit its rates.',
  'settings.selected': 'Selected plan',
  'settings.mode': 'Calculation mode',
  'settings.plans': 'Plans',
  'settings.add': 'Add plan',
  'settings.edit': 'Edit',
  'settings.name': 'Name',
  'settings.models': 'Models (comma separated)',
  'settings.effectiveFrom': 'Effective from',
  'settings.effectiveTo': 'Effective to (optional)',
  'settings.peakTiers': 'Peak/off-peak tiers',
  'settings.cacheMiss': 'Cache miss',
  'settings.cacheHit': 'Cache hit',
  'settings.output': 'Output',
  'settings.peakMiss': 'Peak miss',
  'settings.peakHit': 'Peak hit',
  'settings.peakOutput': 'Peak output',
  'settings.usdNote': 'Rates are USD per 1M tokens.',
  'settings.aliases': 'Model aliases',
  'settings.aliasesHint': 'Map a model id this deployment reports onto a model a plan names, so it is priced without editing official plans.',
  'settings.aliasFrom': 'Reported model id',
  'settings.aliasTo': 'Priced as',
  'settings.aliasAdd': 'Add alias',
  'settings.aliasTargets': 'Plan models',
  'settings.deleteConfirm': 'Delete this plan?',
  'settings.lastPlan': 'The last remaining plan cannot be deleted.',
  'settings.invalidRates': 'Every rate must be a non-negative decimal.',
  'settings.unknownStart': 'Leave the start empty when the rates’ start date is unknown: the plan then applies back to the beginning of the log.',
} as const

/** Chinese dictionary (same key set as {@link en}). */
export const zh: Record<keyof typeof en, string> = {
  'tab.title': '会话费用',
  'tab.subtitle': '按所选方案为模型上报的 Token 计价',

  'action.refresh': '刷新官网价格',
  'action.settings': '方案设置',
  'action.collapse': '收起',
  'action.apply': '应用',
  'action.cancel': '取消',
  'action.save': '保存',
  'action.delete': '删除',
  'action.copy': '复制',
  'action.reset': '恢复内置方案',

  'total.label': '总费用',
  'total.known': '已知费用（部分可计算）',
  'total.anchor': '按「{plan}」为 {amount}',
  'total.uncovered': '{count} 次请求未计价',
  'total.covered': '{count} 次请求全部计价',
  'total.noAttempts': '本会话还没有可计费的请求',

  'mode.effective': '按发生时价格',
  'mode.reprice': '全部按所选方案重算',
  'mode.effectiveHint': '每次请求使用发生时生效的方案。',
  'mode.repriceHint': '模拟对比：所有匹配请求都按所选方案计价。',

  'stat.tokens': '总 tokens',
  'stat.turns': '轮次',
  'stat.attempts': '请求数',
  'stat.average': '单轮均值',
  'stat.hitRate': '缓存命中率',

  'breakdown.title': '费用拆解',
  'breakdown.miss': '输入 · 缓存未命中',
  'breakdown.hit': '输入 · 缓存命中',
  'breakdown.output': '输出',
  'breakdown.tokens': '{tokens} tok',
  'breakdown.peakNote': '{count} 次请求落在高峰时段',
  'breakdown.flatNote': '该方案不分峰谷',
  'breakdown.noPeakRequests': '没有请求落在高峰时段',
  'breakdown.cacheWriteWarning': '{count} 次请求上报了缓存写入 Token；该方案没有缓存写入单价，已排除在总额外。',

  'plan.title': '计价方案',
  'plan.badge.official': '官方',
  'plan.badge.manual': '手工',
  'plan.source': '来源：{source}',
  'plan.effective': '生效 {from} → {to}',
  'plan.effectiveOpen': '{from} 起生效',
  'plan.unknownStart': '生效起点未知 · 快照于 {at}',
  'plan.perMillion': '每 100 万 tokens',
  'plan.peakColumn': '高峰',
  'plan.offPeakColumn': '空闲',
  'plan.rateColumn': '单价',
  'plan.syncedAt': '同步于 {time}',
  'plan.neverSynced': '随包快照',
  'plan.compare': '同一批 Token 在各方案下的费用',
  'plan.selected': '当前',

  'turns.title': '逐轮消耗',
  'turns.hint': '点击行展开请求明细',
  'turns.turn': '第 {turn} 轮',
  'turns.peak': '峰',
  'turns.offPeak': '谷',
  'turns.attempt': '第 {attempt} 次请求',
  'turns.subtotal': '小计',
  'turns.noRoute': '无模型',
  'turns.unpriced': '未计价',
  'turns.complete': '完整',
  'turns.partial': '部分',
  'turns.open': '进行中',

  'empty.noUsage': '本会话还没有模型上报的 usage。',
  'empty.noUsageHint': '发送一条消息后重新打开本页。',
  'empty.noPlan': '尚未配置计价方案。',
  'empty.noPlanHint': '请在方案设置中添加方案。',

  'reason.no-usage': '未上报 usage',
  'reason.invalid': 'usage 未通过校验',
  'reason.no-route': '未记录模型路线',
  'reason.not-official': '提供方不是 deepseek-official',
  'reason.no-plan': '没有匹配的方案',
  'reason.inactive-plan': '当时没有生效的方案版本',
  'reason.no-split': '缺少缓存分桶',
  'reason.cache-write': '缓存写入 Token 没有单价',

  'error.settingsCorrupt': '已保存的方案设置无法解析，当前显示内置方案。',
  'error.refreshFailed': '官网刷新失败：{message}',
  'error.refreshParse': '官网页面结构发生变化，已保留上次成功方案。',
  'error.writeFailed': '方案保存失败：{message}',

  'refresh.title': '官网价格差异',
  'refresh.added': '新增模型：{models}',
  'refresh.removed': '移除模型：{models}',
  'refresh.changed': '{count} 项价格变化',
  'refresh.noChange': '与随包快照相比没有变化。',
  'refresh.hash': '内容 hash {hash}',
  'refresh.confirm': '确认为新的官方版本',

  'settings.title': '费用监控方案',
  'settings.hint': '官方方案只读；需要修改时先复制为手工方案。',
  'settings.selected': '当前方案',
  'settings.mode': '计算模式',
  'settings.plans': '方案列表',
  'settings.add': '新增方案',
  'settings.edit': '编辑',
  'settings.name': '方案名称',
  'settings.models': '模型（逗号分隔）',
  'settings.effectiveFrom': '生效日期（起）',
  'settings.effectiveTo': '生效日期（止，可空）',
  'settings.peakTiers': '区分高峰/空闲',
  'settings.cacheMiss': '缓存未命中',
  'settings.cacheHit': '缓存命中',
  'settings.output': '输出',
  'settings.peakMiss': '高峰·未命中',
  'settings.peakHit': '高峰·命中',
  'settings.peakOutput': '高峰·输出',
  'settings.usdNote': '单价为美元 / 100 万 tokens。',
  'settings.aliases': '模型别名',
  'settings.aliasesHint': '把本机上报的模型 id 映射到方案中已有的模型名，无需修改官方方案即可计价。',
  'settings.aliasFrom': '上报的模型 id',
  'settings.aliasTo': '按此模型计价',
  'settings.aliasAdd': '新增别名',
  'settings.aliasTargets': '方案中的模型',
  'settings.deleteConfirm': '确定删除该方案？',
  'settings.lastPlan': '最后一个方案不能删除。',
  'settings.invalidRates': '每一项单价都必须是非负十进制数。',
  'settings.unknownStart': '生效起点留空表示起始日期未知：该方案将覆盖日志的最早记录。',
}

/** The dictionary key union this namespace owns. */
export type PriceMonitorKey = keyof typeof en

/** The namespace-bound translate function (reads the active locale at call time). */
export type Translate = (key: PriceMonitorKey, params?: Record<string, unknown>) => string

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
let bound: Translate = key => key

/**
 * Install the namespace-bound translate function.
 * @param translate - the function `ctx.locale.bind(NS)` returned.
 */
export function bindTranslate(translate: Translate): void {
  bound = translate
}

/**
 * Translate one key in the price-monitor namespace.
 * @param key - dictionary key.
 * @param params - `{name}` placeholder values.
 * @returns the active locale's text.
 */
export function t(key: PriceMonitorKey, params?: Record<string, unknown>): string {
  return bound(key, params)
}
