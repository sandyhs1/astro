import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { routeLLM } from "@/lib/astrology/llm-router";
// @ts-ignore
import api from 'astrologyapi';
import { geocodePlace } from "@/lib/astrology/client";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SOUL_CODE_PROMPT = (pName: string, jaiminiJson: string, bioJson: string, moonBioJson: string) => `You are KARMA — the Grand Master Jyotishi of Quantum Karma.
You are generating a deeply personal, brutal, savage, legit, and accurate SOUL CODE REPORT for ${pName}.

Our audience is GenZ, Gen Alpha, and Millennials. No sugarcoating. No fluff.
Do not use these BANNED words: AMULET, DANCE, CODE, COSMOS, COSMIC, ARCHITECT, ILLUMINATE, POETIC, SURGICAL, TAPESTRY, SHIMMERING.

Here is the precise Jaimini Blueprint data:
${jaiminiJson}

Here is the precise Biorhythm and Pancha Pakshi (Moon Biorhythm) data:
General Biorhythm: ${bioJson}
Moon Biorhythm: ${moonBioJson}

You MUST return a pure JSON object. DO NOT wrap it in markdown block quotes. DO NOT return any text outside the JSON.
The JSON must strictly match this schema:
{
  "karakasIntro": "A beautiful, real-world explanation of what Karakas are and how they act as soul contracts. Use relatable real-world examples so users can understand easily.",
  "karakas": [
    {
      "name": "Atmakaraka (or whatever the karaka name is)",
      "planet": "Name of the planet",
      "meaning": "What this karaka means in general.",
      "impact": "What this specific planet means for this specific user.",
      "significance": "Brutal, honest advice on what they must do."
    }
    // ... list ALL karakas found in the Jaimini data.
  ],
  "biorhythmIntro": "A short, beautiful intro on what Biorhythms and Pancha Pakshi (Moon Biorhythm) are.",
  "biorhythmActionPlan": "A brutal, highly actionable plan based on their CURRENT physical, emotional, intellectual frequencies and their birth pakshi.",
  "moonBird": "The name of their Birth Pakshi (bird)."
}
`;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get("profileId");
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let targetProfileId = profileId;
    if (!profileId || profileId === "self") {
      const { data: fp } = await supabase.from("family_profiles").select("id").eq("user_id", user.id).eq("relationship", "Self").maybeSingle();
      if (fp) targetProfileId = fp.id;
    }
    if (!targetProfileId) return NextResponse.json({ found: false });

    const { data: saved } = await supabaseAdmin.from("saved_reports")
      .select("content")
      .eq("user_id", user.id)
      .eq("profile_id", targetProfileId)
      .eq("report_type", "soul_code")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (saved) return NextResponse.json({ found: true, reportData: saved.content });
    return NextResponse.json({ found: false });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { profileId } = await req.json();
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let targetProfileId = profileId;
    if (!profileId || profileId === "self") {
      const { data: fp } = await supabase.from("family_profiles").select("id").eq("user_id", user.id).eq("relationship", "Self").maybeSingle();
      if (fp) targetProfileId = fp.id;
    }

    // Force regenerate by bypassing cache (for now while we test changes)
    // if (targetProfileId) { ... cache code removed ... }

    let dob, tob, pob, tz, pName;
    if (!targetProfileId) {
      const { data: lead } = await supabase.from("onboarding_leads").select("*").eq("email", user.email).maybeSingle();
      dob = lead?.dob; tob = lead?.tob; pob = lead?.pob; tz = lead?.timezone || "+05:30"; pName = lead?.name || "Seeker";
    } else {
      const { data: fp } = await supabase.from("family_profiles").select("*").eq("id", targetProfileId).maybeSingle();
      dob = fp?.dob; tob = fp?.tob; pob = fp?.pob; tz = fp?.timezone || "+05:30"; pName = fp?.name || "Seeker";
    }

    if (!dob || !tob || !pob) return NextResponse.json({ error: "Birth details not found" }, { status: 422 });

    let d = 1, m = 1, y = 2000;
    if (dob.includes('-')) {
      const parts = dob.split('-');
      if (parts[0].length === 4) { y = parseInt(parts[0]); m = parseInt(parts[1]); d = parseInt(parts[2]); }
      else { d = parseInt(parts[0]); m = parseInt(parts[1]); y = parseInt(parts[2]); }
    } else if (dob.includes('/')) {
      const parts = dob.split('/');
      if (parts[2].length === 4) { d = parseInt(parts[0]); m = parseInt(parts[1]); y = parseInt(parts[2]); }
      else { y = parseInt(parts[0]); m = parseInt(parts[1]); d = parseInt(parts[2]); }
    }

    let h = 12, min = 0;
    const cleanTob = tob.replace(/am|pm/gi, '').trim();
    const parts = cleanTob.split(':');
    h = parseInt(parts[0]);
    if (tob.toLowerCase().includes('pm') && h < 12) h += 12;
    if (tob.toLowerCase().includes('am') && h === 12) h = 0;
    min = parts.length > 1 ? parseInt(parts[1]) : 0;

    const tzMatch = tz.match(/([+-]\d{2}):(\d{2})/);
    let tzone = 5.5;
    if (tzMatch) {
      const sign = tzMatch[1].startsWith("-") ? -1 : 1;
      tzone = sign * (Math.abs(parseInt(tzMatch[1])) + parseInt(tzMatch[2]) / 60);
    }

    const geo = await geocodePlace(pob);
    const astroClient = new api({ userId: process.env.ASTROLOGY_API_USER_ID!, apiKey: process.env.ASTROLOGY_API_KEY! });
    
    const payload = { day: d, month: m, year: y, hour: h, min, lat: geo.lat, lon: geo.lon, tzone };

    const jRes = await astroClient.customRequest({ method: 'POST', endpoint: 'jaimini_details', params: payload });
    const bRes = await astroClient.customRequest({ method: 'POST', endpoint: 'biorhythm', params: payload });
    const mRes = await astroClient.customRequest({ method: 'POST', endpoint: 'moon_biorhythm', params: payload });

    if (jRes.status === false) throw new Error(jRes.msg || "AstrologyAPI jaimini_details error");
    
    const jaiminiJson = JSON.stringify(jRes);
    const bioJson = JSON.stringify(bRes);
    const moonBioJson = JSON.stringify(mRes);

    const prompt = SOUL_CODE_PROMPT(pName, jaiminiJson, bioJson, moonBioJson);
    const llmResult = await routeLLM(prompt, [{ role: "user", content: "Generate my Soul Code Report JSON now." }], 4000);

    let parsed;
    try {
      const cleanJson = llmResult.text.replace(/```json/gi, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleanJson);
    } catch (e) {
      console.error("Failed to parse JSON from LLM:", llmResult.text);
      throw new Error("AI returned invalid structure. Please try again.");
    }

    const reportContent = { 
      parsed,
      rawBiorhythm: bRes 
    };

    if (targetProfileId) {
      await supabaseAdmin.from("saved_reports").delete().eq("user_id", user.id).eq("profile_id", targetProfileId).eq("report_type", "soul_code");
      await supabaseAdmin.from("saved_reports").insert({
        user_id: user.id,
        profile_id: targetProfileId,
        report_type: "soul_code",
        content: reportContent
      });
    }

    return NextResponse.json(reportContent);
  } catch (err: any) {
    console.error("Soul Code POST error:", err);
    return NextResponse.json({ error: err.message || "Failed to generate report" }, { status: 500 });
  }
}
