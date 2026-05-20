import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getOrBuildChart } from "@/lib/astrology/manager";
import { routeLLM } from "@/lib/astrology/llm-router";
import { FEATURE_CREDITS } from "@/lib/pricing/feature-credits";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CREDITS_COST = FEATURE_CREDITS.ishta_devata;

const LLM_PRICE: Record<string, { in: number; out: number }> = {
  "bedrock/us.anthropic.claude-sonnet-4-6": { in: 0.252, out: 1.26 },
  "gemini/gemini-3.1-pro-preview":          { in: 0.105, out: 0.42 },
  "gemini/gemini-3.1-flash-lite":   { in: 0.0063, out: 0.0063 },
};
function calcCostInr(model: string, tokIn: number, tokOut: number): number {
  const p = LLM_PRICE[model] ?? { in: 0.252, out: 1.26 };
  return (tokIn / 1000) * p.in + (tokOut / 1000) * p.out;
}

const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
];

// ── Pure Jaimini logic: Derive Ishta Devata ──────────────────────────────────
// Step 1: AK is the planet with highest degree (already in chart.karakas.ak)
// Step 2: Find AK's position in D9 (Navamsa) → this is the Karakamsa
// Step 3: Find the 12th house FROM the Karakamsa sign in D9
// Step 4: Map the sign-lord of that 12th house → Ishta Devata
function deriveIshtaDevata(chart: any): {
  ak: string;
  akD9Sign: string;
  akD9House: number;
  karakamsaSign: string;
  twelfthFromKarakamsa: string;
  twelfthLord: string;
  ishtaDevata: string;
  allForms: string[];
} {
  const SIGN_LORD: Record<string, string> = {
    Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
    Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Mars",
    Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Saturn", Pisces: "Jupiter",
  };

  // Planet → primary deity + all forms
  const DEVATA_MAP: Record<string, { primary: string; allForms: string[] }> = {
    Sun:     { primary: "Lord Rama / Shiva", allForms: ["Lord Rama", "Shiva", "Surya Narayana"] },
    Moon:    { primary: "Lord Krishna / Gauri", allForms: ["Lord Krishna", "Gauri", "Lalita", "Parvati"] },
    Mars:    { primary: "Hanuman / Subramanya / Narasimha", allForms: ["Hanuman", "Kartikeya (Subramanya)", "Narasimha", "Murugan"] },
    Mercury: { primary: "Lord Vishnu", allForms: ["Lord Vishnu", "Trivikrama"] },
    Jupiter: { primary: "Vamana / Shiva", allForms: ["Vamana", "Dakshinamurthy (Shiva)", "Brihaspati"] },
    Venus:   { primary: "Lakshmi / Annapurna", allForms: ["Maha Lakshmi", "Annapurna", "Bhuvanesvari", "Sri Devi"] },
    Saturn:  { primary: "Vishnu / Kurma / Shani", allForms: ["Kurma (Vishnu)", "Shani Dev", "Shanishwara"] },
    Rahu:    { primary: "Durga / Varaha", allForms: ["Maha Durga", "Varaha (Vishnu)", "Bhairava"] },
    Ketu:    { primary: "Ganesha / Matsya", allForms: ["Ganesha", "Matsya (Vishnu)", "Skandha"] },
  };

  const ak = chart.karakas?.ak ?? "Sun";

  // Find AK planet in D9
  const d9Planets: any[] = chart.divisional?.d9?.planets ?? [];
  const akD9Planet = d9Planets.find((p: any) =>
    p.name.toLowerCase() === ak.toLowerCase()
  );

  const akD9Sign = akD9Planet?.sign ?? "Unknown";
  const akD9House = akD9Planet?.house ?? 1;

  // Karakamsa = the sign AK occupies in D9
  const karakamsaSign = akD9Sign;

  // 12th from Karakamsa
  const karakamsaIdx = SIGNS.findIndex(s => s.toLowerCase() === karakamsaSign.toLowerCase());
  const twelfthIdx = karakamsaIdx >= 0 ? (karakamsaIdx + 11) % 12 : 11; // +11 = 12th house (0-indexed)
  const twelfthFromKarakamsa = SIGNS[twelfthIdx] ?? "Pisces";

  // Lord of 12th from Karakamsa
  const twelfthLord = SIGN_LORD[twelfthFromKarakamsa] ?? "Jupiter";

  const devataInfo = DEVATA_MAP[twelfthLord] ?? { primary: "Lord Vishnu", allForms: ["Lord Vishnu"] };

  return {
    ak,
    akD9Sign,
    akD9House,
    karakamsaSign,
    twelfthFromKarakamsa,
    twelfthLord,
    ishtaDevata: devataInfo.primary,
    allForms: devataInfo.allForms,
  };
}

