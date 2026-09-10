import { createHash } from "node:crypto";
import { Parser } from "htmlparser2";
import { z } from "zod";
//#region src/official-pricing.ts
/**
* Strict parser for the DeepSeek official pricing page, plus the shared
* candidate/diff vocabulary the client uses to preview a refresh before
* applying it.
*
* The parser reads the Chinese page, whose prices are the primary published
* numbers in CNY; the English page prints the same rates as a rounded USD
* conversion, and nothing here converts anything. The page is a Docusaurus
* table transposed so models are columns and pricing categories are rows, with
* rowspan carrying the label cells down. The parser reconstructs a rectangular
* grid, locates the model header and the three priced categories (cache hit /
* cache miss / output) across the off-peak and peak bands, and validates the
* structure strictly — a changed header, a missing category, a malformed
* amount, a broken peak/off-peak 2x relation, or a different peak-window
* footnote all fail, so a changed page can never be half-imported over the last
* good catalog.
*
* This module is node-free: the host route adds hashing and the network fetch.
*
* @module dsh-price-monitor/official-pricing
*/
/** A price cell: a decimal amount with the page's own yuan suffix. */
const AMOUNT = /^(\d+(?:\.\d+)?)元$/;
/** The page's peak hours, stated in Beijing time as `H:MM - H:MM、H:MM - H:MM`. */
const WINDOW_FOOTNOTE = /高峰时段为北京时间周一至周五\s*(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})、(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/;
/** The only currency this page prints. */
const PAGE_CURRENCY = "CNY";
/** Reconstruct a rectangular grid, propagating rowspan/colspan values down. */
function expandGrid(rows) {
	const columnCount = rows.reduce((max, row) => {
		let total = 0;
		for (const cell of row) total += cell.colspan;
		return Math.max(max, total);
	}, 0);
	const grid = [];
	const occupied = [];
	for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
		const row = rows[rowIndex];
		let column = 0;
		for (const cell of row) {
			while (occupied[rowIndex]?.[column] === true) column += 1;
			for (let rr = rowIndex; rr < rowIndex + cell.rowspan; rr += 1) for (let cc = column; cc < column + cell.colspan; cc += 1) {
				const occ = occupied[rr] ??= [];
				occ[cc] = true;
				const line = grid[rr] ??= new Array(columnCount).fill("");
				line[cc] = cell.text;
			}
			column += cell.colspan;
		}
	}
	for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) grid[rowIndex] ??= new Array(columnCount).fill("");
	return grid;
}
/**
* Parse one HTML table into a rectangular grid of trimmed cell texts.
*
* Text inside `<sup>` is dropped: in these tables a superscript is always a
* footnote reference (`deepseek-flash<sup>(1)</sup>`), i.e. documentation
* apparatus rather than data. Stripping it here keeps the model-id and
* category matchers reading the cell's actual content — but nothing else is
* normalized, so a cell that means something different still fails validation.
*/
function parseTable(html) {
	const rows = [];
	let currentRow = [];
	let inCell = false;
	let cellText = "";
	let colspan = 1;
	let rowspan = 1;
	let supDepth = 0;
	const parser = new Parser({
		onopentag(name, attributes) {
			if (name === "sup") {
				supDepth += 1;
				return;
			}
			if (name === "tr") currentRow = [];
			else if (name === "td" || name === "th") {
				inCell = true;
				cellText = "";
				colspan = Math.max(1, Number(attributes.colspan ?? 1) || 1);
				rowspan = Math.max(1, Number(attributes.rowspan ?? 1) || 1);
			}
		},
		ontext(text) {
			if (inCell && supDepth === 0) cellText += text;
		},
		onclosetag(name) {
			if (name === "sup") {
				supDepth = Math.max(0, supDepth - 1);
				return;
			}
			if ((name === "td" || name === "th") && inCell) {
				currentRow.push({
					text: cellText,
					colspan,
					rowspan
				});
				inCell = false;
			} else if (name === "tr") {
				rows.push(currentRow);
				currentRow = [];
			}
		}
	}, { decodeEntities: true });
	parser.write(html);
	parser.end();
	return expandGrid(rows);
}
const normalize = (value) => value.replace(/\s+/g, " ").trim();
/** Drop trailing fractional zeros (`0.30` → `0.3`), so equal rates compare equal. */
function canonicalRate(value) {
	if (!value.includes(".")) return value;
	const trimmed = value.replace(/0+$/, "").replace(/\.$/, "");
	return trimmed === "" ? "0" : trimmed;
}
/** The canonical decimal amount of one price cell, or undefined when malformed. */
function stripAmount(value) {
	const match = AMOUNT.exec(normalize(value));
	return match === null ? void 0 : canonicalRate(match[1]);
}
/** Multiply a decimal string by two, exactly (rates are fixed-point). */
function doubleRate(value) {
	const [whole, fraction = ""] = value.split(".");
	const digits = (whole + fraction).padStart(fraction.length + 1, "0");
	let carry = 0;
	let out = "";
	for (let index = digits.length - 1; index >= 0; index -= 1) {
		const doubled = Number(digits[index]) * 2 + carry;
		out = String(doubled % 10) + out;
		carry = doubled >= 10 ? 1 : 0;
	}
	const result = (carry === 1 ? "1" : "") + out;
	const point = result.length - fraction.length;
	const wholePart = result.slice(0, point) || "0";
	const fracPart = result.slice(point).replace(/0+$/, "");
	return fracPart === "" ? wholePart : `${wholePart}.${fracPart}`;
}
/**
* The priced category a row labels. The miss label contains the hit one's
* characters but not as a contiguous run, and it is matched first so a future
* rewording cannot silently swap the two.
*/
function categoryOf(cell) {
	const value = normalize(cell);
	if (value.includes("缓存未命中")) return "cacheMiss";
	if (value.includes("缓存命中")) return "cacheHit";
	if (value.includes("输出")) return "output";
}
/** The model header row's leading label. */
const MODEL_HEADER = "模型";
/** The two rate bands the page prints, and the peak schedule they imply. */
const OFF_PEAK_BAND = "空闲时段";
const PEAK_BAND = "高峰时段";
/** The peak windows the page's Beijing-time footnote must still name. */
const EXPECTED_PEAK_WINDOWS = [["01:00", "04:00"], ["06:00", "10:00"]];
/** `H:MM` or `HH:MM` to minutes after midnight. */
function clockMinutes(clock) {
	const [hour, minute] = clock.split(":").map(Number);
	return hour * 60 + minute;
}
/** Minutes after midnight to `HH:MM`. */
function clockOf(minutes) {
	return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}
