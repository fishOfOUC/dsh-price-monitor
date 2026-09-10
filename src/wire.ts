/**
 * Small JSON response helpers for the host routes.
 *
 * @module dsh-price-monitor/wire
 */

import type { ServerResponse } from 'node:http'

/** A minimal response face the routes write to. */
export interface WireResponse {
  statusCode: number
  end(body?: string): void
}

/** Send one JSON body with a status code and a short Cache-Control. */
export function sendJson(res: WireResponse, status: number, body: unknown): void {
  res.statusCode = status
  res.end(JSON.stringify(body))
}

/** Send an empty body with a status code. */
export function sendEmpty(res: WireResponse, status: number): void {
  res.statusCode = status
  res.end()
}

/** Send a JSON error envelope. */
export function sendError(res: WireResponse, status: number, code: string, message: string): void {
  sendJson(res, status, { ok: false, error: { code, message } })
}

/** Read a response body capped at maxBytes; rejects when it exceeds the cap. */
export async function readBoundedBody(stream: ReadableStream<Uint8Array> | null, maxBytes: number): Promise<string> {
  if (stream === null) return ''
  const reader = stream.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    total += value.byteLength
    if (total > maxBytes) throw new Error(`response body exceeds ${maxBytes} bytes`)
    chunks.push(value)
  }
  return new TextDecoder().decode(joinChunks(chunks))
}

function joinChunks(chunks: readonly Uint8Array[]): Uint8Array {
  const total = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0)
  const merged = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    merged.set(chunk, offset)
    offset += chunk.byteLength
  }
  return merged
}

export type { ServerResponse }
