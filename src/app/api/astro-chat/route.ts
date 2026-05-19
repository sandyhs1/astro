import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getOrBuildChart } from "@/lib/astrology/manager";
import { buildClaudeContext, ASTRO_SYSTEM_PROMPT, generateSuggestedPrompts, detectTopic } from "@/lib/astrology/prompts";
import { buildPredictionContext } from "@/lib/astrology/prediction-engine";
import { routeLLM, gatekeeperCheck } from "@/lib/astrology/llm-router";
import { getCurrentGochar } from "@/lib/astrology/gochar";
import { getRelevantScriptures } from "@/lib/astrology/rag";
// Freemius import removed — billing is via Razorpay credits in user_profiles

// Service-role client — bypasses RLS for persistent chat saving
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// INR pricing (per 1K tokens) — used for cost tracking in admin dashboard
// ✅ PRIMARY: Claude Sonnet 4.6 | ✅ FALLBACK: Gemini 3.1 Pro | ⛔ BANNED: Claude 3.7
const PRICE = {
  "bedrock/us.anthropic.claude-sonnet-4-6": { in: 0.252,  out: 1.26  },
  "bedrock/claude-3-7-sonnet":               { in: 0.252,  out: 1.26  },
  "gemini/gemini-3.1-pro-preview":           { in: 0.105,  out: 0.42  },
  "gemini/gemini-3.1-flash-lite":    { in: 0.0063, out: 0.0063 },
} as Record<string, { in: number; out: number }>;
const ASTRO_CALL_COST_INR = 0.084;

// Credit value for admin tracking only
const CREDIT_VALUE_INR = 35.98; // ₹1,799 ÷ 50 credits

// ── CREDIT DEDUCTION TIERS (simple rounded numbers) ───────────────────────────
// Tier 1 — Simple question / follow-up:      1 credit  (₹35.98 revenue vs ~₹5 cost)
// Tier 2 — Substantive life prediction:       2 credits (₹71.96 revenue vs ~₹8 cost)
// Users can ask as many questions as credits allow. No daily/monthly limits.
const TIER_SIMPLE      = 1;  // whole number
const TIER_SUBSTANTIVE = 2;  // whole number

function calcCostInr(model: string, tokIn: number, tokOut: number): number {
  const p = PRICE[model] || { in: 0.252, out: 1.26 };
  return (tokIn / 1000) * p.in + (tokOut / 1000) * p.out;
}

