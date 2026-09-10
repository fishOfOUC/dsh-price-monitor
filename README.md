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
| A plan for the rates you want to see | the selected plan prices the session; without one, every request is listed as unpriced rather than guessed |

The host half (the token ledger) works without the sidebar, but nothing reads
it: the ledger has no UI besides that tab.

## What it shows

- **Total cost** for the current session at the selected plan's rates, with the
  exact three-bucket split (cache miss / cache hit / output) in both tokens and
  USD.
- **Per-turn list**: every turn with its tokens and cost, expandable to each
  billed request attempt — including attempts that retried, switched model, or
  cannot be priced.
- **Plan card** with the selected plan's rates and a same-tokens comparison
  across every saved plan.
- **Partial honesty**: an attempt whose usage never arrived or failed
  validation, whose cache buckets cannot be separated, or that reported
  cache-write tokens the plan has no rate for is excluded from the *money* and
  listed with its reason. Token counts, being provider-reported facts, are still
  summed and shown: unknown cost never blanks a known count, and unknown is
  never shown as zero.

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

### How a session is priced

**The selected plan is the whole pricing basis.** It prices every attempt of
the session, so switching a plan moves the hero total, the three-bucket
breakdown, the per-turn rows, and the comparison list together — the reason to
switch is exactly "what would these tokens cost at other rates", and the model
and provider that produced them are what the substitution replaces. Nothing
about an attempt's route gates an amount: a request whose model no plan names, a
request that ran on another gateway, and a request with no route recorded at all
are all priced at the selected plan's rates.

Only the token facts can leave an attempt out of the money: usage that never
arrived or failed validation, cache buckets that cannot be separated, and
cache-write tokens a plan has no rate for. Their tokens are still counted, and
the hero switches to "known cost" with the reason tally, so an unknown amount
never becomes a zero.

A plan's declared rate period (`effectiveFrom` / `effectiveTo`) is a label for
the plan card — when those rates applied — and never a gate: the selected plan
prices the whole session whatever dates its attempts fall on. The bundled
snapshot omits a start deliberately, because a fetch observes today's rates
rather than learning when they began.

Peak/off-peak uses each attempt's UTC start time: Monday–Friday, 01:00–04:00 and
06:00–10:00 UTC are peak (left-closed, right-open), and a plan without a peak
band prices everything at its single rate. The bundled snapshot is dated
2026-09-10 and shows its source link in the UI; it prices the two models the
page lists — the flash model and the pro model — with one flash price covering
the ids that model has been listed or reported under (`deepseek-flash`,
`deepseek-v4-flash`, `deepseek-v4-flash-vision-exp`).

Stored settings carry a `schemaVersion`. A readable version 1 blob — which also
held a calculation mode and a model-alias map — is upgraded in place, keeping
the user's plans and selection; both fields are gone because neither can change
an amount under a single pricing basis.

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
| `tests/pricing-engine.spec.ts` | peak boundaries, the selected plan as the sole basis (route, model, and rate period never gate an amount), switching plans reprices every layer, token facts under partial pricing, decimal exactness, schema rejection, and the v1 upgrade |
| `tests/official-pricing.spec.ts` | both saved page fixtures (three-column and the renamed two-model layout) parse exactly; changed amounts, categories, headers, malformed ids, or footnote windows fail |
| `tests/trust-fence.spec.ts` | loopback/trusted hosts pass; cross-site, opaque, and mismatched origins fail |
| `tests/client.spec.tsx` | activation and the feature gate, catalog reads (including the v1 upgrade), the hero total equal to the sum of the turn rows, and a plan switch repricing hero, breakdown, and rows |
| `tests/client-interaction.spec.tsx` | expanding a turn reveals each attempt; clicking a plan writes the catalog and reprices the rendered tab; a failed write surfaces |
| `tests/built-artifacts.spec.ts` | the built entry points exist and behave; the client bundle is a valid loader factory; the route over real HTTP refuses GET/cross-site/foreign redirects and returns a candidate plus diff |
