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

function parseBirthData(profileData: any) {
  let d = 1, m = 1, y = 2000;
  const dob = profileData.dob || "";
  if (dob.includes('-')) {
    const p = dob.split('-');
    if (p[0].length === 4) { y = +p[0]; m = +p[1]; d = +p[2]; }
    else { d = +p[0]; m = +p[1]; y = +p[2]; }
  } else if (dob.includes('/')) {
    const p = dob.split('/');
    if (p[2].length === 4) { d = +p[0]; m = +p[1]; y = +p[2]; }
    else { y = +p[0]; m = +p[1]; d = +p[2]; }
  }

  let h = 12, min = 0;
  const tob = profileData.tob || "";
  if (tob) {
    const isPM = tob.toLowerCase().includes('pm');
    const isAM = tob.toLowerCase().includes('am');
    const clean = tob.replace(/am|pm/gi, '').trim();
    const p = clean.split(':');
    h = +p[0]; min = p[1] ? +p[1] : 0;
    if (isPM && h < 12) h += 12;
    if (isAM && h === 12) h = 0;
  }

  let tzone = 5.5;
  const tz = profileData.timezone || "+05:30";
  const tzMatch = tz.match(/([+-]\d{2}):(\d{2})/);
  if (tzMatch) {
    const sign = tzMatch[1].startsWith('-') ? -1 : 1;
    tzone = sign * (Math.abs(+tzMatch[1]) + +tzMatch[2] / 60);
  }

  return { d, m, y, h, min, tzone };
}

