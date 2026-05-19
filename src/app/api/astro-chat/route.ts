import { NextResponse } from "next/server";
import { generateSuggestedPrompts } from "@/lib/astrology/prompts";
import { routeLLM } from "@/lib/astrology/llm-router";
import { prepareChatRequest, finalizeChatRequest, calcCostInr, CREDIT_VALUE_INR } from "@/lib/astrology/chat-pipeline";

/**
 * /api/astro-chat — one-shot JSON response.
 *
 * The /stream sibling endpoint serves the same logic over Server-Sent Events
 * for live token-by-token rendering. Both endpoints share prepareChatRequest()
 * and finalizeChatRequest() so they cannot drift.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prep = await prepareChatRequest(body);

    if (prep.kind === "error")   return NextResponse.json(prep.body, { status: prep.status });
    if (prep.kind === "warning") return NextResponse.json(prep.body);

    const { ctx } = prep;

    let llmResult = await routeLLM(ctx.fullSystemPrompt, ctx.messages, ctx.maxTokens);

    // ── AUTO-CONTINUE ON TRUNCATION ──────────────────────────────────────────
    // If the model hit max-tokens, auto-issue one continuation call and stitch
    // the result onto the original. Capped at one retry.
    if (llmResult.stopReason === "max_tokens") {
      console.warn(`⚠️ [CHAT] Truncated at maxTokens=${ctx.maxTokens}. Auto-continuing once…`);
      try {
        const continuationMessages = [
          ...ctx.messages,
          { role: "assistant" as const, content: llmResult.text },
          { role: "user"      as const, content: "Continue exactly where you left off. Do NOT repeat or restart anything you already wrote. Do NOT re-introduce any section. Pick up mid-sentence if needed and finish the response cleanly." },
        ];
        const continuationBudget = Math.min(ctx.maxTokens, 1500);
        const cont = await routeLLM(ctx.fullSystemPrompt, continuationMessages, continuationBudget);
        llmResult = {
          ...llmResult,
          text:        llmResult.text + cont.text,
          tokensIn:    llmResult.tokensIn + cont.tokensIn,
          tokensOut:   llmResult.tokensOut + cont.tokensOut,
          stopReason:  cont.stopReason,
          usedFallback: llmResult.usedFallback || cont.usedFallback,
        };
        console.log(`✅ [CHAT] Continuation merged. Final stopReason=${cont.stopReason} | total out tokens=${llmResult.tokensOut}`);
      } catch (contErr) {
        const msg = contErr instanceof Error ? contErr.message : String(contErr);
        console.warn(`⚠️ [CHAT] Continuation failed (${msg.slice(0, 80)}). Using truncated reply.`);
      }
    }

    // ── Post-call: deduct credits, log usage, persist messages ──────────────
    const { newCredits, costInr } = await finalizeChatRequest({
      ctx,
      finalText: llmResult.text,
      model:     llmResult.model,
      tokensIn:  llmResult.tokensIn,
      tokensOut: llmResult.tokensOut,
    });

    const actualCreditCost = parseFloat((costInr / CREDIT_VALUE_INR).toFixed(4));
    const suggestedPrompts = generateSuggestedPrompts(ctx.message, llmResult.text);

    return NextResponse.json({
      reply:            llmResult.text,
      model:            llmResult.model,
      usedFallback:     llmResult.usedFallback,
      creditsRemaining: newCredits,
      chartCached:      ctx.fromCache,
      confidence:       ctx.chartConfidence,
      suggestedPrompts,
      marker:           llmResult.model.includes("claude") ? "A" : llmResult.model.includes("pro") ? "B" : "C",
      usage: {
        tokensIn:        llmResult.tokensIn,
        tokensOut:       llmResult.tokensOut,
        actualCostInr:   parseFloat(costInr.toFixed(4)),
        actualCredits:   actualCreditCost,
        creditsDeducted: ctx.creditsToDeduct,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    console.error("Astro Chat Error:", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
// Re-export calcCostInr to keep any external imports working (none currently, but defensive).
export { calcCostInr };
