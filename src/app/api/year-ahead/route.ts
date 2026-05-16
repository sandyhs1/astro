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

const YEAR_AHEAD_PROMPT = (pName: string, year: number, yogasJson: string, monthJson: string) => `You are KARMA — the Grand Master Jyotishi of Quantum Karma.
You are generating a deeply personal, brutal, savage, legit, and accurate YEAR AHEAD ${year} REPORT for ${pName}.

Our audience is GenZ, Gen Alpha, and Millennials. No sugarcoating. No fluff. Give subtle nuances.
Do not use these BANNED words: COSMOS, COSMIC, DANCE, TAPESTRY, ILLUMINATE, POETIC, AMULET, SHIMMERING.
NO GEMSTONE RECOMMENDATIONS EVER.

Here is the precise Varshaphal (Solar Return) data from the planetary engine:
Active Yogas for the Year:
${yogasJson}

Monthly Chart (Month 1 is the month of their birthday this year):
${monthJson}

TASK:
Return a pure JSON object (NO markdown code blocks, NO text outside JSON) with this exact schema:
{
  "intro": "Brutal, honest, yet encouraging assessment of what this year means for them based on the Varshaphal. 3-4 sentences.",
  "activeYogas": [
    {
      "name": "Name of the Yoga",
      "meaning": "Explain EXACTLY what this yoga means, its impact, and how it is formed based on the data."
    }
  ],
  "months": [
    {
      "monthNumber": 1,
      "theme": "A powerful 4-5 word theme for the month based on the Muntha or key planets.",
      "keywords": ["Keyword1", "Keyword2", "Keyword3"],
      "nuances": "Deep, subtle details and nuances about what will happen this month. Legit and accurate.",
      "actionPlan": "What they MUST do this month.",
      "advice": "Honest advice and encouragement for this specific month."
    }
  ] // Generate all 12 months exactly as passed in the data
}

CRITICAL: Output ONLY valid JSON. Escape all double quotes inside strings. Do not include trailing commas. Do not include unescaped newlines in strings.
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

    const { data: saved } = await supabase
      .from("saved_reports")
      .select("content")
      .eq("user_id", user.id)
      .eq("profile_id", targetProfileId)
      .eq("report_type", "year_ahead")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (saved && saved.content && saved.content.parsed && saved.content.metadata) {
      return NextResponse.json({ found: true, reportData: saved.content });
    }
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

    if (targetProfileId) {
      const { data: existing } = await supabaseAdmin
        .from("saved_reports")
        .select("content")
        .eq("user_id", user.id)
        .eq("profile_id", targetProfileId)
        .eq("report_type", "year_ahead")
        .limit(1)
        .maybeSingle();
      // Only use cache if it has the new structured parsed JSON AND metadata for month names
      if (existing && existing.content && existing.content.parsed && existing.content.metadata) {
        return NextResponse.json({ ...existing.content, fromCache: true });
      }
    }

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
    
    const year = new Date().getFullYear();
    const payload = { day: d, month: m, year: y, hour: h, min, lat: geo.lat, lon: geo.lon, tzone, varshaphal_year: year };

    const mcRes = await astroClient.customRequest({ method: 'POST', endpoint: 'varshaphal_month_chart', params: payload });
    const vyRes = await astroClient.customRequest({ method: 'POST', endpoint: 'varshaphal_yoga', params: payload });

    if (mcRes.status === false) throw new Error(mcRes.msg || "AstrologyAPI varshaphal_month_chart error");
    if (vyRes.status === false) throw new Error(vyRes.msg || "AstrologyAPI varshaphal_yoga error");

    const yogasJson = JSON.stringify(vyRes.filter((y: any) => y.is_yog_happening).map((y: any) => ({ name: y.name, description: y.description })));
    const monthJson = JSON.stringify(mcRes.slice(0, 12).map((m: any, i: number) => ({ month: i+1, ascendant: m.ascendant, muntha_house: m.muntha_house })));

    const prompt = YEAR_AHEAD_PROMPT(pName, year, yogasJson, monthJson);
    const llmResult = await routeLLM(prompt, [{ role: "user", content: "Generate my Year Ahead Blueprint JSON now." }], 4500, true);

    let parsed: any;
    try {
      // Find the first { and last } to extract only the JSON object
      let clean = llmResult.text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const firstBrace = clean.indexOf('{');
      const lastBrace = clean.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        clean = clean.substring(firstBrace, lastBrace + 1);
      }
      parsed = JSON.parse(clean);
    } catch (e: any) {
      console.error("JSON PARSE ERROR in Year Ahead:", e.message);
      console.log("Raw Text snippet:", llmResult.text.substring(0, 500));
      throw new Error("AI returned invalid structure. Please try again.");
    }

    const reportContent = { 
      parsed,
      metadata: {
        birthMonth: m,
        varshaphalYear: year
      }
    };

    if (targetProfileId) {
      // Clear out the old version if it existed, we only want 1 per year usually, but since the schema changed let's just delete the old one
      await supabaseAdmin.from("saved_reports").delete()
        .eq("user_id", user.id).eq("profile_id", targetProfileId).eq("report_type", "year_ahead");
      await supabaseAdmin.from("saved_reports").insert({
        user_id: user.id,
        profile_id: targetProfileId,
        report_type: "year_ahead",
        content: reportContent
      });
    }

    return NextResponse.json(reportContent);
  } catch (err: any) {
    console.error("Year Ahead POST error:", err);
    return NextResponse.json({ error: err.message || "Failed to generate report" }, { status: 500 });
  }
}