const NAK_PROMPT = (name: string, gender: string, nakData: any, ascData: any, astroDetails: any) => `You are KARMA — the Grand Master Jyotishi at Quantum Karma.
Generate a NAKSHATRA & ASCENDANT DEEP INTELLIGENCE REPORT for ${name} (Gender: ${gender}).

BANNED WORDS — never use these: COSMOS, COSMIC, DANCE, TAPESTRY, ILLUMINATE, POETIC, AMULET, SHIMMERING, ARCHITECT, SURGICAL.

Our audience is GenZ, Gen Alpha, and Millennials. Be brutal, savage, legit, accurate, and honest. Zero old-book language. Zero generic fluff. Speak to them like a wise, no-nonsense friend who reads their birth chart.

RAW NAKSHATRA DATA FROM PLANETARY ENGINE:
${JSON.stringify(nakData)}

ASTRO DETAILS (Contains Pada / Charan):
Nakshatra: ${astroDetails?.Naksahtra}
Pada (Charan): ${astroDetails?.Charan}
Ruling Planet: ${astroDetails?.NaksahtraLord}

RAW ASCENDANT DATA FROM PLANETARY ENGINE:
Ascendant Sign: ${ascData?.asc_report?.ascendant || "Unknown"}
Raw Report: ${ascData?.asc_report?.report || ""}

TASK:
Return a pure JSON object (NO markdown code blocks, NO text outside JSON) with this exact schema:

{
  "nakshatra": {
    "name": "${astroDetails?.Naksahtra || "Extract from data"}",
    "pada": ${astroDetails?.Charan || 1},
    "rulingPlanet": "${astroDetails?.NaksahtraLord || "Extract from data"}",
    "tagline": "One savage, powerful line that captures this Nakshatra's energy. Max 15 words.",
    "shadowSide": "The brutally honest weakness or shadow pattern of this Nakshatra. No sugarcoating.",
    "strengths": ["3-4 bullet string strengths, specific and powerful, no generic"],
    "maleTraits": "Specific analysis of how this Nakshatra and Pada manifests in males. Be brutal and accurate.",
    "femaleTraits": "Specific analysis of how this Nakshatra and Pada manifests in females. Be brutal and accurate.",
    "career": "What careers and paths this Nakshatra is wired for. Brutal and specific.",
    "relationships": "How this Nakshatra loves, attaches, and drives people away. Be real.",
    "actionPlan": ["4-5 concrete, actionable things this person must do NOW based on their Nakshatra and Pada"]
  },
  "ascendant": {
    "sign": "${ascData?.asc_report?.ascendant || "Unknown"}",
    "tagline": "One savage powerful line for this rising sign. Max 15 words.",
    "firstImpression": "How others actually experience this person at first meeting. Brutally honest.",
    "body": "Physical traits and energy this rising sign gives. Be specific.",
    "lifeTheme": "The dominant life theme and soul mission this ascendant is wired for.",
    "shadowSide": "The ego trap or blind spot this ascendant defaults to.",
    "actionPlan": ["4-5 concrete things this person must do to channel their rising sign power properly"]
  }
}`;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get("profileId");
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get(n: string) { return cookieStore.get(n)?.value; } } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let targetProfileId = profileId;
    if (!profileId || profileId === "self") {
      const { data: fp } = await supabaseAdmin.from("family_profiles").select("id").eq("user_id", user.id).eq("relationship", "Self").maybeSingle();
      if (fp) targetProfileId = fp.id;
    }
    if (!targetProfileId) return NextResponse.json({ found: false });

    const { data: saved } = await supabaseAdmin.from("saved_reports").select("content")
      .eq("user_id", user.id).eq("profile_id", targetProfileId).eq("report_type", "nakshatra_ascendant")
      .order("created_at", { ascending: false }).limit(1).maybeSingle();

    if (saved) return NextResponse.json({ found: true, reportData: saved.content });
    return NextResponse.json({ found: false });
  } catch {
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
      { cookies: { get(n: string) { return cookieStore.get(n)?.value; } } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let targetProfileId = profileId;
    if (!profileId || profileId === "self") {
      const { data: fp } = await supabaseAdmin.from("family_profiles").select("id").eq("user_id", user.id).eq("relationship", "Self").maybeSingle();
      if (fp) targetProfileId = fp.id;
    }

    // Check cache
    if (targetProfileId) {
      const { data: existing } = await supabaseAdmin.from("saved_reports").select("content")
        .eq("user_id", user.id).eq("profile_id", targetProfileId).eq("report_type", "nakshatra_ascendant")
        .limit(1).maybeSingle();
      if (existing) return NextResponse.json({ ...existing.content, fromCache: true });
    }

    let profileData: any;
    if (!targetProfileId) {
      const { data: lead } = await supabaseAdmin.from("onboarding_leads").select("*").eq("email", user.email).maybeSingle();
      profileData = lead;
    } else {
      const { data: fp } = await supabaseAdmin.from("family_profiles").select("*").eq("id", targetProfileId).maybeSingle();
      profileData = fp;
    }

    if (!profileData) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    if (!profileData.dob || !profileData.tob || !profileData.pob)
      return NextResponse.json({ error: "Incomplete birth details" }, { status: 422 });

    const { d, m, y, h, min, tzone } = parseBirthData(profileData);
    const geo = await geocodePlace(profileData.pob);
    const astroClient = new api({ userId: process.env.ASTROLOGY_API_USER_ID!, apiKey: process.env.ASTROLOGY_API_KEY! });
    const payload = { day: d, month: m, year: y, hour: h, min, lat: geo.lat, lon: geo.lon, tzone };

    const [nakRes, ascRes, astroDetRes] = await Promise.all([
      astroClient.customRequest({ method: 'POST', endpoint: 'general_nakshatra_report', params: payload }),
      astroClient.customRequest({ method: 'POST', endpoint: 'general_ascendant_report', params: payload }),
      astroClient.customRequest({ method: 'POST', endpoint: 'astro_details', params: payload })
    ]);

    if (nakRes.status === false) throw new Error("Nakshatra API error: " + nakRes.msg);
    if (ascRes.status === false) throw new Error("Ascendant API error: " + ascRes.msg);

    const gender = profileData.gender || "male";
    const prompt = NAK_PROMPT(profileData.name || "Seeker", gender, nakRes, ascRes, astroDetRes);
    const llmResult = await routeLLM(prompt, [{ role: "user", content: "Generate my Nakshatra and Ascendant Report JSON now." }], 4000);

    let parsed: any;
    try {
      const clean = llmResult.text.replace(/```json/gi, '').replace(/```/g, '').trim();
      parsed = JSON.parse(clean);
    } catch {
      throw new Error("AI returned invalid structure. Please try again.");
    }

    const reportContent = { parsed };

    if (targetProfileId) {
      await supabaseAdmin.from("saved_reports").delete()
        .eq("user_id", user.id).eq("profile_id", targetProfileId).eq("report_type", "nakshatra_ascendant");
      await supabaseAdmin.from("saved_reports").insert({
        user_id: user.id, profile_id: targetProfileId,
        report_type: "nakshatra_ascendant", content: reportContent
      });
    }

    return NextResponse.json(reportContent);
  } catch (err: any) {
    console.error("Nakshatra-Ascendant POST error:", err);
    return NextResponse.json({ error: err.message || "Failed to generate" }, { status: 500 });
  }
}
