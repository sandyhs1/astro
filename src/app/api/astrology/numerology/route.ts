import { NextResponse } from "next/server";
// Legacy numerology route — to be rebuilt with astrologyapi.com numerology endpoints
export async function POST() {
  return NextResponse.json({ error: "Deprecated. Numerology will be rebuilt soon." }, { status: 410 });
}