const ISHTA_DEVATA_SYSTEM_PROMPT = (
  pName: string,
  ak: string,
  karakamsaSign: string,
  twelfthFromKarakamsa: string,
  twelfthLord: string,
  ishtaDevata: string,
  allForms: string[]
) => `You are a Jaimini Sutra specialist and Grandmaster Jyotishi. Your astrological logic is infallible. Your knowledge of Puranic lore, Agama Shastra, and the Jaimini Sutram is encyclopedic and precise.

## THE MATHEMATICAL DERIVATION (pre-computed — your output must explain this)
- Person: ${pName}
- Atmakaraka (AK — Soul Planet): ${ak}
- AK's position in D9 (Navamsa): ${karakamsaSign} — this is the KARAKAMSA
- 12th house from Karakamsa: ${twelfthFromKarakamsa}
- Lord of 12th from Karakamsa: ${twelfthLord}
- Derived Ishta Devata: ${ishtaDevata}
- All Divine Forms of this Devata: ${allForms.join(", ")}

Your task: Generate a complete, powerful, and deeply personalized Ishta Devata report for ${pName}.

## MANDATORY OUTPUT STRUCTURE:

### 🔱 What is an Ishta Devata? (The Truth Most Miss)
2-3 sentences. Explain the difference between Kula Devata (inherited family deity) and Ishta Devata (mathematically derived soul deity). Mention that while Kula Devata is about clan karma, the Ishta Devata is about Moksha — the soul's specific liberation path. Reference Jaimini Sutram directly (cite Chapter and Adhyaya where possible).

### ⚡ Your Revelation: ${ishtaDevata}
Announce ${pName}'s Ishta Devata with complete scriptural authority. Explain the mathematical derivation step by step — Atmakaraka ${ak} in D9 sits in ${karakamsaSign} (the Karakamsa), and the 12th from Karakamsa is ${twelfthFromKarakamsa}, ruled by ${twelfthLord}, pointing to ${ishtaDevata}. Make this feel like a sacred discovery, not a generic reading.

### 🌟 All Divine Forms & Micro-Analysis
Go deep on every form of ${ishtaDevata}: ${allForms.join(", ")}.
For each form:
- What aspect of the deity this form represents
- Which specific Purana or scripture mentions this form in the Moksha context
- Which form to approach first and why (based on ${pName}'s AK: ${ak})

### 💫 Why Your Soul Chose This Deity
The AK ${ak} carries a specific unfulfilled longing from past lives. Explain precisely what wound, aspiration, or karmic contract the soul carries that is SOLVED by connecting to ${ishtaDevata}. This is not generic. Reference ${ak}'s inherent qualities and what its divine counterpart provides.

### 📿 The Connection Ritual — Sadhana Prescription
Provide three specific, non-generic prescriptions:

**1. Primary Mantra:**
Give the exact Sanskrit mantra for this deity (specific to ${ishtaDevata}), with Devanagari transliteration and meaning. Specify:
- When to chant (day, time — tied to the ruling planet ${twelfthLord})
- How many repetitions (108 minimum)
- Which direction to face
- What to offer on the altar

**2. Nitya Practice (Daily):**
One specific daily act that establishes a living connection. Not "meditate." Be precise — what to visualize, what to say, how long.

**3. Special Occasion Worship:**
The one festival or Tithi during the year when this connection is magnified 1000x. What to do that day specifically.

### 🚀 Soul Benefits — What Changes When You Connect
List 5-7 specific, tangible life changes that occur when a person with this Ishta Devata actively worships them. Connect each benefit to the planet ${twelfthLord} and what that planet governs.

### ⚔️ The Responsibility — What Your Soul Is Called To Do
This is not a free pass. What does having this Ishta Devata demand of ${pName}? What lifestyle, ethical standard, or spiritual discipline is non-negotiable for this Devata's grace to flow? Be direct and uncompromising.

### 🏛️ Plan of Action — 90-Day Activation Protocol
Day 1-30: Foundation phase — what to establish
Day 31-60: Deepening phase — what practice to add
Day 61-90: Integration phase — what shifts to expect
Be specific. No vague "meditate daily." Give exact instructions.

---
*Note: Your Ishta Devata is not the same as your Kula Devata (family deity). The Kula Devata is passed through blood and clan — you inherit it from your ancestors. Your Ishta Devata is mathematically revealed through your soul's birth data alone. To discover your Kula Devata, consult your elders and ancestral traditions. These are two separate, equally sacred connections.*

---
## TONE: Savage yet Divine. Brutally honest about the weight of this soul connection. Direct, authoritative. Not poetic rambling.
## BANNED WORDS: cosmic, cosmos, shimmer, amulet, orchestrate, tapestry, dance, illuminate, poetic, poetry, architect, celestial, mystical, vibrations, energies, interplay, paradigm, resonate, journey, weave.
## LENGTH: 1000-1400 words. Premium Markdown. Every sentence delivers information.
## CRITICAL: Do NOT be generic. Every line must reference ${ak}, ${karakamsaSign}, ${twelfthLord}, or ${ishtaDevata} specifically.`;

