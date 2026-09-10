/**
 * Built-artifact smoke tests: the two published entry points on disk behave
 * the way the packaging contract promises — the host half registers its
 * projection and route on a cordis context, and the client half is the
 * ModuleLoader closure factory requiring only the harness's browser module
 * table.
 *
 * These tests depend on `pnpm run build` having produced `lib/` (the repo's
 * "built smokes for published paths" policy).
 */

import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it, vi } from 'vitest'
import type { IncomingMessage, ServerResponse } from 'node:http'

const ROOT = new URL('..', import.meta.url)
const read = (relative: string): string => readFileSync(fileURLToPath(new URL(relative, ROOT)), 'utf8')

/**
 * The real fetch, captured before any test stubs the global. The route under
 * test must call the stub; the test's own requests to its local server must
 * reach that server.
 */
const realFetch: typeof fetch = globalThis.fetch

/** One local HTTP server hosting a route handler, plus its close function. */
async function serve(
  handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void>,
): Promise<{ url: string, close: () => Promise<void> }> {
  const { createServer } = await import('node:http')
  const server = createServer((req, res) => { void handler(req, res) })
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  const port = typeof address === 'object' && address !== null ? address.port : 0
  return {
    url: `http://127.0.0.1:${port}/price-monitor/api/official-pricing`,
    close: async () => { await new Promise<void>(resolve => { server.close(() => { resolve() }) }) },
  }
}

/** The harness browser module table (`packages/client/web/src/platform.ts`). */
const PLATFORM_MODULES = [
  'react',
  'react/jsx-runtime',
  'react-dom',
  'react-dom/client',
  '@deepseek-ai/cordis',
  '@deepseek-ai/dsh-client-store',
  '@deepseek-ai/dsh-client-ui-slots',
  '@deepseek-ai/dsh-client-ui-primitives',
  '@deepseek-ai/dsh-client-ui-dockkit',
]

describe('host artifact', () => {
  it('exists at the declared entry points', () => {
    const manifest = JSON.parse(read('package.json')) as {
      main: string
      types: string
      exports: Record<string, Record<string, string>>
      dsh: { bundle: { patch: string }, client: { platform: string } }
    }
    for (const relative of [
      manifest.main,
      manifest.types,
      manifest.exports['.']!['types']!,
      manifest.exports['./client']!['types']!,
      manifest.exports['./client']!['default']!,
      manifest.dsh.bundle.patch,
    ]) {
      expect(existsSync(fileURLToPath(new URL(relative, ROOT))), relative).toBe(true)
    }
    expect(manifest.dsh.client.platform).toBe('web')
  })

  it('registers the projection and the official-pricing route', async () => {
    const module = await import('../lib/index.js')
    expect(module.inject).toEqual(['sessionProjections', 'webServer', 'webRuntime'])

    const definitions: { key: string, stateVersion: number, init: () => unknown, wire: { view: (state: unknown) => unknown } }[] = []
    const routes: { kind: string, path: string, handler: unknown }[] = []
    const ctx = {
      sessionProjections: { register: (definition: typeof definitions[number]) => { definitions.push(definition); return () => {} } },
      webServer: { register: (route: typeof routes[number]) => { routes.push(route); return () => {} } },
      webRuntime: { trustedHosts: ['dsh.example.com'] },
    }
    module.apply(ctx as never)

    expect(definitions).toHaveLength(1)
    const definition = definitions[0]!
    expect(definition.key).toBe('priceMonitorUsage')
    expect(definition.stateVersion).toBe(1)
    // The empty log folds to an empty, schema-valid view.
    expect(definition.wire.view(definition.init())).toEqual({ turns: [] })

    expect(routes).toHaveLength(1)
    expect(routes[0]!.kind).toBe('exact')
    expect(routes[0]!.path).toBe('/price-monitor/api/official-pricing')
    expect(routes[0]!.handler).toBeTypeOf('function')
  })
})

