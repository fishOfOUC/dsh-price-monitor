/**
 * Ledger fold tests: attempt lifecycle, validation, contradictions, reference
 * stability, cold/live parity, and cross-checks against the harness's own
 * `deriveTurnTokenUsage` (imported from the checked-out deepseek-harness).
 */

import { describe, expect, it } from 'vitest'
import type { SessionEvent, SessionEventMap, SessionSeq } from '@deepseek-ai/dsh-session'
import type { AssistantMessage, TokenUsage } from '@deepseek-ai/dsh-llm'
import { deriveTurnTokenUsage } from 'E:/tools/code_soft/deepseek-harness/packages/llm/token-meter/src/turn-usage.ts'
import {
  foldLedgerState,
  normalizeUsageSample,
  priceMonitorUsageProjectionDefinition,
} from '../src/usage-ledger.ts'
import type { AttemptUsageRow, PriceMonitorUsageState, TurnUsageRow } from '../src/projection-types.ts'

type StreamRecord = SessionEventMap['assistant/message']['stream'][number]

const PROVIDER = 'deepseek-official'
const MODEL = 'deepseek-v4-flash'

let seqCounter = 0

/** One fixture event; the data payload is cast because fixture payloads are minimal. */
function event(type: string, time: number, data: Record<string, unknown>): SessionEvent {
  seqCounter += 1
  return { type, seq: seqCounter as SessionSeq, time, data } as unknown as SessionEvent
}

const turnStart = (turn: number, time: number) => event('turn/start', time, { turn })
const turnEnd = (turn: number, time: number) => event('turn/end', time, { turn, reason: { kind: 'completed' } })
const stepStart = (turn: number, step: number, time: number) => event('step/start', time, { turn, step })
const stepEnd = (turn: number, step: number, time: number) => event('step/end', time, { turn, step })
const requestHeader = (provider: string, model: string, time: number) =>
  event('request/header', time, { header: { config: { provider, model } }, reason: 'initial' })
const retry = (turn: number, step: number, time: number) => event('llm/retry', time, { turn, step })
const retryStarted = (turn: number, step: number, time: number) => event('llm/retry-started', time, { turn, step })

function streamWith(usage: TokenUsage): StreamRecord[] {
  return [{ type: 'chunk', time: 0, chunk: { type: 'usage', usage } }] as StreamRecord[]
}

function message(provider: string, model: string): AssistantMessage {
  // Fixture minimal shape: the real Message base requires an id.
  return { id: 'm1', role: 'assistant', source: { kind: 'model', provider, model }, content: [{ type: 'text', text: 'hi' }] } as unknown as AssistantMessage
}

const assistantAttempt = (turn: number, step: number, time: number, stream: StreamRecord[]) =>
  event('assistant/attempt', time, { turn, step, stream })

const assistantMessage = (
  turn: number,
  step: number,
  time: number,
  messageText: AssistantMessage,
  options: { usage?: TokenUsage; stream?: StreamRecord[] } = {},
) => event('assistant/message', time, {
  turn,
  step,
  message: messageText,
  stream: options.stream ?? [],
  ...options.usage === undefined ? {} : { usage: options.usage },
})

const usageOf = (
  inputTokens: number,
  outputTokens: number,
  extra: Partial<TokenUsage> = {},
): TokenUsage => ({ inputTokens, outputTokens, ...extra })

function foldAll(events: readonly SessionEvent[]): PriceMonitorUsageState {
  return events.reduce(foldLedgerState, priceMonitorUsageProjectionDefinition.init())
}

function wire(events: readonly SessionEvent[]) {
  return priceMonitorUsageProjectionDefinition.wire.view(foldAll(events))
}

function completeBuckets(row: AttemptUsageRow) {
  expect(row.completeness).toBe('complete')
  return {
    uncachedInputTokens: row.uncachedInputTokens,
    cacheReadTokens: row.cacheReadTokens,
    cacheWriteTokens: row.cacheWriteTokens,
    outputTokens: row.outputTokens,
  }
}

