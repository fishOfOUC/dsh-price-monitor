/**
 * Strict parser for the DeepSeek official pricing page, plus the shared
 * candidate/diff vocabulary the client uses to preview a refresh before
 * applying it.
 *
 * The parser reads the Chinese page, whose prices are the primary published
 * numbers in CNY; the English page prints the same rates as a rounded USD
 * conversion, and nothing here converts anything. The page is a Docusaurus
 * table transposed so models are columns and pricing categories are rows, with
 * rowspan carrying the label cells down. The parser reconstructs a rectangular
 * grid, locates the model header and the three priced categories (cache hit /
 * cache miss / output) across the off-peak and peak bands, and validates the
 * structure strictly — a changed header, a missing category, a malformed
 * amount, a broken peak/off-peak 2x relation, or a different peak-window
 * footnote all fail, so a changed page can never be half-imported over the last
 * good catalog.
 *
 * This module is node-free: the host route adds hashing and the network fetch.
 *
 * @module dsh-price-monitor/official-pricing
 */

import { Parser } from 'htmlparser2'
import type { Currency } from './pricing/schema.ts'

/** A price cell: a decimal amount with the page's own yuan suffix. */
const AMOUNT = /^(\d+(?:\.\d+)?)元$/
/** The page's peak hours, stated in Beijing time as `H:MM - H:MM、H:MM - H:MM`. */
const WINDOW_FOOTNOTE = /高峰时段为北京时间周一至周五\s*(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})、(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/
/** The only currency this page prints. */
const PAGE_CURRENCY: Currency = 'CNY'

/** One parsed model's four rates (per million tokens, decimal strings). */
export interface OfficialModelRates {
  readonly model: string
  readonly cacheHit: string
  readonly cacheMiss: string
  readonly output: string
  readonly peakCacheHit: string
  readonly peakCacheMiss: string
  readonly peakOutput: string
}

/** A validated parse result: one row per model plus the confirmed peak schedule. */
export interface ParsedOfficialPricing {
  readonly models: readonly OfficialModelRates[]
  readonly peakWindows: readonly [readonly [string, string], readonly [string, string]]
  /** The currency the page printed (CNY on the Chinese page). */
  readonly currency: Currency
}

/** The candidate the host route returns for client preview. */
export interface OfficialPricingCandidate {
  readonly models: readonly OfficialModelRates[]
  readonly peakWindows: readonly [readonly [string, string], readonly [string, string]]
  readonly currency: Currency
  readonly fetchedAt: string
  readonly contentHash: string
  readonly sourceUrl: string
}

/** One field-level change between a previous and a candidate rate. */
export interface OfficialDiffEntry {
  readonly model: string
  readonly field: keyof Omit<OfficialModelRates, 'model'>
  readonly before?: string
  readonly after: string
}

/** Field-level diff between a previous catalog and the candidate. */
export interface OfficialPricingDiff {
  readonly addedModels: readonly string[]
  readonly removedModels: readonly string[]
  readonly changed: readonly OfficialDiffEntry[]
}

interface RawCell {
  readonly text: string
  readonly colspan: number
  readonly rowspan: number
}

/** Reconstruct a rectangular grid, propagating rowspan/colspan values down. */
function expandGrid(rows: readonly RawCell[][]): string[][] {
  const columnCount = rows.reduce((max, row) => {
    let total = 0
    for (const cell of row) total += cell.colspan
    return Math.max(max, total)
  }, 0)
  const grid: string[][] = []
  const occupied: boolean[][] = []
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
    const row = rows[rowIndex]!
    let column = 0
    for (const cell of row) {
      while (occupied[rowIndex]?.[column] === true) column += 1
      for (let rr = rowIndex; rr < rowIndex + cell.rowspan; rr += 1) {
        for (let cc = column; cc < column + cell.colspan; cc += 1) {
          const occ = (occupied[rr] ??= [])
          occ[cc] = true
          const line = (grid[rr] ??= new Array<string>(columnCount).fill(''))
          line[cc] = cell.text
        }
      }
      column += cell.colspan
    }
  }
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
    grid[rowIndex] ??= new Array<string>(columnCount).fill('')
  }
  return grid
}

/**
 * Parse one HTML table into a rectangular grid of trimmed cell texts.
 *
 * Text inside `<sup>` is dropped: in these tables a superscript is always a
 * footnote reference (`deepseek-flash<sup>(1)</sup>`), i.e. documentation
 * apparatus rather than data. Stripping it here keeps the model-id and
 * category matchers reading the cell's actual content — but nothing else is
 * normalized, so a cell that means something different still fails validation.
 */
