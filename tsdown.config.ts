import { defineConfig, type UserConfig } from 'tsdown'

/**
 * Two halves with genuinely different artifact contracts.
 *
 * Host (`.`, `lib/index.js`): plain ESM for Node, loaded by the cordis Loader
 * from a real install. Production dependencies (`zod`, `htmlparser2`,
 * `decimal.js`) stay imports — they are installed beside the built package —
 * and only the framework faces are never bundled.
 *
 * Client (`./client`, `lib/client.js`): the harness fetches this file at
 * `/plugins/<package>/client.js` and evaluates it as a classic script, so it
 * must be the closure-factory artifact `window.__ModuleLoader__.load({id,
 * factory})` — a plain ESM bundle would never register. Everything the loader
 * module table does not answer is inlined (zod, decimal.js), because a
 * `require()` the table cannot answer is a runtime throw; the table is the
 * harness's `PLATFORM_MODULES` (react, react-dom, cordis, client-store,
 * ui-slots, ui-primitives, ui-dockkit). This package requires react only: all
 * DSH and dsh-better-sidebar imports here are type-only and erased, and
 * cross-plugin collaboration goes through cordis services (ctx.betterSidebar,
 * ctx.sessions, ctx.locale) rather than module edges.
 */

/** Production dependencies kept as imports in the host artifact. */
const PRODUCTION_DEPENDENCIES: readonly string[] = ['decimal.js', 'htmlparser2', 'zod']

/** The harness browser module table (`packages/client/web/src/platform.ts`). */
const PLATFORM_MODULES: readonly string[] = [
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

/** The plugin id stamped into the loader handoff (the package name). */
const PLUGIN_ID = 'dsh-price-monitor'

/** One specifier pattern matching a package name and its subpaths. */
function packagePattern(name: string): RegExp {
  return new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(/|$)`)
}

const host: UserConfig = {
  name: PLUGIN_ID,
  entry: { index: 'src/index.ts' },
  format: ['esm'],
  platform: 'node',
  target: 'es2022',
  outDir: 'lib',
  // Declarations beside the JavaScript, so a relative importer of
  // `lib/index.js` is typed without a second tree. The package's published type
  // entries are the tsc-emitted `lib/types/**` (tsconfig.build.json), which
  // `clean: false` keeps.
  dts: true,
  sourcemap: false,
  clean: false,
  // `.js`, not tsdown's `.mjs` default: the package is `"type": "module"` and
  // `main`/`exports` follow the harness convention of pointing at `lib/*.js`.
  outExtensions: () => ({ js: '.js' }),
  deps: {
    neverBundle: [/^@deepseek-ai\//, ...PRODUCTION_DEPENDENCIES.map(packagePattern)],
  },
}

const client: UserConfig = {
  name: `${PLUGIN_ID}/client`,
  entry: { client: 'src/client/index.tsx' },
  format: 'cjs',
  platform: 'browser',
  target: 'es2022',
  outDir: 'lib',
  dts: false,
  sourcemap: false,
  clean: false,
  deps: {
    neverBundle: [...PLATFORM_MODULES],
    alwaysBundle: (specifier: string) => !PLATFORM_MODULES.includes(specifier),
    // Inlining every non-table dependency is the point of this artifact (the
    // loader can only answer the table), so the "unexpected dependency"
    // advisory is not applicable here.
    onlyBundle: false,
  },
  outputOptions: {
    entryFileNames: 'client.js',
    // The classic-script wrapper the harness module loader expects; `module`,
    // `exports` and `require` come from the intro and the loader's table.
    banner: `window.__ModuleLoader__.load({ id: ${JSON.stringify(PLUGIN_ID)}, factory: (require) => {`,
    footer: 'return module.exports; } });',
    intro: 'var module = { exports: {} }; var exports = module.exports;',
  },
}

export default defineConfig([host, client])
