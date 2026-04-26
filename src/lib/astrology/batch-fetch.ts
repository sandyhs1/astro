/**
 * ASTROLOGY ENGINE — LAYER 2: BATCH FETCHER
 *
 * Fires all required Indian Vedic endpoints in parallel.
 * Returns a raw bundle of API responses — no transformation here.
 *
 * Endpoints fetched:
 *   - astro_details       → Lagna, Moon, Nakshatra, basic Karakas
 *   - planets             → All 9 planets with sign/house/degree
 *   - planets/extended    → Retrograde, exaltation, combustion
 *   - horo_chart/D1       → House-planet placements (Rasi)
 *   - horo_chart/D9       → Navamsha chart
 *   - horo_chart/D10      → Dashamsha chart
 *   - current_vdasha_all  → Active Maha/Antar/Pratyantar Dasha
 *   - major_vdasha        → Full life Dasha timeline
 *   - sarvashtak          → Ashtakavarga house scores
 */

import { astroClient, type BirthParams } from "./client";

export interface RawAstroBundle {
  astroDetails: any;
  planets: any;
  planetsExtended: any;
  horoChartD1: any;
  horoChartD9: any;
  horoChartD10: any;
  currentDasha: any;
  majorDasha: any;
  sarvashtak: any;
  errors: Record<string, string>;
}

/**
 * Fires all Vedic endpoints in parallel.
 * Non-critical failures are captured in `errors` — never throws.
 */
export async function batchFetchVedicChart(params: BirthParams): Promise<RawAstroBundle> {
  const p = params; // shorthand

  const safeCall = async (name: string, fn: () => Promise<any>): Promise<[string, any, string | null]> => {
    try {
      const result = await fn();
      return [name, result, null];
    } catch (err: any) {
      const msg = err?.message || String(err);

      // Critical error: insufficient balance — alert admin
      if (msg.toLowerCase().includes("insufficient") || msg.toLowerCase().includes("balance")) {
        console.error(`🚨 ADMIN ALERT: AstrologyAPI balance insufficient! Method: ${name}`);
        // Fire-and-forget alert (non-blocking)
        notifyAdminBalance().catch(() => {});
      }

      console.error(`AstrologyAPI [${name}] failed:`, msg);
      return [name, null, msg];
    }
  };

  const results = await Promise.all([
    safeCall("astroDetails",    () => astroClient.vedic.getAstroDetails(p)),
    safeCall("planets",         () => astroClient.vedic.getPlanets(p)),
    safeCall("planetsExtended", () => astroClient.customRequest({ method: "POST", endpoint: "planets/extended", params: p })),
    safeCall("horoChartD1",     () => astroClient.vedic.getHoroChartD1(p)),
    safeCall("horoChartD9",     () => astroClient.customRequest({ method: "POST", endpoint: "horo_chart/D9", params: p })),
    safeCall("horoChartD10",    () => astroClient.customRequest({ method: "POST", endpoint: "horo_chart/D10", params: p })),
    safeCall("currentDasha",    () => astroClient.customRequest({ method: "POST", endpoint: "current_vdasha_all", params: p })),
    safeCall("majorDasha",      () => astroClient.customRequest({ method: "POST", endpoint: "major_vdasha", params: p })),
    safeCall("sarvashtak",      () => astroClient.customRequest({ method: "POST", endpoint: "sarvashtak", params: p })),
  ]);

  const bundle: RawAstroBundle = {
    astroDetails:    null,
    planets:         null,
    planetsExtended: null,
    horoChartD1:     null,
    horoChartD9:     null,
    horoChartD10:    null,
    currentDasha:    null,
    majorDasha:      null,
    sarvashtak:      null,
    errors: {},
  };

  for (const [name, data, error] of results) {
    (bundle as any)[name] = data;
    if (error) bundle.errors[name] = error;
  }

  return bundle;
}

async function notifyAdminBalance(): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;
  // Log prominently — actual email via existing Supabase/SMTP if set up
  console.error(`🚨🚨🚨 CRITICAL: AstrologyAPI.com balance is INSUFFICIENT. Top up immediately at https://astrologyapi.com/pricing. Alert to: ${adminEmail}`);
}
