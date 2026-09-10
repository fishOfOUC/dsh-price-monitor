/**
 * Strict parser for the DeepSeek official pricing page, plus the shared
 * candidate/diff vocabulary the client uses to preview a refresh before
 * applying it.
 *
 * The page is a Docusaurus table transposed so models are columns and pricing
 * categories are rows, with rowspan carrying the label cells down. The parser
 * reconstructs a rectangular grid, locates the model header and the three
 * priced categories (cache hit / cache miss / output) across the off-peak and
 * peak bands, and validates the structure strictly — a changed header, a
 * missing category, a malformed amount, a broken peak/off-peak 2x relation, or
 * a different peak-window footnote all fail, so a changed page can never be
 * half-imported over the last good catalog.
 *
 * This module is node-free: the host route adds hashing and the network fetch.
 *
 * @module dsh-price-monitor/official-pricing
 */

import { Parser } from 'htmlparser2'

const AMOUNT = /^\$?(\d+(?:\.\d+)?)$/
const WINDOW_FOOTNOTE = /Peak hours are\s+(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})\s+and\s+(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})\s+UTC,\s+Monday through Friday/

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
}

/** The candidate the host route returns for client preview. */
export interface OfficialPricingCandidate {
  readonly models: readonly OfficialModelRates[]
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

function stripAmount(value: string): string | undefined {
  const match = AMOUNT.exec(normalize(value))
  return match?.[1]
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

function categoryOf(cell: string): Category | undefined {
  const value = normalize(cell).toUpperCase()
  if (value.includes('CACHE HIT')) return 'cacheHit'
  if (value.includes('CACHE MISS')) return 'cacheMiss'
  if (value.includes('OUTPUT')) return 'output'
  return undefined
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
  const header = grid.find(row => normalize(row[0] ?? '') === 'MODEL')
  if (header === undefined || grid.length < 2) return undefined

  // The 'MODEL' label spans the leading columns, so the model ids are the
  // remaining non-empty cells that are not the label itself.
  const models = header.slice(1).map(normalize).filter(value => value !== '' && value.toUpperCase() !== 'MODEL')
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
    if (band !== 'OFF-PEAK' && band !== 'PEAK') continue
    const prices = row.slice(3, 3 + models.length).map(stripAmount)
    if (prices.length !== models.length || prices.some(value => value === undefined)) return undefined
    const slot = rates.get(category)!
    const key = band === 'OFF-PEAK' ? 'off' : 'peak'
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

  // The peak-window footnote must still name the same two UTC windows.
  const footnote = WINDOW_FOOTNOTE.exec(html)
  if (footnote === null) return undefined
  const windows: readonly [readonly [string, string], readonly [string, string]] = [
    [footnote[1]!, footnote[2]!],
    [footnote[3]!, footnote[4]!],
  ]
  if (windows[0][0] !== '01:00' || windows[0][1] !== '04:00'
    || windows[1][0] !== '06:00' || windows[1][1] !== '10:00') {
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
    peakWindows: windows,
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
