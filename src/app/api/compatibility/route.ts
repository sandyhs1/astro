/**
 * /api/compatibility — B2C Compatibility (Soul Alignment) generator.
 *
 *   POST  → generate a new compatibility report between two people, save it,
 *           return { id, report, snapshot, ... }.
 *   GET   → list the current user's saved reports (?id=… to load one report,
 *           with its snapshot rebuilt from saved metrics).
 *   DELETE?id=… → permanently remove one report.
 *
 * Pipeline:
 *   1. Auth-gate via Supabase session.
 *   2. In parallel: build/fetch GoldenMaster charts for each partner
 *      (cached forever in chart_cache by birth-hash) AND fetch deterministic
 *      AstrologyAPI match_* metrics (cached forever in match_cache by pair-hash).
 *   3. Inject the verified metrics + chart contexts into the LLM prompt.
 *   4. Generate the report. Persist it together with the metrics so the UI
 *      can render the score card without re-running anything.
 *
 * Credits: 5 credits charged on first generation per unique pair (pair_hash).
 * Re-opening a saved report or regenerating the same pair is free.
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import crypto from "crypto";

import { getOrBuildChart } from "@/lib/astrology/manager";
import { buildClaudeContext } from "@/lib/astrology/prompts";
import { routeLLM } from "@/lib/astrology/llm-router";
import { buildCompatibilityPrompt, type PartnerInput } from "@/lib/astrology/compatibility-prompt";
import {
  fetchMatchMetrics,
  formatMetricsForPrompt,
  buildCompatibilitySnapshot,
  type MatchMetrics,
  type MatchPartnerInput,
} from "@/lib/astrology/match-fetch";
import { tzStringToFloat } from "@/lib/astrology/client";
import { FEATURE_CREDITS } from "@/lib/pricing/feature-credits";

const CREDITS_COST = FEATURE_CREDITS.compatibility;

// Service-role client for persistence (RLS-safe writes)
const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// ─── auth helper ─────────────────────────────────────────────────────────────
async function getAuthedUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } },
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// ─── input shape & validation ────────────────────────────────────────────────
type PartnerPayload = PartnerInput & {
  lat?: number;
  lon?: number;
  timezone?: string;
};

function validatePartner(p: any, label: string): { ok: true; partner: PartnerPayload } | { ok: false; error: string } {
  if (!p || typeof p !== "object") return { ok: false, error: `${label}: missing` };
  for (const k of ["name", "dob", "tob", "pob", "gender"] as const) {
    if (!p[k] || typeof p[k] !== "string" || !p[k].trim()) {
      return { ok: false, error: `${label}: ${k} is required` };
    }
  }
  return {
    ok: true,
    partner: {
      name:     p.name.trim(),
      dob:      p.dob.trim(),
      tob:      p.tob.trim(),
      pob:      p.pob.trim(),
      gender:   p.gender.trim(),
      lat:      typeof p.lat === "number" ? p.lat : undefined,
      lon:      typeof p.lon === "number" ? p.lon : undefined,
      timezone: typeof p.timezone === "string" && p.timezone.trim() ? p.timezone.trim() : "+05:30",
    },
  };
}

// ─── POST ────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const v1 = validatePartner(body.partner1, "Partner 1");
    const v2 = validatePartner(body.partner2, "Partner 2");
    if (!v1.ok) return NextResponse.json({ error: v1.error }, { status: 422 });
    if (!v2.ok) return NextResponse.json({ error: v2.error }, { status: 422 });
    const partner1 = v1.partner;
    const partner2 = v2.partner;

    // ── Pair-hash: deterministic key for "same pair" detection ───────────────
    // Sorted so (A,B) and (B,A) produce the same hash → same pair.
    function birthHash(p: PartnerPayload): string {
      return crypto.createHash("md5")
        .update(`${p.dob}-${p.tob}-${p.pob}`.toLowerCase().replace(/\s+/g, ""))
        .digest("hex");
    }
    const h1 = birthHash(partner1);
    const h2 = birthHash(partner2);
    const pairHash = [h1, h2].sort().join(":");

    // ── Credits + first-time guard ──────────────────────────────────────────
    const { data: userProfile } = await supabaseAdmin
      .from("user_profiles").select("credits").eq("id", user.id).single();
    const credits = userProfile?.credits ?? 0;

    // Check if this exact pair was already generated for this user
    const { data: existingPair } = await supabaseAdmin
      .from("compatibility_reports")
      .select("id, report_markdown, metrics, partner1, partner2, created_at")
      .eq("user_id", user.id)
      .eq("pair_hash", pairHash)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingPair) {
      // Already generated this pair — return saved report at ZERO credit cost
      const snapshot = existingPair.metrics
        ? buildCompatibilitySnapshot(existingPair.metrics as MatchMetrics)
        : null;
      return NextResponse.json({
        id:        existingPair.id,
        report:    existingPair.report_markdown,
        snapshot,
        partner1:  existingPair.partner1,
        partner2:  existingPair.partner2,
        createdAt: existingPair.created_at,
        savedToDashboard: true,
        fromCache: true,
        creditsRemaining: credits,
      });
    }

    // First-time pair — check credits
    if (credits < CREDITS_COST) {
      return NextResponse.json({
        error: `Insufficient credits. Compatibility Report costs ${CREDITS_COST} credits.`,
        required: CREDITS_COST,
        available: credits,
      }, { status: 402 });
    }

    // ── Step 1+2 in parallel: charts (cached) + match metrics (cached) ──────
    const matchInputFor = (p: PartnerPayload): MatchPartnerInput | null => {
      if (typeof p.lat !== "number" || typeof p.lon !== "number") return null;
      return {
        name:   p.name,
        gender: p.gender,
        dob:    p.dob,
        tob:    p.tob,
        lat:    p.lat,
        lon:    p.lon,
        tzone:  tzStringToFloat(p.timezone || "+05:30"),
      };
    };

    const m1 = matchInputFor(partner1);
    const m2 = matchInputFor(partner2);

    const [c1, c2, metrics] = await Promise.all([
      getOrBuildChart(
        partner1.dob, partner1.tob, partner1.pob,
        partner1.timezone || "+05:30",
        partner1.lat, partner1.lon,
        user.email ?? undefined,
      ),
      getOrBuildChart(
        partner2.dob, partner2.tob, partner2.pob,
        partner2.timezone || "+05:30",
        partner2.lat, partner2.lon,
        user.email ?? undefined,
      ),
      // Match-metrics fetch only proceeds if BOTH partners have lat/lon.
      // If either is missing, we still produce a report — just without verified metrics.
      (m1 && m2)
        ? fetchMatchMetrics(m1, m2, user.email ?? undefined).catch((err) => {
            console.warn("[compatibility] match-fetch failed, continuing without metrics:", err?.message);
            return undefined as unknown as MatchMetrics;
          })
        : Promise.resolve(undefined as unknown as MatchMetrics),
    ]);

    // ── Build chart contexts ────────────────────────────────────────────────
    const ctx1 = buildClaudeContext(c1.chart, partner1.name);
    const ctx2 = buildClaudeContext(c2.chart, partner2.name);

    // ── Format verified-metrics block for the LLM ──────────────────────────
    const verifiedMetricsBlock = metrics
      ? formatMetricsForPrompt(metrics)
      : "VERIFIED MATCH METRICS: not computed for this pair (geocoordinates were missing). Fall back to chart-based synthesis only.";

    // ── Build snapshot for the UI score card ───────────────────────────────
    const snapshot = metrics ? buildCompatibilitySnapshot(metrics) : null;

    // ── Build the locked-voice + 6-section system prompt ───────────────────
    const systemPrompt = buildCompatibilityPrompt(
      partner1, partner2,
      ctx1, ctx2,
      verifiedMetricsBlock,
    );

    // ── Run the model ───────────────────────────────────────────────────────
    const llm = await routeLLM(
      systemPrompt,
      [{
        role: "user",
        content: `Generate the complete Compatibility Report for ${partner1.name} and ${partner2.name} now. Follow the markdown blueprint exactly. Include the Score Card table, the Ashtakoota 8-koota table, the Mangal Dosha table, and the Timeline Convergence table. Use the verified metrics verbatim. No throat-clearing. No banned words. Maximum 3 sentences per paragraph.`,
      }],
      4000,
    );
    if (!llm?.text) {
      return NextResponse.json({ error: "Model returned empty response. Try again in a moment." }, { status: 502 });
    }

    // ── Persist (report + raw metrics so the UI can re-render later) ────────
    const { data: saved, error: saveErr } = await supabaseAdmin
      .from("compatibility_reports")
      .insert({
        user_id:         user.id,
        partner1:        { ...partner1 },
        partner2:        { ...partner2 },
        report_markdown: llm.text,
        metrics:         metrics ?? null,
        model:           llm.model,
        tokens_in:       llm.tokensIn,
        tokens_out:      llm.tokensOut,
        pair_hash:       pairHash,
      })
      .select("id, created_at")
      .single();

    // ── Deduct credits (first-time pair) ────────────────────────────────────
    const newCredits = Math.max(0, credits - CREDITS_COST);
    await supabaseAdmin.from("user_profiles")
      .update({ credits: newCredits })
      .eq("id", user.id);

    // ── Log usage ───────────────────────────────────────────────────────────
    void supabaseAdmin.from("token_usage_logs").insert({
      user_id:          user.id,
      model_name:       llm.model,
      input_tokens:     llm.tokensIn,
      output_tokens:    llm.tokensOut,
      total_tokens:     llm.tokensIn + llm.tokensOut,
      cost_inr:         "0.000000", // cost tracked via LLM pricing separately
      credits_used:     CREDITS_COST,
      question_preview: `Compatibility: ${partner1.name} & ${partner2.name}`,
      feature:          "compatibility",
    });

    if (saveErr) {
      console.error("[compatibility] save failed:", saveErr.message, saveErr.details);
      return NextResponse.json({
        id:       null,
        report:   llm.text,
        snapshot,
        partner1, partner2,
        savedToDashboard: false,
        warning: "Reading generated but archive write failed. Refresh and re-save.",
        creditsRemaining: newCredits,
        tokens: { input: llm.tokensIn, output: llm.tokensOut, total: llm.tokensIn + llm.tokensOut },
        model:  llm.model,
      });
    }

    return NextResponse.json({
      id:        saved.id,
      report:    llm.text,
      snapshot,
      partner1, partner2,
      createdAt: saved.created_at,
      savedToDashboard: true,
      creditsRemaining: newCredits,
      tokens:    { input: llm.tokensIn, output: llm.tokensOut, total: llm.tokensIn + llm.tokensOut },
      model:     llm.model,
    });
  } catch (err: any) {
    console.error("[compatibility] POST error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

// ─── GET (list / load by id) ─────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = req.nextUrl.searchParams.get("id");

    if (id) {
      const { data, error } = await supabaseAdmin
        .from("compatibility_reports")
        .select("id, partner1, partner2, report_markdown, metrics, created_at")
        .eq("id", id)
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      if (!data) return NextResponse.json({ error: "Report not found" }, { status: 404 });

      const snapshot = data.metrics ? buildCompatibilitySnapshot(data.metrics as MatchMetrics) : null;

      return NextResponse.json({
        id:        data.id,
        partner1:  data.partner1,
        partner2:  data.partner2,
        report:    data.report_markdown,
        snapshot,
        createdAt: data.created_at,
      });
    }

    const { data, error } = await supabaseAdmin
      .from("compatibility_reports")
      .select("id, partner1, partner2, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw error;

    const items = (data ?? []).map((row: any) => ({
      id:           row.id,
      partner1Name: row.partner1?.name ?? "Partner 1",
      partner2Name: row.partner2?.name ?? "Partner 2",
      createdAt:    row.created_at,
    }));

    return NextResponse.json({ items });
  } catch (err: any) {
    console.error("[compatibility] GET error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

// ─── DELETE ─────────────────────────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const user = await getAuthedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const { error } = await supabaseAdmin
      .from("compatibility_reports")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[compatibility] DELETE error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
