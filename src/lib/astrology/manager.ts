/**
 * ASTROLOGY ENGINE — LAYER 4: AstroDataManager
 *
 * THE SINGLE ENTRY POINT FOR ALL CHART DATA.
 *
 * Before calling the API, checks Supabase for an existing chart
 * keyed by birth hash. If found, returns cached GoldenMasterJSON.
 * If not found: batch-fetch → normalize → save → return.
 *
 * NEVER calls AstrologyAPI twice for the same birth data.
 */

import { createClient } from "@supabase/supabase-js";
import { geocodePlace, parseBirthParams, tzStringToFloat, type BirthParams } from "./client";
import { batchFetchVedicChart } from "./batch-fetch";
import { normalizeBundle, buildBirthHash, type GoldenMasterJSON } from "./normalize";

// Server-side Supabase (service role — bypasses RLS for caching)
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
 * Main entry point.
 *
 * @param dob         - "DD/MM/YYYY"
 * @param tob         - "HH:MM" or "H:MM AM/PM"
 * @param pob         - Place name e.g. "Bangalore, India"
 * @param tz          - Timezone offset string e.g. "+05:30" (default IST)
 * @param latOverride - Optional pre-geocoded lat
 * @param lonOverride - Optional pre-geocoded lon
 * @param userId      - Supabase user ID (for caching to correct user row)
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

  // 2. Build params
  const tzFloat = tzStringToFloat(tz);
  const params  = parseBirthParams(dob, tob, geo.lat, geo.lon, tzFloat);
  const hash    = buildBirthHash(params);

  // 3. Check Supabase cache
  const { data: cached } = await supabase
    .from("onboarding_leads")
    .select("golden_master_json, chart_hash")
    .eq("chart_hash", hash)
    .maybeSingle();

  if (cached?.golden_master_json) {
    return { chart: cached.golden_master_json as GoldenMasterJSON, fromCache: true };
  }

  // 4. Batch-fetch from API
  const bundle = await batchFetchVedicChart(params);

  // 5. Normalize
  const chart = normalizeBundle(bundle, params, pob, dob, tob);

  // 6. Save to Supabase
  if (userId) {
    await supabase
      .from("onboarding_leads")
      .update({
        chart_hash: hash,
        golden_master_json: chart,
        chart_generated_at: new Date().toISOString(),
      })
      .eq("email", userId); // userId here is the user's email for onboarding_leads
  } else {
    // Upsert by hash for anonymous caching
    await supabase
      .from("chart_cache")
      .upsert({ hash, chart, created_at: new Date().toISOString() }, { onConflict: "hash" })
      .select();
  }

  return { chart, fromCache: false };
}

/**
 * Quick fetch by birth hash from cache only (no API call).
 * Returns null if not cached.
 */
export async function getCachedChart(hash: string): Promise<GoldenMasterJSON | null> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("onboarding_leads")
    .select("golden_master_json")
    .eq("chart_hash", hash)
    .maybeSingle();
  return data?.golden_master_json ?? null;
}
