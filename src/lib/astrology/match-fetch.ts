/**
 * MATCH FETCHER — AstrologyAPI compatibility endpoints
 *
 * Fetches the 5 deterministic match endpoints we actually need:
 *   - match_ashtakoot_points   (36-point Guna Milan, per-koota breakdown)
 *   - match_manglik_report     (Mangal Dosha + cancellation rules)
 *   - match_obstructions       (verified doshas / friction signals)
 *   - match_dashakoot_points   (10-fold extended, ~28 points)
 *   - match_percentage         (single headline number for the UI badge)
 *
 * Caching strategy:
 *   The same pair of people produces the same metrics regardless of which
 *   partner is "first". We hash sorted(birthHashA, birthHashB) and cache the
 *   combined payload in the `match_cache` Supabase table forever.
 *
 *   ⇒ Same pair = ZERO API calls on every re-run.
 *   ⇒ New pair = 5 parallel API calls, then cached forever.
 */

import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { astroClient, parseBirthParams, tzStringToFloat, type BirthParams } from "./client";
import { buildBirthHash } from "./normalize";

// AstrologyAPI per-call cost (same as batch-fetch.ts)
const ASTRO_API_COST_INR = 0.084;

export interface MatchPartnerInput {
  name: string;
  gender?: string;
  dob: string;        // "YYYY-MM-DD" or "DD/MM/YYYY"
  tob: string;        // "HH:MM"
  lat: number;
  lon: number;
  tzone: number;      // float, e.g. 5.5
}

export interface MatchMetrics {
  /** 36-point Ashtakoota Guna Milan — full breakdown */
  ashtakoot?: any;
  /** Mangal Dosha analysis for both + cancellation */
  manglik?: any;
  /** Verified doshas / friction signals */
  obstructions?: any;
  /** Optional: Dashakoot (10-fold) detailed score */
  dashakoot?: any;
  /** Single headline percentage */
  percentage?: any;
  /** Per-endpoint errors (so the LLM can see what was unavailable) */
  errors: Record<string, string>;
  /** True if this came back from match_cache without burning calls */
  fromCache: boolean;
}

// ── Supabase admin client (service role) ────────────────────────────────────
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// ── Pair-hash (deterministic regardless of partner order) ───────────────────
export function buildPairHash(a: BirthParams, b: BirthParams): string {
  const ha = buildBirthHash(a);
  const hb = buildBirthHash(b);
  const sorted = [ha, hb].sort();
  return crypto.createHash("sha256")
    .update(`pair::${sorted[0]}::${sorted[1]}`)
    .digest("hex")
    .slice(0, 24);
}

// ── Logging (mirrors batch-fetch.ts) ────────────────────────────────────────
async function logApiCall(endpoint: string, fromCache: boolean, userId?: string) {
  try {
    const supabase = getSupabase();
    const row: Record<string, any> = {
      endpoint,
      from_cache: fromCache,
      cost_inr:   fromCache ? 0 : ASTRO_API_COST_INR,
      created_at: new Date().toISOString(),
    };
    if (userId) row.user_id = userId;
    await supabase.from("astroapi_logs").insert(row);
  } catch (err) {
    console.warn("[match-fetch] log failed:", endpoint, err);
  }
}

// ── Convert our partner shape → MatchAstroBody payload ──────────────────────
// AstrologyAPI's match_* endpoints want a unified body:
//   { m_day, m_month, m_year, m_hour, m_min, m_lat, m_lon, m_tzone,   // male
//     f_day, f_month, f_year, f_hour, f_min, f_lat, f_lon, f_tzone }  // female
function toMatchBody(male: BirthParams, female: BirthParams) {
  return {
    m_day:   male.day,   m_month: male.month, m_year: male.year,
    m_hour:  male.hour,  m_min:   male.min,
    m_lat:   male.lat,   m_lon:   male.lon,   m_tzone: male.tzone,
    f_day:   female.day, f_month: female.month, f_year: female.year,
    f_hour:  female.hour, f_min:  female.min,
    f_lat:   female.lat,  f_lon:  female.lon,  f_tzone: female.tzone,
  };
}

// ── Single safe call (no throws, captures errors) ───────────────────────────
async function safeMatchCall(endpoint: string, body: any): Promise<{ data: any; error: string | null }> {
  try {
    const res = await astroClient.customRequest({ method: "POST", endpoint, params: body });
    return { data: res, error: null };
  } catch (err: any) {
    const msg = err?.message || String(err);
    console.error(`[match-fetch] ${endpoint} failed:`, msg);
    return { data: null, error: msg };
  }
}

