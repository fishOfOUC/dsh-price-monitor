/**
 * Small JSON response helpers for the host routes.
 *
 * @module dsh-price-monitor/wire
 */
import type { ServerResponse } from 'node:http';
/** A minimal response face the routes write to. */
export interface WireResponse {
    statusCode: number;
    end(body?: string): void;
}
/** Send one JSON body with a status code and a short Cache-Control. */
export declare function sendJson(res: WireResponse, status: number, body: unknown): void;
/** Send an empty body with a status code. */
export declare function sendEmpty(res: WireResponse, status: number): void;
/** Send a JSON error envelope. */
export declare function sendError(res: WireResponse, status: number, code: string, message: string): void;
/** Read a response body capped at maxBytes; rejects when it exceeds the cap. */
export declare function readBoundedBody(stream: ReadableStream<Uint8Array> | null, maxBytes: number): Promise<string>;
export type { ServerResponse };