/** Turn-local events from turn/start through turn/end (inclusive). */
function turnSlice(events: readonly SessionEvent[], turn: number): SessionEvent[] {
  const start = events.findIndex(entry => entry.type === 'turn/start' && entry.data.turn === turn)
  const end = events.findIndex(entry => entry.type === 'turn/end' && entry.data.turn === turn)
  expect(start, 'turn/start present').toBeGreaterThanOrEqual(0)
  expect(end, 'turn/end present').toBeGreaterThanOrEqual(start)
  return events.slice(start, end + 1)
}

/**
 * Cross-check helper: the harness reference is compiled against ITS OWN
 * dsh-session instance (same published version, different physical package),
 * so the fixtures cross the boundary through an erased cast.
 */
function deriveCrossCheck(events: readonly SessionEvent[]): ReturnType<typeof deriveTurnTokenUsage> {
  return deriveTurnTokenUsage(events as unknown as Parameters<typeof deriveTurnTokenUsage>[0])
}

/** Sum the buckets of every complete attempt of one turn row. */
function sumCompleteAttempts(row: TurnUsageRow) {
  const sum = { uncachedInputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0 }
  for (const attempt of row.attempts) {
    if (attempt.completeness !== 'complete') continue
    sum.uncachedInputTokens += attempt.uncachedInputTokens ?? 0
    sum.outputTokens += attempt.outputTokens ?? 0
    sum.cacheReadTokens += attempt.cacheReadTokens ?? 0
    sum.cacheWriteTokens += attempt.cacheWriteTokens ?? 0
  }
  return sum
}

