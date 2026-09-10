/**
 * Official-pricing parser tests: the saved fixture parses exactly, and any
 * structural change (amount, category, header, footnote windows) fails so the
 * caller keeps the last good catalog.
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { diffOfficialPricing, parseOfficialPricing } from '../src/official-pricing.ts'

const fixture = readFileSync(fileURLToPath(new URL('../fixtures/official-pricing.html', import.meta.url)), 'utf8')
/** The page as served later the same day: two models, `deepseek-flash` renamed. */
const twoModelFixture = readFileSync(
  fileURLToPath(new URL('../fixtures/official-pricing-two-model.html', import.meta.url)),
  'utf8',
)

describe('official pricing parser', () => {
  it('parses the saved fixture into the three models with exact rates', () => {
    const parsed = parseOfficialPricing(fixture)
    expect(parsed).toBeDefined()
    expect(parsed!.models).toEqual([
      { model: 'deepseek-v4-flash', cacheHit: '0.007', peakCacheHit: '0.014', cacheMiss: '0.22', peakCacheMiss: '0.44', output: '0.66', peakOutput: '1.32' },
      { model: 'deepseek-v4-pro', cacheHit: '0.022', peakCacheHit: '0.044', cacheMiss: '0.66', peakCacheMiss: '1.32', output: '1.98', peakOutput: '3.96' },
      { model: 'deepseek-v4-flash-vision-exp', cacheHit: '0.007', peakCacheHit: '0.014', cacheMiss: '0.22', peakCacheMiss: '0.44', output: '0.66', peakOutput: '1.32' },
    ])
    expect(parsed!.peakWindows).toEqual([['01:00', '04:00'], ['06:00', '10:00']])
  })

  it('parses the renamed two-model layout, dropping footnote superscripts', () => {
    // The page later stopped listing a vision column (vision is now a feature
    // row of flash) and renamed the flash column to `deepseek-flash<sup>(1)</sup>`.
    const parsed = parseOfficialPricing(twoModelFixture)
    expect(parsed).toBeDefined()
    expect(parsed!.models).toEqual([
      { model: 'deepseek-flash', cacheHit: '0.003', peakCacheHit: '0.006', cacheMiss: '0.15', peakCacheMiss: '0.3', output: '0.6', peakOutput: '1.2' },
      { model: 'deepseek-v4-pro', cacheHit: '0.022', peakCacheHit: '0.044', cacheMiss: '0.66', peakCacheMiss: '1.32', output: '1.98', peakOutput: '3.96' },
    ])
    expect(parsed!.peakWindows).toEqual([['01:00', '04:00'], ['06:00', '10:00']])
  })

  it('still refuses a genuinely malformed model id in that layout', () => {
    expect(parseOfficialPricing(twoModelFixture.replace('>deepseek-flash<sup>', '>deepseek flash<sup>'))).toBeUndefined()
  })

  it('rejects a changed amount (breaks the peak/off-peak 2x relation)', () => {
    expect(parseOfficialPricing(fixture.replace('$0.014', '$0.015'))).toBeUndefined()
  })

  it('rejects a missing pricing category', () => {
    expect(parseOfficialPricing(fixture.replace('(CACHE MISS)', '(FOO)'))).toBeUndefined()
  })

  it('rejects a malformed amount', () => {
    expect(parseOfficialPricing(fixture.replace('$0.007', 'free'))).toBeUndefined()
  })

  it('rejects a changed model header', () => {
    expect(parseOfficialPricing(fixture.replace('>MODEL<', '>PRODUCTS<'))).toBeUndefined()
  })

  it('rejects a changed peak-window footnote', () => {
    expect(parseOfficialPricing(fixture.replace('01:00 - 04:00', '02:00 - 04:00'))).toBeUndefined()
  })
})

describe('official pricing diff', () => {
  const previous = [
    { model: 'a', cacheHit: '0.007', peakCacheHit: '0.014', cacheMiss: '0.22', peakCacheMiss: '0.44', output: '0.66', peakOutput: '1.32' },
    { model: 'b', cacheHit: '0.022', peakCacheHit: '0.044', cacheMiss: '0.66', peakCacheMiss: '1.32', output: '1.98', peakOutput: '3.96' },
  ]
  const candidate = [
    { model: 'a', cacheHit: '0.007', peakCacheHit: '0.014', cacheMiss: '0.22', peakCacheMiss: '0.44', output: '0.70', peakOutput: '1.40' },
    { model: 'c', cacheHit: '0.007', peakCacheHit: '0.014', cacheMiss: '0.22', peakCacheMiss: '0.44', output: '0.66', peakOutput: '1.32' },
  ]

  it('reports added, removed and changed models field-by-field', () => {
    const diff = diffOfficialPricing(previous, candidate)
    expect(diff.addedModels).toEqual(['c'])
    expect(diff.removedModels).toEqual(['b'])
    expect(diff.changed).toEqual([
      { model: 'a', field: 'output', before: '0.66', after: '0.70' },
      { model: 'a', field: 'peakOutput', before: '1.32', after: '1.40' },
    ])
  })
})
