import { NextResponse } from "next/server";
// Legacy VedAstro route — replaced by /api/generate-chart and /api/astro-chat
export async function POST() {
  return NextResponse.json({ error: "Deprecated. Use /api/generate-chart or /api/astro-chat" }, { status: 410 });
}
export async function GET() {
  return NextResponse.json({ error: "Deprecated. Use /api/generate-chart or /api/astro-chat" }, { status: 410 });
}
