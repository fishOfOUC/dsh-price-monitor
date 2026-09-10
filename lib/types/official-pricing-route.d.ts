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
import type { WebRouteFace } from './context-types.ts';
/** The registered route definition (exact POST path). */
export declare function officialPricingRoute(trustedHosts: readonly string[]): WebRouteFace;