describe('usage ledger fold', () => {
  it('records one successful call with header-pinned start time and full buckets', () => {
    const events = [
      turnStart(1, 1000),
      stepStart(1, 0, 1010),
      requestHeader(PROVIDER, MODEL, 1020),
      assistantMessage(1, 0, 1030, message(PROVIDER, MODEL), {
        usage: usageOf(100, 50, { totalTokens: 180, cacheReadTokens: 30, cacheWriteTokens: 0 }),
      }),
      stepEnd(1, 0, 1040),
      turnEnd(1, 1050),
    ]
    const { turns } = wire(events)
    expect(turns).toHaveLength(1)
    const row = turns[0]!
    expect(row.complete).toBe(true)
    expect(row.attempts).toHaveLength(1)
    const attempt = row.attempts[0]!
    expect(attempt.id).toBe('1:0:0')
    expect(attempt.startedAt).toBe(1020) // request/header time, not step/start
    expect(attempt.settledAt).toBe(1030)
    expect(attempt.provider).toBe(PROVIDER)
    expect(attempt.model).toBe(MODEL)
    expect(completeBuckets(attempt)).toEqual({
      uncachedInputTokens: 100,
      cacheReadTokens: 30,
      cacheWriteTokens: 0,
      outputTokens: 50,
    })
  })

  it('matches deriveTurnTokenUsage for a single complete turn', () => {
    const events = [
      turnStart(1, 1000),
      stepStart(1, 0, 1010),
      requestHeader(PROVIDER, MODEL, 1020),
      assistantMessage(1, 0, 1030, message(PROVIDER, MODEL), {
        usage: usageOf(100, 50, { totalTokens: 180, cacheReadTokens: 30, cacheWriteTokens: 0, reasoningTokens: 20 }),
      }),
      stepEnd(1, 0, 1040),
      turnEnd(1, 1050),
    ]
    const derived = deriveCrossCheck(turnSlice(events, 1))
    expect(derived).toBeDefined()
    const [row] = wire(events).turns
    expect(row).toBeDefined()
    expect(sumCompleteAttempts(row!)).toEqual({
      uncachedInputTokens: derived!.uncachedInputTokens,
      outputTokens: derived!.outputTokens,
      cacheReadTokens: derived!.cacheReadTokens,
      cacheWriteTokens: derived!.cacheWriteTokens,
    })
  })

  it('keeps every step of a multi-step turn and inherits the header across steps', () => {
    const events = [
      turnStart(1, 1000),
      stepStart(1, 0, 1010),
      requestHeader(PROVIDER, MODEL, 1020),
      assistantMessage(1, 0, 1030, message(PROVIDER, MODEL), {
        usage: usageOf(100, 50, { totalTokens: 150, cacheReadTokens: 0, cacheWriteTokens: 0 }),
      }),
      stepEnd(1, 0, 1040),
      stepStart(1, 1, 1050),
      assistantMessage(1, 1, 1060, message(PROVIDER, MODEL), {
        usage: usageOf(200, 80, { totalTokens: 300, cacheReadTokens: 20, cacheWriteTokens: 0 }),
      }),
      stepEnd(1, 1, 1070),
      turnEnd(1, 1080),
    ]
    const derived = deriveCrossCheck(turnSlice(events, 1))
    expect(derived).toBeDefined()
    const [row] = wire(events).turns
    const attempts = row!.attempts
    expect(attempts.map(entry => entry.id)).toEqual(['1:0:0', '1:1:0'])
    // Step 1 logged no header of its own: the fold inherits step 0's route.
    expect(attempts[1]!.model).toBe(MODEL)
    expect(sumCompleteAttempts(row!)).toEqual({
      uncachedInputTokens: derived!.uncachedInputTokens,
      outputTokens: derived!.outputTokens,
      cacheReadTokens: derived!.cacheReadTokens,
      cacheWriteTokens: derived!.cacheWriteTokens,
    })
  })

  it('counts a failed attempt and its retried successor with the retry start time', () => {
    const events = [
      turnStart(1, 1000),
      stepStart(1, 0, 1010),
      requestHeader(PROVIDER, MODEL, 1020),
      assistantAttempt(1, 0, 1030, streamWith(usageOf(40, 0, { totalTokens: 40, cacheReadTokens: 0, cacheWriteTokens: 0 }))),
      retry(1, 0, 1035),
      retryStarted(1, 0, 1045),
      assistantMessage(1, 0, 1060, message(PROVIDER, MODEL), {
        usage: usageOf(100, 50, { totalTokens: 150, cacheReadTokens: 0, cacheWriteTokens: 0 }),
      }),
      stepEnd(1, 0, 1070),
      turnEnd(1, 1080),
    ]
    const derived = deriveCrossCheck(turnSlice(events, 1))
    expect(derived).toBeDefined()
    const [row] = wire(events).turns
    const attempts = row!.attempts
    expect(attempts).toHaveLength(2)
    expect(attempts.map(entry => entry.id)).toEqual(['1:0:0', '1:0:1'])
    expect(attempts[0]!.completeness).toBe('complete')
    expect(attempts[1]!.startedAt).toBe(1045) // llm/retry-started time
    expect(attempts[1]!.completeness).toBe('complete')
    // Both attempts contribute; the retry must not double-count attempt 0.
    expect(sumCompleteAttempts(row!)).toEqual({
      uncachedInputTokens: derived!.uncachedInputTokens,
      outputTokens: derived!.outputTokens,
      cacheReadTokens: derived!.cacheReadTokens,
      cacheWriteTokens: derived!.cacheWriteTokens,
    })
  })

  it('prefers event.data.usage over the embedded stream usage', () => {
    const events = [
      turnStart(1, 1000),
      stepStart(1, 0, 1010),
      requestHeader(PROVIDER, MODEL, 1020),
      assistantMessage(1, 0, 1030, message(PROVIDER, MODEL), {
        usage: usageOf(10, 5, { totalTokens: 15, cacheReadTokens: 0, cacheWriteTokens: 0 }),
        stream: streamWith(usageOf(999, 999, { totalTokens: 1998, cacheReadTokens: 0, cacheWriteTokens: 0 })),
      }),
      stepEnd(1, 0, 1040),
      turnEnd(1, 1050),
    ]
    const attempt = wire(events).turns[0]!.attempts[0]!
    expect(completeBuckets(attempt).uncachedInputTokens).toBe(10)
  })

  it('prefers the message source route over the request header', () => {
    const events = [
      turnStart(1, 1000),
      stepStart(1, 0, 1010),
      requestHeader('some-gateway', MODEL, 1020),
      assistantMessage(1, 0, 1030, message(PROVIDER, MODEL), {
        usage: usageOf(10, 5, { totalTokens: 15, cacheReadTokens: 0, cacheWriteTokens: 0 }),
      }),
      stepEnd(1, 0, 1040),
      turnEnd(1, 1050),
    ]
    const attempt = wire(events).turns[0]!.attempts[0]!
    expect(attempt.provider).toBe(PROVIDER)
  })

  it('uses the new model after a changed header', () => {
    const events = [
      turnStart(1, 1000),
      stepStart(1, 0, 1010),
      requestHeader(PROVIDER, MODEL, 1020),
      assistantMessage(1, 0, 1030, message(PROVIDER, MODEL), {
        usage: usageOf(10, 5, { totalTokens: 15, cacheReadTokens: 0, cacheWriteTokens: 0 }),
      }),
      stepEnd(1, 0, 1040),
      stepStart(1, 1, 1050),
      requestHeader(PROVIDER, 'deepseek-v4-pro', 1055),
      assistantMessage(1, 1, 1060, message(PROVIDER, 'deepseek-v4-pro'), {
        usage: usageOf(20, 8, { totalTokens: 28, cacheReadTokens: 0, cacheWriteTokens: 0 }),
      }),
      stepEnd(1, 1, 1070),
      turnEnd(1, 1080),
    ]
    const attempts = wire(events).turns[0]!.attempts
    expect(attempts.map(entry => entry.model)).toEqual([MODEL, 'deepseek-v4-pro'])
  })

  it('keeps a usage-missing row for a settled attempt that reported no usage', () => {
    const events = [
      turnStart(1, 1000),
      stepStart(1, 0, 1010),
      requestHeader(PROVIDER, MODEL, 1020),
      assistantMessage(1, 0, 1030, message(PROVIDER, MODEL)),
      stepEnd(1, 0, 1040),
      turnEnd(1, 1050),
    ]
    // The harness fold proves nothing for a usage-less message.
    expect(deriveCrossCheck(turnSlice(events, 1))).toBeUndefined()
    const attempt = wire(events).turns[0]!.attempts[0]!
    expect(attempt.completeness).toBe('usage-missing')
    expect(attempt.uncachedInputTokens).toBeUndefined()
  })

  it('prices a usage sample that never reported a cache-write bucket', () => {
    // Sessions recorded before that bucket existed (and providers that never
    // account writes) log only hit and miss input. Nothing billable is lost:
    // no plan carries a cache-write rate.
    const events = [
      turnStart(1, 1000),
      stepStart(1, 0, 1010),
      requestHeader(PROVIDER, MODEL, 1020),
      assistantMessage(1, 0, 1030, message(PROVIDER, MODEL), {
        usage: usageOf(107, 168, { cacheReadTokens: 8064 }),
      }),
      stepEnd(1, 0, 1040),
      turnEnd(1, 1050),
    ]
    const attempt = wire(events).turns[0]!.attempts[0]!
    expect(attempt.completeness).toBe('complete')
    expect(attempt.uncachedInputTokens).toBe(107)
    expect(attempt.cacheReadTokens).toBe(8064)
    expect(attempt.outputTokens).toBe(168)
    // A reported non-zero write count still keeps the attempt out of the money,
    // because those tokens were billed and no rate covers them.
    expect(normalizeUsageSample(usageOf(10, 5, { cacheReadTokens: 0, cacheWriteTokens: 0 }))).toBeDefined()
    expect(normalizeUsageSample(usageOf(10, 5, { cacheReadTokens: 0, cacheWriteTokens: 3 }))).toBeDefined()
    // Without even the hit bucket, the input split is unknown.
    expect(normalizeUsageSample(usageOf(10, 5))).toBeUndefined()
  })

  it('marks a valid-usage attempt without any route as route-missing', () => {
    const events = [
      turnStart(1, 1000),
      stepStart(1, 0, 1010),
      assistantMessage(1, 0, 1030, message('', ''), {
        usage: usageOf(10, 5, { totalTokens: 15, cacheReadTokens: 0, cacheWriteTokens: 0 }),
      }),
      stepEnd(1, 0, 1040),
      turnEnd(1, 1050),
    ]
    const attempt = wire(events).turns[0]!.attempts[0]!
    expect(attempt.completeness).toBe('route-missing')
    expect(attempt.uncachedInputTokens).toBe(10)
  })

  it('fails closed on negative, overflowing and contradictory counts', () => {
    const badUsages: TokenUsage[] = [
      usageOf(-1, 5, { totalTokens: 4, cacheReadTokens: 0, cacheWriteTokens: 0 }),
      usageOf(10, 5, { totalTokens: 15, cacheReadTokens: -1, cacheWriteTokens: 0 }),
      usageOf(Number.MAX_SAFE_INTEGER, 5, { totalTokens: Number.MAX_SAFE_INTEGER, cacheReadTokens: 0, cacheWriteTokens: 0 }),
      usageOf(10, 5, { totalTokens: 15, cacheReadTokens: 0, cacheWriteTokens: 0, reasoningTokens: 6 }),
      usageOf(10, 5, { totalTokens: 5, cacheReadTokens: 0, cacheWriteTokens: 0 }),
      usageOf(10, 5, { cacheReadTokens: 0, cacheWriteTokens: 0, totalTokens: 15.5 }),
    ]
    expect(normalizeUsageSample(badUsages[0]!)).toBeUndefined()
    expect(normalizeUsageSample(badUsages[1]!)).toBeUndefined()
    expect(normalizeUsageSample(badUsages[2]!)).toBeUndefined()
    expect(normalizeUsageSample(badUsages[3]!)).toBeUndefined()
    expect(normalizeUsageSample(badUsages[4]!)).toBeUndefined()
    expect(normalizeUsageSample(badUsages[5]!)).toBeUndefined()
    // One bad sample inside a turn marks the attempt invalid, keeps folding.
    const events = [
      turnStart(1, 1000),
      stepStart(1, 0, 1010),
      requestHeader(PROVIDER, MODEL, 1020),
      assistantMessage(1, 0, 1030, message(PROVIDER, MODEL), { usage: badUsages[0]! }),
      stepEnd(1, 0, 1040),
      turnEnd(1, 1050),
    ]
    const row = wire(events).turns[0]!
    expect(row.complete).toBe(false)
    expect(row.attempts[0]!.completeness).toBe('invalid')
    expect(row.attempts[0]!.uncachedInputTokens).toBeUndefined()
  })

  it('returns the same state reference for irrelevant events', () => {
    const base = foldAll([
      turnStart(1, 1000),
      stepStart(1, 0, 1010),
      requestHeader(PROVIDER, MODEL, 1020),
    ])
    const irrelevant = [
      event('user/message', 1015, { source: { kind: 'user' }, content: [{ type: 'text', text: 'x' }] }),
      event('request/context', 1018, { provider: PROVIDER, model: MODEL }),
      event('tool/call', 1021, { turn: 1, step: 0, callId: 'c1', name: 'n', arguments: '{}' }),
      event('session/end-seed', 1022, { inherited: true }),
    ]
    for (const entry of irrelevant) {
      expect(foldLedgerState(base, entry)).toBe(base)
    }
  })

  it('produces the same wire from cold replay and incremental append', () => {
    const events = [
      turnStart(1, 1000),
      stepStart(1, 0, 1010),
      requestHeader(PROVIDER, MODEL, 1020),
      assistantMessage(1, 0, 1030, message(PROVIDER, MODEL), {
        usage: usageOf(100, 50, { totalTokens: 150, cacheReadTokens: 0, cacheWriteTokens: 0 }),
      }),
      stepEnd(1, 0, 1040),
      turnEnd(1, 1050),
      turnStart(2, 2000),
      stepStart(2, 0, 2010),
      assistantMessage(2, 0, 2020, message(PROVIDER, MODEL), {
        usage: usageOf(30, 10, { totalTokens: 40, cacheReadTokens: 0, cacheWriteTokens: 0 }),
      }),
      stepEnd(2, 0, 2030),
      turnEnd(2, 2040),
    ]
    const cold = wire(events)
    const incremental = wire(events.slice(0, 6))
    let state = foldAll(events.slice(0, 6))
    for (const entry of events.slice(6)) state = foldLedgerState(state, entry)
    const live = priceMonitorUsageProjectionDefinition.wire.view(state)
    expect(live).toEqual(cold)
    expect(incremental.turns).toHaveLength(1)
  })

  it('keeps an inherited fork prefix intact across the end-seed marker', () => {
    const prefix = [
      turnStart(1, 1000),
      stepStart(1, 0, 1010),
      requestHeader(PROVIDER, MODEL, 1020),
      assistantMessage(1, 0, 1030, message(PROVIDER, MODEL), {
        usage: usageOf(100, 50, { totalTokens: 150, cacheReadTokens: 0, cacheWriteTokens: 0 }),
      }),
      stepEnd(1, 0, 1040),
      turnEnd(1, 1050),
      event('session/end-seed', 1060, { inherited: true }),
    ]
    const events = [
      ...prefix,
      turnStart(2, 2000),
      stepStart(2, 0, 2010),
      assistantMessage(2, 0, 2020, message(PROVIDER, MODEL), {
        usage: usageOf(30, 10, { totalTokens: 40, cacheReadTokens: 0, cacheWriteTokens: 0 }),
      }),
      stepEnd(2, 0, 2030),
      turnEnd(2, 2040),
    ]
    const { turns } = wire(events)
    expect(turns.map(entry => entry.turn)).toEqual([1, 2])
    expect(turns[0]!.attempts).toHaveLength(1)
  })

  it('taints the attempt and closes the step when a step boundary interrupts an open step', () => {
    const events = [
      turnStart(1, 1000),
      stepStart(1, 0, 1010),
      requestHeader(PROVIDER, MODEL, 1020),
      stepStart(1, 1, 1030), // contradiction: step 0 never ended
      assistantMessage(1, 1, 1040, message(PROVIDER, MODEL), {
        usage: usageOf(30, 10, { totalTokens: 40, cacheReadTokens: 0, cacheWriteTokens: 0 }),
      }),
      stepEnd(1, 1, 1050),
      turnEnd(1, 1060),
    ]
    const row = wire(events).turns[0]!
    expect(row.complete).toBe(false)
    expect(row.attempts.map(entry => entry.id)).toEqual(['1:0:0', '1:1:0'])
    expect(row.attempts[0]!.completeness).toBe('invalid')
    expect(row.attempts[1]!.completeness).toBe('complete')
  })

  it('taints on a double settlement and on retries without a settled attempt', () => {
    const doubleSettlement = [
      turnStart(1, 1000),
      stepStart(1, 0, 1010),
      requestHeader(PROVIDER, MODEL, 1020),
      assistantMessage(1, 0, 1030, message(PROVIDER, MODEL), {
        usage: usageOf(30, 10, { totalTokens: 40, cacheReadTokens: 0, cacheWriteTokens: 0 }),
      }),
      assistantMessage(1, 0, 1035, message(PROVIDER, MODEL), {
        usage: usageOf(30, 10, { totalTokens: 40, cacheReadTokens: 0, cacheWriteTokens: 0 }),
      }),
      stepEnd(1, 0, 1040),
      turnEnd(1, 1050),
    ]
    const doubled = wire(doubleSettlement).turns[0]!
    expect(doubled.complete).toBe(false)
    expect(doubled.attempts[0]!.completeness).toBe('invalid')

    const retryWithoutSettle = [
      turnStart(1, 1000),
      stepStart(1, 0, 1010),
      requestHeader(PROVIDER, MODEL, 1020),
      retry(1, 0, 1030),
      stepEnd(1, 0, 1040),
      turnEnd(1, 1050),
    ]
    const unsettled = wire(retryWithoutSettle).turns[0]!
    expect(unsettled.complete).toBe(false)
    expect(unsettled.attempts[0]!.completeness).toBe('invalid')

    const retryStartedWithoutRetry = [
      turnStart(1, 1000),
      stepStart(1, 0, 1010),
      requestHeader(PROVIDER, MODEL, 1020),
      assistantMessage(1, 0, 1030, message(PROVIDER, MODEL), {
        usage: usageOf(30, 10, { totalTokens: 40, cacheReadTokens: 0, cacheWriteTokens: 0 }),
      }),
      retryStarted(1, 0, 1040), // a retry-started must follow llm/retry
      stepEnd(1, 0, 1050),
      turnEnd(1, 1060),
    ]
    const jumped = wire(retryStartedWithoutRetry).turns[0]!
    expect(jumped.complete).toBe(false)
    expect(jumped.attempts[0]!.completeness).toBe('invalid')
  })

  it('ignores events outside any open turn', () => {
    const base = foldAll([])
    expect(foldLedgerState(base, assistantMessage(1, 0, 1000, message(PROVIDER, MODEL), {
      usage: usageOf(10, 5, { totalTokens: 15, cacheReadTokens: 0, cacheWriteTokens: 0 }),
    }))).toBe(base)
  })

  it('reports an open turn as an incomplete live row', () => {
    const events = [
      turnStart(1, 1000),
      stepStart(1, 0, 1010),
      requestHeader(PROVIDER, MODEL, 1020),
      assistantMessage(1, 0, 1030, message(PROVIDER, MODEL), {
        usage: usageOf(10, 5, { totalTokens: 15, cacheReadTokens: 0, cacheWriteTokens: 0 }),
      }),
    ]
    const { turns } = wire(events)
    expect(turns).toHaveLength(1)
    expect(turns[0]!.complete).toBe(false)
    expect(turns[0]!.endedAt).toBeUndefined()
    expect(turns[0]!.attempts[0]!.completeness).toBe('complete')
    // The harness fold proves nothing without the turn boundary.
    expect(deriveCrossCheck(events)).toBeUndefined()
  })
})

