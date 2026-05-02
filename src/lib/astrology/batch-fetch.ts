/**
 * ASTROLOGY ENGINE — LAYER 2: BATCH FETCHER
 *
 * Fires all 22 required Indian Vedic endpoints in RATE-LIMITED batches.
 * Free-trial constraint: ~100 calls/day, per-minute limit.
 *
 * Strategy: 4 sequential groups, 8-second gap between groups.
 * Total: 22 API calls per new chart. Cache hits = 0 calls.
 *
 * LOGGING: Every API call (success or failure) is written to
 * astroapi_logs in Supabase so the Admin dashboard AstrologyAPI
 * tab shows real-time usage and cost.
 *
 * GROUP 1 — Core (9 calls, parallel):
 *   astro_details, planets, planets/extended,
 *   horo_chart/D1, horo_chart/D9, horo_chart/D10,
 *   current_vdasha_all, major_vdasha, sarvashtak
 *
 * GROUP 2 — Divisional Batch 1 (5 calls, parallel, +8s delay):
 *   horo_chart/D2  → Hora (wealth)
 *   horo_chart/D3  → Drekkana (siblings, vitality)
 *   horo_chart/D4  → Chaturthamsha (property, home)
 *   horo_chart/D7  → Saptamsha (children)
 *   horo_chart/D12 → Dwadashamsha (parents)
 *
 * GROUP 3 — Divisional Batch 2 (5 calls, parallel, +8s delay):
 *   horo_chart/D16 → Shodashamsha (vehicles, comforts)
 *   horo_chart/D20 → Vimshamsha (spirituality, moksha)
 *   horo_chart/D24 → Chaturvimshamsha (education)
 *   horo_chart/D27 → Bhamsha (strengths/weaknesses)
 *   horo_chart/D30 → Trimshamsha (misfortune)
 *
 * GROUP 4 — Divisional Batch 3 (3 calls, parallel, +8s delay):
 *   horo_chart/D40 → Khavedamsha (maternal karma)
 *   horo_chart/D45 → Akshavedamsha (paternal karma)
 *   horo_chart/D60 → Shashtiamsha (soul karma — highest precision)
 */

import { createClient } from "@supabase/supabase-js";
import { astroClient, type BirthParams } from "./client";

// Cost per AstrologyAPI call (free-trial and paid plans)
const ASTRO_API_COST_INR = 0.084; // ₹0.084 per call (~$0.001)

export interface RawAstroBundle {
  // Core
  astroDetails:    any;
  planets:         any;
  planetsExtended: any;
  horoChartD1:     any;
  horoChartD9:     any;
  horoChartD10:    any;
  currentDasha:    any;
  majorDasha:      any;
  sarvashtak:      any;
  // Divisional Batch 1
  horoChartD2:     any;
  horoChartD3:     any;
  horoChartD4:     any;
  horoChartD7:     any;
  horoChartD12:    any;
  // Divisional Batch 2
  horoChartD16:    any;
  horoChartD20:    any;
  horoChartD24:    any;
  horoChartD27:    any;
  horoChartD30:    any;
  // Divisional Batch 3
  horoChartD40:    any;
  horoChartD45:    any;
  horoChartD60:    any;
  errors: Record<string, string>;
}

// ── Supabase logging ──────────────────────────────────────────────────────────

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Writes a single row to astroapi_logs.
 * Fire-and-forget — never throws, never blocks the chart build.
 */
async function logApiCall(
  endpoint: string,
  fromCache: boolean,
  userId?: string
): Promise<void> {
  try {
    const supabase = getSupabase();
    const row: Record<string, any> = {
      endpoint,
      from_cache: fromCache,
      cost_inr:   fromCache ? 0 : ASTRO_API_COST_INR,
      created_at: new Date().toISOString(),
    };
    // Only set user_id if we have a real UUID (FK constraint)
    if (userId) row.user_id = userId;

    await supabase.from("astroapi_logs").insert(row);
  } catch (err) {
    // Logging must never crash the chart build
    console.warn("[batch-fetch] Failed to log API call:", endpoint, err);
  }
}

