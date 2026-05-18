/**
 * /api/astro-chat/suggest-prompts
 *
 * Generates 4 hyper-personalized, ANGLE-DIVERSE follow-up questions for
 * the Oracle Chat panel. Pure UX helper — does NOT consume astrology
 * credits, does NOT trigger any external astrology API calls.
 *
 * INPUT (POST body, all optional except auth):
 *   {
 *     lastUserMessage?:      string,
 *     lastAssistantMessage?: string,
 *     recentHistory?:        { role: "user"|"assistant"; content: string }[],
 *     profileName?:          string,
 *     excludeQuestions?:     string[]   // already-shown / already-clicked chips
 *   }
 *
 * OUTPUT:
 *   { suggestions: string[] }    // exactly 4 items
 *
 * Pipeline:
 *   1. Server-side resolve the user's primary "Self" family_profiles row.
 *   2. Hit getOrBuildChart (CACHE HIT — no AstrologyAPI calls) to extract a
 *      tiny "chart fingerprint": Lagna / Moon nakshatra / Sun sign / AK /
 *      DK / current Mahadasha + Antardasha. This makes suggestions name
 *      the user's actual planets, not generic placements.
 *   3. Build a model prompt with the conversation thread + chart fingerprint
 *      + an explicit "FORCED ANGLE DIVERSITY" rule (TIMING / CAUSE / ACTION /
 *      DEEPER) so the 4 chips cover four different functional questions.
 *   4. Run Gemini 3.1 Flash Lite (cheapest tier, ~Rs 0.005/call).
 *   5. Post-filter: drop banned-word leakage, drop duplicates, drop anything
 *      in excludeQuestions, top up from topic-aware static fallbacks if the
 *      LLM returns fewer than 4.
 *
 * Hard 4-second timeout. On any failure, returns a topic-keyword fallback
 * so the chat UI is NEVER blocked by this.
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { getOrBuildChart } from "@/lib/astrology/manager";

// ─── Topic fallback chips (only used if the LLM completely fails) ──────────
const FALLBACK_BY_TOPIC: Record<string, string[]> = {
  career: [
    "When does my next career window open?",
    "Why has my work felt stuck this past year?",
    "Should I pivot now or hold the line?",
    "What does my D10 say about my real path?",
  ],
  relationship: [
    "When will the right partner enter my life?",
    "Why do the same patterns keep showing up?",
    "What can I do this month to soften the friction?",
    "What does my D9 reveal about my future spouse?",
  ],
  finance: [
    "When does my next wealth window activate?",
    "Why does money feel hard to hold for me?",
    "What is one practical shift I can make now?",
    "What is the karmic story behind my finances?",
  ],
  health: [
    "Which area of my body needs attention now?",
    "Why are recurring issues showing up again?",
    "What daily practice would actually help me?",
    "Which house in my chart governs my vitality?",
  ],
  spiritual: [
    "When does my spiritual breakthrough come?",
    "Why does my soul feel restless right now?",
    "What practice fits my chart precisely?",
    "What does my D60 reveal about past lives?",
  ],
  family: [
    "When do family dynamics shift for me?",
    "Why does my home life feel heavy?",
    "What can I do to ease the friction at home?",
    "What does my 4th house reveal about my mother?",
  ],
  general: [
    "When does my next major life window open?",
    "Why is this current chapter showing up now?",
    "What is one decision I should make this month?",
    "What hidden strength does my chart carry?",
  ],
};

function detectTopic(text: string): keyof typeof FALLBACK_BY_TOPIC {
  const t = (text || "").toLowerCase();
  if (/career|job|work|business|promotion|profession/.test(t))                           return "career";
  if (/marriag|spouse|partner|love|relation|breakup|divorce|dating/.test(t))             return "relationship";
  if (/money|wealth|financ|income|debt|invest|salary/.test(t))                            return "finance";
  if (/health|illness|body|energy|vitality|sick|disease/.test(t))                         return "health";
  if (/spirit|mantra|meditation|dharma|moksha|soul|karma|past.life/.test(t))              return "spiritual";
  if (/mother|father|parent|family|home|child|sibling/.test(t))                           return "family";
  return "general";
}

function fallbackChips(messages: string[]): string[] {
  const combined = messages.filter(Boolean).join(" ");
  const topic    = detectTopic(combined);
  return [...FALLBACK_BY_TOPIC[topic]];
}

// ─── Auth + admin clients ──────────────────────────────────────────────────
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

function getAdmin() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// ─── Chart fingerprint extraction (zero extra API calls) ───────────────────
interface ChartFingerprint {
  name?:           string;
  lagna?:          string;
  moonSign?:       string;
  moonNakshatra?:  string;
  sunSign?:        string;
  atmakaraka?:     string;
  darakaraka?:     string;
  mahadasha?:      string;
  mahadashaEnd?:   string;
  antardasha?:     string;
  antardashaEnd?:  string;
}

async function getChartFingerprint(userId: string, userEmail: string | null): Promise<ChartFingerprint | null> {
  try {
    const admin = getAdmin();

    // 1. Resolve the user's primary "Self" family_profiles row
    const { data: fp } = await admin
      .from("family_profiles")
      .select("name, dob, tob, pob, timezone, lat, lng")
      .eq("user_id", userId)
      .eq("relationship", "Self")
      .maybeSingle();

    if (!fp || !fp.dob || !fp.tob || !fp.pob) return null;

    // 2. Pull the cached GoldenMaster chart. getOrBuildChart() short-circuits
    //    on cache hit (chart_cache by birth-hash) — usually <50ms here.
    const { chart } = await getOrBuildChart(
      fp.dob, fp.tob, fp.pob,
      fp.timezone || "+05:30",
      typeof fp.lat === "number" ? fp.lat : undefined,
      typeof fp.lng === "number" ? fp.lng : undefined,
      userEmail ?? undefined,
    );

    return {
      name:          fp.name,
      lagna:         chart.d1.ascendant,
      moonSign:      chart.d1.moonSign,
      moonNakshatra: chart.d1.moonNakshatra,
      sunSign:       chart.d1.sunSign,
      atmakaraka:    chart.karakas?.ak,
      darakaraka:    chart.karakas?.dk,
      mahadasha:     chart.dasha?.mahadasha,
      mahadashaEnd:  chart.dasha?.mahadashaEnd,
      antardasha:    chart.dasha?.antardasha,
      antardashaEnd: chart.dasha?.antardashaEnd,
    };
  } catch (err) {
    console.warn("[suggest-prompts] chart fingerprint lookup failed:", (err as Error)?.message);
    return null;
  }
}

function formatFingerprint(fp: ChartFingerprint | null): string {
  if (!fp) return "Chart fingerprint: unavailable (suggest based on the conversation alone).";
  const lines: string[] = [];
  if (fp.lagna)         lines.push(`Lagna: ${fp.lagna}`);
  if (fp.moonSign)      lines.push(`Moon sign: ${fp.moonSign}` + (fp.moonNakshatra ? ` (Nakshatra: ${fp.moonNakshatra})` : ""));
  if (fp.sunSign)       lines.push(`Sun sign: ${fp.sunSign}`);
  if (fp.atmakaraka)    lines.push(`Atmakaraka (soul lord): ${fp.atmakaraka}`);
  if (fp.darakaraka)    lines.push(`Darakaraka (spouse significator): ${fp.darakaraka}`);
  if (fp.mahadasha)     lines.push(`Active Mahadasha: ${fp.mahadasha}` + (fp.mahadashaEnd ? ` (until ${fp.mahadashaEnd})` : ""));
  if (fp.antardasha)    lines.push(`Active Antardasha: ${fp.antardasha}` + (fp.antardashaEnd ? ` (until ${fp.antardashaEnd})` : ""));
  return lines.join("\n");
}

// ─── Conversation thread formatting ────────────────────────────────────────
function formatHistory(history: { role: string; content: string }[]): string {
  if (!history?.length) return "(no prior turns)";
  return history
    .slice(-6) // last 3 exchanges max
    .map((m, i) => `${i + 1}. ${m.role === "user" ? "USER" : "ORACLE"}: ${(m.content || "").slice(0, 600).replace(/\s+/g, " ").trim()}`)
    .join("\n");
}

// ─── Output post-filter ────────────────────────────────────────────────────
const BANNED = [
  "delve","testament","navigate","landscape","profound","beacon","foster",
  "journey","unlock","ignite","resonate","tapestry","illuminate","cosmos",
  "cosmic","dance","orchestrate","architect","poetry","poetic","amulet",
  "shimmering","weave","woven","realm","embark","myriad","ethereal",
  "whisper","radiant","luminous","vibrant","soulmate","twin flame","destined",
  "the universe","perfect match","puzzle pieces","made for each other",
];
function containsBanned(s: string): boolean {
  const t = s.toLowerCase();
  return BANNED.some(b => t.includes(b));
}
function normalize(s: string): string {
  return s.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim();
}

function postFilter(
  raw: string[],
  exclude: Set<string>,
  topic: keyof typeof FALLBACK_BY_TOPIC,
  fingerprint: ChartFingerprint | null,
): string[] {
  const seen = new Set<string>();
  const cleaned: string[] = [];

  for (const q of raw) {
    if (typeof q !== "string") continue;
    let s = q.replace(/^["'\u201C\u201D]+|["'\u201C\u201D]+$/g, "").trim();
    if (!s) continue;
    if (s.length < 8 || s.length > 140) continue;
    if (containsBanned(s)) continue;
    const key = normalize(s);
    if (seen.has(key)) continue;
    if (exclude.has(key)) continue;
    seen.add(key);
    cleaned.push(s);
    if (cleaned.length >= 4) break;
  }

  // Top up from topic fallbacks if the model under-delivered
  if (cleaned.length < 4) {
    const fb = FALLBACK_BY_TOPIC[topic];
    for (const q of fb) {
      if (cleaned.length >= 4) break;
      const key = normalize(q);
      if (seen.has(key)) continue;
      if (exclude.has(key)) continue;
      seen.add(key);
      cleaned.push(q);
    }
  }

  // Last-resort: pad from "general"
  if (cleaned.length < 4) {
    for (const q of FALLBACK_BY_TOPIC.general) {
      if (cleaned.length >= 4) break;
      const key = normalize(q);
      if (seen.has(key)) continue;
      if (exclude.has(key)) continue;
      seen.add(key);
      cleaned.push(q);
    }
  }

  return cleaned.slice(0, 4);
}

// ─── LLM call ──────────────────────────────────────────────────────────────
async function generateSmartSuggestions(
  recentHistory: { role: string; content: string }[],
  fingerprint: ChartFingerprint | null,
  profileName: string,
  exclude: Set<string>,
): Promise<string[] | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const fpBlock      = formatFingerprint(fingerprint);
  const historyBlock = formatHistory(recentHistory);

  // Render exclusion list compactly so the model sees it but doesn't waste tokens
  const excludeArr   = Array.from(exclude).slice(-12);
  const excludeBlock = excludeArr.length
    ? excludeArr.map((q, i) => `${i + 1}. ${q}`).join("\n")
    : "(none)";

  const firstName = (profileName || "").split(" ")[0] || profileName || "the seeker";

  const prompt = `You are generating 4 follow-up questions for a Vedic astrology chat app.

The questions must build directly on the conversation below AND name the actual placements in this person's chart. They should feel like the next thing ${firstName} would obviously want to ask.

═══════════════════════════════════════════
CHART FINGERPRINT FOR ${firstName.toUpperCase()}
═══════════════════════════════════════════
${fpBlock}

═══════════════════════════════════════════
RECENT CONVERSATION (most recent last)
═══════════════════════════════════════════
${historyBlock}

═══════════════════════════════════════════
ALREADY ASKED OR ALREADY SHOWN — DO NOT REPEAT
═══════════════════════════════════════════
${excludeBlock}

═══════════════════════════════════════════
HARD RULES (any violation = rejection)
═══════════════════════════════════════════
1. Return EXACTLY 4 questions covering FOUR DIFFERENT ANGLES — one per angle:
   • TIMING       — "When will…" / "By when…" / "How soon…"
   • CAUSE        — "Why is this…" / "What is making…"
   • ACTION       — "What should I do…" / "How can I…" / "What practice…"
   • DEEPER LAYER — soul / karma / past-life / hidden truth angle
2. Phrase each in FIRST PERSON, as if ${firstName} is asking ("my", "I", "me").
3. 6 to 14 words per question. Concrete, never vague.
4. Where natural, name a real planet, sign, house, nakshatra, or Dasha lord
   from the fingerprint above (e.g. "my ${fingerprint?.atmakaraka || "Atmakaraka"}",
   "my ${fingerprint?.mahadasha || "current Mahadasha"}",
   "my ${fingerprint?.lagna || "Lagna"}"). Do NOT name placements that aren't
   in the fingerprint.
5. NEVER repeat any question in the "already asked / already shown" list.
6. NEVER use any of these banned words: cosmos, cosmic, dance, tapestry,
   illuminate, journey, navigate, profound, resonate, weave, woven, unlock,
   ignite, embark, realm, soulmate, twin flame, destined, the universe,
   perfect match, beacon, shimmering, ethereal, radiant, luminous, vibrant.
7. No emojis. No quote marks around the questions. No leading numbering.
8. Return ONLY a JSON array of 4 strings. No prose. No markdown fences.

Example shape (do not copy verbatim — generate fresh based on the chart and the conversation):
["When will my Saturn release the 10th house pressure?","Why does this Mahadasha feel like a clearing year?","What one decision in the next 90 days would shift the trajectory?","What does this period demand from my soul?"]`;

  try {
    const gemini = new GoogleGenerativeAI(apiKey);
    const model  = gemini.getGenerativeModel({
      model: "gemini-3.1-flash-lite-preview",
      generationConfig: {
        responseMimeType: "application/json",
        maxOutputTokens: 300,
        temperature: 0.9,
      },
    });

    // Hard 4-second timeout — we never block the chat UI on suggestions
    const llmCall = model.generateContent(prompt);
    const result  = await Promise.race([
      llmCall,
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 4000)),
    ]) as Awaited<typeof llmCall>;

    const raw = result.response.text().trim();
    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
      parsed = JSON.parse(cleaned);
    }
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch (err) {
    console.warn("[suggest-prompts] gemini failed:", (err as Error)?.message);
    return null;
  }
}

// ─── Route handler ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const lastUserMessage      = (body?.lastUserMessage      ?? "").toString();
    const lastAssistantMessage = (body?.lastAssistantMessage ?? "").toString();
    const profileName          = (body?.profileName          ?? "").toString().slice(0, 80);

    // Build recent history. Prefer explicit `recentHistory`. Fall back to the
    // last user/assistant pair if the client only sent that.
    let recentHistory: { role: string; content: string }[] = [];
    if (Array.isArray(body?.recentHistory)) {
      recentHistory = body.recentHistory
        .filter((m: any) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
        .slice(-6);
    }
    if (recentHistory.length === 0) {
      if (lastUserMessage)      recentHistory.push({ role: "user",      content: lastUserMessage });
      if (lastAssistantMessage) recentHistory.push({ role: "assistant", content: lastAssistantMessage });
    }

    // Build the exclusion set (already-asked / already-shown)
    const excludeRaw: string[] = Array.isArray(body?.excludeQuestions)
      ? body.excludeQuestions.filter((s: any) => typeof s === "string")
      : [];
    // Also exclude every USER question already in the conversation
    for (const m of recentHistory) {
      if (m.role === "user") excludeRaw.push(m.content);
    }
    const exclude = new Set<string>(excludeRaw.map(normalize).filter(Boolean));

    // Empty conversation → topic-keyword fallback (still personalised by name)
    if (recentHistory.length === 0) {
      return NextResponse.json({
        suggestions: FALLBACK_BY_TOPIC.general,
        source:      "fallback-empty",
      });
    }

    // Fetch chart fingerprint server-side (cache hit — no extra astrology API calls)
    const fingerprint = await getChartFingerprint(user.id, user.email ?? null);

    const topic = detectTopic([lastUserMessage, lastAssistantMessage, ...recentHistory.map(h => h.content)].join(" "));

    const raw = await generateSmartSuggestions(recentHistory, fingerprint, profileName, exclude);
    const filtered = postFilter(raw ?? [], exclude, topic, fingerprint);

    return NextResponse.json({
      suggestions: filtered,
      source:      raw && raw.length > 0 ? "llm" : "fallback-keyword",
      // Echo the bits of fingerprint we used so debugging is easy
      // (these are the user's own chart values — safe to return to them)
      fingerprintUsed: fingerprint
        ? {
            lagna:        fingerprint.lagna,
            moonSign:     fingerprint.moonSign,
            atmakaraka:   fingerprint.atmakaraka,
            mahadasha:    fingerprint.mahadasha,
            antardasha:   fingerprint.antardasha,
          }
        : null,
    });
  } catch (err: any) {
    console.error("[suggest-prompts] error:", err);
    return NextResponse.json({
      suggestions: FALLBACK_BY_TOPIC.general,
      source:      "fallback-error",
    });
  }
}