/**
 * Resolve the partner inputs into BirthParams.
 * Accepts the same shape Compatibility's /api/compatibility route uses,
 * with lat/lon/tzone already known (we capture them via PlaceAutocomplete).
 */
export function resolveMatchParams(p: MatchPartnerInput): BirthParams {
  return parseBirthParams(p.dob, p.tob, p.lat, p.lon, p.tzone);
}

/**
 * Main entry — returns deterministic compatibility metrics for the pair.
 *
 * Resolves which partner the API treats as "male" vs "female":
 *   - If exactly one partner is gender:"female" → that one becomes f_*.
 *   - Else first partner becomes m_*, second becomes f_*.
 *   This is purely API-input plumbing; the LLM will discuss BOTH partners
 *   regardless of how AstrologyAPI labels them internally.
 */
export async function fetchMatchMetrics(
  partner1: MatchPartnerInput,
  partner2: MatchPartnerInput,
  userId?: string,
): Promise<MatchMetrics> {
  const supabase = getSupabase();

  // Decide male/female assignment for the API body
  const p1Female = (partner1.gender || "").toLowerCase().startsWith("f");
  const p2Female = (partner2.gender || "").toLowerCase().startsWith("f");
  let male: MatchPartnerInput, female: MatchPartnerInput;
  if (p1Female && !p2Female) { female = partner1; male = partner2; }
  else if (p2Female && !p1Female) { male = partner1; female = partner2; }
  else { male = partner1; female = partner2; }

  const maleParams   = resolveMatchParams(male);
  const femaleParams = resolveMatchParams(female);
  const pairHash     = buildPairHash(maleParams, femaleParams);

  // ── 1. Cache lookup ─────────────────────────────────────────────────────
  try {
    const { data: cached } = await supabase
      .from("match_cache")
      .select("payload")
      .eq("pair_hash", pairHash)
      .maybeSingle();
    if (cached?.payload) {
      console.log(`[match-fetch] CACHE HIT pair=${pairHash}`);
      // Log a single cache-hit row (not per-endpoint — keeps logs tidy)
      logApiCall("MATCH_CACHE_HIT", true, userId).catch(() => {});
      return {
        ...(cached.payload as Omit<MatchMetrics, "fromCache" | "errors">),
        errors:    (cached.payload as any)?.errors ?? {},
        fromCache: true,
      };
    }
  } catch (err) {
    console.warn("[match-fetch] cache lookup failed:", err);
  }

  // ── 2. Live fetch — 5 parallel calls ────────────────────────────────────
  console.log(`[match-fetch] CACHE MISS pair=${pairHash} — firing 5 match endpoints`);
  const body = toMatchBody(maleParams, femaleParams);

  const [ashtakoot, manglik, obstructions, dashakoot, percentage] = await Promise.all([
    safeMatchCall("match_ashtakoot_points", body),
    safeMatchCall("match_manglik_report",   body),
    safeMatchCall("match_obstructions",     body),
    safeMatchCall("match_dashakoot_points", body),
    safeMatchCall("match_percentage",       body),
  ]);

  // Log each call (live)
  Promise.allSettled([
    logApiCall("match_ashtakoot_points", false, userId),
    logApiCall("match_manglik_report",   false, userId),
    logApiCall("match_obstructions",     false, userId),
    logApiCall("match_dashakoot_points", false, userId),
    logApiCall("match_percentage",       false, userId),
  ]).catch(() => {});

  const errors: Record<string, string> = {};
  if (ashtakoot.error)    errors.ashtakoot    = ashtakoot.error;
  if (manglik.error)      errors.manglik      = manglik.error;
  if (obstructions.error) errors.obstructions = obstructions.error;
  if (dashakoot.error)    errors.dashakoot    = dashakoot.error;
  if (percentage.error)   errors.percentage   = percentage.error;

  const metrics: MatchMetrics = {
    ashtakoot:    ashtakoot.data    ?? undefined,
    manglik:      manglik.data      ?? undefined,
    obstructions: obstructions.data ?? undefined,
    dashakoot:    dashakoot.data    ?? undefined,
    percentage:   percentage.data   ?? undefined,
    errors,
    fromCache:    false,
  };

  // ── 3. Persist (only if at least one endpoint returned data) ────────────
  if (ashtakoot.data || manglik.data || obstructions.data || dashakoot.data || percentage.data) {
    try {
      const { error } = await supabase
        .from("match_cache")
        .upsert({ pair_hash: pairHash, payload: metrics }, { onConflict: "pair_hash" });
      if (error) console.error("[match-fetch] cache write failed:", error.message);
    } catch (err) {
      console.warn("[match-fetch] cache upsert exception:", err);
    }
  }

  return metrics;
}

// ─── Helpers consumed by the prompt builder + UI ───────────────────────────

