/**
 * Official-pricing parser tests: the saved Chinese page parses exactly (and
 * agrees with the shipped seed), and any structural change (amount, category,
 * header, footnote windows) fails so the caller keeps the last good catalog.
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { diffOfficialPricing, parseOfficialPricing } from '../src/official-pricing.ts'
import { officialSeedPlans } from '../src/pricing/official-seed.ts'

const fixture = readFileSync(fileURLToPath(new URL('../fixtures/official-pricing.html', import.meta.url)), 'utf8')

/** The page's two priced models, in CNY per million tokens. */
const PAGE_MODELS = [
  { model: 'deepseek-flash', cacheHit: '0.02', peakCacheHit: '0.04', cacheMiss: '1', peakCacheMiss: '2', output: '4', peakOutput: '8' },
  { model: 'deepseek-v4-pro', cacheHit: '0.15', peakCacheHit: '0.3', cacheMiss: '4.5', peakCacheMiss: '9', output: '13.5', peakOutput: '27' },
]

describe('official pricing parser', () => {
  it('parses the saved page into the two models with exact yuan rates', () => {
    const parsed = parseOfficialPricing(fixture)
    expect(parsed).toBeDefined()
    expect(parsed!.models).toEqual(PAGE_MODELS)
    expect(parsed!.currency).toBe('CNY')
    // The page states its peak hours in Beijing time; the schedule prices in UTC.
    expect(parsed!.peakWindows).toEqual([['01:00', '04:00'], ['06:00', '10:00']])
  })

  it('drops the footnote superscript from a model id', () => {
    // The page writes `deepseek-flash<sup>(1)</sup>`; the id itself has no
    // footnote in it.
    expect(parseOfficialPricing(fixture)!.models[0]!.model).toBe('deepseek-flash')
    expect(parseOfficialPricing(fixture.replace('>deepseek-flash<sup>', '>deepseek flash<sup>'))).toBeUndefined()
  })

  it('agrees with the shipped seed, so a refresh of an unchanged page is empty', () => {
    // The seed is a hand-kept copy of this page: if they ever disagree, the
    // refresh would report a change the user cannot act on.
    expect(diffOfficialPricing(officialSeedPlans.map(plan => ({
      model: plan.modelIds[0]!,
      cacheHit: plan.ratesPerMillion.offPeak.cacheHit,
      cacheMiss: plan.ratesPerMillion.offPeak.cacheMiss,
      output: plan.ratesPerMillion.offPeak.output,
      peakCacheHit: plan.ratesPerMillion.peak!.cacheHit,
      peakCacheMiss: plan.ratesPerMillion.peak!.cacheMiss,
      peakOutput: plan.ratesPerMillion.peak!.output,
    })), parseOfficialPricing(fixture)!.models)).toEqual({ addedModels: [], removedModels: [], changed: [] })
    for (const plan of officialSeedPlans) expect(plan.currency).toBe('CNY')
  })

  it('rejects a changed amount (breaks the peak/off-peak 2x relation)', () => {
    expect(parseOfficialPricing(fixture.replace('>0.04元<', '>0.05元<'))).toBeUndefined()
  })

  it('rejects a missing pricing category', () => {
    expect(parseOfficialPricing(fixture.replace('（缓存未命中）', '（其他）'))).toBeUndefined()
  })

  it('rejects a malformed amount', () => {
    expect(parseOfficialPricing(fixture.replace('>0.02元<', '>免费<'))).toBeUndefined()
    // A dollar figure is not this page's unit.
    expect(parseOfficialPricing(fixture.replace('>0.02元<', '>$0.02<'))).toBeUndefined()
  })

  it('rejects a changed model header', () => {
    expect(parseOfficialPricing(fixture.replace('>模型<', '>产品<' ))).toBeUndefined()
  })

  it('rejects a changed peak-window footnote', () => {
    expect(parseOfficialPricing(fixture.replace('9:00 - 12:00', '10:00 - 12:00'))).toBeUndefined()
    expect(parseOfficialPricing(fixture.replace('周一至周五', '每天'))).toBeUndefined()
  })
})

describe('official pricing diff', () => {
  const previous = [
    { model: 'a', cacheHit: '0.02', peakCacheHit: '0.04', cacheMiss: '1', peakCacheMiss: '2', output: '4', peakOutput: '8' },
    { model: 'b', cacheHit: '0.15', peakCacheHit: '0.3', cacheMiss: '4.5', peakCacheMiss: '9', output: '13.5', peakOutput: '27' },
  ]
  const candidate = [
    { model: 'a', cacheHit: '0.02', peakCacheHit: '0.04', cacheMiss: '1', peakCacheMiss: '2', output: '5', peakOutput: '10' },
    { model: 'c', cacheHit: '0.02', peakCacheHit: '0.04', cacheMiss: '1', peakCacheMiss: '2', output: '4', peakOutput: '8' },
  ]

  it('reports added, removed and changed models field-by-field', () => {
    const diff = diffOfficialPricing(previous, candidate)
    expect(diff.addedModels).toEqual(['c'])
    expect(diff.removedModels).toEqual(['b'])
    expect(diff.changed).toEqual([
      { model: 'a', field: 'output', before: '4', after: '5' },
      { model: 'a', field: 'peakOutput', before: '8', after: '10' },
    ])
  })
})
