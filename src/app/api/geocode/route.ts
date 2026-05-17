/**
 * /api/geocode — Server-side proxy for place-of-birth autocomplete.
 *
 * WHY THIS EXISTS:
 *   - The previous implementation called photon.komoot.io directly from the browser.
 *   - As of May 2026, photon.komoot.io returns 502 Bad Gateway (service is down).
 *   - This proxy calls Nominatim (OpenStreetMap) which is stable and free.
 *   - Running server-side lets us set a proper User-Agent (required by Nominatim ToS)
 *     and avoids any browser CORS restrictions.
 *
 * USAGE:
 *   GET /api/geocode?q=Mumbai
 *   Returns: [{ Name: "Mumbai, Maharashtra, India", lat: 19.07, lon: 72.87 }, ...]
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=6&addressdetails=1`;

    const res = await fetch(url, {
      headers: {
        // Nominatim ToS requires a descriptive User-Agent with contact info
        "User-Agent": "QuantumKarma-App/1.0 (help@soulsync.tech)",
        "Accept-Language": "en",
      },
      // 5-second timeout — fast enough for typeahead
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      return NextResponse.json([]);
    }

    const data = await res.json();

    // Map Nominatim results → { Name, lat, lon } format expected by the frontend
    const suggestions = data
      .map((item: any) => {
        const addr = item.address || {};
        // Build a clean "City, State, Country" label
        const parts = [
          addr.city || addr.town || addr.village || addr.hamlet || addr.county || item.name,
          addr.state,
          addr.country,
        ].filter(Boolean);

        return {
          Name: parts.join(", "),
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
        };
      })
      // Remove entries with no usable name
      .filter((s: any) => s.Name && s.Name.length > 0);

    // Deduplicate by Name
    const unique = Array.from(
      new Map(suggestions.map((s: any) => [s.Name, s])).values()
    );

    return NextResponse.json(unique);
  } catch (err) {
    console.error("[geocode] Nominatim fetch failed:", err);
    return NextResponse.json([]);
  }
}
