/**
 * LLM ROUTER
 *
 * Primary  : Claude Sonnet 4.6 (AWS Bedrock — requires IAM access key + secret)
 * Fallback : Gemini 3.1 Pro (Google AI SDK)
 * Gatekeeper: Gemini 3.1 Flash Lite (cheap + fast)
 */

import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface LLMResponse {
  text: string;
  model: string;
  tokensIn: number;
  tokensOut: number;
}

interface Message { role: "user" | "assistant"; content: string; }

// ─── Primary: AWS Bedrock — Claude Sonnet 4.6 ────────────────────────────────

const BEDROCK_MODEL  = "us.anthropic.claude-sonnet-4-6"; // Cross-region inference profile (required)
const BEDROCK_REGION = process.env.AWS_BEDROCK_REGION || "us-east-1";
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID     || "";
const AWS_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY || "";

function hasBedRockCreds(): boolean {
  return !!(AWS_ACCESS_KEY && AWS_SECRET_KEY);
}

async function callBedrock(
  systemPrompt: string,
  messages: Message[],
  maxTokens = 900
): Promise<LLMResponse> {
  if (!hasBedRockCreds()) {
    throw new Error("AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY not set — Bedrock unavailable");
  }

  const client = new BedrockRuntimeClient({
    region: BEDROCK_REGION,
    credentials: {
      accessKeyId:     AWS_ACCESS_KEY,
      secretAccessKey: AWS_SECRET_KEY,
    },
  });

  // Convert messages to Bedrock ConverseCommand format
  const bedrockMessages = messages.map(m => ({
    role: m.role as "user" | "assistant",
    content: [{ text: m.content }],
  }));

  const command = new ConverseCommand({
    modelId: BEDROCK_MODEL,
    system: [{ text: systemPrompt }],
    messages: bedrockMessages,
    inferenceConfig: { maxTokens, temperature: 0.7 }, // Note: topP cannot be used with temperature for this model
  });

  const response = await client.send(command);
  const text = response.output?.message?.content?.[0]?.text || "";

  return {
    text,
    model: `bedrock/${BEDROCK_MODEL}`,
    tokensIn:  response.usage?.inputTokens  || 0,
    tokensOut: response.usage?.outputTokens || 0,
  };
}

// ─── Fallback: Gemini 3.1 Pro ─────────────────────────────────────────────────

const GEMINI_API_KEY     = process.env.GEMINI_API_KEY || "";
const GEMINI_PRO_MODEL   = "gemini-3.1-pro-preview";
const GEMINI_FLASH_MODEL = "gemini-3.1-flash-lite-preview";

async function callGeminiPro(
  systemPrompt: string,
  messages: Message[],
  maxTokens = 900
): Promise<LLMResponse> {
  const gemini = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model  = gemini.getGenerativeModel({
    model: GEMINI_PRO_MODEL,
    systemInstruction: systemPrompt,
    generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7 },
  });

  const history = messages.slice(0, -1).map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const lastMessage = messages[messages.length - 1]?.content || "";
  const chat   = model.startChat({ history });
  const result = await chat.sendMessage(lastMessage);

  return {
    text: result.response.text(),
    model: `gemini/${GEMINI_PRO_MODEL}`,
    tokensIn:  result.response.usageMetadata?.promptTokenCount     || 0,
    tokensOut: result.response.usageMetadata?.candidatesTokenCount || 0,
  };
}

async function callGeminiFlash(prompt: string, maxTokens = 900): Promise<LLMResponse> {
  const gemini = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model  = gemini.getGenerativeModel({
    model: GEMINI_FLASH_MODEL,
    generationConfig: { maxOutputTokens: maxTokens },
  });
  const result = await model.generateContent(prompt);
  return {
    text: result.response.text(),
    model: `gemini/${GEMINI_FLASH_MODEL}`,
    tokensIn:  result.response.usageMetadata?.promptTokenCount     || 0,
    tokensOut: result.response.usageMetadata?.candidatesTokenCount || 0,
  };
}

// ─── Exported Router ──────────────────────────────────────────────────────────

/**
 * PRIMARY → FALLBACK → LAST RESORT
 *
 * Primary : Bedrock Claude Sonnet 4.6 (active when AWS IAM keys are set)
 * Fallback: Gemini 3.1 Pro           (active always — Gemini API key set)
 * Last    : Gemini 3.1 Flash Lite    (emergency fallback)
 */
export async function routeLLM(
  systemPrompt: string,
  messages: Message[],
  maxTokens = 900
): Promise<LLMResponse & { usedFallback: boolean }> {

  // PRIMARY: Bedrock (only if IAM keys present)
  if (hasBedRockCreds()) {
    try {
      const result = await callBedrock(systemPrompt, messages, maxTokens);
      console.log(`✅ [LLM] Bedrock ${BEDROCK_MODEL} [in:${result.tokensIn} out:${result.tokensOut}]`);
      return { ...result, usedFallback: false };
    } catch (err: any) {
      console.warn(`⚠️ [LLM] Bedrock failed: ${err.message?.slice(0, 100)} → switching to Gemini`);
    }
  }

  // FALLBACK: Gemini 3.1 Pro
  try {
    const result = await callGeminiPro(systemPrompt, messages, maxTokens);
    console.log(`✅ [LLM] Gemini 3.1 Pro [in:${result.tokensIn} out:${result.tokensOut}]`);
    return { ...result, usedFallback: !hasBedRockCreds() };
  } catch (err: any) {
    console.warn(`⚠️ [LLM] Gemini Pro failed: ${err.message?.slice(0, 80)} → Flash fallback`);
  }

  // LAST RESORT: Gemini Flash Lite
  const lastMsg = messages[messages.length - 1]?.content || "";
  const combined = `${systemPrompt}\n\n${lastMsg}`;
  const result = await callGeminiFlash(combined, maxTokens);
  console.log(`✅ [LLM] Gemini Flash Lite [emergency fallback]`);
  return { ...result, usedFallback: true };
}

// ─── Gatekeeper (always Flash Lite — cheapest + fastest) ────────────────────

export async function gatekeeperCheck(message: string): Promise<{ allowed: boolean; reason: string | null }> {
  const safeMsg = message.replace(/"/g, "'").slice(0, 200);
  const prompt = `Is this question about Indian Vedic astrology (birth charts, planets, houses, dashas, marriage, career, health, spiritual path, compatibility)?

Question: "${safeMsg}"

Reply with ONLY this exact JSON structure, nothing else:
{"allowed":true,"reason":null}
OR
{"allowed":false,"reason":"\u{1F319} Karma reads only the stars. Ask about your birth chart, planets, dashas or cosmic destiny."}`;

  try {
    const gemini = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model  = gemini.getGenerativeModel({
      model: GEMINI_FLASH_MODEL,
      generationConfig: { responseMimeType: "application/json", maxOutputTokens: 60, temperature: 0 },
    });
    const res    = await model.generateContent(prompt);
    const raw    = res.response.text().trim();
    const parsed = JSON.parse(raw);
    return { allowed: !!parsed.allowed, reason: parsed.reason || null };
  } catch {
    return { allowed: true, reason: null }; // fail-open
  }
}