const MODEL_ID = /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/;
/**
* Parse the official pricing page HTML into validated per-model rates and the
* confirmed peak schedule. Returns undefined on any structural mismatch, so a
* caller keeps the last good catalog.
* @param html - the fetched page body.
* @returns the validated parse, or undefined when the page changed unexpectedly.
*/
function parseOfficialPricing(html) {
	const grid = parseTable(html);
	const header = grid.find((row) => normalize(row[0] ?? "") === MODEL_HEADER);
	if (header === void 0 || grid.length < 2) return void 0;
	const models = header.slice(1).map(normalize).filter((value) => value !== "" && value !== MODEL_HEADER);
	if (models.length === 0) return void 0;
	if (models.some((model) => !MODEL_ID.test(model))) return void 0;
	if (new Set(models).size !== models.length) return void 0;
	const rates = /* @__PURE__ */ new Map([
		["cacheHit", {}],
		["cacheMiss", {}],
		["output", {}]
	]);
	for (const row of grid) {
		const category = categoryOf(row[1] ?? "");
		if (category === void 0) continue;
		const band = normalize(row[2] ?? "");
		if (band !== OFF_PEAK_BAND && band !== PEAK_BAND) continue;
		const prices = row.slice(3, 3 + models.length).map(stripAmount);
		if (prices.length !== models.length || prices.some((value) => value === void 0)) return void 0;
		const slot = rates.get(category);
		const key = band === OFF_PEAK_BAND ? "off" : "peak";
		if (slot[key] !== void 0) return void 0;
		slot[key] = prices;
	}
	for (const slot of rates.values()) if (slot.off === void 0 || slot.peak === void 0) return void 0;
	for (let index = 0; index < models.length; index += 1) for (const [category, slot] of rates) {
		const off = slot.off[index];
		const peak = slot.peak[index];
		if (doubleRate(off) !== peak) return void 0;
	}
	const footnote = WINDOW_FOOTNOTE.exec(html);
	if (footnote === null) return void 0;
	footnote[1], footnote[2], footnote[3], footnote[4];
	const toUtc = (clock) => clockOf((clockMinutes(clock) - 480 + 1440) % 1440);
	const utcWindows = [[toUtc(footnote[1]), toUtc(footnote[2])], [toUtc(footnote[3]), toUtc(footnote[4])]];
	if (utcWindows[0][0] !== EXPECTED_PEAK_WINDOWS[0][0] || utcWindows[0][1] !== EXPECTED_PEAK_WINDOWS[0][1] || utcWindows[1][0] !== EXPECTED_PEAK_WINDOWS[1][0] || utcWindows[1][1] !== EXPECTED_PEAK_WINDOWS[1][1]) return;
	const cacheHit = rates.get("cacheHit");
	const cacheMiss = rates.get("cacheMiss");
	const output = rates.get("output");
	return {
		models: models.map((model, index) => ({
			model,
			cacheHit: cacheHit.off[index],
			peakCacheHit: cacheHit.peak[index],
			cacheMiss: cacheMiss.off[index],
			peakCacheMiss: cacheMiss.peak[index],
			output: output.off[index],
			peakOutput: output.peak[index]
		})),
		peakWindows: EXPECTED_PEAK_WINDOWS,
		currency: PAGE_CURRENCY
	};
}
const RATE_FIELDS = [
	"cacheHit",
	"cacheMiss",
	"output",
	"peakCacheHit",
	"peakCacheMiss",
	"peakOutput"
];
/** Field-level diff between a previous official catalog and a candidate. */
function diffOfficialPricing(previous, candidate) {
	const previousByModel = new Map(previous.map((entry) => [entry.model, entry]));
	const candidateModels = new Set(candidate.map((entry) => entry.model));
	const addedModels = candidate.filter((entry) => !previousByModel.has(entry.model)).map((entry) => entry.model);
	const removedModels = previous.filter((entry) => !candidateModels.has(entry.model)).map((entry) => entry.model);
	const changed = [];
	for (const entry of candidate) {
		const before = previousByModel.get(entry.model);
		if (before === void 0) continue;
		for (const field of RATE_FIELDS) if (before[field] !== entry[field]) changed.push({
			model: entry.model,
			field,
			before: before[field],
			after: entry[field]
		});
	}
	return {
		addedModels,
		removedModels,
		changed
	};
}
//#endregion
//#region src/pricing/official-seed.ts
const SOURCE_URL = "https://api-docs.deepseek.com/zh-cn/quick_start/pricing/";
const SNAPSHOT_DATE = "2026-09-10";
const SOURCE_CURRENCY = "CNY";
/** Shared peak schedule for every model group in the current era. */
const OFFICIAL_SCHEDULE = {
	timezone: "UTC",
	peakWeekdays: [
		1,
		2,
		3,
		4,
		5
	],
	peakWindows: [["01:00", "04:00"], ["06:00", "10:00"]]
};
/**
* The flash model's ids: the page's current name, the id earlier pages and
* harness builds reported it under, and the id sessions recorded while vision
* was listed as its own price line used. One price tier, so one group covers
* them.
*/
const FLASH_MODEL_IDS = [
	"deepseek-flash",
	"deepseek-v4-flash",
	"deepseek-v4-flash-vision-exp"
];
/** The pro model's ids, priced by the current era's own table. */
const PRO_MODEL_IDS = ["deepseek-v4-pro"];
const FLASH_CURRENT = {
	cacheHit: "0.02",
	cacheMiss: "1",
	output: "4",
	peakCacheHit: "0.04",
	peakCacheMiss: "2",
	peakOutput: "8"
};
const PRO_CURRENT = {
	cacheHit: "0.15",
	cacheMiss: "4.5",
	output: "13.5",
	peakCacheHit: "0.3",
	peakCacheMiss: "9",
	peakOutput: "27"
};
/** Before the increase: one flat price, cache hit and miss already at today's levels. */
const FLASH_BEFORE = {
	cacheHit: "0.02",
	cacheMiss: "1",
	output: "2"
};
/** The increase: the peak column the era published, its off-peak half. */
const FLASH_RAISED = {
	cacheHit: "0.05",
	cacheMiss: "1.5",
	output: "4.5",
	peakCacheHit: "0.1",
	peakCacheMiss: "3",
	peakOutput: "9"
};
function entryOf(models, rates) {
	return {
		models: [...models],
		offPeak: {
			cacheMiss: rates.cacheMiss,
			cacheHit: rates.cacheHit,
			output: rates.output
		},
		...rates.peakCacheHit === void 0 || rates.peakCacheMiss === void 0 || rates.peakOutput === void 0 ? {} : { peak: {
			cacheMiss: rates.peakCacheMiss,
			cacheHit: rates.peakCacheHit,
			output: rates.peakOutput
		} }
	};
}
/** Stable short content hash so a plan id is derived from its rates. */
function hash8(text) {
	let hash = 5381;
	for (let index = 0; index < text.length; index += 1) hash = (hash << 5) + hash + text.charCodeAt(index) >>> 0;
	return hash.toString(16).padStart(8, "0");
}
function eraPlan(input) {
	const content = input.entries.map((entry) => [
		entry.models.join(","),
		entry.offPeak.cacheHit,
		entry.offPeak.cacheMiss,
		entry.offPeak.output,
		entry.peak?.cacheHit ?? "",
		entry.peak?.cacheMiss ?? "",
		entry.peak?.output ?? ""
	].join("/")).join("|");
	return {
		id: `era:${input.slug}:${SNAPSHOT_DATE}:${hash8(content)}`,
		name: input.name,
		source: "manual",
		provider: "deepseek-official",
		currency: SOURCE_CURRENCY,
		schedule: input.schedule,
		entries: [...input.entries],
		...input.effectiveFrom === void 0 ? {} : { effectiveFrom: input.effectiveFrom },
		...input.effectiveTo === void 0 ? {} : { effectiveTo: input.effectiveTo },
		provenance: {
			url: SOURCE_URL,
			fetchedAt: `${SNAPSHOT_DATE}T00:00:00.000Z`,
			contentHash: `seed-era-${input.slug}-${SNAPSHOT_DATE}`
		}
	};
}
/** The shipped plan catalog: one plan per published flash-pricing era, oldest first. */
const officialSeedPlans = [
	eraPlan({
		slug: "before-hike",
		name: "涨价前（8-17 前）",
		entries: [entryOf(FLASH_MODEL_IDS, FLASH_BEFORE)],
		schedule: null,
		effectiveTo: "2026-08-16"
	}),
	eraPlan({
		slug: "hike",
		name: "涨价后（8-17 起）",
		entries: [entryOf(FLASH_MODEL_IDS, FLASH_RAISED)],
		schedule: OFFICIAL_SCHEDULE,
		effectiveFrom: "2026-08-17",
		effectiveTo: SNAPSHOT_DATE
	}),
	eraPlan({
		slug: "current",
		name: "降价后（现行官方价）",
		entries: [entryOf(FLASH_MODEL_IDS, FLASH_CURRENT), entryOf(PRO_MODEL_IDS, PRO_CURRENT)],
		schedule: OFFICIAL_SCHEDULE
	})
];
/**
* The shipped era in force: the one that declares no end. The refresh route
* compares the live page against it, and applying a fetch replaces it.
* @returns the current-era plan (the newest shipped plan when none declares an open end).
*/
function currentEraPlan() {
	return officialSeedPlans.find((plan) => plan.effectiveTo === void 0) ?? officialSeedPlans[officialSeedPlans.length - 1];
}
//#endregion
//#region src/trust-fence.ts
function header(headers, name) {
	const value = headers[name];
	return typeof value === "string" ? value : void 0;
}
/** Normalized URL of a Host-header authority, or undefined when unparsable. */
function parseAuthority(authority) {
	try {
		return new URL(`http://${authority}`);
	} catch {
		return;
	}
}
/** Whether a normalized URL hostname names the local loopback authority. */
function isLoopbackHostname(hostname) {
	if (hostname === "localhost" || hostname === "[::1]") return true;
	const parts = hostname.split(".");
	return parts.length === 4 && parts[0] === "127" && parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
}
/** Canonical authority form: hostname, or hostname:port when a port was written. */
function canonicalAuthority(entry, entryUrl) {
	const port = entryUrl.port !== "" ? entryUrl.port : new URL(`https://${entry}`).port;
	return port === "" ? entryUrl.hostname : `${entryUrl.hostname}:${port}`;
}
/** Whether the request authority matches a trustedHosts entry (exact or port-less). */
function isTrustedAuthority(hostUrl, trustedHosts) {
	return trustedHosts.some((entry) => {
		const entryUrl = parseAuthority(entry);
		if (entryUrl === void 0) return false;
		return canonicalAuthority(entry, entryUrl) === entryUrl.hostname ? entryUrl.hostname === hostUrl.hostname : entryUrl.host === hostUrl.host;
	});
}
/**
* Decide whether one request may reach the plugin routes.
* @param request - request facts (headers).
* @param trustedHosts - non-loopback authorities this deployment serves.
* @returns true when the Host is ours (loopback or trusted) and browser markers are same-origin.
*/
function isTrustedApiRequest(request, trustedHosts) {
	const host = header(request.headers, "host");
	if (host === void 0) return false;
	const hostUrl = parseAuthority(host);
	if (hostUrl === void 0) return false;
	if (!isLoopbackHostname(hostUrl.hostname) && !isTrustedAuthority(hostUrl, trustedHosts)) return false;
	if (header(request.headers, "sec-fetch-site") === "cross-site") return false;
	const origin = header(request.headers, "origin");
	if (origin === void 0) return true;
	try {
		return new URL(origin).hostname === hostUrl.hostname;
	} catch {
		return false;
	}
}
//#endregion
//#region src/wire.ts
/** Send one JSON body with a status code and a short Cache-Control. */
function sendJson(res, status, body) {
	res.statusCode = status;
	res.end(JSON.stringify(body));
}
/** Send a JSON error envelope. */
function sendError(res, status, code, message) {
	sendJson(res, status, {
		ok: false,
		error: {
			code,
			message
		}
	});
}
/** Read a response body capped at maxBytes; rejects when it exceeds the cap. */
async function readBoundedBody(stream, maxBytes) {
	if (stream === null) return "";
	const reader = stream.getReader();
	const chunks = [];
	let total = 0;
	for (;;) {
		const { done, value } = await reader.read();
		if (done) break;
		total += value.byteLength;
		if (total > maxBytes) throw new Error(`response body exceeds ${maxBytes} bytes`);
		chunks.push(value);
	}
	return new TextDecoder().decode(joinChunks(chunks));
}
function joinChunks(chunks) {
	const total = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
	const merged = new Uint8Array(total);
	let offset = 0;
	for (const chunk of chunks) {
		merged.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return merged;
}
//#endregion
//#region src/official-pricing-route.ts
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
/**
* The Chinese page: it prints the primary published rates in CNY, while the
* English page prints their rounded USD conversion (see official-pricing.ts).
*/
const OFFICIAL_URL = "https://api-docs.deepseek.com/zh-cn/quick_start/pricing/";
const ALLOWED_HOST = "api-docs.deepseek.com";
const MAX_REDIRECTS = 3;
const MAX_BODY_BYTES = 262144;
const TIMEOUT_MS = 1e4;
/**
* The shipped era in force, expressed in the parser's per-model rate
* vocabulary for diffing: the refresh answers "did the price that applies now
* change", so it compares against the current era rather than the whole shipped
* history.
*/
function seedModelRates() {
	return currentEraPlan().entries.map((entry) => ({
		model: entry.models[0] ?? "unknown",
		cacheHit: entry.offPeak.cacheHit,
		cacheMiss: entry.offPeak.cacheMiss,
		output: entry.offPeak.output,
		peakCacheHit: entry.peak?.cacheHit ?? entry.offPeak.cacheHit,
		peakCacheMiss: entry.peak?.cacheMiss ?? entry.offPeak.cacheMiss,
		peakOutput: entry.peak?.output ?? entry.offPeak.output
	}));
}
async function fetchOfficialPricingPage() {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
	try {
		let url = OFFICIAL_URL;
		for (let redirects = 0;; redirects += 1) {
			const response = await fetch(url, {
				redirect: "manual",
				signal: controller.signal,
				headers: { accept: "text/html" }
			});
			if (response.status >= 300 && response.status < 400) {
				const location = response.headers.get("location");
				if (location === null) throw new Error("redirect without a location");
				const target = new URL(location, url);
				if (target.protocol !== "https:") throw new Error("redirect to a non-HTTPS target refused");
				if (target.hostname !== ALLOWED_HOST) throw new Error("redirect to an unexpected host refused");
				if (redirects >= MAX_REDIRECTS) throw new Error("too many redirects");
				url = target.toString();
				continue;
			}
			if (!response.ok) throw new Error(`upstream responded ${response.status}`);
			if (!(response.headers.get("content-type") ?? "").includes("text/html")) throw new Error("non-HTML response refused");
			return await readBoundedBody(response.body, MAX_BODY_BYTES);
		}
	} finally {
		clearTimeout(timeout);
	}
}
/** The route handler body. */
async function handleOfficialPricing(req, res, trustedHosts) {
	if (req.method !== "POST") {
		sendError(res, 405, "method-not-allowed", "only POST is accepted");
		return;
	}
	if (!isTrustedApiRequest({ headers: req.headers }, trustedHosts)) {
		sendError(res, 403, "forbidden", "forbidden");
		return;
	}
	try {
		const html = await fetchOfficialPricingPage();
		const parsed = parseOfficialPricing(html);
		if (parsed === void 0) {
			sendError(res, 502, "parse-failed", "official pricing page changed unexpectedly; the last catalog was kept");
			return;
		}
		sendJson(res, 200, {
			ok: true,
			candidate: {
				models: parsed.models,
				peakWindows: parsed.peakWindows,
				currency: parsed.currency,
				fetchedAt: (/* @__PURE__ */ new Date()).toISOString(),
				contentHash: createHash("sha256").update(html).digest("hex"),
				sourceUrl: OFFICIAL_URL
			},
			diff: diffOfficialPricing(seedModelRates(), parsed.models)
		});
	} catch (error) {
		sendError(res, 502, "fetch-failed", error instanceof Error ? error.message : "fetch failed");
	}
}
/** The registered route definition (exact POST path). */
function officialPricingRoute(trustedHosts) {
	return {
		kind: "exact",
		path: "/price-monitor/api/official-pricing",
		handler: (req, res) => handleOfficialPricing(req, res, trustedHosts)
	};
}
//#endregion
//#region src/usage-ledger.ts
/**
* The `priceMonitorUsage` projection unit: a pure whole-session fold of the
* durable lifecycle events into one per-attempt token ledger.
*
* The fold mirrors the per-turn attempt semantics of the harness's own
* `deriveTurnTokenUsage` (packages/llm/token-meter/src/turn-usage.ts) — the
* same usage-sample validation rules and the same step/retry lifecycle — but
* keeps every attempt as its own row with timestamps and a route, so pricing
* can place each billed request in a plan. Tests replay harness fixtures and
* assert the bucket sums agree with `deriveTurnTokenUsage` for every complete
* turn.
*
* Contradictory sequences (double settlements, retries without a settled
* attempt, steps inside steps) never throw: the affected attempt is marked
* `invalid` and the turn `complete: false`, and folding continues. Facts that
* could not be proven are absent, never zeroed.
*
* @module dsh-price-monitor/usage-ledger
*/
const EMPTY_STATE = {
	turns: [],
	open: null,
	lastRoute: null
};
const count = z.number().int().nonnegative();
const routeSchema = z.object({
	provider: z.string(),
	model: z.string()
}).strict();
const usageSampleSchema = z.object({
	inputTokens: count,
	outputTokens: count,
	totalTokens: count.optional(),
	cacheReadTokens: count.optional(),
	cacheWriteTokens: count.optional(),
	reasoningTokens: count.optional()
}).strict();
const attemptRowSchema = z.object({
	id: z.string(),
	turn: count,
	step: count,
	attempt: count,
	startedAt: count,
	settledAt: count.optional(),
	provider: z.string().optional(),
	model: z.string().optional(),
	uncachedInputTokens: count.optional(),
	cacheReadTokens: count.optional(),
	cacheWriteTokens: count.optional(),
	outputTokens: count.optional(),
	reasoningTokens: count.optional(),
	completeness: z.enum([
		"complete",
		"usage-missing",
		"route-missing",
		"invalid"
	])
}).strict();
const turnRowSchema = z.object({
	turn: count,
	startedAt: count,
	endedAt: count.optional(),
	complete: z.boolean(),
	attempts: z.array(attemptRowSchema)
}).strict();
const openAttemptSchema = z.object({
	attempt: count,
	startedAt: count,
	route: routeSchema.optional(),
	usage: usageSampleSchema.optional(),
	settledAt: count.optional(),
	settledBy: z.enum(["attempt", "message"]).optional(),
	retried: z.boolean().optional(),
	invalid: z.boolean().optional()
}).strict();
const closedStepSchema = z.object({
	step: count,
	attempts: z.array(attemptRowSchema)
}).strict();
const openStepSchema = z.object({
	step: count,
	attempts: z.array(attemptRowSchema),
	attempt: openAttemptSchema
}).strict();
const openTurnSchema = z.object({
	turn: count,
	startedAt: count,
	steps: z.array(closedStepSchema),
	step: openStepSchema.nullable(),
	complete: z.boolean()
}).strict();
/** Checkpoint schema: the one definition of the fold state's wire shape. */
const stateSchema = z.object({
	turns: z.array(turnRowSchema),
	open: openTurnSchema.nullable(),
	lastRoute: routeSchema.nullable()
}).strict();
/** Client view schema: closed turns plus the live open turn. */
const viewSchema = z.object({ turns: z.array(turnRowSchema) }).strict();
function isCount(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}
function safeSum(values) {
	let total = 0;
	for (const value of values) {
		total += value;
		if (!Number.isSafeInteger(total)) return void 0;
	}
	return total;
}
/** The last usage chunk of a compact assistant stream, or undefined when it reported none. */
function lastUsageChunk(stream) {
	for (let index = stream.length - 1; index >= 0; index -= 1) {
		const record = stream[index];
		if (record?.type !== "chunk" || record.chunk === null || typeof record.chunk !== "object") continue;
		const chunk = record.chunk;
		if (chunk.type === "usage") return chunk.usage;
	}
}
/**
* Validate one provider-reported usage sample: disjoint non-negative
* safe-integer counts, a reasoning subset that never exceeds output, and a
* prompt total that agrees with the exact total when one is reported.
*
* A reported cache-hit bucket is required unless the exact total proves the
* prompt, because without it the split between hit and miss input is unknown.
* The cache-write bucket is not required: sessions recorded before the bucket
* existed, and providers that never account writes, omit it entirely — and no
* plan carries a cache-write rate, so an omitted count changes no amount. A
* reported non-zero write count still keeps the attempt out of the money,
* because the tokens were billed and no rate covers them.
*
* @param usage - raw provider usage.
* @returns the normalized sample, or undefined when it cannot be proven.
*/
function normalizeUsageSample(usage) {
	const { inputTokens, outputTokens, cacheReadTokens, cacheWriteTokens, reasoningTokens, totalTokens } = usage;
	if (!isCount(inputTokens) || !isCount(outputTokens)) return void 0;
	if (cacheReadTokens !== void 0 && !isCount(cacheReadTokens)) return void 0;
	if (cacheWriteTokens !== void 0 && !isCount(cacheWriteTokens)) return void 0;
	if (reasoningTokens !== void 0 && (!isCount(reasoningTokens) || reasoningTokens > outputTokens)) return;
	const knownPrompt = safeSum([
		inputTokens,
		...cacheReadTokens === void 0 ? [] : [cacheReadTokens],
		...cacheWriteTokens === void 0 ? [] : [cacheWriteTokens]
	]);
	if (knownPrompt === void 0) return void 0;
	if (totalTokens !== void 0) {
		if (!isCount(totalTokens)) return void 0;
		const exactPrompt = totalTokens - outputTokens;
		if (!isCount(exactPrompt) || exactPrompt < knownPrompt) return void 0;
		if (cacheReadTokens !== void 0 && cacheWriteTokens !== void 0 && exactPrompt !== knownPrompt) return;
	} else if (cacheReadTokens === void 0) return;
	return {
		inputTokens,
		outputTokens,
		...cacheReadTokens === void 0 ? {} : { cacheReadTokens },
		...cacheWriteTokens === void 0 ? {} : { cacheWriteTokens },
		...reasoningTokens === void 0 ? {} : { reasoningTokens }
	};
}
/**
* Build the wire row for one attempt at close time. The completeness order
* mirrors the fold's failure model: contradictions and unprovable counts are
* `invalid`; a settled attempt without usage is `usage-missing`; valid usage
* without a route is `route-missing`.
*/
function toAttemptRow(attempt, turn, step) {
	const base = {
		id: `${turn}:${step}:${attempt.attempt}`,
		turn,
		step,
		attempt: attempt.attempt,
		startedAt: attempt.startedAt,
		...attempt.settledAt === void 0 ? {} : { settledAt: attempt.settledAt },
		...attempt.route === void 0 ? {} : {
			provider: attempt.route.provider,
			model: attempt.route.model
		}
	};
	if (attempt.invalid === true || attempt.usage !== void 0 && normalizeUsageSample(attempt.usage) === void 0) return {
		...base,
		completeness: "invalid"
	};
	const usage = attempt.usage === void 0 ? void 0 : normalizeUsageSample(attempt.usage);
	if (usage === void 0) return {
		...base,
		completeness: "usage-missing"
	};
	const buckets = {
		uncachedInputTokens: usage.inputTokens,
		outputTokens: usage.outputTokens,
		...usage.cacheReadTokens === void 0 ? {} : { cacheReadTokens: usage.cacheReadTokens },
		...usage.cacheWriteTokens === void 0 ? {} : { cacheWriteTokens: usage.cacheWriteTokens },
		...usage.reasoningTokens === void 0 ? {} : { reasoningTokens: usage.reasoningTokens }
	};
	if (attempt.route === void 0) return {
		...base,
		...buckets,
		completeness: "route-missing"
	};
	return {
		...base,
		...buckets,
		completeness: "complete"
	};
}
/** Flatten an open turn into its wire row (used by the view and by turn close). */
function toTurnRow(open, endedAt, complete) {
	const attempts = [];
	for (const step of open.steps) attempts.push(...step.attempts);
	if (open.step !== null) attempts.push(...open.step.attempts, toAttemptRow(open.step.attempt, open.turn, open.step.step));
	return {
		turn: open.turn,
		startedAt: open.startedAt,
		...endedAt === void 0 ? {} : { endedAt },
		complete,
		attempts
	};
}
/**
* Fold one `llm/retry` or `llm/retry-started` event. These two names are not
* part of this package's compiled `SessionEventMap` (the map merge lives in
* dsh-llm-retry), so they are read structurally instead of via narrowing.
* @param state - ledger covering all prior events.
* @param event - the retry lifecycle event.
* @param kind - the event's type tag.
* @returns the next state; the same reference when the event is not the unit's.
*/
function foldRetryLifecycle(state, event, kind) {
	const data = event.data;
	if (data?.turn === void 0 || data.step === void 0 || !Number.isSafeInteger(data.turn) || !Number.isSafeInteger(data.step)) return state;
	const open = state.open;
	if (open === null || open.step === null) return state;
	const step = open.step;
	if (open.turn !== data.turn || step.step !== data.step) return state;
	const attempt = step.attempt;
	if (kind === "llm/retry") {
		if (attempt.settledBy !== "attempt" || attempt.retried === true) return taint(state, open.turn, step.step);
		return {
			...state,
			open: {
				...open,
				step: {
					...step,
					attempt: {
						...attempt,
						retried: true
					}
				}
			}
		};
	}
	if (attempt.retried !== true) return taint(state, open.turn, step.step);
	const closed = toAttemptRow(attempt, open.turn, step.step);
	return {
		...state,
		open: {
			...open,
			step: {
				step: step.step,
				attempts: [...step.attempts, closed],
				attempt: {
					attempt: attempt.attempt + 1,
					startedAt: event.time,
					...state.lastRoute === null ? {} : { route: state.lastRoute }
				}
			}
		}
	};
}
/** A new step's first attempt, inheriting the latest logged request route. */
function firstAttempt(state, startedAt) {
	return {
		attempt: 0,
		startedAt,
		...state.lastRoute === null ? {} : { route: state.lastRoute }
	};
}
function sameRoute(left, right) {
	return left !== null && left.provider === right.provider && left.model === right.model;
}
/** Mark the open attempt invalid and the turn incomplete; used on every lifecycle contradiction. */
function taint(state, turn, step, settledAt) {
	const open = state.open;
	if (open === null || open.step === null || open.turn !== turn || open.step.step !== step) return state;
	const attempt = open.step.attempt;
	if (attempt.invalid === true) return state;
	return {
		...state,
		open: {
			...open,
			complete: false,
			step: {
				...open.step,
				attempt: {
					...attempt,
					invalid: true,
					...settledAt === void 0 ? {} : { settledAt }
				}
			}
		}
	};
}
/**
* Fold one committed event into the ledger.
* @param state - ledger covering all prior events.
* @param event - the next committed session event.
* @returns the next state; the same reference when the event is not the unit's.
*/
function foldLedgerState(state, event) {
	const type = event.type;
	if (type === "llm/retry" || type === "llm/retry-started") return foldRetryLifecycle(state, event, type);
	switch (event.type) {
		case "turn/start": {
			const { turn } = event.data;
			if (state.open === null) return {
				...state,
				open: {
					turn,
					startedAt: event.time,
					steps: [],
					step: null,
					complete: true
				}
			};
			const row = toTurnRow(state.open, void 0, false);
			return {
				...state,
				turns: [...state.turns, row],
				open: {
					turn,
					startedAt: event.time,
					steps: [],
					step: null,
					complete: true
				}
			};
		}
		case "step/start": {
			if (state.open === null || state.open.turn !== event.data.turn) return state;
			const open = state.open;
			const { step } = event.data;
			if (open.step === null) return {
				...state,
				open: {
					...open,
					step: {
						step,
						attempts: [],
						attempt: firstAttempt(state, event.time)
					}
				}
			};
			const steps = [...open.steps, {
				step: open.step.step,
				attempts: [...open.step.attempts, toAttemptRow({
					...open.step.attempt,
					invalid: true
				}, open.turn, open.step.step)]
			}];
			return {
				...state,
				open: {
					...open,
					steps,
					complete: false,
					step: {
						step,
						attempts: [],
						attempt: firstAttempt(state, event.time)
					}
				}
			};
		}
		case "request/header": {
			const route = {
				provider: event.data.header.config.provider,
				model: event.data.header.config.model
			};
			const open = state.open;
			if (open !== null && open.step !== null && open.step.attempt.settledAt === void 0) {
				const step = open.step;
				return {
					...state,
					lastRoute: route,
					open: {
						...open,
						step: {
							...step,
							attempt: {
								...step.attempt,
								startedAt: event.time,
								route
							}
						}
					}
				};
			}
			return sameRoute(state.lastRoute, route) ? state : {
				...state,
				lastRoute: route
			};
		}
		case "assistant/attempt": {
			const open = state.open;
			if (open === null || open.step === null) return state;
			const step = open.step;
			if (open.turn !== event.data.turn || step.step !== event.data.step) return state;
			const attempt = step.attempt;
			if (attempt.settledAt !== void 0) return taint(state, open.turn, step.step);
			const usage = lastUsageChunk(event.data.stream);
			if (usage !== void 0 && normalizeUsageSample(usage) === void 0) return taint(state, open.turn, step.step, event.time);
			return {
				...state,
				open: {
					...open,
					step: {
						...step,
						attempt: {
							...attempt,
							settledAt: event.time,
							settledBy: "attempt",
							...usage === void 0 ? {} : { usage }
						}
					}
				}
			};
		}
		case "assistant/message": {
			const open = state.open;
			if (open === null || open.step === null) return state;
			const step = open.step;
			if (open.turn !== event.data.turn || step.step !== event.data.step) return state;
			const attempt = step.attempt;
			if (attempt.settledAt !== void 0) return taint(state, open.turn, step.step);
			const usage = event.data.usage ?? lastUsageChunk(event.data.stream);
			if (usage !== void 0 && normalizeUsageSample(usage) === void 0) return taint(state, open.turn, step.step, event.time);
			const source = event.data.message.source;
			const route = source.provider.length > 0 && source.model.length > 0 ? {
				provider: source.provider,
				model: source.model
			} : attempt.route;
			return {
				...state,
				open: {
					...open,
					step: {
						...step,
						attempt: {
							...attempt,
							settledAt: event.time,
							settledBy: "message",
							...usage === void 0 ? {} : { usage },
							...route === void 0 ? {} : { route }
						}
					}
				}
			};
		}
		case "step/end": {
			if (state.open === null) return state;
			const open = state.open;
			if (open.step === null) return open.turn === event.data.turn ? {
				...state,
				open: {
					...open,
					complete: false
				}
			} : state;
			const step = open.step;
			const steps = [...open.steps, {
				step: step.step,
				attempts: [...step.attempts, toAttemptRow(step.attempt, open.turn, step.step)]
			}];
			const complete = open.complete && step.step === event.data.step;
			return {
				...state,
				open: {
					...open,
					steps,
					complete,
					step: null
				}
			};
		}
		case "turn/end": {
			if (state.open === null) return state;
			const open = state.open;
			const complete = open.complete && open.turn === event.data.turn;
			return {
				...state,
				turns: [...state.turns, toTurnRow(open, event.time, complete)],
				open: null
			};
		}
		default: return state;
	}
}
/** Client view: closed turns plus the open turn as its live row (never complete). */
function view(state) {
	if (state.open === null) return { turns: state.turns };
	return { turns: [...state.turns, toTurnRow(state.open, void 0, false)] };
}
/**
* The `priceMonitorUsage` projection unit registered on
* `ctx.sessionProjections` (see the package entry).
*/
const priceMonitorUsageProjectionDefinition = {
	key: "priceMonitorUsage",
	stateVersion: 1,
	stateSchema,
	init: () => EMPTY_STATE,
	apply: foldLedgerState,
	wire: {
		viewSchema,
		view
	}
};
//#endregion
//#region src/index.ts
/** Host service requirements. */
const inject = [
	"sessionProjections",
	"webServer",
	"webRuntime"
];
/**
* Host plugin body: register the usage-ledger projection and the official
* pricing refresh route. Both registrations bind to this plugin's fiber
* (unload removes them), so the calls themselves are the effects.
* @param ctx - host root context.
*/
function apply(ctx) {
	const host = ctx;
	host.sessionProjections.register(priceMonitorUsageProjectionDefinition);
	host.webServer.register(officialPricingRoute(host.webRuntime.trustedHosts));
}
//#endregion
export { apply, diffOfficialPricing, inject, parseOfficialPricing, priceMonitorUsageProjectionDefinition };
