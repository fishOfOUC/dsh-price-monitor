/**
 * Structural faces of the services this plugin consumes, host and client.
 *
 * Like dsh-better-sidebar's own context-types, these are restated mirrors —
 * NOT cordis augmentations — because the harness host and client packages
 * augment `@deepseek-ai/cordis` with different types for shared members
 * (host `sessions: SessionStore` vs client `sessions: ISessions`), and
 * re-declaring either member here would fail interface merging (TS2717).
 * Faces are combined with the vendored cordis `Context` by intersection at
 * each call site instead.
 *
 * This file must stay free of Node.js types: it is part of the
 * client-reachable declaration graph. Host-only modules cast to real Node
 * types at their own boundaries.
 *
 * @module dsh-price-monitor/context-types
 */
import type { Context as CordisContext } from '@deepseek-ai/cordis';
import type { SessionId } from '@deepseek-ai/dsh-session/types';
import type { BetterSidebarService } from 'dsh-better-sidebar';
/** The bare observable face a projection key exposes (getSnapshot/subscribe). */
export interface ObservableSnapshotFace<T> {
    getSnapshot(): T;
    subscribe(listener: () => void): () => void;
}
/** The per-session projection store face (`session.projections.faceOf(key)`). */
export interface SessionProjectionStoreFace {
    faceOf(key: string): ObservableSnapshotFace<unknown>;
}
/** The stable session binding face (`ctx.sessions.binding(id)`). */
export interface SessionBindingFace {
    session: {
        projections: SessionProjectionStoreFace;
    };
}
/**
 * The client sessions-service slice this plugin reads (mirror of
 * ISessions.binding). Absent when the deployment's client has no Session
 * Controller; readers then see no projection at all rather than failing.
 */
export interface SessionsClientFace {
    binding?(id: SessionId): SessionBindingFace | undefined;
}
/** One locale snapshot field read for re-render (mirror of LocaleSnapshot). */
export interface LocaleSnapshotFace {
    readonly active: string;
    readonly revision: number;
}
/** The client locale-service slice this plugin uses (mirror of LocaleRuntime). */
export interface LocaleClientFace {
    getSnapshot(): LocaleSnapshotFace;
    subscribe(listener: () => void): () => void;
    /** Register one namespace's complete dictionaries for every built-in locale. */
    register(ns: string, dicts: Record<string, Record<string, string>>): () => void;
    /** Bind a namespace to a translate function reading the active locale at call time. */
    bind(ns: string): (key: string, params?: Record<string, unknown>) => string;
}
/** One named webserver route (mirror of the host-webserver WebRoute). */
export interface WebRouteFace {
    kind: 'exact' | 'prefix';
    path: string;
    handler: (req: unknown, res: unknown) => void | Promise<void>;
}
/** The host webserver face (`ctx.webServer.register`). */
export interface WebServerFace {
    register(route: WebRouteFace): () => void;
}
/** The web runtime face (bind-derived trust list for the request fence). */
export interface WebRuntimeFace {
    readonly trustedHosts: readonly string[];
}
/**
 * The host context face: cordis base plus the services the host half consumes.
 * Omitted-and-replaced members (rather than intersection): a program that also
 * pulls a harness package augmenting the same member would otherwise have to
 * satisfy BOTH declarations, and the host and client faces of `sessions`
 * genuinely differ.
 */
export type HostContext = Omit<CordisContext, 'webServer' | 'webRuntime'> & {
    webServer: WebServerFace;
    webRuntime: WebRuntimeFace;
};
/** The client context face: cordis base plus the client services the tab consumes. */
export type ClientContext = Omit<CordisContext, 'sessions' | 'locale' | 'betterSidebar'> & {
    /** The sidebar tab/viewer registry (provided by the sidebar's client half). */
    betterSidebar: BetterSidebarService;
    /** The Session Controller client face (binding → projection store). */
    sessions: SessionsClientFace;
    /** The client locale registry this plugin's dictionary registers into. */
    locale: LocaleClientFace;
};
/**
 * Widen a cordis context into the client faces this plugin reads.
 *
 * Two reasons one conversion (through `unknown`) is the honest form here.
 * The sidebar's structural `Context` mirrors `sessions.binding` as the rename
 * verb only — it never reads projections — although the runtime object is the
 * Session Controller's client service, which has them. And the base cordis
 * `Context` in this program carries no client service augmentations at all:
 * this package mirrors the client services structurally (see the file header)
 * rather than importing every client package's declaration merge. Converting
 * once, here, keeps every consumer typed against the real reads instead of
 * scattering casts through the components.
 * @param ctx - a cordis context from the sidebar's tab/settings props.
 * @returns the same runtime context, typed for this plugin's reads.
 */
export declare function clientContextOf(ctx: CordisContext): ClientContext;
