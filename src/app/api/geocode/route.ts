/**
 * /api/geocode — Server-side proxy for Place of Birth autocomplete.
 *
 * PROVIDER: AstrologyAPI.com /v1/geo_details
 *   - Already integrated in this project (same credentials as Vedic chart engine)
 *   - Returns precise lat/lon + timezone_id for every city globally
 *   - Works perfectly for Indian cities (Kolkata, Mysore, Mangalore etc.)
 *   - No rate-limiting issues — we're an authenticated paying customer
 *
 * PREVIOUS HISTORY:
 *   - photon.komoot.io → returned 502 Bad Gateway (service down May 2026)
 *   - nominatim.openstreetmap.org → 429 Too Many Requests (strict 1 req/sec limit)
 *
 * RESPONSE FORMAT:
 *   [{ Name: "Kolkata, IN", lat: 22.56263, lon: 88.36304, timezone_id: "Asia/Kolkata" }, ...]
 *
 * USAGE:
 *   GET /api/geocode?q=Kolkata
 */

import { NextRequest, NextResponse } from "next/server";

// Convert IANA timezone_id (e.g. "Asia/Kolkata") to numeric offset string (e.g. "+05:30")
// This is what the Supabase family_profiles.timezone column expects
function timezoneIdToOffset(timezone_id: string): string {
  try {
    const now = new Date();
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone_id,
      timeZoneName: "shortOffset",
    });
    const parts = formatter.formatToParts(now);
    const offsetPart = parts.find((p) => p.type === "timeZoneName")?.value || "GMT+0";
    // offsetPart is like "GMT+5:30" or "GMT-3"
    const match = offsetPart.match(/GMT([+-]\d{1,2}):?(\d{2})?/);
    if (match) {
      const sign = match[1].startsWith("-") ? "-" : "+";
      const hours = Math.abs(parseInt(match[1])).toString().padStart(2, "0");
      const mins = (match[2] || "00").padStart(2, "0");
      return `${sign}${hours}:${mins}`;
    }
    return "+05:30"; // safe default for India
  } catch {
    return "+05:30";
  }
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  const userId = process.env.ASTROLOGY_API_USER_ID;
  const apiKey = process.env.ASTROLOGY_API_KEY;

  if (!userId || !apiKey) {
    console.error("[geocode] Missing ASTROLOGY_API_USER_ID or ASTROLOGY_API_KEY");
    return NextResponse.json([]);
  }

  const credentials = Buffer.from(`${userId}:${apiKey}`).toString("base64");

  try {
    const res = await fetch("https://json.astrologyapi.com/v1/geo_details", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ place: query, maxRows: 8 }),
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) {
      console.error("[geocode] AstrologyAPI geo_details failed:", res.status);
      return NextResponse.json([]);
    }

    const data = await res.json();

    if (!data?.geonames || data.geonames.length === 0) {
      return NextResponse.json([]);
    }

    // Map to { Name, lat, lon, timezone_id, timezone_offset }
    const suggestions = data.geonames
      .map((g: any) => {
        const tz_id = g.timezone_id || "Asia/Kolkata";
        return {
          Name: `${g.place_name}${g.country_code ? ", " + g.country_code : ""}`,
          lat: parseFloat(g.latitude),
          lon: parseFloat(g.longitude),
          timezone_id: tz_id,
          // Pre-compute the numeric offset so the frontend can store it directly
          timezone: timezoneIdToOffset(tz_id),
        };
      })
      .filter((s: any) => s.Name && !isNaN(s.lat) && !isNaN(s.lon));

    // Deduplicate by Name
    const unique = Array.from(
      new Map(suggestions.map((s: any) => [s.Name, s])).values()
    );

    return NextResponse.json(unique);
  } catch (err) {
    console.error("[geocode] fetch error:", err);
    return NextResponse.json([]);
  }
}