/**
 * Logs a full batch of calls to astroapi_logs in one go.
 * Called after each group completes.
 */
async function logBatch(
  results: [string, any, string | null][],
  userId?: string
): Promise<void> {
  // Fire all inserts in parallel, don't await individually
  await Promise.allSettled(
    results.map(([name, , error]) =>
      logApiCall(name, false /* these are always live calls */, userId)
        .catch(() => {/* swallow */})
    )
  );
}

// ── API call wrapper ──────────────────────────────────────────────────────────

/** Wraps a single API call — captures errors without throwing */
const safeCall = async (
  name: string,
  fn: () => Promise<any>
): Promise<[string, any, string | null]> => {
  try {
    const result = await fn();
    return [name, result, null];
  } catch (err: any) {
    const msg = err?.message || String(err);
    if (msg.toLowerCase().includes("insufficient") || msg.toLowerCase().includes("balance")) {
      console.error(`🚨 ADMIN ALERT: AstrologyAPI balance insufficient! Method: ${name}`);
      notifyAdminBalance().catch(() => {});
    }
    console.error(`AstrologyAPI [${name}] failed:`, msg);
    return [name, null, msg];
  }
};

/** Sleep helper for rate limiting */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/** Apply a batch of results into the bundle object */
function applyResults(
  bundle: RawAstroBundle,
  results: [string, any, string | null][]
): void {
  for (const [name, data, error] of results) {
    (bundle as any)[name] = data;
    if (error) bundle.errors[name] = error;
  }
}

// ── Main batch fetch ──────────────────────────────────────────────────────────

/**
 * Fires all 22 Vedic endpoints in 4 rate-limited batches.
 * Logs every call to astroapi_logs (fire-and-forget).
 * Non-critical failures are captured in `errors` — never throws.
 *
 * @param params   Birth parameters
 * @param userId   Optional Supabase user UUID — stored in logs for per-user cost tracking
 */
