/**
 * ASTROLOGY ENGINE — LAYER 1: AstrologyAPI.com Client
 *
 * Singleton client for astrologyapi.com (Indian Vedic only).
 * Auth: Basic base64(userId:apiKey) — per their API spec.
 *
 * Base URL: https://json.astrologyapi.com/v1/
 */

// The SDK is CommonJS, import carefully
// eslint-disable-next-line @typescript-eslint/no-require-imports
const AstrologyAPI = require("astrologyapi");

if (!process.env.ASTROLOGY_API_USER_ID || !process.env.ASTROLOGY_API_KEY) {
  throw new Error("Missing ASTROLOGY_API_USER_ID or ASTROLOGY_API_KEY in environment");
}

// Singleton — created once per server lifecycle
export const astroClient: InstanceType<typeof AstrologyAPI> = new AstrologyAPI({
  userId: process.env.ASTROLOGY_API_USER_ID,
  apiKey: process.env.ASTROLOGY_API_KEY,
});

/**
 * Standard birth params for all Indian Vedic API calls.
 * The API expects:
 *   day, month, year (integers)
 *   hour, min (integers, 24h format)
 *   lat, lon (floats)
 *   tzone (float, e.g. 5.5 for IST)
 */
export interface BirthParams {
  day: number;
  month: number;
  year: number;
  hour: number;
  min: number;
  lat: number;
  lon: number;
  tzone: number;
}

/**
 * Parse user birth inputs into BirthParams.
 *
 * @param dob  - "DD/MM/YYYY" or "YYYY-MM-DD"
 * @param tob  - "HH:MM" (24h) or "H:MM AM/PM"
 * @param lat  - latitude float
 * @param lon  - longitude float
 * @param tz   - timezone offset as float (e.g. 5.5 for +05:30)
 */
export function parseBirthParams(
  dob: string,
  tob: string,
  lat: number,
  lon: number,
  tz: number = 5.5
): BirthParams {
  // Parse date
  let day: number, month: number, year: number;
  if (dob.includes("/")) {
    const parts = dob.split("/");
    day   = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10);
    year  = parseInt(parts[2], 10);
  } else if (dob.includes("-")) {
    const parts = dob.split("-");
    if (parts[0].length === 4) {
      year  = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      day   = parseInt(parts[2], 10);
    } else {
      day   = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      year  = parseInt(parts[2], 10);
    }
  } else {
    throw new Error(`Invalid date format: "${dob}". Use DD/MM/YYYY`);
  }

  // Parse time — convert 12h → 24h if needed
  let hour: number, min: number;
  const amPm = tob.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (amPm) {
    hour = parseInt(amPm[1], 10);
    min  = parseInt(amPm[2], 10);
    const period = amPm[3].toUpperCase();
    if (period === "AM" && hour === 12) hour = 0;
    if (period === "PM" && hour !== 12) hour += 12;
  } else {
    const parts = tob.split(":");
    hour = parseInt(parts[0], 10);
    min  = parseInt(parts[1], 10);
  }

  if (isNaN(day) || isNaN(month) || isNaN(year)) throw new Error(`Could not parse date: "${dob}"`);
  if (isNaN(hour) || isNaN(min)) throw new Error(`Could not parse time: "${tob}"`);

  return { day, month, year, hour, min, lat, lon, tzone: tz };
}

/**
 * Geocode a place name → lat/lon using Nominatim.
 */
export async function geocodePlace(place: string): Promise<{ lat: number; lon: number; displayName: string }> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}&limit=1`;
  const res = await fetch(url, {
    headers: { "User-Agent": "QuantumKarma/2.0 (contact@quantumkarma.tech)" },
  });
  if (!res.ok) throw new Error(`Geocoding HTTP ${res.status}`);
  const data = await res.json();
  if (!data?.length) throw new Error(`Could not geocode: "${place}"`);
  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
    displayName: data[0].display_name || place,
  };
}

/**
 * Parse timezone offset string "+05:30" → float 5.5
 */
export function tzStringToFloat(tz: string = "+05:30"): number {
  const match = tz.match(/^([+-])(\d{2}):(\d{2})$/);
  if (!match) return 5.5;
  const sign  = match[1] === "+" ? 1 : -1;
  const hours = parseInt(match[2], 10);
  const mins  = parseInt(match[3], 10);
  return sign * (hours + mins / 60);
}