describe('client artifact', () => {
  const source = read('lib/client.js')

  it('is the loader closure factory for this package id', () => {
    // The footer is pretty-printed across lines, so compare whitespace-collapsed text.
    const normalized = source.replace(/\s+/g, ' ').trim()
    expect(source.startsWith('window.__ModuleLoader__.load({')).toBe(true)
    expect(source).toContain('id: "dsh-price-monitor"')
    expect(source).toContain('factory: (require) => {')
    expect(normalized.endsWith('return module.exports; } });')).toBe(true)
  })

  it('carries no stray ESM statement a classic script could not parse', () => {
    expect(source).not.toMatch(/^\s*import\s/m)
    expect(source).not.toMatch(/^\s*export\s/m)
  })

  it('requires only the harness module table', () => {
    const required = [...source.matchAll(/require\("([^"]+)"\)/g)].map(match => match[1]!)
    expect(new Set(required)).toEqual(new Set(['react', 'react/jsx-runtime']))
    for (const specifier of required) expect(PLATFORM_MODULES).toContain(specifier)
  })

  it('inlines its non-table dependencies instead of requiring them', () => {
    // A require() the table cannot answer is a guaranteed runtime throw, so
    // zod and decimal.js must be bundled in.
    expect(source).not.toContain('require("zod")')
    expect(source).not.toContain('require("decimal.js")')
  })
})

describe('host route over real HTTP', () => {
  it('refuses a GET, a cross-site request, and a mismatched origin', async () => {
    const { officialPricingRoute } = await import('../src/official-pricing-route.ts')
    const route = officialPricingRoute([])
    const gateway = await serve((req, res) => route.handler(req as never, res as never))
    try {
      const get = await realFetch(gateway.url)
      expect(get.status).toBe(405)

      const crossSite = await realFetch(gateway.url, {
        method: 'POST',
        headers: { 'sec-fetch-site': 'cross-site' },
      })
      expect(crossSite.status).toBe(403)
      expect(await crossSite.json()).toMatchObject({ ok: false, error: { code: 'forbidden' } })

      const badOrigin = await realFetch(gateway.url, {
        method: 'POST',
        headers: { origin: 'http://evil.example.com' },
      })
      expect(badOrigin.status).toBe(403)
    } finally {
      await gateway.close()
    }
  })

  it('answers a same-origin POST with a validated candidate and diff, ignoring a client-supplied URL', async () => {
    const { officialPricingRoute } = await import('../src/official-pricing-route.ts')
    const fixture = read('fixtures/official-pricing.html')
    const calls: string[] = []
    vi.stubGlobal('fetch', vi.fn(async (input: unknown) => {
      calls.push(String(input))
      return new Response(fixture, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } })
    }))

    const route = officialPricingRoute([])
    const gateway = await serve((req, res) => route.handler(req as never, res as never))
    try {
      const response = await realFetch(gateway.url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url: 'https://evil.example.com/pricing', sessionId: 's1' }),
      })
      expect(response.status).toBe(200)
      const body = await response.json() as {
        ok: boolean
        candidate: { models: unknown[], contentHash: string, sourceUrl: string },
        diff: { addedModels: string[], removedModels: string[], changed: unknown[] }
      }
      expect(body.ok).toBe(true)
      expect(body.candidate.models).toHaveLength(3)
      expect(body.candidate.contentHash).toMatch(/^[0-9a-f]{64}$/)
      expect(body.candidate.sourceUrl).toBe('https://api-docs.deepseek.com/quick_start/pricing/')
      // This fixture is the page as it looked before the flash model was
      // renamed, while the shipped snapshot is the page after: the diff must
      // name exactly those two movements and nothing else.
      expect([...body.diff.addedModels].sort()).toEqual(['deepseek-v4-flash', 'deepseek-v4-flash-vision-exp'])
      expect(body.diff.removedModels).toEqual(['deepseek-flash'])
      // The fixed target was used despite the payload's url field.
      expect(calls).toEqual(['https://api-docs.deepseek.com/quick_start/pricing/'])
    } finally {
      vi.unstubAllGlobals()
      await gateway.close()
    }
  })

  it('reports no change when the page still matches the shipped snapshot', async () => {
    // The two-model page the snapshot was taken from: this is the check that
    // keeps the bundled rates honest between reviews.
    const { officialPricingRoute } = await import('../src/official-pricing-route.ts')
    vi.stubGlobal('fetch', vi.fn(async () => new Response(read('fixtures/official-pricing-two-model.html'), {
      status: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    })))
    const route = officialPricingRoute([])
    const gateway = await serve((req, res) => route.handler(req as never, res as never))
    try {
      const response = await realFetch(gateway.url, { method: 'POST' })
      expect(response.status).toBe(200)
      const body = await response.json() as { candidate: { models: unknown[] }, diff: unknown }
      expect(body.candidate.models).toHaveLength(2)
      expect(body.diff).toEqual({ addedModels: [], removedModels: [], changed: [] })
    } finally {
      vi.unstubAllGlobals()
      await gateway.close()
    }
  })

  it('reports a changed page shape instead of touching the saved catalog', async () => {
    const { officialPricingRoute } = await import('../src/official-pricing-route.ts')
    vi.stubGlobal('fetch', vi.fn(async () => new Response('<html>nothing here</html>', {
      status: 200,
      headers: { 'content-type': 'text/html' },
    })))
    const route = officialPricingRoute([])
    const gateway = await serve((req, res) => route.handler(req as never, res as never))
    try {
      const response = await realFetch(gateway.url, { method: 'POST' })
      expect(response.status).toBe(502)
      expect(await response.json()).toMatchObject({ ok: false, error: { code: 'parse-failed' } })
    } finally {
      vi.unstubAllGlobals()
      await gateway.close()
    }
  })

  it('refuses a non-HTML body and a redirect off the allowed host', async () => {
    const { officialPricingRoute } = await import('../src/official-pricing-route.ts')
    const route = officialPricingRoute([])
    const call = async (mock: () => Promise<Response>): Promise<{ status: number, code?: string }> => {
      vi.stubGlobal('fetch', vi.fn(mock))
      const gateway = await serve((req, res) => route.handler(req as never, res as never))
      try {
        const response = await realFetch(gateway.url, { method: 'POST' })
        const body = await response.json() as { error?: { code?: string } }
        return { status: response.status, ...body.error?.code === undefined ? {} : { code: body.error.code } }
      } finally {
        vi.unstubAllGlobals()
        await gateway.close()
      }
    }

    const json = await call(async () => new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } }))
    expect(json.status).toBe(502)
    expect(json.code).toBe('fetch-failed')

    const foreignRedirect = await call(async () => new Response('', {
      status: 302,
      headers: { location: 'https://evil.example.com/x' },
    }))
    expect(foreignRedirect.status).toBe(502)

    const insecureRedirect = await call(async () => new Response('', {
      status: 302,
      headers: { location: 'http://api-docs.deepseek.com/x' },
    }))
    expect(insecureRedirect.status).toBe(502)
  })
})
