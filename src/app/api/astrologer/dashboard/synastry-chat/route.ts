import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { routeLLM } from "@/lib/astrology/llm-router";
import { getOrBuildChart } from "@/lib/astrology/manager";
import { buildClaudeContext } from "@/lib/astrology/prompts";

export async function POST(req: Request) {
  try {
    const { profile1, profile2, message, history, report } = await req.json();

    if (!profile1 || !profile2 || !message) {
      return NextResponse.json({ error: "Missing required profiles or message" }, { status: 400 });
    }

    // 1. Fetch real charts for both profiles
    const { chart: chart1 } = await getOrBuildChart(profile1.dob, profile1.tob, profile1.pob, '+05:30');
    const { chart: chart2 } = await getOrBuildChart(profile2.dob, profile2.tob, profile2.pob, '+05:30');

    // 2. Build detailed context for the LLM
    const context1 = buildClaudeContext(chart1, profile1.name);
    const context2 = buildClaudeContext(chart2, profile2.name);

    const systemPrompt = `You are a Grand Master Vedic Astrologer answering follow-up questions on a Deep Synastry and Compatibility analysis.
You are given the VERIFIED birth charts of two individuals, as well as the INITIAL COMPATIBILITY REPORT that was just generated for them.

═══════════════════════════════════════════════════════════════
Profile A: ${profile1.name} (${profile1.gender})
CHART DATA A:
${context1}
═══════════════════════════════════════════════════════════════
Profile B: ${profile2.name} (${profile2.gender})
CHART DATA B:
${context2}
═══════════════════════════════════════════════════════════════

INITIAL REPORT GENERATED (Context):
"""
${report || "No initial report provided."}
"""

YOUR INSTRUCTIONS:
1. Provide deep, profound, and accurate answers based ONLY on the provided astrological data.
2. Directly answer the user's specific question.
3. Be highly professional, empathetic, and speak in the voice of a Grand Master Astrologer.
4. Keep your responses concise unless deep explanation is requested.`;

    // Add history + current message
    const formattedHistory = (history || []).map((m: any) => ({
      role: m.role,
      content: m.content
    }));
    
    formattedHistory.push({ role: "user", content: message });

    const response = await routeLLM(systemPrompt, formattedHistory, 1500); 

    if (!response || !response.text) {
      throw new Error("LLM failed to generate a response");
    }

    return NextResponse.json({
      reply: response.text
    });

  } catch (error: any) {
    console.error('Deep Synastry Chat API Error:', error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
