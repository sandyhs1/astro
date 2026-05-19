import { NextResponse } from "next/server";
import { generateSuggestedPrompts } from "@/lib/astrology/prompts";
import { streamLLM, type StreamChunk } from "@/lib/astrology/llm-router";
import {
  prepareChatRequest,
  finalizeChatRequest,
  calcCostInr,
  CREDIT_VALUE_INR,
} from "@/lib/astrology/chat-pipeline";

/**
 * /api/astro-chat/stream — Server-Sent Events streaming endpoint.
 *
 * Yields:
 *   event: delta     data: {"text":"..."}              ← incremental text deltas
 *   event: meta      data: {"creditsRemaining": ...,   ← final metadata after completion
 *                            "model": ..., "marker":...,
 *                            "suggestedPrompts":[...]}
 *   event: warning   data: {"systemWarning":"..."}     ← gatekeeper / out-of-credits
 *   event: error     data: {"error":"..."}             ← terminal error
 *
 * The dashboard consumes deltas as they arrive and renders the answer in real
 * time. The auto-continue-on-truncation logic from the JSON endpoint is
 * preserved: when a stream finishes with stopReason "max_tokens", the route
 * silently issues a continuation stream and keeps emitting deltas — the user
 * sees one seamless answer.
 *
 * Runtime: nodejs (the AWS Bedrock SDK requires it; the edge runtime cannot
 * stream from Bedrock cleanly today).
 */
export const runtime = "nodejs";

function sseEvent(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const prep = await prepareChatRequest(body as Record<string, unknown>);

  if (prep.kind === "error") {
    return NextResponse.json(prep.body, { status: prep.status });
  }

  // For the warning case, we still return SSE so the client can use a single
  // EventSource handler. One "warning" event, then close.
  if (prep.kind === "warning") {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(sseEvent("warning", prep.body)));
        controller.close();
      },
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection":    "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  }

  const { ctx } = prep;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // Aggregated state across primary + (optional) continuation stream.
      let aggregatedText = "";
      let totalIn = 0;
      let totalOut = 0;
      let lastModel = "unknown";
      let lastStopReason: string | undefined;

      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(sseEvent(event, data)));
      };

      // Periodic comment heartbeat keeps proxies from buffering / closing the
      // connection during long pauses between deltas.
      const heartbeat = setInterval(() => {
        try { controller.enqueue(encoder.encode(": ping\n\n")); } catch { /* closed */ }
      }, 15_000);

      const consumeStream = async (
        sysPrompt: string,
        msgs: { role: "user" | "assistant"; content: string }[],
        budget: number,
      ): Promise<void> => {
        for await (const chunk of streamLLM(sysPrompt, msgs, budget) as AsyncGenerator<StreamChunk>) {
          if (chunk.type === "delta" && chunk.text) {
            aggregatedText += chunk.text;
            send("delta", { text: chunk.text });
          } else if (chunk.type === "done") {
            totalIn        += chunk.tokensIn  ?? 0;
            totalOut       += chunk.tokensOut ?? 0;
            lastModel       = chunk.model      ?? lastModel;
            lastStopReason  = chunk.stopReason;
          } else if (chunk.type === "error") {
            send("error", { error: chunk.error || "stream failed" });
            throw new Error(chunk.error || "stream failed");
          }
        }
      };

      try {
        // ── Primary stream ────────────────────────────────────────────────
        await consumeStream(ctx.fullSystemPrompt, ctx.messages, ctx.maxTokens);

        // ── Auto-continue on truncation ───────────────────────────────────
        if (lastStopReason === "max_tokens") {
          console.warn(`⚠️ [CHAT-STREAM] Truncated at maxTokens=${ctx.maxTokens}. Auto-continuing once…`);
          try {
            const continuationMsgs = [
              ...ctx.messages,
              { role: "assistant" as const, content: aggregatedText },
              { role: "user"      as const, content: "Continue exactly where you left off. Do NOT repeat or restart anything you already wrote. Do NOT re-introduce any section. Pick up mid-sentence if needed and finish the response cleanly." },
            ];
            await consumeStream(ctx.fullSystemPrompt, continuationMsgs, Math.min(ctx.maxTokens, 1500));
            console.log(`✅ [CHAT-STREAM] Continuation merged. Final stopReason=${lastStopReason}`);
          } catch (contErr) {
            const msg = contErr instanceof Error ? contErr.message : String(contErr);
            console.warn(`⚠️ [CHAT-STREAM] Continuation failed (${msg.slice(0, 80)}).`);
          }
        }

        // ── Finalize: credits, persistence, suggestions ───────────────────
        const { newCredits, costInr } = await finalizeChatRequest({
          ctx,
          finalText: aggregatedText,
          model:     lastModel,
          tokensIn:  totalIn,
          tokensOut: totalOut,
        });
        const suggestedPrompts = generateSuggestedPrompts(ctx.message, aggregatedText);
        const actualCreditCost = parseFloat((costInr / CREDIT_VALUE_INR).toFixed(4));

        send("meta", {
          creditsRemaining: newCredits,
          model:            lastModel,
          marker:           lastModel.includes("claude") ? "A" : lastModel.includes("pro") ? "B" : "C",
          chartCached:      ctx.fromCache,
          confidence:       ctx.chartConfidence,
          suggestedPrompts,
          usage: {
            tokensIn:        totalIn,
            tokensOut:       totalOut,
            actualCostInr:   parseFloat(costInr.toFixed(4)),
            actualCredits:   actualCreditCost,
            creditsDeducted: ctx.creditsToDeduct,
          },
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "stream error";
        console.error("[CHAT-STREAM] error:", err);
        try { send("error", { error: msg }); } catch { /* already closed */ }
      } finally {
        clearInterval(heartbeat);
        try { controller.close(); } catch { /* already closed */ }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type":      "text/event-stream; charset=utf-8",
      "Cache-Control":     "no-cache, no-transform",
      "Connection":        "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