export async function POST(req: Request) {
  try {
    const { message, profileId, history, lat, lon } = await req.json();
    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // ── Auth ──────────────────────────────────────────────────────────────────
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Astrologer Bypass ───────────────────────────────────────────────────
    const { data: isAstrologer } = await supabaseAdmin
      .from('astrologers')
      .select('id, status')
      .eq('id', user.id)
      .eq('status', 'approved')
      .maybeSingle();

    // ── Access Control: Credits-based (Razorpay) ─────────────────────────────
    // Astrologers get unlimited access; all other users are gated by credits.
    // The credits check below handles the zero-credits case.

    // ── Credits Check ─────────────────────────────────────────────────────────
    const { data: userProfile } = await supabase
      .from("user_profiles").select("*").eq("id", user.id).single();

    const credits = userProfile?.credits ?? 0;
    if (credits <= 0) {
      return NextResponse.json({
        systemWarning: "Your AI Credits are currently depleted. Please top up your credits for immediate access, or wait until your next billing cycle to continue your destiny reading.",
        creditsRemaining: 0,
      });
    }

    // ── Gatekeeper (fast Gemini Flash — no cost) ──────────────────────────────
    // BYPASS: short conversational replies (≤20 chars) OR common affirmatives
    // These are follow-ups to the AI's own questions — blocking them breaks UX.
    const trimmed = message.trim().toLowerCase();
    const isShortReply = message.trim().length <= 20;
    const isAffirmative = ["yes","no","ok","okay","sure","go on","go ahead",
      "tell me","please","continue","more","yes please","absolutely",
      "of course","definitely","yeah","yep","yup","nope","tell me more",
      "what does it mean","explain","and","so","then","next",
    ].some(a => trimmed === a || trimmed.startsWith(a+" ") || trimmed.endsWith(" "+a));

    // Also bypass if there is existing history (mid-conversation follow-up)
    const hasPriorContext = history && history.length > 0;

    if (!isShortReply && !isAffirmative && !hasPriorContext) {
      const gate = await gatekeeperCheck(message);
      if (!gate.allowed) {
        return NextResponse.json({
          systemWarning: gate.reason,
          creditsRemaining: credits,
        });
      }
    } else if (!isShortReply && !isAffirmative && hasPriorContext) {
      // Mid-conversation: still gate but be lenient — allow if related to prior AI response
      const gate = await gatekeeperCheck(message);
      if (!gate.allowed) {
        return NextResponse.json({
          systemWarning: gate.reason,
          creditsRemaining: credits,
        });
      }
    }

    // ── Resolve Birth Details ─────────────────────────────────────────────────
    let dob: string | undefined, tob: string | undefined,
        pob: string | undefined, tz = "+05:30", pName = "User", gender = "Male";

    let isAstroClient = false;
    if (!profileId || profileId === "self") {
      // PRIMARY: family_profiles (Self relationship) — this is where dashboard saves data
      const { data: fp } = await supabase
        .from("family_profiles").select("*")
        .eq("user_id", user.id).eq("relationship", "Self").maybeSingle();
      if (fp) {
        dob = fp.dob; tob = fp.tob; pob = fp.pob;
        tz  = fp.timezone || "+05:30";
        pName = fp.name || user.email?.split("@")[0] || "User";
        gender = fp.gender || "Male";
      } else {
        // FALLBACK: onboarding_leads (legacy path)
        const { data: lead } = await supabase
          .from("onboarding_leads").select("*").ilike("email", user.email ?? "").maybeSingle();
        dob = lead?.dob; tob = lead?.tob; pob = lead?.pob;
        tz  = lead?.timezone || "+05:30";
        pName = lead?.name || user.email?.split("@")[0] || "User";
        gender = lead?.gender || "Male";
      }
    } else {
      let { data: fp } = await supabase
        .from("family_profiles").select("*").eq("id", profileId).maybeSingle();
      
      if (!fp) {
        const { data: astroClient } = await supabase
          .from("astrologer_clients").select("*").eq("id", profileId).maybeSingle();
        fp = astroClient;
        if (astroClient) isAstroClient = true;
      }

      dob = fp?.dob; tob = fp?.tob; pob = fp?.pob;
      tz  = fp?.timezone || "+05:30";
      pName = fp?.name || "Client/Member";
      gender = fp?.gender || "Male";
    }

    if (!dob || !tob || !pob) {
      return NextResponse.json({
        error: "Birth details not found. Please complete your profile first.",
      }, { status: 422 });
    }

    // ── Get or Build GoldenMasterJSON ─────────────────────────────────────────
    const { chart, fromCache } = await getOrBuildChart(
      dob, tob, pob, tz,
      lat ? Number(lat) : undefined,
      lon ? Number(lon) : undefined,
      user.email,
    );

    // ── Validate Chart Completeness ───────────────────────────────────────────
    if (!chart.d1.ascendant) {
      return NextResponse.json({
        error: "Chart generation failed — Lagna missing. Verify birth details.",
        confidence: chart.confidence,
      }, { status: 422 });
    }

    const REQUIRED = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
    const missing  = REQUIRED.filter(n => !chart.d1.planets.find(p => p.name.toLowerCase() === n.toLowerCase()));
    if (missing.length > 0) {
      return NextResponse.json({
        error: `Chart incomplete — missing planets: ${missing.join(", ")}`,
        confidence: chart.confidence,
      }, { status: 422 });
    }

    // ── Build Grandmaster Context (topic-aware divisional chart injection) ────
    const jyotishTopic = detectTopic(message);
    // Fetch today's live sidereal transit positions (auto-calculated, no manual updates)
    const gocharSnapshot = getCurrentGochar();
    const chartContext = buildClaudeContext(chart, pName, jyotishTopic, gocharSnapshot);
    const predictionContext = buildPredictionContext(chart, jyotishTopic, message);

    // ── RAG: Fetch Authoritative Scriptural References ────────────────────────
    const scripturalReferences = await getRelevantScriptures(message);

    // Detect first message — inject Namaste instruction
    const isFirstMessage = !history || history.length === 0;
    const namasteInstruction = isFirstMessage
      ? `\n\nIMPORTANT: This is ${pName}'s FIRST message. Begin your response with exactly: "Namaste ${pName} 🙏" on its own line, then answer.`
      : "";
      
    const genderContext = `\n[GENDER CONTEXT: The native is ${gender}. Adapt the Vedic astrological interpretations, relationship karakas, and timeline predictions accordingly.]\n`;

    const antiHallucinationInstruction = `
═══════════════════════════════════════════════════════════════
MANDATORY PREDICTION LAWS (ANTI-HALLUCINATION)
═══════════════════════════════════════════════════════════════
1. You MUST use the Scriptural References provided above if they exist. 
2. NEVER hallucinate or assume astrological rules. If a rule contradicts another, use your profound logical judgment as a Grand Master, but explicitly state your reasoning based on the provided texts.
3. Your predictions must be flawlessly accurate, citing solid proofs and logic from the provided texts and the verified chart data.`;

    // Full system prompt = persona + prediction engine + cached chart data
    const fullSystemPrompt = `${ASTRO_SYSTEM_PROMPT}${namasteInstruction}${genderContext}

${predictionContext}

═══════════════════════════════════════════════════════════════
VERIFIED CHART DATA — ${pName} (${gender})
═══════════════════════════════════════════════════════════════
${chartContext}
═══════════════════════════════════════════════════════════════
${scripturalReferences}
${antiHallucinationInstruction}`;

    // ── Sentiment Detection — 4-State Emotional Calibration ──────────────────
    // Detects the user's primary emotional state and injects the appropriate
    // framing instruction so the LLM opens with the right tone (Enhancement 3).
    const msgLower = message.toLowerCase();
    const recentHistory = (history || []).slice(-6).map((h:any)=>h.content).join(" ").toLowerCase();
    const combinedText = msgLower + " " + recentHistory;

    let sentimentInstruction = "";

    // ── STATE 1: GRIEF / LOSS ─────────────────────────────────────────────────
    if (/died|death|passed away|lost my|grief|mourning|funeral|gone forever|he is gone|she is gone/.test(combinedText)) {
      sentimentInstruction = `\n\n[EMOTIONAL STATE: GRIEF] The user is carrying the weight of loss or grief. Open with genuine human compassion — one sentence that acknowledges their pain before any chart data. The karmic reading must bring meaning and peace, not statistics. Use the Quantum Shift Protocol to show the soul-level significance of this moment. This is sacred ground.`;

    // ── STATE 1b: Newborn with complications ─────────────────────────────────
    } else if (/baby|born|birth|delivered|son|daughter|newborn|child arrived|blessed/.test(combinedText) &&
               /sick|ill|hospital|icu|nicu|complication|difficult|worried/.test(combinedText)) {
      sentimentInstruction = `\n\n[EMOTIONAL STATE: GRIEF/ANXIETY] The user is sharing news about a newborn with health complications. Lead with deep empathy before any astrological reading. Be gentle and human first, Grand Master Jyotishi second.`;

    // ── STATE 1c: Relationship loss / separation ─────────────────────────────
    } else if (/divorce|separated|breakup|broke up|left me|cheated|affair|heartbreak|he left|she left/.test(combinedText)) {
      sentimentInstruction = `\n\n[EMOTIONAL STATE: GRIEF] The user is moving through the pain of separation or heartbreak. Acknowledge the emotional weight with genuine compassion before analysing the chart. Do not be clinical. Be the compassionate elder who sees the karmic meaning behind the pain. Apply Quantum Shift Protocol.`;

    // ── STATE 2: ANXIETY / FEAR ───────────────────────────────────────────────
    } else if (/depressed|anxious|scared|terrified|hopeless|giving up|can't go on|suicidal|no hope|i'm afraid|what if|worried|panicking|i don't know what/.test(combinedText)) {
      sentimentInstruction = `\n\n[EMOTIONAL STATE: ANXIETY/DISTRESS] The user is in a state of fear or anxiety. Open with a STABILIZING HAND — one sentence of certainty and grounding before the chart reading. Lead with what the chart CONFIRMS, not what it questions. If distress level is severe (suicidal/hopeless language), acknowledge their pain with warmth and close with: "The chart shows the energy; your choices shape the outcome. Please speak to a qualified professional immediately." Apply the Sensitive Topic Protocol.`;

    // ── STATE 3: SKEPTICISM / DOUBT ───────────────────────────────────────────
    } else if (/does this even work|i don't believe|prove it|are you sure|is astrology real|test this|show me|i'm skeptical|i'm not sure about this|can you actually/.test(combinedText)) {
      sentimentInstruction = `\n\n[EMOTIONAL STATE: SKEPTICISM] The user is doubting or testing. Do NOT respond with mysticism or persuasion. Open immediately with the most specific, verifiable data point in their chart (exact degree, nakshatra, a past event their Dasha confirms). Let the precision do the convincing. Earn trust with accuracy, not charisma.`;

    // ── STATE 4: HOPE / EXCITEMENT ────────────────────────────────────────────
    } else if (/hopeful|excited|can't wait|will it happen|is it coming|i feel like|i think this is my time|feels like something is changing|finally|so close/.test(combinedText)) {
      sentimentInstruction = `\n\n[EMOTIONAL STATE: HOPE/EXCITEMENT] The user is riding a wave of hope or excitement. Match and elevate their energy. Validate the instinct first — if the chart confirms it, celebrate it with them. If the timing needs correcting, do it gently but honestly. Show them exactly which chart factor their feeling is coming from.`;

    // ── STATE 5: CELEBRATION ──────────────────────────────────────────────────
    } else if (/got the job|promotion|married|engaged|new house|achieved|succeeded|won|cleared|passed|just got|great news|amazing news|baby is born|child arrived/.test(combinedText)) {
      sentimentInstruction = `\n\n[EMOTIONAL STATE: CELEBRATION] The user is sharing a victory or milestone. Celebrate genuinely with them before connecting it to the chart. Show how their chart always pointed to this exact moment — make them feel seen and confirmed.`;
    }

    const fullSystemPromptWithSentiment = sentimentInstruction
      ? fullSystemPrompt + sentimentInstruction
      : fullSystemPrompt;

    // Build message history (last 20 turns — full context memory per Enhancement 5)
    // 20 turns = ~10 full back-and-forth exchanges, sufficient for complete session memory
    const messages = [
      ...(history || []).slice(-20).map((h: any) => ({
        role: h.role as "user" | "assistant",
        content: h.content,
      })),
      { role: "user" as const, content: message },
    ];

    // ── CREDIT TIER DETECTION ────────────────────────────────────────────────────
    // Tier 1 (1 credit):  short / follow-up / conversational questions
    // Tier 2 (2 credits): substantive life predictions (marriage, career, wealth etc.)
    const PREDICTION_TOPICS = ['marriage','spouse','partner','career','job','wealth','money',
      'finance','children','child','property','house','land','travel','abroad','foreign',
      'health','sick','illness','business','promotion','education','spiritual','legal',
      'court','debt','vehicle','sibling','parent','divorce','love','relationship','when will',
      'when do','will i','will i get','will i meet','will i have','when am i','my future'];
    const msgLc = message.toLowerCase();
    const isSubstantivePrediction = message.trim().length > 25 &&
      PREDICTION_TOPICS.some(kw => msgLc.includes(kw));

    const creditsToDeduct = isSubstantivePrediction ? TIER_SUBSTANTIVE : TIER_SIMPLE; // 2 or 1
    const maxTokens       = isSubstantivePrediction ? 3500 : 1800;

    // Guard: user must have enough credits for this tier
    if (credits < creditsToDeduct) {
      return NextResponse.json({
        error: credits < TIER_SIMPLE
          ? `You have ${credits} credit${credits === 1 ? '' : 's'} remaining. Please top up to continue.`
          : `This prediction costs 2 credits. You have ${credits} credit left — enough for a simple follow-up question only.`,
        creditsRemaining: credits,
      }, { status: 402 });
    }

    const llmResult = await routeLLM(fullSystemPromptWithSentiment, messages, maxTokens);

    // ── DEDUCT CREDITS (clean whole number) ─────────────────────────────────────
    const newCredits = Math.max(0, credits - creditsToDeduct); // always whole number
    await supabase
      .from("user_profiles")
      .update({ credits: newCredits })
      .eq("id", user.id);

    // ── Log LLM Usage (fire-and-forget) ──────────────────────────────────────
    // cost_inr     = real INR spent on LLM (for admin actual-cost tracking)
    // credits_used = whole number deducted from user (1 or 2)
    const costInr = calcCostInr(llmResult.model, llmResult.tokensIn, llmResult.tokensOut);
    const actualCreditCost = parseFloat((costInr / CREDIT_VALUE_INR).toFixed(4));
    supabaseAdmin.from("token_usage_logs").insert({
      user_id:          user.id,
      model_name:       llmResult.model,
      input_tokens:     llmResult.tokensIn,
      output_tokens:    llmResult.tokensOut,
      total_tokens:     llmResult.tokensIn + llmResult.tokensOut,
      cost_inr:         costInr.toFixed(6),
      credits_used:     creditsToDeduct,   // 1 or 2 — clean whole number charged to user
      question_preview: message.slice(0, 100),
      usage_type:       isAstroClient ? 'astrologer' : 'user'
    });

    // ── Log AstrologyAPI Call (fire-and-forget) ───────────────────────────────
    supabaseAdmin.from("astroapi_logs").insert({
      user_id:    user.id,
      endpoint:   "batch_chart",
      from_cache: fromCache,
      cost_inr:   fromCache ? 0 : ASTRO_CALL_COST_INR,
      usage_type: isAstroClient ? 'astrologer' : 'user'
    });

    // ── PERSIST CHAT MESSAGES TO SUPABASE ────────────────────────────────────
    // Always resolve the actual profile UUID — never leave it null.
    // When profileId === "self", look up the Self family_profile for this user.
    let persistProfileId: string | null = null;
    if (!profileId || profileId === "self") {
      const { data: selfProfile } = await supabaseAdmin
        .from("family_profiles")
        .select("id")
        .eq("user_id", user.id)
        .eq("relationship", "Self")
        .maybeSingle();
      persistProfileId = selfProfile?.id ?? null;
    } else {
      persistProfileId = profileId;
    }

    if (persistProfileId) {
      const msgDataUser: any = { user_id: user.id, role: "user", content: message };
      const msgDataAsst: any = { user_id: user.id, role: "assistant", content: llmResult.text };
      
      if (isAstroClient) {
        msgDataUser.astrologer_client_id = persistProfileId;
        msgDataAsst.astrologer_client_id = persistProfileId;
      } else {
        msgDataUser.profile_id = persistProfileId;
        msgDataAsst.profile_id = persistProfileId;
      }

      const { error: chatSaveErr } = await supabaseAdmin.from("chat_messages").insert([
        msgDataUser,
        msgDataAsst,
      ]);
      if (chatSaveErr) {
        console.error("[CHAT] ❌ Failed to save messages:", chatSaveErr.message, chatSaveErr.code, chatSaveErr.details);
      } else {
        console.log("[CHAT] ✅ Messages saved for profile:", persistProfileId);
      }
    } else {
      console.warn("[CHAT] ⚠️ No valid profileId — messages NOT saved.");
    }

    // ── Generate Suggested Prompts ────────────────────────────────────────────
    const suggestedPrompts = generateSuggestedPrompts(message, llmResult.text);

    // ── Response ──────────────────────────────────────────────────────────────
    return NextResponse.json({
      reply:            llmResult.text,
      model:            llmResult.model,
      usedFallback:     llmResult.usedFallback,
      creditsRemaining: newCredits,
      chartCached:      fromCache,
      confidence:       chart.confidence.score,
      suggestedPrompts,
      marker:           llmResult.model.includes("claude") ? "A" : llmResult.model.includes("pro") ? "B" : "C",
      usage: {
        tokensIn:        llmResult.tokensIn,
        tokensOut:       llmResult.tokensOut,
        actualCostInr:   parseFloat(costInr.toFixed(4)),
        actualCredits:   parseFloat(actualCreditCost.toFixed(4)),  // real cost in credits
        creditsDeducted: creditsToDeduct,                          // 2× — what user was charged
      },
    });

  } catch (err: any) {
    console.error("Astro Chat Error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
