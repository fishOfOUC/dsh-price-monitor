---
description: "dsh-price-monitor: a dsh-better-sidebar tab that prices a DeepSeek Harness session's provider-reported token usage."
kind: "user-guide"
---

# dsh-price-monitor

Session cost monitoring for DeepSeek Harness: a host-side session projection
folds the durable log into a per-attempt token ledger, and a
[dsh-better-sidebar](https://github.com/topics/dsh-better-sidebar) tab prices
that ledger with an official or hand-entered plan.

## Requirements — read this first

**This plugin has no user interface of its own. It renders entirely as a tab of
[dsh-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar), which
must be installed and mounted first.** Without it:

- there is no place for the cost view to appear — this package registers a
  single sidebar tab and a plan-settings panel, nothing else;
- the client half refuses to activate, and says so
  (`dsh-price-monitor requires Better Sidebar features: pluginSettings, stateSubscription`),
  rather than loading a half-working panel.

| Requirement | Why |
|---|---|
| DeepSeek Harness with the `web` profile | the plugin ships a Host half (a session projection and an HTTP route) and a browser half |
| [dsh-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) **≥ 0.18.0**, mounted and enabled | the tab, the settings panel, the plan catalog's storage, and the projection read all come from its service API (`ctx.betterSidebar`, `stateSubscription`, `pluginSettings`) — see [Install](#install) |
| A `deepseek-official` route in the session | pricing attributes cost to that provider; anything else is reported as unpriced rather than guessed |

The host half (the token ledger) works without the sidebar, but nothing reads
it: the ledger has no UI besides that tab.

## What it shows

- **Total cost** for the current session, with the exact three-bucket split
  (cache miss / cache hit / output) in both tokens and USD.
- **Per-turn list**: every turn with its tokens and cost, expandable to each
  billed request attempt — including attempts that retried, switched model, or
  cannot be priced.
- **Plan card** with the selected plan's rates and a same-tokens comparison
  across every saved plan.
- **Partial honesty**: an attempt whose usage is missing, whose provider is not
  `deepseek-official`, whose model matches no plan, whose plan is not in force
  at that time, or that reported cache-write tokens a plan has no rate for is
  excluded from the *money* and listed with its reason. Token counts, being
  provider-reported facts, are still summed and shown: unknown cost never
  blanks a known count, and unknown is never shown as zero.

## Architecture

```
host   priceMonitorUsage session projection   ← the only fact source
         └─ one row per (turn, step, attempt): startedAt/settledAt, provider,
            model, the four DSH token buckets, completeness
client price tab (dsh-better-sidebar)
         ├─ reads the projection through ctx.sessions.binding(id)
         ├─ prices it with decimal.js under pluginSettings['price-monitor']
         └─ official refresh: POST /price-monitor/api/official-pricing
```

Three properties follow from that split, and each is covered by tests:

1. **Complete history** — the ledger comes from the whole persisted log, not
   from the client's paged event window.
2. **No double counting** — pricing never re-derives tokens; it consumes the
   exact provider-reported buckets. The fold mirrors the harness's own
   `deriveTurnTokenUsage` and is cross-checked against it for every complete
   turn.
3. **Re-pricing is free** — plans live in the sidebar's settings, so switching
   a plan re-prices without touching the session log.

## Token bucket semantics

DSH's `TokenUsage` buckets are disjoint: `inputTokens` is **uncached input
only**, and DeepSeek's adapter subtracts cache hits out of `prompt_tokens`
before writing it. Pricing therefore multiplies each bucket by its own rate and
never computes `prompt_tokens - cacheReadTokens`. `outputTokens` already
includes reasoning tokens, so reasoning is never billed twice.

## Pricing plans

Rates are USD per million tokens stored as decimal strings; every product and
sum stays a `Decimal` until display.

| Plan source | Editable | Created by |
|---|---|---|
| `official` | no — duplicate it first | the bundled snapshot, or an official refresh |
| `manual` | yes | the settings panel |

### Model aliases

A deployment may report a model under an id no plan names — this harness
reports `deepseek-v4.1-flash-expires-on-0910` for the model the page lists as
`deepseek-flash`. The settings panel's **Model aliases** map one reported id
onto a model a plan names, so such a session is priced without duplicating
(and thereby detaching) a read-only official plan:

```
deepseek-v4.1-flash-expires-on-0910 → deepseek-flash
```

Attribution consults the alias map before the plan's `modelIds`; the
same-tokens comparison and repricing mode need no alias at all, since they
substitute the model by design. An alias pointing at a model no plan names
leaves the attempt unpriced — the plugin never guesses a rate for an unknown id.

### Effective windows

A plan may declare when it is in force. `effectiveFrom` is optional, and its
absence means **no known start**: the plan applies back to the beginning of the
log and is superseded by any later-fetched plan naming the same model. An
official snapshot omits it deliberately — a fetch observes today's rates, it
does not learn when they began — so historical sessions are priced with the
best rates the plugin has rather than showing nothing. A hand-entered
historical plan states its window; an attempt outside every window is reported
as `no plan version in force at that time`, which is a different fix from
`no matching plan` (the model is named by nobody).

Peak/off-peak uses each attempt's UTC start time: Monday–Friday,
01:00–04:00 and 06:00–10:00 UTC are peak (left-closed, right-open). The bundled
snapshot is dated 2026-09-10 and shows its source link in the UI; it prices the
two models the page lists — the flash model and the pro model — with one flash
price covering the ids that model has been listed or reported under
(`deepseek-flash`, `deepseek-v4-flash`, `deepseek-v4-flash-vision-exp`).

Two calculation modes, never conflated:

- **As-of-time pricing** — each attempt is attributed to the plan in force when
  it ran (provider and model matter, so an unaliased model or a non-DeepSeek
  provider stays explicitly unpriced). The hero's aside shows the counterfactual
  at the selected plan, so switching a plan answers "what would this cost at
  other rates" without changing the actual number.
- **Reprice everything** — a simulated counterfactual over the same tokens:
  every attempt whose token facts are usable is priced at the *selected* plan's
  rates, regardless of which model or provider produced it, because substituting
  the model is the entire point. Only unusable token facts (missing or invalid
  usage, an unseparable cache split, cache-write tokens with no rate) stay
  unpriced. The UI labels the mode as a simulation.

## Official price refresh

The client never fetches the upstream page. It POSTs to the plugin's host
route, which:

1. requires the browser-trust fence (Host header must be loopback or a
   configured trusted authority; `cross-site` and mismatched `Origin` are
   refused) and POST only;
2. fetches one hard-coded URL (`https://api-docs.deepseek.com/quick_start/pricing/`)
   — a client payload cannot change the target, redirects must stay HTTPS on
   that one host, and the body is capped at 256 KiB and must be HTML;
3. parses the page strictly: model header, the three priced categories across
   both bands, the peak = 2 × off-peak relation, and the peak-window footnote.
   Any structural change fails the whole import (HTTP 502) and the caller keeps
   the last good catalog;
4. returns a per-field diff. The user confirms in the tab before anything is
   written, and applying appends new immutable official versions (fresh ids) —
   previous versions stay for historical comparison.

## Install

Install and mount **dsh-better-sidebar first** — this plugin's tab appears in
that sidebar's `+` menu, and its plan settings appear in that sidebar's
*Side card* settings page. Then install this plugin:

```sh
# 1. the sidebar this plugin renders inside (skip if you already have it)
dsh plugin --profile web add dsh-better-sidebar

# 2. this plugin
dsh plugin --profile web add dsh-price-monitor
```

Both commands append a bundle to the profile and restart-time mount; restart
DSH after installing (the Host halves changed), then open the sidebar's `+`
menu and pick **Session cost**.

### Development install (from this checkout)

```sh
cd dsh-price-monitor
pnpm install
pnpm run build          # tsc emits lib/types, tsdown emits lib/index.js + lib/client.js
```

Then point the profile's sidebar plugin at the built package:

```yaml
# ~/.dsh/profiles/web/package.json
"dependencies": {
  "dsh-price-monitor": "link:E:/Code/my_code/dsh_price_monitor/dsh-price-monitor"
}
```

```sh
cd ~/.dsh/profiles/web && pnpm install
```

The package's own `cordis.patch.yml` (`dsh.bundle.patch`) mounts the host half
once the bundle is in `dsh.profile.bundles`; for a `link:` install add the
bundle name there as well:

```json
"dsh": { "profile": { "bundles": [ "...", "dsh-price-monitor" ] } }
```

Then **restart DSH** and hard-refresh the browser. The tab appears in the
sidebar's + menu as **Session cost**; its gear opens the plan settings.

Restart the host after *any* rebuild, including client-only edits: the client
artifact is served from `/plugins/<package>/client.js` with a revision derived
from its bytes, and a `link:`ed package outside the loader's watched workspace
is not re-read while the host runs — a rebuilt `lib/client.js` keeps being
served from the host's in-memory copy until it restarts.

### Published install

```sh
dsh plugin --profile web add dsh-price-monitor
```

The same sidebar-first rule applies: with no mounted dsh-better-sidebar the
client half throws at activation instead of silently doing nothing, so check
that the sidebar itself is working before filing a bug here.

## Privacy and network behavior

- Reading the ledger and pricing it are entirely local; nothing is uploaded.
- The only outbound request is the official-pricing refresh, which the user
  triggers explicitly and which fetches one public documentation page.
- Plan settings live in the sidebar's own preferences document
  (`pluginSettings['price-monitor'].catalog`), i.e. alongside the user's other
  sidebar settings; the plugin writes nothing into session logs.

## Configuration

No `cordis.yml` configuration: the plan catalog is user data, edited in the
settings panel. The bundled official snapshot is the offline default.

## Development notes

- `pnpm run typecheck`, `pnpm run test`, `pnpm run build`.
- `lib/` is committed, so a git install (`dsh plugin add github:<owner>/dsh-price-monitor`)
  needs no build step. Rerun `pnpm run build` and commit `lib/` together with any
  source change.
- The client half is a ModuleLoader closure factory (`format: 'cjs'` wrapped in
  `window.__ModuleLoader__.load`), because the harness evaluates it as a classic
  script at `/plugins/dsh-price-monitor/client.js`; only the harness's browser
  module table may stay external, so zod and decimal.js are inlined.
- Styles are injected as one `<style>` element from `src/client/styles.ts`
  rather than a `*.module.css` import: tsdown does not compile CSS modules
  without an extra plugin, and every class carries a `dpm-` prefix so one
  global sheet cannot collide. Colors come only from DSH theme tokens.
- The tab writes its catalog through the sidebar's own settings route with the
  same whole-`pluginSettings` patch its client sends, serialized through one
  promise chain so two quick edits cannot interleave.

## Tests

| File | Covers |
|---|---|
| `tests/usage-ledger.spec.ts` | the fold: attempt lifecycle, retries, validation, contradictions, reference stability, cold/live parity, and cross-checks against the harness's `deriveTurnTokenUsage` |
| `tests/pricing-engine.spec.ts` | peak boundaries, effective windows (unknown start, supersession), the two no-plan reasons, model aliases, token facts under partial pricing, both modes, decimal exactness, schema rejection |
| `tests/official-pricing.spec.ts` | both saved page fixtures (three-column and the renamed two-model layout) parse exactly; changed amounts, categories, headers, malformed ids, or footnote windows fail |
| `tests/trust-fence.spec.ts` | loopback/trusted hosts pass; cross-site, opaque, and mismatched origins fail |
| `tests/client.spec.tsx` | activation and the feature gate, catalog reads, and rendered totals equal to the sum of the turn rows |
| `tests/client-interaction.spec.tsx` | expanding a turn reveals each attempt; plan and mode switches write the catalog and re-render; a failed write surfaces |
| `tests/built-artifacts.spec.ts` | the built entry points exist and behave; the client bundle is a valid loader factory; the route over real HTTP refuses GET/cross-site/foreign redirects and returns a candidate plus diff |
