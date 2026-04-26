import { NextResponse } from "next/server";
// Legacy VedAstro match route — replaced by new astrologyapi.com integration
export async function POST() {
  return NextResponse.json({ error: "Deprecated. Compatibility matching will be rebuilt soon." }, { status: 410 });
}
