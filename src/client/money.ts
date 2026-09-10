/**
 * Money presentation for the price-monitor client. Amounts are `Decimal`s
 * produced by the pricing engine and are never converted between currencies:
 * a plan's rates are the numbers its publisher printed, so an amount always
 * carries the currency of the plan that produced it.
 *
 * @module dsh-price-monitor/client/money
 */

import { Decimal } from 'decimal.js'
import type { Currency } from '../pricing/index.ts'

/** The symbol of each supported currency. */
export const SYMBOL: Record<Currency, string> = { USD: '$', CNY: '¥' }

/** Every supported currency, in display order. */
export const CURRENCIES: readonly Currency[] = ['USD', 'CNY']

/**
 * Format an amount in the currency of the plan that produced it, with adaptive
 * decimals so a small total keeps enough digits to stay readable.
 * @param value - the exact amount.
 * @param currency - the producing plan's currency.
 * @returns the display string.
 */
export function formatCost(value: Decimal, currency: Currency): string {
  const absolute = value.abs()
  const decimals = absolute.gte(10) ? 4 : absolute.gte(0.01) ? 6 : 8
  return `${SYMBOL[currency]}${value.toFixed(decimals)}`
}

/**
 * A signed percentage change of `current` against `reference`, or undefined
 * when there is nothing to compare — a zero reference, an identical amount, or
 * two different currencies, where a ratio would be meaningless.
 * @param current - the amount to describe.
 * @param reference - the amount it is compared against.
 * @param sameCurrency - whether both amounts share one currency.
 * @returns the signed percentage, or undefined.
 */
export function formatDelta(current: Decimal, reference: Decimal, sameCurrency: boolean): string | undefined {
  if (!sameCurrency || reference.isZero()) return undefined
  const delta = current.div(reference).minus(1).mul(100)
  if (delta.isZero()) return undefined
  return `${delta.isNegative() ? '−' : '+'}${delta.abs().toFixed(0)}%`
}
