import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { formatVedAstroTime, fetchFullBirthChart, fetchDasaAtRange, buildVedAstroTime, type VedAstroTimeLegacy } from "@/lib/vedastro";
import { ASTRO_SYSTEM_PROMPT, INTENT_GATEKEEPER_PROMPT } from "@/lib/ai-prompts";

// Approximate costs (adjust as necessary)
// Claude Sonnet 4.6 (Amazon Bedrock) - Input: $3/M, Output: $15/M -> ~83 INR/USD
// Gemini Pro 3.1 - Input: $1.25/M, Output: $5/M
const INR_PER_USD = 83;
const BEDROCK_INPUT_COST = (3 / 1000000) * INR_PER_USD;
const BEDROCK_OUTPUT_COST = (15 / 1000000) * INR_PER_USD;
const GEMINI_INPUT_COST = (1.25 / 1000000) * INR_PER_USD;
const GEMINI_OUTPUT_COST = (5 / 1000000) * INR_PER_USD;

export async function POST(req: Request) {
  try {
    const { message, profileId, history, lat, lon } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // 1. Auth check
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch primary user profile to get credits
    const { data: userProfile, error: profileErr } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileErr || !userProfile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    let credits = userProfile.credits || 0;

    if (credits <= 0) {
      return NextResponse.json({ systemWarning: "You have run out of Cosmic Credits. Please recharge to continue your journey." }, { status: 200 });
    }

    // Initialize Gemini
    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const gatekeeperModel = ai.getGenerativeModel({ model: "gemini-2.0-flash", generationConfig: { responseMimeType: "application/json" } });

    // ── Layer 2: Intent Gatekeeping (filtering only — no longer used for billing) ──
    let intentData = { is_allowed: true, rejection_reason: null };
    
    try {
      const gatekeeperResult = await gatekeeperModel.generateContent({
        contents: [{ role: "user", parts: [{ text: `Analyze this message: "${message}"\n\nPrompt:\n${INTENT_GATEKEEPER_PROMPT}` }] }]
      });
      const parsed = JSON.parse(gatekeeperResult.response.text());
      intentData = { is_allowed: parsed.is_allowed, rejection_reason: parsed.rejection_reason };
    } catch (gkErr) {
      console.warn("Gatekeeper failed (likely 429). Defaulting to allowed.", gkErr);
    }

    if (!intentData.is_allowed) {
      return NextResponse.json({ 
        systemWarning: intentData.rejection_reason || "I must humbly decline. As a Vedic Astrologer, my domain is your Cosmic Path, not earthly matters like coding or medicine." 
      });
    }

    // NOTE: Credits are deducted AFTER response based on actual token usage.
    // Minimum 1 credit is guaranteed; formula: ceil((inputTokens + outputTokens) / 10_000)

    // ── Layer 3: Family Profile Logic ──
    let targetDob, targetTob, targetPob, targetTimezone;
    let personContext = "Primary User";

    if (profileId === "self") {
      // Fetch primary user's onboarding data (assuming it's in user_profiles or onboarding_leads)
      // Since user_profiles lacks dob, we fallback or try to fetch from onboarding_leads
      const { data: leadData } = await supabase.from("onboarding_leads").select("*").eq("email", user.email).single();
      
      targetDob = leadData?.dob || "1992-10-25"; // Fallback
      targetTob = leadData?.tob || "14:30";
      targetPob = leadData?.pob || "Mumbai, India";
      targetTimezone = leadData?.timezone || "+05:30";
    } else {
      const { data: familyProfile } = await supabase
        .from("family_profiles")
        .select("*")
        .eq("id", profileId)
        .eq("user_id", user.id)
        .single();

      if (familyProfile) {
        personContext = `Family Member (${familyProfile.relationship}): ${familyProfile.name}`;
        targetDob = familyProfile.dob;
        targetTob = familyProfile.tob;
        targetPob = familyProfile.pob;
        targetTimezone = familyProfile.timezone || "+05:30";
      } else {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
      }
    }

    // ── Layer 1: Context Mapping (VedAstro Integration) ──
    let chartContext = `[Context: No strict birth data available for ${personContext}. Provide general astrological guidance.]`;
    
    if (targetDob && targetTob && targetPob) {
      try {
        let finalLat = lat;
        let finalLon = lon;

        if (!finalLat || !finalLon) {
          const { geocodePlace } = await import("@/lib/vedastro");
          const geo = await geocodePlace(targetPob);
          finalLat = geo.lat;
          finalLon = geo.lon;
        }

        const stdTime = formatVedAstroTime(targetDob, targetTob, undefined, targetTimezone);
        const timeObj: VedAstroTimeLegacy = {
          StdTime: stdTime,
          Location: { Name: targetPob, Longitude: finalLon, Latitude: finalLat }
        };

        const chartData = await fetchFullBirthChart(timeObj);
        
        // Calculate AK and DK
        // AK: Planet with highest degree in its sign (excluding Rahu/Ketu)
        // DK: Planet with lowest degree in its sign (excluding Rahu/Ketu)
        const validPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
        const planetDegrees = chartData.planets
          .map((p: any) => p[Object.keys(p)[0]])
          .filter((d: any) => d?.PlanetName && validPlanets.includes(d.PlanetName.Name))
          .map((d: any) => {
            const degStr = d.PlanetRasiD1Sign?.DegreesIn?.TotalDegrees || "0";
            return { name: d.PlanetName.Name, deg: parseFloat(degStr) };
          });
          
        let ak = "Unknown", dk = "Unknown";
        if (planetDegrees.length > 0) {
          planetDegrees.sort((a: any, b: any) => b.deg - a.deg);
          ak = planetDegrees[0].name;
          dk = planetDegrees[planetDegrees.length - 1].name;
        }

        const planetsCompact = chartData.planets.map((p: any) => {
          const d = p[Object.keys(p)[0]];
          const name = d?.PlanetName?.Name || "Unknown";
          const sign = d?.PlanetZodiacSign?.Name || "Unknown Sign";
          const nakshatra = d?.PlanetConstellation?.Name || "Unknown Nakshatra";
          const house = d?.HousePlanetOccupiesBasedOnSign?.replace("House", "") || "?";
          const d9 = d?.PlanetNavamshaD9Sign?.Name || "?";
          return `${name}: ${sign} (House ${house}, Nakshatra: ${nakshatra}, D9: ${d9})`;
        }).join(" | ");

        // Fetch Dasha context for the current decade to prevent hallucinations
        const currentYear = new Date().getFullYear();
        let dashaContext = "Unavailable";
        try {
          const properTimeObj = buildVedAstroTime(targetDob, targetTob, finalLat, finalLon, targetTimezone || "+05:30");
          const dashaData = await fetchDasaAtRange(properTimeObj, currentYear - 2, currentYear + 15);
          dashaContext = dashaData.slice(0, 5).map((d: any) => `${d.Lord} (${new Date(d.StartTime).getFullYear()}-${new Date(d.EndTime).getFullYear()})`).join(", ");
        } catch (dashaErr) {
          console.warn("Dasha fetch failed for AI context", dashaErr);
        }

        chartContext = `
        [CHART DATA FOR ${personContext.toUpperCase()}]
        DOB: ${targetDob}, Time: ${targetTob}, Place: ${targetPob} (Lat: ${finalLat}, Lon: ${finalLon})
        ATMAKARAKA (AK): ${ak} | DARAKARAKA (DK): ${dk}
        PLANETARY POSITIONS (D1 & D9): ${planetsCompact || "Unavailable"}
        CURRENT & UPCOMING DASHAS: ${dashaContext}
        `;
      } catch (err) {
        console.error("VedAstro mapping failed", err);
        chartContext = `[Error retrieving deep astronomical data for ${personContext}. Try basic guidance.]`;
      }
    }

    // ── Layer 4: System Instructions & Generation ──
    let aiReply = "";
    let aiMarker = "";
    let inputTokens = 0;
    let outputTokens = 0;
    let costInr = 0;
    let modelUsed = "";

    try {
      // PRIMARY: Claude Sonnet 4.6 via Amazon Bedrock (Marker 'A')
      const bedrockUrl = "https://bedrock-runtime.us-east-1.amazonaws.com/model/us.anthropic.claude-sonnet-4-6/converse";
      const bedrockToken = process.env.AWS_BEARER_TOKEN_BEDROCK;
      
      if (!bedrockToken) throw new Error("AWS_BEARER_TOKEN_BEDROCK is not set");

      // Format messages for Bedrock Converse API
      // Note: Bedrock's Converse API doesn't support "system" role in the messages array, 
      // it uses a top-level "system" array.
      const bedrockMessages = history.map((m: any) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: [{ text: m.content }]
      }));
      // Add the final user message along with chart context if any
      const userContent = chartContext ? `[SYSTEM DATA: ${chartContext}]\n\n${message}` : message;
      bedrockMessages.push({
        role: "user",
        content: [{ text: userContent }]
      });

      const bedrockResponse = await fetch(bedrockUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${bedrockToken}`
        },
        body: JSON.stringify({
          system: [{ text: ASTRO_SYSTEM_PROMPT }],
          messages: bedrockMessages
        })
      });

      if (!bedrockResponse.ok) {
        throw new Error(`Bedrock API Error: ${bedrockResponse.status} ${await bedrockResponse.text()}`);
      }

      const bedrockData = await bedrockResponse.json();
      aiReply = bedrockData.output?.message?.content?.[0]?.text || "";
      aiMarker = "A"; // Claude Sonnet 4.6
      modelUsed = "Claude Sonnet 4.6";
      
      inputTokens = bedrockData.usage?.inputTokens || 0;
      outputTokens = bedrockData.usage?.outputTokens || 0;
      costInr = (inputTokens * BEDROCK_INPUT_COST) + (outputTokens * BEDROCK_OUTPUT_COST);

    } catch (bedrockErr: any) {
      console.warn("Bedrock Claude failed. Falling back to Gemini 3.1 Pro Preview (Marker B)...", bedrockErr.message);
      
      // Fallback format for Gemini
      const geminiConversation = [
        { role: "user", parts: [{ text: `[SYSTEM DATA: ${chartContext}]` }] },
        { role: "model", parts: [{ text: "I have securely mapped the chart data into my cosmic memory. What shall we explore?" }] },
        ...history.map((m: any) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }]
        })),
        { role: "user", parts: [{ text: message }] }
      ];

      try {
        // FALLBACK 1: Gemini 3.1 pro preview (Marker 'B')
        const fallbackModel = ai.getGenerativeModel({ 
          model: "gemini-3.1-pro-preview", 
          systemInstruction: ASTRO_SYSTEM_PROMPT
        });
        const result = await fallbackModel.generateContent({ contents: geminiConversation as any });
        aiReply = result.response.text();
        aiMarker = "B";
        modelUsed = "Gemini 3.1 Pro";
        
        inputTokens = result.response.usageMetadata?.promptTokenCount || 0;
        outputTokens = result.response.usageMetadata?.candidatesTokenCount || 0;
        costInr = (inputTokens * GEMINI_INPUT_COST) + (outputTokens * GEMINI_OUTPUT_COST);

      } catch (geminiProErr: any) {
        console.warn("Gemini 3.1 Pro Preview failed. Falling back to Gemini 3.1 Flash Lite Preview (Marker C)...", geminiProErr.message);
        
        // FALLBACK 2: Gemini 3.1 flash lite preview (Marker 'C')
        const fallback2Model = ai.getGenerativeModel({ 
          model: "gemini-3.1-flash-lite-preview", 
          systemInstruction: ASTRO_SYSTEM_PROMPT
        });
        const result = await fallback2Model.generateContent({ contents: geminiConversation as any });
        aiReply = result.response.text();
        aiMarker = "C";
        modelUsed = "Gemini 3.1 Flash";
        
        inputTokens = result.response.usageMetadata?.promptTokenCount || 0;
        outputTokens = result.response.usageMetadata?.candidatesTokenCount || 0;
        costInr = (inputTokens * GEMINI_INPUT_COST) + (outputTokens * GEMINI_OUTPUT_COST);
      }
    }

    if (!aiReply) {
      throw new Error("All AI models failed to generate a response.");
    }

    // ── Token-Bucket Credit Deduction (post-response, accurate) ──
    // Formula: max(1, ceil((inputTokens + outputTokens) / 10_000))
    const totalTokens = inputTokens + outputTokens;
    const creditsToDeduct = Math.max(1, Math.ceil(totalTokens / 10_000));
    const creditsRemaining = Math.max(0, credits - creditsToDeduct);

    // Deduct from user_profiles (fire-and-forget)
    supabase
      .from("user_profiles")
      .update({ credits: creditsRemaining })
      .eq("id", user.id)
      .then(({ error }) => { if (error) console.error("Credit deduction failed:", error); });

    // ── Persist messages to database (fire-and-forget) ──
    const resolvedProfileId = profileId === "self"
      ? (await supabase.from("family_profiles").select("id").eq("user_id", user.id).eq("relationship", "Self").single()).data?.id
      : profileId;

    if (resolvedProfileId) {
      supabase.from("chat_messages").insert({
        user_id: user.id,
        profile_id: resolvedProfileId,
        role: "user",
        content: message
      }).then(({ error }) => { if (error) console.error("Failed to save user msg:", error); });

      supabase.from("chat_messages").insert({
        user_id: user.id,
        profile_id: resolvedProfileId,
        role: "assistant",
        content: `${aiReply}\n\n<!-- MARKER:${aiMarker} -->`
      }).then(({ error }) => { if (error) console.error("Failed to save AI msg:", error); });
    }

    // ── Log token + credit usage ──
    if (modelUsed) {
      supabase.from("token_usage_logs").insert({
        user_id: user.id,
        model_name: modelUsed,
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        total_tokens: totalTokens,
        cost_inr: costInr,
        credits_used: creditsToDeduct,
      }).then(({ error }) => { if (error) console.error("Failed to save token logs:", error); });
    }

    return NextResponse.json({
      reply: aiReply,
      marker: aiMarker,
      systemWarning: creditsToDeduct > 1
        ? `This exchange used ${creditsToDeduct} credits (complexity-based). Remaining: ${creditsRemaining}.`
        : null,
      creditsRemaining,
      creditsUsed: creditsToDeduct,
      tokensUsed: totalTokens,
    });

  } catch (error: any) {
    console.error("Astro-Chat Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
