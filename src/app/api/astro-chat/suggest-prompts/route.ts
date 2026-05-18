/**
 * /api/astro-chat/suggest-prompts
 *
 * Generates 4 hyper-personalized follow-up question suggestions for the
 * Oracle Chat panel.  Pure UX helper — does NOT consume astrology credits,
 * does NOT touch the chart-build pipeline, and falls back to keyword-based
 * static chips on any failure.
 *
 * Input:
 *   {
 *     lastUserMessage?: string,
 *     lastAssistantMessage?: string,
 *     profileName?: string,
 *     historyTopics?: string[]   // optional, for variety
 *   }
 *
 * Output:
 *   { suggestions: string[] }    // exactly 4 items
 *
 * Model: Gemini 3.1 Flash Lite (~₹0.006/1K tokens). Worst-case cost per call
 * is well under ₹0.05 — effectively free for the user.
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ─── Static fallback chips (used if the model fails / times out) ────────────
const FALLBACK_BY_TOPIC: Record<string, string[]> = {
  career: [
    "When is my next big career window?",
    "Which Dasha lord is shaping my work life now?",
    "Should I pivot or double down on my current path?",
    "What does my D10 reveal about my professional peak?",
  ],
  relationship: [
    "When will I meet someone karmically aligned?",
    "What does my D9 say about my future spouse?",
    "Which patterns keep showing up in my relationships?",
    "Is the bond I'm in right now soul-level real?",
  ],
  finance: [
    "When does my next wealth-building window open?",
    "Which house in my chart governs my income?",
    "What is the karmic root of my money pattern?",
    "How will the next Dasha shift my finances?",
  ],
  health: [
    "Which area of health needs my attention right now?",
    "What does my 6th house say about recurring issues?",
    "Which daily practice would actually help my chart?",
    "When does my Pranapada Lagna activate this year?",
  ],
  spiritual: [
    "What is my Atmakaraka teaching me right now?",
    "Which mantra fits my chart precisely?",
    "What is my soul-level mission this lifetime?",
    "What does my D60 say about my past-life karma?",
  ],
  family: [
    "What does my 4th house say about my home life?",
    "How does my chart describe my mother's influence?",
    "What is the karmic thread with my father?",
    "When does family dynamics shift for me next?",
  ],
  general: [
    "What is the biggest opportunity in my next 3 years?",
    "Which of my planets is doing the heaviest lifting?",
    "What hidden strengths does my chart reveal?",
    "Which Mahadasha is about to reshape my life?",
  ],
};

function detectTopic(text: string): keyof typeof FALLBACK_BY_TOPIC {
  const t = (text || "").toLowerCase();
  if (/career|job|work|business|promotion|profession/.test(t)) return "career";
  if (/marriag|spouse|partner|love|relation|breakup|divorce|dating/.test(t)) return "relationship";
  if (/money|wealth|financ|income|debt|invest|salary/.test(t))     return "finance";
  if (/health|illness|body|energy|vitality|sick|disease/.test(t))  return "health";
  if (/spirit|mantra|meditation|dharma|moksha|soul|karma|past.life/.test(t)) return "spiritual";
  if (/mother|father|parent|family|home|child|sibling/.test(t))    return "family";
  return "general";
}

function fallbackChips(messages: string[]): string[] {
  const combined = messages.filter(Boolean).join(" ");
  const topic    = detectTopic(combined);
  return FALLBACK_BY_TOPIC[topic].slice(0, 4);
}

// ─── Auth helper ────────────────────────────────────────────────────────────
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

// ─── LLM helper ─────────────────────────────────────────────────────────────
async function generateSmartSuggestions(
  lastUserMessage: string,
  lastAssistantMessage: string,
  profileName: string,
): Promise<string[] | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const prompt = `You are generating short, punchy follow-up questions for a Vedic astrology chat app.

CONTEXT:
- The user asking is "${profileName}".
- Their last message: """${lastUserMessage.slice(0, 600)}"""
- The astrologer's last reply: """${lastAssistantMessage.slice(0, 1200)}"""

YOUR TASK:
Generate exactly 4 follow-up questions that ${profileName} would naturally want to ask next. They must:
- Build directly on the conversation above (no generic horoscope questions).
- Be phrased in first person ("my", "I", "me") as if ${profileName} is asking.
- Be concrete and specific — never vague, never "tell me more".
- Stay between 6 and 14 words.
- Cover slightly different angles (timing, reason, action, deeper layer).
- Use natural English — NEVER use these banned words: cosmos, cosmic, dance, tapestry, illuminate, journey, navigate, profound, resonate, weave, woven, unlock, ignite, embark, realm, soulmate, twin flame, destined, the universe, perfect match, beacon, shimmering.
- Do NOT include emojis or quote marks.

Return ONLY a JSON array of 4 strings. No other text. No markdown.

Example output format:
["Question one here?","Question two here?","Question three here?","Question four here?"]`;

  try {
    const gemini = new GoogleGenerativeAI(apiKey);
    const model  = gemini.getGenerativeModel({
      model: "gemini-3.1-flash-lite-preview",
      generationConfig: {
        responseMimeType: "application/json",
        maxOutputTokens: 240,
        temperature: 0.85,
      },
    });

    // 4-second hard timeout — never block the chat UI on suggestions
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
      // Sometimes the model wraps the JSON in code fences despite the mime type
      const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
      parsed = JSON.parse(cleaned);
    }

    if (!Array.isArray(parsed)) return null;
    const cleaned = parsed
      .filter((q: any) => typeof q === "string")
      .map((q: string) => q.replace(/^["'\u201C\u201D]+|["'\u201C\u201D]+$/g, "").trim())
      .filter((q: string) => q.length > 0)
      .slice(0, 4);

    if (cleaned.length < 2) return null;
    // If the model returned fewer than 4, pad with topic-appropriate fallbacks
    if (cleaned.length < 4) {
      const fb = fallbackChips([lastUserMessage, lastAssistantMessage]);
      for (const q of fb) {
        if (cleaned.length >= 4) break;
        if (!cleaned.includes(q)) cleaned.push(q);
      }
    }
    return cleaned.slice(0, 4);
  } catch (err) {
    console.warn("[suggest-prompts] gemini failed:", (err as Error)?.message);
    return null;
  }
}

// ─── Route ──────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const lastUserMessage      = (body?.lastUserMessage      ?? "").toString();
    const lastAssistantMessage = (body?.lastAssistantMessage ?? "").toString();
    const profileName          = (body?.profileName          ?? "the seeker").toString().slice(0, 80);

    // Empty pair → fall back to general chips
    if (!lastUserMessage.trim() && !lastAssistantMessage.trim()) {
      return NextResponse.json({
        suggestions: FALLBACK_BY_TOPIC.general,
        source:      "fallback-empty",
      });
    }

    const smart = await generateSmartSuggestions(lastUserMessage, lastAssistantMessage, profileName);
    if (smart && smart.length > 0) {
      return NextResponse.json({ suggestions: smart, source: "llm" });
    }

    return NextResponse.json({
      suggestions: fallbackChips([lastUserMessage, lastAssistantMessage]),
      source:      "fallback-keyword",
    });
  } catch (err: any) {
    console.error("[suggest-prompts] error:", err);
    // Never break the UI — always return something
    return NextResponse.json({
      suggestions: FALLBACK_BY_TOPIC.general,
      source:      "fallback-error",
    });
  }
}