// ─── GET: Load saved Ishta Devata report ────────────────────────────────────
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
      const { data: fp } = await supabaseAdmin.from("family_profiles").select("id").eq("user_id", user.id).eq("relationship", "Self").maybeSingle();
      if (fp) {
        targetProfileId = fp.id;
      } else {
        targetProfileId = null;
        if (req.method === "POST") {
          const { data: lead } = await supabaseAdmin.from("onboarding_leads").select("*").eq("email", user.email || "").maybeSingle();
          if (lead) {
            const { data: newFp } = await supabaseAdmin.from("family_profiles").insert({
              user_id: user.id, name: lead.name || "Seeker", relationship: "Self", dob: lead.dob, tob: lead.tob, pob: lead.pob, gender: lead.gender || "male", timezone: lead.timezone || "+05:30"
            }).select("id").maybeSingle();
            if (newFp) targetProfileId = newFp.id;
          }
        }
      }
    }
    if (targetProfileId === "self") targetProfileId = null;
    if (!targetProfileId) return NextResponse.json({ found: false });

    const { data: saved } = await supabaseAdmin.from("saved_reports")
      .select("content")
      .eq("user_id", user.id)
      .eq("profile_id", targetProfileId)
      .eq("report_type", "ishta_devata")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (saved) return NextResponse.json({ found: true, reportData: saved.content });
    return NextResponse.json({ found: false });

  } catch (err: any) {
    console.error("[ISHTA DEVATA] GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── POST: Generate Ishta Devata report ─────────────────────────────────────
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

    // ── Credits check ─────────────────────────────────────────────────────────
    const { data: profile } = await supabaseAdmin.from("user_profiles").select("*").eq("id", user.id).single();
    const credits = profile?.credits ?? 0;
    if (credits < CREDITS_COST) {
      return NextResponse.json(
        { error: `Insufficient credits. Ishta Devata Report costs ${CREDITS_COST} credits.` },
        { status: 402 }
      );
    }

    // ── ONE-TIME GUARD: return existing if already generated ──────────────────
    let earlyProfileId: string | null = profileId ?? null;
    if (!profileId || profileId === "self") {
      const { data: fp } = await supabaseAdmin.from("family_profiles").select("id")
        .eq("user_id", user.id).eq("relationship", "Self").maybeSingle();
      earlyProfileId = fp?.id ?? null;
    }
    if (earlyProfileId) {
      const { data: existing } = await supabaseAdmin
        .from("saved_reports").select("content")
        .eq("user_id", user.id).eq("profile_id", earlyProfileId)
        .eq("report_type", "ishta_devata").limit(1).maybeSingle();
      if (existing) {
        return NextResponse.json({ ...existing.content, creditsRemaining: credits, fromCache: true });
      }
    }

    // ── Resolve birth details ──────────────────────────────────────────────────
    let dob = "", tob = "", pob = "", tz = "+05:30", pName = "Seeker";
    if (!profileId || profileId === "self") {
      const { data: fp } = await supabaseAdmin.from("family_profiles").select("*")
        .eq("user_id", user.id).eq("relationship", "Self").maybeSingle();
      if (fp) { dob = fp.dob; tob = fp.tob; pob = fp.pob; tz = fp.timezone || "+05:30"; pName = fp.name; }
      else {
        const { data: lead } = await supabaseAdmin.from("onboarding_leads").select("*")
          .eq("email", user.email).maybeSingle();
        dob = lead?.dob; tob = lead?.tob; pob = lead?.pob;
        tz = lead?.timezone || "+05:30"; pName = lead?.name || "Seeker";
      }
    } else {
      const { data: fp } = await supabaseAdmin.from("family_profiles").select("*")
        .eq("id", profileId).maybeSingle();
      dob = fp?.dob; tob = fp?.tob; pob = fp?.pob;
      tz = fp?.timezone || "+05:30"; pName = fp?.name || "Seeker";
    }
    if (!dob || !tob || !pob) return NextResponse.json({ error: "Birth details not found" }, { status: 422 });

    // ── Build chart & derive Ishta Devata mathematically ─────────────────────
    const { chart } = await getOrBuildChart(dob, tob, pob, tz, undefined, undefined, user.email);
    const derivation = deriveIshtaDevata(chart);

    // ── Call LLM ─────────────────────────────────────────────────────────────
    const systemPrompt = ISHTA_DEVATA_SYSTEM_PROMPT(
      pName,
      derivation.ak,
      derivation.karakamsaSign,
      derivation.twelfthFromKarakamsa,
      derivation.twelfthLord,
      derivation.ishtaDevata,
      derivation.allForms
    );

    const llmResult = await routeLLM(
      systemPrompt,
      [{ role: "user", content: `Generate the complete Ishta Devata report for ${pName}. The mathematical derivation is already computed. Explain it clearly and build the full report as specified. Be specific, precise, and powerful.` }],
      4000
    );

    // ── Deduct credits ────────────────────────────────────────────────────────
    await supabaseAdmin.from("user_profiles")
      .update({ credits: Math.max(0, credits - CREDITS_COST) })
      .eq("id", user.id);

    // ── Log usage ─────────────────────────────────────────────────────────────
    supabaseAdmin.from("token_usage_logs").insert({
      user_id:       user.id,
      model_name:    llmResult.model,
      input_tokens:  llmResult.tokensIn,
      output_tokens: llmResult.tokensOut,
      total_tokens:  llmResult.tokensIn + llmResult.tokensOut,
      cost_inr:      calcCostInr(llmResult.model, llmResult.tokensIn, llmResult.tokensOut).toFixed(6),
      credits_used:  CREDITS_COST,
      question_preview: `Ishta Devata: ${derivation.ishtaDevata}`,
      feature:       "ishta_devata",
    });

    const reportData = {
      report:                llmResult.text,
      personName:            pName,
      model:                 llmResult.model,
      ak:                    derivation.ak,
      akD9Sign:              derivation.akD9Sign,
      karakamsaSign:         derivation.karakamsaSign,
      twelfthFromKarakamsa:  derivation.twelfthFromKarakamsa,
      twelfthLord:           derivation.twelfthLord,
      ishtaDevata:           derivation.ishtaDevata,
      allForms:              derivation.allForms,
      generatedAt:           new Date().toISOString(),
    };

    // ── Save permanently ──────────────────────────────────────────────────────
    let targetProfileId: string | null = null;
    if (!profileId || profileId === "self") {
      const { data: fp } = await supabaseAdmin.from("family_profiles").select("id")
        .eq("user_id", user.id).eq("relationship", "Self").maybeSingle();
      targetProfileId = fp?.id ?? null;
    } else {
      targetProfileId = profileId;
    }

    if (targetProfileId) {
      const { error: saveErr } = await supabaseAdmin.from("saved_reports").insert({
        user_id:     user.id,
        profile_id:  targetProfileId,
        report_type: "ishta_devata",
        content:     reportData,
      });
      if (saveErr) console.error("[ISHTA DEVATA] ❌ Save error:", saveErr.message);
      else console.log("[ISHTA DEVATA] ✅ Report saved for profile:", targetProfileId);
    }

    return NextResponse.json({ ...reportData, creditsRemaining: Math.max(0, credits - CREDITS_COST) });

  } catch (err: any) {
    console.error("[ISHTA DEVATA] POST error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