describe('ledger schemas', () => {
  const validEvents = [
    turnStart(1, 1000),
    stepStart(1, 0, 1010),
    requestHeader(PROVIDER, MODEL, 1020),
    assistantMessage(1, 0, 1030, message(PROVIDER, MODEL), {
      usage: usageOf(10, 5, { totalTokens: 15, cacheReadTokens: 0, cacheWriteTokens: 0 }),
    }),
    stepEnd(1, 0, 1040),
    turnEnd(1, 1050),
  ]

  it('accepts the folded state and wire of a normal turn', () => {
    const state = foldAll(validEvents)
    expect(priceMonitorUsageProjectionDefinition.stateSchema.safeParse(state).success).toBe(true)
    const value = priceMonitorUsageProjectionDefinition.wire.view(state)
    expect(priceMonitorUsageProjectionDefinition.wire.viewSchema.safeParse(value).success).toBe(true)
  })

  it('rejects a corrupted checkpoint', () => {
    const state = foldAll(validEvents) as unknown as Record<string, unknown>
    const corrupted = {
      ...state,
      turns: [{ ...(state.turns as TurnUsageRow[])[0], startedAt: -1 }],
    }
    expect(priceMonitorUsageProjectionDefinition.stateSchema.safeParse(corrupted).success).toBe(false)
  })

  it('rejects a wire value with a negative count', () => {
    const value = priceMonitorUsageProjectionDefinition.wire.view(foldAll(validEvents))
    const corrupted = {
      turns: value.turns.map(row => ({
        ...row,
        attempts: row.attempts.map(attempt => ({ ...attempt, outputTokens: -3 })),
      })),
    }
    expect(priceMonitorUsageProjectionDefinition.wire.viewSchema.safeParse(corrupted).success).toBe(false)
  })
})