/**
 * Compact deterministic metrics summary block to inject into the LLM prompt.
 * Format is intentionally clean key:value lines so the model cannot re-derive
 * the numbers — it must cite them verbatim.
 */
export function formatMetricsForPrompt(m: MatchMetrics): string {
  const lines: string[] = [];

  // Ashtakoota
  if (m.ashtakoot) {
    const a: any = m.ashtakoot;
    const total =
      a.total_score ?? a.ashtakoot_points ?? a.score ??
      (a.varna_kuta?.received_points ?? 0) +
      (a.vasya_kuta?.received_points ?? 0) +
      (a.tara_kuta?.received_points ?? 0) +
      (a.yoni_kuta?.received_points ?? 0) +
      (a.graha_maitri?.received_points ?? 0) +
      (a.gana_kuta?.received_points ?? 0) +
      (a.bhakoot_kuta?.received_points ?? 0) +
      (a.naadi_kuta?.received_points ?? 0);

    lines.push(`ASHTAKOOTA TOTAL: ${total}/36`);
    const kootas = [
      ["Varna",        a.varna_kuta,    1],
      ["Vashya",       a.vasya_kuta,    2],
      ["Tara",         a.tara_kuta,     3],
      ["Yoni",         a.yoni_kuta,     4],
      ["Graha Maitri", a.graha_maitri,  5],
      ["Gana",         a.gana_kuta,     6],
      ["Bhakoot",      a.bhakoot_kuta,  7],
      ["Nadi",         a.naadi_kuta,    8],
    ] as const;
    for (const [label, k, max] of kootas) {
      if (k && typeof k === "object") {
        const score = k.received_points ?? k.score ?? "?";
        const desc  = (k.description || "").toString().slice(0, 220).replace(/\s+/g, " ").trim();
        lines.push(`  ${label}: ${score}/${max}${desc ? ` — ${desc}` : ""}`);
      }
    }
  } else if (m.errors.ashtakoot) {
    lines.push(`ASHTAKOOTA: unavailable (${m.errors.ashtakoot})`);
  }

  // Manglik
  if (m.manglik) {
    const mg: any = m.manglik;
    const maleStatus   = mg.male?.is_present ?? mg.male_manglik_present;
    const femaleStatus = mg.female?.is_present ?? mg.female_manglik_present;
    const cancellation = mg.is_male_manglik_cancelled ?? mg.is_cancelled ?? mg.cancellation;
    const conclusion   = (mg.conclusion || mg.report || "").toString().slice(0, 320).replace(/\s+/g, " ").trim();
    lines.push("");
    lines.push(`MANGLIK (Mangal Dosha):`);
    if (typeof maleStatus !== "undefined")   lines.push(`  Partner A is Manglik: ${maleStatus ? "YES" : "NO"}`);
    if (typeof femaleStatus !== "undefined") lines.push(`  Partner B is Manglik: ${femaleStatus ? "YES" : "NO"}`);
    if (typeof cancellation !== "undefined") lines.push(`  Cancellation applies: ${cancellation ? "YES" : "NO"}`);
    if (conclusion) lines.push(`  Verdict: ${conclusion}`);
  } else if (m.errors.manglik) {
    lines.push(`MANGLIK: unavailable (${m.errors.manglik})`);
  }

  // Obstructions
  if (m.obstructions) {
    const o: any = m.obstructions;
    const items = Array.isArray(o) ? o : (o.obstructions || o.list || []);
    if (Array.isArray(items) && items.length > 0) {
      lines.push("");
      lines.push(`OBSTRUCTIONS / DOSHAS DETECTED:`);
      for (const it of items.slice(0, 12)) {
        const t = (it?.name || it?.title || it?.dosha || "Item").toString();
        const d = (it?.description || it?.desc || it?.report || "").toString().slice(0, 220).replace(/\s+/g, " ").trim();
        lines.push(`  • ${t}${d ? `: ${d}` : ""}`);
      }
    } else {
      const summary = (o.summary || o.report || o.note || "").toString().slice(0, 320).replace(/\s+/g, " ").trim();
      if (summary) {
        lines.push("");
        lines.push(`OBSTRUCTIONS: ${summary}`);
      }
    }
  } else if (m.errors.obstructions) {
    lines.push(`OBSTRUCTIONS: unavailable (${m.errors.obstructions})`);
  }

  // Dashakoot (optional — keep brief)
  if (m.dashakoot) {
    const d: any = m.dashakoot;
    const total = d.total_score ?? d.dashakoot_points ?? d.score;
    if (typeof total !== "undefined") {
      lines.push("");
      lines.push(`DASHAKOOTA TOTAL: ${total}`);
    }
  }

  // Percentage
  if (m.percentage) {
    const p: any = m.percentage;
    const pct = p.match_percentage ?? p.percentage ?? p.score;
    if (typeof pct !== "undefined") {
      lines.push("");
      lines.push(`COMPATIBILITY PERCENTAGE (AstrologyAPI computed): ${pct}%`);
    }
  }

  if (lines.length === 0) {
    return "VERIFIED MATCH METRICS: unavailable (live API endpoints did not respond — fall back to chart-data synthesis).";
  }
  return lines.join("\n");
}

