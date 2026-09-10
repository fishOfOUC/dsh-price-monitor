/**
 * Browser-trust fence for the plugin routes, behaviorally identical to the
 * one dsh-better-sidebar runs in front of /sidebar (and the /api gateway's
 * fence): Host-header loopback or a configured trusted authority passes, and
 * cross-site browser markers are refused. This is a DNS-rebinding / cross-site
 * defense, not authentication.
 *
 * @module dsh-price-monitor/trust-fence
 */
import type { IncomingHttpHeaders } from 'node:http';
/** The request facts the fence reads (structural subset of IncomingMessage). */
export interface FenceRequest {
    headers: IncomingHttpHeaders;
}
/** Whether a normalized URL hostname names the local loopback authority. */
export declare function isLoopbackHostname(hostname: string): boolean;
/**
 * Decide whether one request may reach the plugin routes.
 * @param request - request facts (headers).
 * @param trustedHosts - non-loopback authorities this deployment serves.
 * @returns true when the Host is ours (loopback or trusted) and browser markers are same-origin.
 */
export declare function isTrustedApiRequest(request: FenceRequest, trustedHosts: readonly string[]): boolean;