export async function batchFetchVedicChart(
  params: BirthParams,
  userId?: string
): Promise<RawAstroBundle> {
  const p = params;

  const bundle: RawAstroBundle = {
    astroDetails: null, planets: null, planetsExtended: null,
    horoChartD1: null, horoChartD9: null, horoChartD10: null,
    currentDasha: null, majorDasha: null, sarvashtak: null,
    horoChartD2: null, horoChartD3: null, horoChartD4: null,
    horoChartD7: null, horoChartD12: null,
    horoChartD16: null, horoChartD20: null, horoChartD24: null,
    horoChartD27: null, horoChartD30: null,
    horoChartD40: null, horoChartD45: null, horoChartD60: null,
    errors: {},
  };

  // ── GROUP 1: Core (9 calls) ────────────────────────────────────────────────
  console.log("[batch-fetch] GROUP 1: Core 9 calls...");
  const g1 = await Promise.all([
    safeCall("astroDetails",    () => astroClient.vedic.getAstroDetails(p)),
    safeCall("planets",         () => astroClient.vedic.getPlanets(p)),
    safeCall("planetsExtended", () => astroClient.customRequest({ method: "POST", endpoint: "planets/extended", params: p })),
    safeCall("horoChartD1",     () => astroClient.vedic.getHoroChartD1(p)),
    safeCall("horoChartD9",     () => astroClient.customRequest({ method: "POST", endpoint: "horo_chart/D9",  params: p })),
    safeCall("horoChartD10",    () => astroClient.customRequest({ method: "POST", endpoint: "horo_chart/D10", params: p })),
    safeCall("currentDasha",    () => astroClient.customRequest({ method: "POST", endpoint: "current_vdasha_all", params: p })),
    safeCall("majorDasha",      () => astroClient.customRequest({ method: "POST", endpoint: "major_vdasha", params: p })),
    safeCall("sarvashtak",      () => astroClient.customRequest({ method: "POST", endpoint: "sarvashtak", params: p })),
  ]);
  applyResults(bundle, g1);
  // Log Group 1 calls to admin dashboard (fire-and-forget)
  logBatch(g1, userId).catch(() => {});

  // ── Rate-limit pause ───────────────────────────────────────────────────────
  console.log("[batch-fetch] GROUP 1 done. Waiting 8s before GROUP 2...");
  await sleep(8000);

  // ── GROUP 2: Divisional Batch 1 (5 calls) ─────────────────────────────────
  console.log("[batch-fetch] GROUP 2: D2/D3/D4/D7/D12...");
  const g2 = await Promise.all([
    safeCall("horoChartD2",  () => astroClient.customRequest({ method: "POST", endpoint: "horo_chart/D2",  params: p })),
    safeCall("horoChartD3",  () => astroClient.customRequest({ method: "POST", endpoint: "horo_chart/D3",  params: p })),
    safeCall("horoChartD4",  () => astroClient.customRequest({ method: "POST", endpoint: "horo_chart/D4",  params: p })),
    safeCall("horoChartD7",  () => astroClient.customRequest({ method: "POST", endpoint: "horo_chart/D7",  params: p })),
    safeCall("horoChartD12", () => astroClient.customRequest({ method: "POST", endpoint: "horo_chart/D12", params: p })),
  ]);
  applyResults(bundle, g2);
  logBatch(g2, userId).catch(() => {});

  console.log("[batch-fetch] GROUP 2 done. Waiting 8s before GROUP 3...");
  await sleep(8000);

  // ── GROUP 3: Divisional Batch 2 (5 calls) ─────────────────────────────────
  console.log("[batch-fetch] GROUP 3: D16/D20/D24/D27/D30...");
  const g3 = await Promise.all([
    safeCall("horoChartD16", () => astroClient.customRequest({ method: "POST", endpoint: "horo_chart/D16", params: p })),
    safeCall("horoChartD20", () => astroClient.customRequest({ method: "POST", endpoint: "horo_chart/D20", params: p })),
    safeCall("horoChartD24", () => astroClient.customRequest({ method: "POST", endpoint: "horo_chart/D24", params: p })),
    safeCall("horoChartD27", () => astroClient.customRequest({ method: "POST", endpoint: "horo_chart/D27", params: p })),
    safeCall("horoChartD30", () => astroClient.customRequest({ method: "POST", endpoint: "horo_chart/D30", params: p })),
  ]);
  applyResults(bundle, g3);
  logBatch(g3, userId).catch(() => {});

  console.log("[batch-fetch] GROUP 3 done. Waiting 8s before GROUP 4...");
  await sleep(8000);

  // ── GROUP 4: Divisional Batch 3 (3 calls) ─────────────────────────────────
  console.log("[batch-fetch] GROUP 4: D40/D45/D60...");
  const g4 = await Promise.all([
    safeCall("horoChartD40", () => astroClient.customRequest({ method: "POST", endpoint: "horo_chart/D40", params: p })),
    safeCall("horoChartD45", () => astroClient.customRequest({ method: "POST", endpoint: "horo_chart/D45", params: p })),
    safeCall("horoChartD60", () => astroClient.customRequest({ method: "POST", endpoint: "horo_chart/D60", params: p })),
  ]);
  applyResults(bundle, g4);
  logBatch(g4, userId).catch(() => {});

  const successCount = 22 - Object.keys(bundle.errors).length;
  console.log(`[batch-fetch] All 22 calls complete. ${successCount}/22 succeeded. Errors: ${Object.keys(bundle.errors).join(", ") || "none"}`);
  return bundle;
}

// ── Cache hit logger (called from manager.ts) ─────────────────────────────────

/**
 * Logs a cache hit to astroapi_logs with from_cache=true and cost=0.
 * Called from manager.ts when a chart is served from Supabase cache.
 * This gives the admin accurate "Cached (Free)" vs "Live API" counts.
 */
export async function logCacheHit(userId?: string): Promise<void> {
  await logApiCall("CACHE_HIT", true, userId);
}

// ── Admin balance alert ───────────────────────────────────────────────────────

async function notifyAdminBalance(): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;
  console.error(`🚨🚨🚨 CRITICAL: AstrologyAPI.com balance INSUFFICIENT. Top up at https://astrologyapi.com/pricing. Alert to: ${adminEmail}`);
}