/**
 * UI-friendly snapshot extracted from raw metrics so the React layer can
 * render a beautiful score card without having to parse raw API JSON.
 */
export interface CompatibilitySnapshot {
  ashtakoot: {
    total: number | null;
    max: number;        // always 36
    kootas: { label: string; score: number | null; max: number; description?: string }[];
  };
  manglik: {
    partnerA: boolean | null;
    partnerB: boolean | null;
    cancellation: boolean | null;
    summary: string | null;
  };
  obstructions: { name: string; description?: string }[];
  dashakoot: { total: number | null; max: number };
  percentage: number | null;
  warnings: string[];
}

export function buildCompatibilitySnapshot(m: MatchMetrics): CompatibilitySnapshot {
  // Ashtakoota
  const a: any = m.ashtakoot ?? {};
  const kootaDefs = [
    ["Varna",        "varna_kuta",    1],
    ["Vashya",       "vasya_kuta",    2],
    ["Tara",         "tara_kuta",     3],
    ["Yoni",         "yoni_kuta",     4],
    ["Graha Maitri", "graha_maitri",  5],
    ["Gana",         "gana_kuta",     6],
    ["Bhakoot",      "bhakoot_kuta",  7],
    ["Nadi",         "naadi_kuta",    8],
  ] as const;
  const kootas = kootaDefs.map(([label, key, max]) => {
    const k = a[key];
    if (!k || typeof k !== "object") return { label, score: null as number | null, max };
    const score = typeof k.received_points === "number" ? k.received_points : (typeof k.score === "number" ? k.score : null);
    const desc  = (k.description || "").toString();
    return { label, score, max, description: desc };
  });
  const totalA = (typeof a.total_score === "number" && a.total_score) ||
                 (typeof a.ashtakoot_points === "number" && a.ashtakoot_points) ||
                 kootas.reduce((sum, k) => sum + (k.score ?? 0), 0) || null;

  // Manglik
  const mg: any = m.manglik ?? {};
  const partnerA = (typeof mg.male?.is_present !== "undefined")   ? !!mg.male.is_present
                 : (typeof mg.male_manglik_present !== "undefined") ? !!mg.male_manglik_present
                 : null;
  const partnerB = (typeof mg.female?.is_present !== "undefined") ? !!mg.female.is_present
                 : (typeof mg.female_manglik_present !== "undefined") ? !!mg.female_manglik_present
                 : null;
  const cancellation = (typeof mg.is_male_manglik_cancelled !== "undefined") ? !!mg.is_male_manglik_cancelled
                     : (typeof mg.is_cancelled !== "undefined") ? !!mg.is_cancelled
                     : null;
  const manglikSummary = (mg.conclusion || mg.report || mg.summary || "")?.toString().trim() || null;

  // Obstructions
  const o: any = m.obstructions ?? {};
  const obstructionsArr = Array.isArray(o) ? o : (o.obstructions || o.list || []);
  const obstructions = (Array.isArray(obstructionsArr) ? obstructionsArr : []).slice(0, 12).map((it: any) => ({
    name:        (it?.name || it?.title || it?.dosha || "Friction").toString(),
    description: (it?.description || it?.desc || it?.report || "").toString(),
  })).filter((it: any) => it.name);

  // Dashakoot
  const dk: any = m.dashakoot ?? {};
  const dashTotal = (typeof dk.total_score === "number" && dk.total_score) ||
                    (typeof dk.dashakoot_points === "number" && dk.dashakoot_points) ||
                    (typeof dk.score === "number" && dk.score) || null;

  // Percentage
  const pct: any = m.percentage ?? {};
  const percentage = (typeof pct.match_percentage === "number") ? pct.match_percentage
                   : (typeof pct.percentage === "number") ? pct.percentage
                   : (typeof pct.score === "number") ? pct.score
                   : null;

  return {
    ashtakoot: { total: totalA, max: 36, kootas },
    manglik:   { partnerA, partnerB, cancellation, summary: manglikSummary },
    obstructions,
    dashakoot: { total: dashTotal, max: 28 },
    percentage,
    warnings: Object.keys(m.errors).map(k => `${k}: ${m.errors[k]}`),
  };
}
