import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { routeLLM } from "@/lib/astrology/llm-router";
import { getOrBuildChart } from "@/lib/astrology/manager";
import { buildClaudeContext } from "@/lib/astrology/prompts";

export async function POST(req: Request) {
  try {
    const { profile1, profile2 } = await req.json();

    if (!profile1 || !profile2) {
      return NextResponse.json({ error: "Both profiles are required" }, { status: 400 });
    }

    const supabaseAdmin = await createAdminClient();

    // 1. Fetch real charts for both profiles
    const { chart: chart1 } = await getOrBuildChart(profile1.dob, profile1.tob, profile1.pob, '+05:30');
    const { chart: chart2 } = await getOrBuildChart(profile2.dob, profile2.tob, profile2.pob, '+05:30');

    // 2. Build detailed context for the LLM
    const context1 = buildClaudeContext(chart1, profile1.name);
    const context2 = buildClaudeContext(chart2, profile2.name);

    const systemPrompt = `You are a Grand Master Vedic Astrologer performing a Deep Synastry and Compatibility analysis.
You are given the VERIFIED birth charts of two individuals.

Profile A: ${profile1.name} (${profile1.gender})
CHART DATA A:
${context1}

Profile B: ${profile2.name} (${profile2.gender})
CHART DATA B:
${context2}

DATE FORMAT: All dates in the provided data are in DD-MM-YYYY format.

Your task is to provide a COMPLETE, UNCOMPROMISING compatibility analysis. You MUST evaluate and explicitly mention:
1. Planetary placements and their synastry aspects (conjunctions, trines, oppositions).
2. Upapada Lagna (UL) and Arudha Lagna (AL) dynamics between the two charts.
3. A7 (Darapada) and Karaka (AK/DK) connections.
4. Ashtakoota/Dashakoota score (calculate or estimate based on Moon nakshatras provided).
5. D9 Navamsha overlay — how do their inner dharmic paths align?

Based on this deep analysis, you MUST categorize the relationship into one of the following:
- Great Match
- Good Match
- Poor Match
- Karmic Match
- Rina (Karmic Debt)

Ensure your response is highly professional, formatted in structured markdown. DO NOT assume any data not provided in the verified chart context. Provide a final recommendation and advice on what to do next.`;

    const response = await routeLLM(systemPrompt, [
      { role: "user", content: "Please run the Deep Compatibility analysis." }
    ], 3000); 

    if (!response || !response.text) {
      throw new Error("LLM failed to generate a response");
    }

    return NextResponse.json({
      report: response.text
    });

  } catch (error: any) {
    console.error('Deep Compatibility API Error:', error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
