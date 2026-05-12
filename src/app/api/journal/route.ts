import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient as createDeepgramClient } from "@deepgram/sdk";
import { getOrBuildChart } from "@/lib/astrology/manager";
import { getCurrentGochar } from "@/lib/astrology/gochar";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { routeLLM } from "@/lib/astrology/llm-router";

// Service-role client for DB persistence
const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const deepgram = createDeepgramClient(process.env.DEEPGRAM_API_KEY!);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get("profileId");

    if (!profileId) {
      return NextResponse.json({ error: "Missing profileId" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Validate profile belongs to user
    let actualProfileId = profileId;
    if (profileId === "self") {
      const { data: selfProfile } = await supabase
        .from("family_profiles")
        .select("id")
        .eq("user_id", user.id)
        .eq("relationship", "Self")
        .single();
      if (!selfProfile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
      actualProfileId = selfProfile.id;
    }

    const { data, error } = await supabase
      .from("life_journals")
      .select("*")
      .eq("user_id", user.id)
      .eq("profile_id", actualProfileId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ entries: data });
  } catch (err: any) {
    console.error("GET Journal Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;
    const textContent = formData.get("text") as string;
    let profileId = formData.get("profileId") as string;

    if (!audioFile && !textContent) {
      return NextResponse.json({ error: "No content provided" }, { status: 400 });
    }

    if (!profileId || profileId === "self") {
      const { data: selfProfile } = await supabase
        .from("family_profiles")
        .select("id, dob, tob, pob, timezone")
        .eq("user_id", user.id)
        .eq("relationship", "Self")
        .single();
      if (!selfProfile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
      profileId = selfProfile.id;
    }

    // Get the user's chart details for Dasha context
    const { data: fp } = await supabase.from("family_profiles").select("*").eq("id", profileId).single();
    if (!fp || !fp.dob || !fp.tob || !fp.pob) {
      return NextResponse.json({ error: "Incomplete birth profile" }, { status: 422 });
    }

    // 1. Process via Deepgram (Sentiment + Intent Recognition)
    let transcription = textContent || "";
    let sentimentLabel = "neutral";
    let sentimentScore = 0; // -1 to 1
    let detectedIntents: string[] = []; // e.g. ["seek support", "express frustration"]

    if (audioFile) {
      const arrayBuffer = await audioFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
        buffer,
        {
          model: "nova-2",
          smart_format: true,
          sentiment: true,
          intents: true,   // ← Deepgram Intent Recognition enabled
          language: "en"
        }
      );

      if (error) {
        console.error("Deepgram Error:", error);
        throw new Error("Failed to process audio");
      }

      const channel = result?.results?.channels?.[0];
      const alternatives = channel?.alternatives?.[0];
      transcription = alternatives?.transcript || "";

      // ── Aggregate Sentiment Score ──────────────────────────────────────────
      if (result?.results?.sentiments?.segments) {
        const segments = result.results.sentiments.segments || [];
        let totalScore = 0;
        let validSegments = 0;
        for (const seg of segments) {
          if (typeof seg.sentiment_score === 'number') {
            totalScore += seg.sentiment_score;
          } else {
            let score = 0;
            if (seg.sentiment === "positive") score = 1;
            else if (seg.sentiment === "negative") score = -1;
            totalScore += score;
          }
          validSegments++;
        }
        sentimentScore = validSegments > 0 ? totalScore / validSegments : 0;
        if (sentimentScore > 0.25) sentimentLabel = "positive";
        else if (sentimentScore < -0.25) sentimentLabel = "negative";
        else sentimentLabel = "neutral";
      }

      // ── Extract Intents from all segments ─────────────────────────────────
      // result.results.intents.segments[].intents[].intent (string)
      //                                            .confidence_score (float 0-1)
      const intentSegments = result?.results?.intents?.segments || [];
      const allIntents: { intent: string; confidence: number }[] = [];
      for (const seg of intentSegments) {
        for (const it of (seg.intents || [])) {
          if (it.intent && typeof it.confidence_score === 'number') {
            allIntents.push({ intent: it.intent, confidence: it.confidence_score });
          }
        }
      }
      // Deduplicate by intent text (keep highest-confidence occurrence)
      const intentMap = new Map<string, number>();
      for (const { intent, confidence } of allIntents) {
        if (!intentMap.has(intent) || intentMap.get(intent)! < confidence) {
          intentMap.set(intent, confidence);
        }
      }
      // Sort by confidence desc, keep top 5, return just the labels
      detectedIntents = Array.from(intentMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([intent]) => intent);

      console.log(`[JOURNAL] Sentiment: ${sentimentLabel} (${sentimentScore.toFixed(2)}) | Intents: [${detectedIntents.join(", ")}]`);
    } else if (textContent) {
      // Text fallback not supported in current SDK version
      throw new Error("Text-only journal entries are not currently supported.");
    }

    if (!transcription.trim()) {
       return NextResponse.json({ error: "Could not transcribe audio" }, { status: 400 });
    }

    // 2. Fetch Astrological Context (Gochar & Dasha)
    const { chart } = await getOrBuildChart(fp.dob, fp.tob, fp.pob, fp.timezone || "+05:30", undefined, undefined, user.email);
    const gocharSnapshot = getCurrentGochar();
    
    // 3. Generate AI Feedback via routeLLM
    let aiFeedback = null;
    try {
      const systemInstruction = "You are a precise, highly analytical, and clinical Grandmaster Jyotishi and psychological behavioral analyst. You receive the user's transcribed journal, their raw emotional sentiment score (-1 to 1), their detected behavioural intents (as classified by an AI speech engine), and their current transits/dashas. Your job is to mathematically and psychologically correlate their feelings AND their underlying intents with their active astrological periods. Use the intents to reveal WHY the user is truly seeking what they are seeking—this is the hidden layer of the reading. Speak plainly, directly, and professionally. NEVER use poetic, cheesy, or cliché phrasing (e.g., avoid 'cosmic dance', 'celestial energies', 'dear one', 'universe is guiding you', 'mystical'). NEVER explicitly state or output the numerical sentiment score to the user—use it internally to gauge their emotional intensity. Provide a highly personalized, practical 1-step behavioral or astrological remedy. Respond purely in JSON format: {\"cosmic_insight\": \"...\", \"action_plan\": \"...\"}. Do not wrap in markdown.";
      
      const intentContext = detectedIntents.length > 0
        ? `Detected Behavioural Intents: ${detectedIntents.join(", ")}`
        : "Detected Behavioural Intents: None detected";

      const prompt = `User Journal Transcription: "${transcription}"
Detected Sentiment: ${sentimentLabel} (Score: ${sentimentScore.toFixed(2)})
${intentContext}
Current Dasha: Mahadasha ${chart?.dasha?.mahadasha}, Antardasha ${chart?.dasha?.antardasha}
Current Saturn Transit: ${gocharSnapshot.planets?.find(p => p.name === 'Saturn')?.sign}
Current Jupiter Transit: ${gocharSnapshot.planets?.find(p => p.name === 'Jupiter')?.sign}

Factor BOTH the sentiment intensity AND the detected intents into your reading. Provide the JSON feedback.`;

      const aiResponse = await routeLLM(systemInstruction, [{ role: "user", content: prompt }]);
      const cleanedJson = aiResponse.text.replace(/```json/g, '').replace(/```/g, '').trim();
      aiFeedback = JSON.parse(cleanedJson);
    } catch (aiErr) {
      console.error("AI Feedback Error:", aiErr);
    }

    // Save to database (including detected intents)
    const { data: insertedRecord, error: dbError } = await supabaseAdmin
      .from("life_journals")
      .insert({
        user_id: user.id,
        profile_id: profileId,
        transcription: transcription,
        sentiment: sentimentLabel,
        sentiment_score: sentimentScore,
        intents: detectedIntents,          // ← persist Deepgram intents
        gochar_snapshot: gocharSnapshot,
        ai_feedback: aiFeedback,
        dasha_snapshot: {
          mahadasha: chart?.dasha?.mahadasha,
          antardasha: chart?.dasha?.antardasha,
          pratyantar: chart?.dasha?.pratyantar,
        }
      })
      .select()
      .single();

    if (dbError) {
      console.error("DB Insert Error:", dbError);
      throw new Error("Failed to save journal entry");
    }

    return NextResponse.json({ success: true, entry: insertedRecord });
  } catch (err: any) {
    console.error("POST Journal Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
