/**
 * The host route that refreshes the official pricing catalog.
 *
 * Only this route fetches the fixed DeepSeek page (the Chinese pricing page, so
 * the official plans stay in the currency the page publishes); the client never talks to
 * the upstream directly. Every request passes the browser-trust fence before
 * any work, only POST is accepted, the target URL is fixed (client payloads
 * cannot change it), redirects stay HTTPS on the one allowed host, the body
 * is size-capped and must be HTML, and the result is validated strictly.
 * Failures never touch the caller's saved catalog — the client previews a
 * diff and applies it only after the user confirms.
 *
 * @module dsh-price-monitor/official-pricing-route
 */

import { createHash } from 'node:crypto'
import type { IncomingMessage, ServerResponse } from 'node:http'
import {
  diffOfficialPricing,
  parseOfficialPricing,
  type OfficialModelRates,
  type OfficialPricingCandidate,
} from './official-pricing.ts'
import { officialSeedPlans } from './pricing/official-seed.ts'
import { isTrustedApiRequest } from './trust-fence.ts'
import { readBoundedBody, sendError, sendJson } from './wire.ts'
import type { WebRouteFace } from './context-types.ts'

/**
 * The Chinese page: it prints the primary published rates in CNY, while the
 * English page prints their rounded USD conversion (see official-pricing.ts).
 */
const OFFICIAL_URL = 'https://api-docs.deepseek.com/zh-cn/quick_start/pricing/'
const ALLOWED_HOST = 'api-docs.deepseek.com'
const MAX_REDIRECTS = 3
const MAX_BODY_BYTES = 256 * 1024
const TIMEOUT_MS = 10_000

/** The shipped seed, expressed in the parser's per-model rate vocabulary for diffing. */
function seedModelRates(): OfficialModelRates[] {
  return officialSeedPlans.map(plan => {
    const off = plan.ratesPerMillion.offPeak
    const peak = plan.ratesPerMillion.peak
    return {
      model: plan.modelIds[0] ?? plan.id,
      cacheHit: off.cacheHit,
      cacheMiss: off.cacheMiss,
      output: off.output,
      peakCacheHit: peak?.cacheHit ?? off.cacheHit,
      peakCacheMiss: peak?.cacheMiss ?? off.cacheMiss,
      peakOutput: peak?.output ?? off.output,
    }
  })
}

async function fetchOfficialPricingPage(): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    let url = OFFICIAL_URL
    for (let redirects = 0; ; redirects += 1) {
      const response = await fetch(url, {
        redirect: 'manual',
        signal: controller.signal,
        headers: { accept: 'text/html' },
      })
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location')
        if (location === null) throw new Error('redirect without a location')
        const target = new URL(location, url)
        if (target.protocol !== 'https:') throw new Error('redirect to a non-HTTPS target refused')
        if (target.hostname !== ALLOWED_HOST) throw new Error('redirect to an unexpected host refused')
        if (redirects >= MAX_REDIRECTS) throw new Error('too many redirects')
        url = target.toString()
        continue
      }
      if (!response.ok) throw new Error(`upstream responded ${response.status}`)
      const contentType = response.headers.get('content-type') ?? ''
      if (!contentType.includes('text/html')) throw new Error('non-HTML response refused')
      return await readBoundedBody(response.body, MAX_BODY_BYTES)
    }
  } finally {
    clearTimeout(timeout)
  }
}

/** The route handler body. */
async function handleOfficialPricing(
  req: IncomingMessage,
  res: ServerResponse,
  trustedHosts: readonly string[],
): Promise<void> {
  if (req.method !== 'POST') {
    sendError(res, 405, 'method-not-allowed', 'only POST is accepted')
    return
  }
  if (!isTrustedApiRequest({ headers: req.headers }, trustedHosts)) {
    sendError(res, 403, 'forbidden', 'forbidden')
    return
  }
  try {
    const html = await fetchOfficialPricingPage()
    const parsed = parseOfficialPricing(html)
    if (parsed === undefined) {
      sendError(res, 502, 'parse-failed', 'official pricing page changed unexpectedly; the last catalog was kept')
      return
    }
    const candidate: OfficialPricingCandidate = {
      models: parsed.models,
      peakWindows: parsed.peakWindows,
      currency: parsed.currency,
      fetchedAt: new Date().toISOString(),
      contentHash: createHash('sha256').update(html).digest('hex'),
      sourceUrl: OFFICIAL_URL,
    }
    sendJson(res, 200, {
      ok: true,
      candidate,
      diff: diffOfficialPricing(seedModelRates(), parsed.models),
    })
  } catch (error) {
    sendError(res, 502, 'fetch-failed', error instanceof Error ? error.message : 'fetch failed')
  }
}

/** The registered route definition (exact POST path). */
export function officialPricingRoute(trustedHosts: readonly string[]): WebRouteFace {
  return {
    kind: 'exact',
    path: '/price-monitor/api/official-pricing',
    handler: (req, res) => handleOfficialPricing(req as IncomingMessage, res as ServerResponse, trustedHosts),
  }
}
