/**
 * ASTROLOGY ENGINE — LAYER 4: AstroDataManager
 *
 * THE SINGLE ENTRY POINT FOR ALL CHART DATA.
 *
 * Cache logic:
 *   - Checks Supabase for an existing chart keyed by birth hash.
 *   - ALSO validates schemaVersion === SCHEMA_VERSION (currently 2).
 *   - If version mismatch → forces full rebuild (picks up all 16 Dn charts).
 *   - If not found OR stale schema → batch-fetch → normalize → save → return.
 *
 * NEVER calls AstrologyAPI twice for the same birth data + schema version.
 */

import { createClient } from "@supabase/supabase-js";
import { geocodePlace, parseBirthParams, tzStringToFloat, type BirthParams } from "./client";
import { batchFetchVedicChart, logCacheHit } from "./batch-fetch";
import { normalizeBundle, buildBirthHash, SCHEMA_VERSION, type GoldenMasterJSON } from "./normalize";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export type { GoldenMasterJSON };

export interface ChartResult {
  chart: GoldenMasterJSON;
  fromCache: boolean;
}

/**
 * Main entry point. Builds or returns cached GoldenMasterJSON v2
 * (all 16 divisional charts + extras).
 */
export async function getOrBuildChart(
  dob: string,
  tob: string,
  pob: string,
  tz: string = "+05:30",
  latOverride?: number,
  lonOverride?: number,
  userId?: string,
): Promise<ChartResult> {
  const supabase = getSupabase();

  // 1. Geocode
  const geo = (latOverride !== undefined && lonOverride !== undefined)
    ? { lat: latOverride, lon: lonOverride, displayName: pob }
    : await geocodePlace(pob);

  // 2. Build params + hash
  const tzFloat = tzStringToFloat(tz);
  const params  = parseBirthParams(dob, tob, geo.lat, geo.lon, tzFloat);
  const hash    = buildBirthHash(params);

  // 3. Check Supabase cache — ALSO validate schemaVersion
  const { data: cached } = await supabase
    .from("onboarding_leads")
    .select("golden_master_json, chart_hash")
    .eq("chart_hash", hash)
    .maybeSingle();

  if (cached?.golden_master_json) {
    const cachedChart = cached.golden_master_json as GoldenMasterJSON;
    // Schema version check — if stale, force rebuild
    if (cachedChart.schemaVersion === SCHEMA_VERSION) {
      console.log(`[manager] Cache HIT (v${SCHEMA_VERSION}) for hash ${hash}`);
      // Log cache hit to astroapi_logs (cost = ₹0, from_cache = true)
      logCacheHit(userId).catch(() => {});
      return { chart: cachedChart, fromCache: true };
    }
    console.log(`[manager] Cache STALE (v${cachedChart.schemaVersion ?? 1}) — rebuilding for v${SCHEMA_VERSION}`);
  } else {
    console.log(`[manager] Cache MISS — building chart for hash ${hash}`);
  }

  // 4. Also check chart_cache table (anonymous / non-lead users)
  const { data: anonCached } = await supabase
    .from("chart_cache")
    .select("chart")
    .eq("hash", hash)
    .maybeSingle();

  if (anonCached?.chart) {
    const cachedChart = anonCached.chart as GoldenMasterJSON;
    if (cachedChart.schemaVersion === SCHEMA_VERSION) {
      console.log(`[manager] AnonCache HIT (v${SCHEMA_VERSION}) for hash ${hash}`);
      // Log cache hit to astroapi_logs (cost = ₹0, from_cache = true)
      logCacheHit(userId).catch(() => {});
      return { chart: cachedChart, fromCache: true };
    }
  }

  // 5. Batch-fetch from API (22 calls, rate-limited)
  // Pass userId so every API call log has user attribution for cost tracking
  const bundle = await batchFetchVedicChart(params, userId);

  // 6. Normalize into GoldenMasterJSON v2
  const chart = normalizeBundle(bundle, params, pob, dob, tob);

  // 7. Save to Supabase
  //
  // STRATEGY: ALWAYS save to chart_cache by hash (persistent for ALL users).
  // Also try onboarding_leads for legacy email-based lookup.
  // This fixes the gap where family_profiles users (no onboarding_leads row)
  // had their chart saved nowhere and rebuilt every request (30s + 22 API calls).

  // 7a. Try onboarding_leads (email-based users — legacy path)
  if (userId) {
    const { error } = await supabase
      .from("onboarding_leads")
      .update({
        chart_hash:         hash,
        golden_master_json: chart,
        chart_generated_at: new Date().toISOString(),
      })
      .eq("email", userId);
    if (error) console.error("[manager] Save to onboarding_leads failed:", error.message);
    // Note: if userId has no onboarding_leads row, this update affects 0 rows silently.
    // chart_cache (7b) below guarantees persistence regardless.
  }

  // 7b. ALWAYS save to chart_cache by birth hash — covers ALL user types:
  //   - family_profiles users (no onboarding_leads row)
  //   - Anonymous users
  //   - Any user whose onboarding_leads update failed
  // This is the single source of truth for hash-based cache hits (step 4 above).
  {
    const { error } = await supabase
      .from("chart_cache")
      .upsert({ hash, chart, created_at: new Date().toISOString() }, { onConflict: "hash" })
      .select();
    if (error) console.error("[manager] Save to chart_cache failed:", error.message);
    else console.log(`[manager] Chart persisted to chart_cache (hash: ${hash})`);
  }

  console.log(`[manager] Chart built + saved (v${SCHEMA_VERSION}), confidence: ${chart.confidence.score}%`);
  return { chart, fromCache: false };
}

/**
 * Quick fetch by birth hash from cache only (no API call).
 * Returns null if not cached OR if schema is stale.
 */
export async function getCachedChart(hash: string): Promise<GoldenMasterJSON | null> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("onboarding_leads")
    .select("golden_master_json")
    .eq("chart_hash", hash)
    .maybeSingle();
  const chart = data?.golden_master_json as GoldenMasterJSON | null;
  if (!chart || chart.schemaVersion !== SCHEMA_VERSION) return null;
  return chart;
}
