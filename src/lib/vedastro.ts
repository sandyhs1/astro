/**
 * VedAstro Vedic Astrology API Client
 *
 * Uses GET requests with URL path parameters.
 * Confirmed-working API endpoints:
 *   - HoroscopePredictions
 *   - AllPlanetData (PlanetName/All)
 *   - MatchReport
 *   - DasaAtRange
 *
 * URL Format:
 *   /api/Calculate/{Method}/Location/{lat},{lon}/Time/{HH:mm}/{DD}/{MM}/{YYYY}/{tz}/Ayanamsa/RAMAN
 *
 * API Docs: https://vedastro.org
 */

const VEDASTRO_BASE = "https://api.vedastro.org/api";
const API_KEY = process.env.VEDASTRO_API_KEY || "";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface GeoResult {
    lat: number;
    lon: number;
    displayName: string;
}

export interface VedAstroTime {
    hhmm: string;   // "14:30"
    dd: string;     // "25"
    mm: string;     // "10"
    yyyy: string;   // "1992"
    tz: string;     // "+05:30"
    lat: number;
    lon: number;
}

// ─── Geocoding ───────────────────────────────────────────────────────────────

// Module-level geocode cache — persists for server process lifetime
// Uses a promise cache so concurrent calls for same place share ONE request
const _geoCache = new Map<string, Promise<GeoResult>>();

export async function geocodePlace(placeName: string): Promise<GeoResult> {
    const key = placeName.toLowerCase().trim();
    if (_geoCache.has(key)) return _geoCache.get(key)!;

    const promise = (async () => {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeName)}&limit=1`;
        const res = await fetch(url, {
            headers: { "User-Agent": "QuantumKarma/1.0 (contact@quantumkarma.tech)" },
        });
        if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);
        const data = await res.json();
        if (!data || data.length === 0) throw new Error(`Could not geocode: "${placeName}"`);
        return {
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon),
            displayName: data[0].display_name || placeName,
        };
    })();

    _geoCache.set(key, promise);
    return promise;
}

// ─── Time Parsing ─────────────────────────────────────────────────────────────

/**
 * Convert birth inputs to VedAstroTime struct.
 * @param dob  - "YYYY-MM-DD" (HTML date input)
 * @param tob  - "HH:MM" (24h)
 * @param lat  - latitude
 * @param lon  - longitude
 * @param tz   - timezone offset "+05:30"
 */
export function buildVedAstroTime(
    dob: string,
    tob: string,
    lat: number,
    lon: number,
    tz: string = "+05:30"
): VedAstroTime {
    const [yyyy, mm, dd] = dob.split("-");
    return { hhmm: tob, dd, mm, yyyy, tz, lat, lon };
}

/**
 * Build the URL segment for a single time+location.
 * Output: "Location/{lat},{lon}/Time/{HH:mm}/{DD}/{MM}/{YYYY}/{tz}"
 */
function seg(t: VedAstroTime): string {
    return `Location/${t.lat},${t.lon}/Time/${t.hhmm}/${t.dd}/${t.mm}/${t.yyyy}/${t.tz}`;
}

// ─── Internal Fetch Wrapper ───────────────────────────────────────────────────

async function vedGet(path: string): Promise<any> {
    // VedAstro requires '+' to be encoded in timezones, otherwise it parses as a space.
    const encodedPath = path.replace(/\+/g, "%2B");
    const url = `${VEDASTRO_BASE}/Calculate/${encodedPath}/Ayanamsa/LAHIRI`;
    const res = await fetch(url, {
        headers: { "x-api-key": API_KEY },
        cache: "no-store", // Do not cache so we never serve stale data
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`VedAstro HTTP ${res.status}: ${text.substring(0, 200)}`);
    }
    const data = await res.json();
    if (data.Status !== "Pass") {
        throw new Error(`VedAstro Fail: ${JSON.stringify(data.Payload).substring(0, 300)}`);
    }
    return data.Payload;
}

// ─── API Functions (Confirmed Working) ───────────────────────────────────────

/**
 * All 9 planet positions, signs, houses, nakshatras, dignity status.
 * Used for Blueprint and Matrix tabs.
 */
export async function fetchAllPlanetData(time: VedAstroTime): Promise<any[]> {
    const payload = await vedGet(`AllPlanetData/PlanetName/All/${seg(time)}`);
    // payload.AllPlanetData is an array of { PlanetName: { ...data } }
    return payload.AllPlanetData || [];
}

/**
 * Vimshottari Dasha periods for a date range.
 * Maha Dasha + Antardasha levels.
 */
export async function fetchDasaAtRange(
    birth: VedAstroTime,
    startYear: number,
    endYear: number
): Promise<any[]> {
    // Build start and end time objects (same location as birth)
    const start: VedAstroTime = { ...birth, hhmm: "00:00", dd: "01", mm: "01", yyyy: String(startYear) };
    const end: VedAstroTime = { ...birth, hhmm: "00:00", dd: "01", mm: "01", yyyy: String(endYear) };
    const payload = await vedGet(`DasaAtRange/${seg(birth)}/${seg(start)}/${seg(end)}`);
    return Array.isArray(payload) ? payload : [];
}

/**
 * 36-point Ashtakoot Kuta compatibility between two birth charts.
 */
export async function fetchMatchReport(male: VedAstroTime, female: VedAstroTime): Promise<any> {
    return await vedGet(`MatchReport/${seg(male)}/${seg(female)}`);
}

/**
 * 200+ Vedic horoscope predictions for a birth chart.
 */
export async function fetchHoroscopePredictions(time: VedAstroTime): Promise<any[]> {
    const payload = await vedGet(`HoroscopePredictions/${seg(time)}`);
    return Array.isArray(payload) ? payload : [];
}

// ─── Legacy Compatibility (for existing route.ts files) ──────────────────────
// These kept to avoid breaking existing imports

export interface VedAstroTimeLegacy {
    StdTime: string;
    Location: {
        Name: string;
        Longitude: number;
        Latitude: number;
    }
}

export function formatVedAstroTime(dob: string, tob: string, _?: string, tz?: string): string {
    const [y, m, d] = dob.split("-");
    return `${tob} ${d}/${m}/${y} ${tz || "+05:30"}`;
}

export async function fetchFullBirthChart(legacyTime: VedAstroTimeLegacy): Promise<any> {
    // legacyTime has .StdTime ("14:30 25/10/1992 +05:30") and .Location
    try {
        const [hhmm, ddmmyyyy, tz] = legacyTime.StdTime.split(" ");
        const [dd, mm, yyyy] = ddmmyyyy.split("/");
        const lat = legacyTime.Location.Latitude;
        const lon = legacyTime.Location.Longitude;
        
        const time = { hhmm, dd, mm, yyyy, tz, lat, lon };
        const [planets, predictions] = await Promise.all([
            fetchAllPlanetData(time),
            fetchHoroscopePredictions(time)
        ]);
        
        return {
            horoscope: predictions,
            planets: planets,
            houses: [], // legacy stub
            errors: []
        };
    } catch(err: any) {
        return { errors: [err.message], horoscope: [], planets: [], houses: [] };
    }
}

export async function fetchNumerology(legacyTime: any): Promise<any> {
    return { nameNumbers: [], destinyNumber: 0, lifePathNumber: 0 }; // legacy stub
}