function parseTable(html: string): string[][] {
  const rows: RawCell[][] = []
  let currentRow: RawCell[] = []
  let inCell = false
  let cellText = ''
  let colspan = 1
  let rowspan = 1
  let supDepth = 0

  const parser = new Parser({
    onopentag(name, attributes) {
      if (name === 'sup') {
        supDepth += 1
        return
      }
      if (name === 'tr') currentRow = []
      else if (name === 'td' || name === 'th') {
        inCell = true
        cellText = ''
        colspan = Math.max(1, Number(attributes.colspan ?? 1) || 1)
        rowspan = Math.max(1, Number(attributes.rowspan ?? 1) || 1)
      }
    },
    ontext(text) {
      if (inCell && supDepth === 0) cellText += text
    },
    onclosetag(name) {
      if (name === 'sup') {
        supDepth = Math.max(0, supDepth - 1)
        return
      }
      if ((name === 'td' || name === 'th') && inCell) {
        currentRow.push({ text: cellText, colspan, rowspan })
        inCell = false
      } else if (name === 'tr') {
        rows.push(currentRow)
        currentRow = []
      }
    },
  }, { decodeEntities: true })
  parser.write(html)
  parser.end()
  return expandGrid(rows)
}

const normalize = (value: string): string => value.replace(/\s+/g, ' ').trim()

/** Drop trailing fractional zeros (`0.30` → `0.3`), so equal rates compare equal. */
function canonicalRate(value: string): string {
  if (!value.includes('.')) return value
  const trimmed = value.replace(/0+$/, '').replace(/\.$/, '')
  return trimmed === '' ? '0' : trimmed
}

/** The canonical decimal amount of one price cell, or undefined when malformed. */
function stripAmount(value: string): string | undefined {
  const match = AMOUNT.exec(normalize(value))
  return match === null ? undefined : canonicalRate(match[1]!)
}

/** Multiply a decimal string by two, exactly (rates are fixed-point). */
function doubleRate(value: string): string {
  // Fixed-point doubling avoids any float: shift digits.
  const [whole, fraction = ''] = value.split('.')
  const digits = (whole + fraction).padStart(fraction.length + 1, '0')
  let carry = 0
  let out = ''
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    const doubled = Number(digits[index]) * 2 + carry
    out = String(doubled % 10) + out
    carry = doubled >= 10 ? 1 : 0
  }
  const result = (carry === 1 ? '1' : '') + out
  const point = result.length - fraction.length
  const wholePart = result.slice(0, point) || '0'
  const fracPart = result.slice(point).replace(/0+$/, '')
  return fracPart === '' ? wholePart : `${wholePart}.${fracPart}`
}

type Category = 'cacheHit' | 'cacheMiss' | 'output'

/**
 * The priced category a row labels. The miss label contains the hit one's
 * characters but not as a contiguous run, and it is matched first so a future
 * rewording cannot silently swap the two.
 */
function categoryOf(cell: string): Category | undefined {
  const value = normalize(cell)
  if (value.includes('缓存未命中')) return 'cacheMiss'
  if (value.includes('缓存命中')) return 'cacheHit'
  if (value.includes('输出')) return 'output'
  return undefined
}

/** The model header row's leading label. */
const MODEL_HEADER = '模型'

/** The two rate bands the page prints, and the peak schedule they imply. */
const OFF_PEAK_BAND = '空闲时段'
const PEAK_BAND = '高峰时段'

/** The peak windows the page's Beijing-time footnote must still name. */
const EXPECTED_PEAK_WINDOWS: readonly [readonly [string, string], readonly [string, string]] = [
  ['01:00', '04:00'],
  ['06:00', '10:00'],
]

/** Beijing time is UTC+8 all year, so the page's clock maps to UTC by subtraction. */
const BEIJING_OFFSET_HOURS = 8

/** `H:MM` or `HH:MM` to minutes after midnight. */
function clockMinutes(clock: string): number {
  const [hour, minute] = clock.split(':').map(Number)
  return hour! * 60 + minute!
}

