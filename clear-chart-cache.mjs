/**
 * Clear all cached charts from onboarding_leads so they are regenerated fresh.
 * Run this once after any normalize.ts fix.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, ".env.local");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim().replace(/^"|"$/g, "").replace(/^'|'$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("❌ Missing Supabase env vars");
  process.exit(1);
}

async function clearCache() {
  // Supabase requires a WHERE clause — filter rows that have a cached chart
  const res = await fetch(`${SUPABASE_URL}/rest/v1/onboarding_leads?chart_hash=not.is.null`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "apikey": SERVICE_KEY,
      "Authorization": `Bearer ${SERVICE_KEY}`,
      "Prefer": "return=representation",
    },
    body: JSON.stringify({ golden_master_json: null, chart_hash: null }),
  });

  const text = await res.text();
  if (!res.ok) {
    console.error(`❌ Supabase error ${res.status}: ${text.slice(0, 300)}`);
    process.exit(1);
  }

  let rows;
  try { rows = JSON.parse(text); } catch { rows = []; }
  console.log(`✅ Cleared chart cache for ${Array.isArray(rows) ? rows.length : "?"} onboarding_leads rows`);
  console.log("   All users will get fresh, corrected chart data on next conversation.");
}

clearCache().catch(err => {
  console.error("❌ FATAL:", err.message);
  process.exit(1);
});
