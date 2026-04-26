import { NextResponse } from "next/server";
import { batchFetchVedicChart } from "@/lib/astrology/batch-fetch";
import { normalizeBundle, buildBirthHash } from "@/lib/astrology/normalize";
import { parseBirthParams } from "@/lib/astrology/client";
import { buildClaudeContext, ASTRO_SYSTEM_PROMPT } from "@/lib/astrology/prompts";

/**
 * GET /api/admin/chart-debug?dob=01/01/1990&tob=11:11+AM&lat=12.9716&lon=77.5946&tz=5.5&pass=admin123
 *
 * Returns raw API responses + GoldenMasterJSON + Claude prompt.
 * Password-protected.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pass   = searchParams.get("pass");
  const dob    = searchParams.get("dob") || "01/01/1990";
  const tob    = searchParams.get("tob") || "11:11 AM";
  const lat    = parseFloat(searchParams.get("lat") || "12.9716");
  const lon    = parseFloat(searchParams.get("lon") || "77.5946");
  const tz     = parseFloat(searchParams.get("tz") || "5.5");
  const pob    = searchParams.get("pob") || "Bangalore, India";

  if (pass !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const params = parseBirthParams(dob, tob, lat, lon, tz);
    const hash   = buildBirthHash(params);
    const bundle = await batchFetchVedicChart(params);
    const chart  = normalizeBundle(bundle, params, pob, dob, tob);
    const ctx    = buildClaudeContext(chart);

    return NextResponse.json({
      birthHash:      hash,
      rawBundle:      bundle,
      goldenMaster:   chart,
      claudeContext:  ctx,
      systemPrompt:   ASTRO_SYSTEM_PROMPT,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