/** Minutes after midnight to `HH:MM`. */
function clockOf(minutes: number): string {
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`
}

const MODEL_ID = /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/

/**
 * Parse the official pricing page HTML into validated per-model rates and the
 * confirmed peak schedule. Returns undefined on any structural mismatch, so a
 * caller keeps the last good catalog.
 * @param html - the fetched page body.
 * @returns the validated parse, or undefined when the page changed unexpectedly.
 */
export function parseOfficialPricing(html: string): ParsedOfficialPricing | undefined {
  const grid = parseTable(html)
  const header = grid.find(row => normalize(row[0] ?? '') === MODEL_HEADER)
  if (header === undefined || grid.length < 2) return undefined

  // The model label spans the leading columns, so the model ids are the
  // remaining non-empty cells that are not the label itself.
  const models = header.slice(1).map(normalize).filter(value => value !== '' && value !== MODEL_HEADER)
  if (models.length === 0) return undefined
  if (models.some(model => !MODEL_ID.test(model))) return undefined
  if (new Set(models).size !== models.length) return undefined

  const rates = new Map<Category, { off?: string[]; peak?: string[] }>([
    ['cacheHit', {}], ['cacheMiss', {}], ['output', {}],
  ])

  for (const row of grid) {
    const category = categoryOf(row[1] ?? '')
    if (category === undefined) continue
    const band = normalize(row[2] ?? '')
    if (band !== OFF_PEAK_BAND && band !== PEAK_BAND) continue
    const prices = row.slice(3, 3 + models.length).map(stripAmount)
    if (prices.length !== models.length || prices.some(value => value === undefined)) return undefined
    const slot = rates.get(category)!
    const key = band === OFF_PEAK_BAND ? 'off' : 'peak'
    if (slot[key] !== undefined) return undefined // duplicate band row
    slot[key] = prices as string[]
  }

  for (const slot of rates.values()) {
    if (slot.off === undefined || slot.peak === undefined) return undefined
  }

  // Peak rates are exactly twice the off-peak rates (the page states this).
  for (let index = 0; index < models.length; index += 1) {
    for (const [category, slot] of rates) {
      const off = slot.off![index]!
      const peak = slot.peak![index]!
      if (doubleRate(off) !== peak) return undefined
    }
  }

  // The peak-window footnote must still name the same two Beijing-time windows,
  // which are the same two UTC windows the schedule prices with.
  const footnote = WINDOW_FOOTNOTE.exec(html)
  if (footnote === null) return undefined
  const windows: [readonly [string, string], readonly [string, string]] = [
    [footnote[1]!, footnote[2]!],
    [footnote[3]!, footnote[4]!],
  ]
  const toUtc = (clock: string): string =>
    clockOf((clockMinutes(clock) - BEIJING_OFFSET_HOURS * 60 + 24 * 60) % (24 * 60))
  const utcWindows: readonly [readonly [string, string], readonly [string, string]] = [
    [toUtc(footnote[1]!), toUtc(footnote[2]!)],
    [toUtc(footnote[3]!), toUtc(footnote[4]!)],
  ]
  if (utcWindows[0][0] !== EXPECTED_PEAK_WINDOWS[0][0] || utcWindows[0][1] !== EXPECTED_PEAK_WINDOWS[0][1]
    || utcWindows[1][0] !== EXPECTED_PEAK_WINDOWS[1][0] || utcWindows[1][1] !== EXPECTED_PEAK_WINDOWS[1][1]) {
    return undefined
  }

  const cacheHit = rates.get('cacheHit')!
  const cacheMiss = rates.get('cacheMiss')!
  const output = rates.get('output')!

  return {
    models: models.map((model, index) => ({
      model,
      cacheHit: cacheHit.off![index]!,
      peakCacheHit: cacheHit.peak![index]!,
      cacheMiss: cacheMiss.off![index]!,
      peakCacheMiss: cacheMiss.peak![index]!,
      output: output.off![index]!,
      peakOutput: output.peak![index]!,
    })),
    peakWindows: EXPECTED_PEAK_WINDOWS,
    currency: PAGE_CURRENCY,
  }
}

const RATE_FIELDS = ['cacheHit', 'cacheMiss', 'output', 'peakCacheHit', 'peakCacheMiss', 'peakOutput'] as const

/** Field-level diff between a previous official catalog and a candidate. */
export function diffOfficialPricing(
  previous: readonly OfficialModelRates[],
  candidate: readonly OfficialModelRates[],
): OfficialPricingDiff {
  const previousByModel = new Map(previous.map(entry => [entry.model, entry]))
  const candidateModels = new Set(candidate.map(entry => entry.model))
  const addedModels = candidate.filter(entry => !previousByModel.has(entry.model)).map(entry => entry.model)
  const removedModels = previous.filter(entry => !candidateModels.has(entry.model)).map(entry => entry.model)
  const changed: OfficialDiffEntry[] = []
  for (const entry of candidate) {
    const before = previousByModel.get(entry.model)
    if (before === undefined) continue
    for (const field of RATE_FIELDS) {
      if (before[field] !== entry[field]) {
        changed.push({ model: entry.model, field, before: before[field], after: entry[field] })
      }
    }
  }
  return { addedModels, removedModels, changed }
}
