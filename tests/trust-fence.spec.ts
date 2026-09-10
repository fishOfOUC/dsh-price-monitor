/**
 * Browser-trust fence tests: loopback and trusted authorities pass; cross-site
 * browser markers and untrusted hosts are refused.
 */

import { describe, expect, it } from 'vitest'
import { isLoopbackHostname, isTrustedApiRequest } from '../src/trust-fence.ts'

function headers(over: Record<string, string | undefined> = {}): { headers: Record<string, string | undefined> } {
  return { headers: over }
}

describe('trust fence', () => {
  it('accepts a loopback host with no origin', () => {
    expect(isTrustedApiRequest(headers({ host: '127.0.0.1:8080' }), [])).toBe(true)
    expect(isTrustedApiRequest(headers({ host: 'localhost:8080' }), [])).toBe(true)
  })

  it('accepts a loopback host with a matching origin', () => {
    expect(isTrustedApiRequest(headers({ host: '127.0.0.1:8080', origin: 'http://127.0.0.1:8080' }), [])).toBe(true)
  })

  it('accepts a trusted authority', () => {
    expect(isTrustedApiRequest(headers({ host: 'dsh.example.com' }), ['dsh.example.com'])).toBe(true)
  })

  it('refuses a missing or non-loopback untrusted host', () => {
    expect(isTrustedApiRequest(headers({}), [])).toBe(false)
    expect(isTrustedApiRequest(headers({ host: 'evil.example.com' }), [])).toBe(false)
  })

  it('refuses a cross-site request', () => {
    expect(isTrustedApiRequest(headers({ host: '127.0.0.1:8080', 'sec-fetch-site': 'cross-site' }), [])).toBe(false)
  })

  it('refuses a mismatched or opaque origin', () => {
    expect(isTrustedApiRequest(headers({ host: '127.0.0.1:8080', origin: 'http://evil.example.com' }), [])).toBe(false)
    expect(isTrustedApiRequest(headers({ host: '127.0.0.1:8080', origin: 'null' }), [])).toBe(false)
  })

  it('recognizes only IPv4 loopback octets', () => {
    expect(isLoopbackHostname('127.0.0.1')).toBe(true)
    expect(isLoopbackHostname('127.255.255.254')).toBe(true)
    expect(isLoopbackHostname('128.0.0.1')).toBe(false)
    expect(isLoopbackHostname('127.0.0.256')).toBe(false)
  })
})
