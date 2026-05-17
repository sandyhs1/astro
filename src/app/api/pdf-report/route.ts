import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { PDFDocument } from "pdf-lib";
import crypto from "crypto";
import { geocodePlace } from "@/lib/astrology/client";

// ─── Constants ────────────────────────────────────────────────────────────────
const PDF_BASE = "https://pdf.astrologyapi.com/v1";
const PRO_CREDIT_COST = 5;
const LOGO_URL = "https://yrgkctlkhhehkchtxedz.supabase.co/storage/v1/object/public/logo_file/Quantum_Karma_Logo_Original.png";

// Keywords that flag gemstone-related pages for removal
const GEMSTONE_KEYWORDS = [
  "gemstone", "gem stone", "ruby", "emerald", "sapphire", "pearl",
  "coral", "yellow sapphire", "hessonite", "cat's eye", "blue sapphire",
  "ratna", "navaratna", "diamond", "amethyst", "garnet"
];

// ─── Quantum Karma Branding ───────────────────────────────────────────────────
// These fields populate the cover page of every generated PDF.
// The AstrologyAPI PDF endpoint supports all of these — pass everything for
// maximum branding. logo_url goes in the header/footer, company_logo on the
// cover. chart_style MUST be uppercase ("NORTH_INDIAN" / "SOUTH_INDIAN").
// ─────────────────────────────────────────────────────────────────────────────
const QK_BRANDING = {
  // Branding text
  company_name:    "Quantum Karma",
  company_info:    "India's most precise Vedic intelligence platform — powered by 5,000 years of classical Jyotish and cutting-edge computation.",
  company_email:   "support@quantumkarma.tech",
  company_mobile:  "+91 000 000 0000",
  company_landline:"",

  // URLs
  domain_url:      "https://quantumkarma.tech",
  footer_link:     "https://quantumkarma.tech",

  // Logo — full hosted Supabase URL (used in report header & cover)
  logo_url:        LOGO_URL,
  company_logo:    LOGO_URL,

  // Report settings
  language:        "en",
  chart_style:     "NORTH_INDIAN",  // uppercase required by API
};


// ─── Helpers ─────────────────────────────────────────────────────────────────
function generateBirthHash(dob: string, tob: string, pob: string): string {
  return crypto
    .createHash("md5")
    .update(`${dob}-${tob}-${pob}`.toLowerCase().replace(/\s+/g, ""))
    .digest("hex");
}

/**
 * Calls the AstrologyAPI PDF generation endpoints.
 * Note: Unlike standard JSON endpoints that use Basic Auth (userId:apiKey), 
 * the PDF endpoints (/v1/basic_horoscope_pdf and /v1/pro_horoscope_pdf) 
 * strictly require the 'x-astrologyapi-key' header containing just the API Key.
 */
async function callPdfApi(endpoint: string, payload: Record<string, any>): Promise<string> {
  const apiKey = process.env.ASTROLOGY_API_KEY!;

  const res = await fetch(`${PDF_BASE}/${endpoint}`, {
    method: "POST",
    headers: {
      "x-astrologyapi-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!data.pdf_url && !data.status) {
    throw new Error(data.msg || data.error_msg || "PDF generation failed");
  }
  return data.pdf_url as string;
}

async function downloadPdf(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to download PDF from AstrologyAPI");
  return Buffer.from(await res.arrayBuffer());
}

/**
 * Assembles the complete AstrologyAPI PDF payload.
 * Centralised here so both Basic (GET) and Pro (POST) use identical
 * branding fields and date/time parsing logic.
 * 
 * The API uses the `name` field to personalise the cover page title,
 * so we pass the user's full name exactly as stored.
 */
function buildPdfPayload(
  profileData: any,
  d: number, m: number, y: number,
  h: number, min: number, tzone: number,
  lat: number, lon: number
): Record<string, any> {
  return {
    // ── Quantum Karma full branding (cover + header + footer) ──
    ...QK_BRANDING,

    // ── Personalised user details ──
    name:   profileData.name ?? "Seeker",
    gender: (profileData.gender ?? "female").toLowerCase(),
    place:  profileData.pob ?? "",

    // ── Birth date / time ──
    day: d, month: m, year: y,
    hour: h, min,

    // ── Geographic / timezone ──
    lat, lon, tzone,
  };
}

/**
 * Remove pages containing gemstone content from the PDF.
 * Uses pdf-lib to reconstruct PDF without flagged pages.
 */
async function removeGemstonePages(pdfBuffer: Buffer): Promise<Buffer> {
  try {
    // Dynamic import to avoid edge runtime issues
    const pdfParse = (await import("pdf-parse")).default;
    const parsed = await pdfParse(pdfBuffer);

    // Get per-page text by splitting on common page markers
    const pageTexts: string[] = parsed.text
      .split(/\f/)
      .map((t: string) => t.toLowerCase());

    const srcDoc = await PDFDocument.load(pdfBuffer);
    const totalPages = srcDoc.getPageCount();
    const destDoc = await PDFDocument.create();

    const keepIndices: number[] = [];
    for (let i = 0; i < totalPages; i++) {
      const pageText = pageTexts[i] ?? "";
      const hasGemstone = GEMSTONE_KEYWORDS.some((kw) => pageText.includes(kw));
      if (!hasGemstone) keepIndices.push(i);
    }

    if (keepIndices.length === 0) {
      // Safety: if all pages were flagged, return original
      return pdfBuffer;
    }

    const copiedPages = await destDoc.copyPages(srcDoc, keepIndices);
    copiedPages.forEach((p) => destDoc.addPage(p));

    const cleanBytes = await destDoc.save();
    return Buffer.from(cleanBytes);
  } catch (err) {
    console.error("Gemstone removal failed, serving original PDF:", err);
    return pdfBuffer; // Fail gracefully
  }
}

async function storeInSupabase(
  adminClient: any,
  pdfBuffer: Buffer,
  storagePath: string
): Promise<string> {
  const { error } = await adminClient.storage
    .from("pdf-reports")
    .upload(storagePath, pdfBuffer, {
      contentType: "application/pdf",
      upsert: true,
    });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  const { data } = adminClient.storage
    .from("pdf-reports")
    .getPublicUrl(storagePath);
  return data.publicUrl;
}

// ─── GET — fetch or generate PDF ─────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get("profileId");
    const type = searchParams.get("type");       // "basic" | "pro"
    const force  = searchParams.get("force") === "true"; // bust cache & regenerate

    if (!profileId || !type) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get(n) { return cookieStore.get(n)?.value; } } }
    );

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Admin client for storage operations
    const admin = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Get profile data
    let profileData: any = null;
    let targetProfileId = profileId;

    if (profileId === "self") {
      const { data: fProfile } = await supabase
        .from('family_profiles').select('*').eq('user_id', session.user.id).eq('relationship', 'Self').maybeSingle();
      if (fProfile) {
        profileData = fProfile;
        targetProfileId = fProfile.id;
      } else {
        const { data: lead } = await supabase
          .from('onboarding_leads').select('*').eq('email', session.user.email).order('created_at', { ascending: false }).limit(1).maybeSingle();
        if (lead) { 
          profileData = lead; 
          targetProfileId = lead.id;
        }
      }
    } else {
      const { data: fp } = await supabase
        .from("family_profiles").select("*").eq("id", profileId).eq("user_id", session.user.id).single();
      if (fp) { profileData = fp; }
      else {
        const { data: lead } = await supabase
          .from("onboarding_leads").select("*").eq("id", profileId).eq("email", session.user.email).single();
        if (lead) profileData = lead;
      }
    }
    if (!profileData) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const hash = generateBirthHash(profileData.dob, profileData.tob, profileData.pob);
    const reportType = type === "pro" ? "pro_horoscope_pdf" : "basic_horoscope_pdf";

    // 2. Check if already stored — serve from cache unless ?force=true
    //    force=true deletes the old record so we fall through to regeneration,
    //    which picks up the latest QK_BRANDING fields (logo, company_info, etc.)
    const { data: existing } = await admin
      .from("pdf_unlocks")
      .select("storage_path")
      .eq("hash", hash)
      .eq("report_type", reportType)
      .single();

    if (existing?.storage_path && !force) {
      // Serve cached signed URL (valid 1 hour)
      const { data: signed } = await admin.storage
        .from("pdf-reports")
        .createSignedUrl(existing.storage_path, 3600);
      return NextResponse.json({ url: signed?.signedUrl, cached: true });
    }

    if (existing?.storage_path && force) {
      // Bust the cache: delete the DB record so we regenerate fresh below
      await admin.from("pdf_unlocks")
        .delete()
        .eq("hash", hash)
        .eq("report_type", reportType);
      console.log(`[pdf-report] Cache busted for hash=${hash}, type=${reportType}`);
    }

    // 3. For PRO — check unlock record (user must have paid)
    if (type === "pro") {
      return NextResponse.json({ error: "not_unlocked" }, { status: 402 });
    }

    // 4. BASIC — generate, strip gemstones, store
    let d = 1, m = 1, y = 2000;
    if (profileData.dob?.includes('-')) {
      const parts = profileData.dob.split('-');
      if (parts[0].length === 4) {
        y = parseInt(parts[0]); m = parseInt(parts[1]); d = parseInt(parts[2]);
      } else {
        d = parseInt(parts[0]); m = parseInt(parts[1]); y = parseInt(parts[2]);
      }
    } else if (profileData.dob?.includes('/')) {
      const parts = profileData.dob.split('/');
      if (parts[2].length === 4) {
        d = parseInt(parts[0]); m = parseInt(parts[1]); y = parseInt(parts[2]);
      } else {
        y = parseInt(parts[0]); m = parseInt(parts[1]); d = parseInt(parts[2]);
      }
    }

    let h = 12, min = 0;
    if (profileData.tob) {
      const isPM = profileData.tob.toLowerCase().includes('pm');
      const cleanTob = profileData.tob.replace(/am|pm/gi, '').trim();
      const parts = cleanTob.split(':');
      h = parseInt(parts[0]);
      if (isPM && h < 12) h += 12;
      if (!isPM && h === 12) h = 0;
      min = parts.length > 1 ? parseInt(parts[1]) : 0;
    }
    let tzone = 5.5;
    const tzMatch = profileData.timezone?.match(/([+-]\d{2}):(\d{2})/);
    if (tzMatch) {
      const sign = tzMatch[1].startsWith("-") ? -1 : 1;
      tzone = sign * (Math.abs(parseInt(tzMatch[1])) + parseInt(tzMatch[2]) / 60);
    }

    let lat = profileData.lat;
    let lon = profileData.lng || profileData.lon;
    if (lat === undefined || lon === undefined) {
      if (profileData.pob) {
        const geo = await geocodePlace(profileData.pob);
        lat = geo.lat;
        lon = geo.lon;
      } else {
        return NextResponse.json({ error: "Missing place of birth" }, { status: 400 });
      }
    }

    // Build fully-branded payload (personalised name, full QK branding fields)
    const payload = buildPdfPayload(profileData, d, m, y, h, min, tzone, lat, lon);

    const pdfUrl = await callPdfApi("basic_horoscope_pdf", payload);
    const rawBuffer = await downloadPdf(pdfUrl);
    const cleanBuffer = await removeGemstonePages(rawBuffer);

    const storagePath = `basic/${hash}.pdf`;
    await storeInSupabase(admin, cleanBuffer, storagePath);

    // Save record
    await admin.from("pdf_unlocks").insert({
      user_id: session.user.id,
      profile_id: profileId,
      hash, report_type: reportType,
      storage_path: storagePath,
      credits_charged: 0,
    });

    const { data: signed } = await admin.storage
      .from("pdf-reports")
      .createSignedUrl(storagePath, 3600);

    return NextResponse.json({ url: signed?.signedUrl, cached: false });

  } catch (err: any) {
    console.error("PDF Report GET Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ─── POST — unlock Pro (deduct credits + generate) ───────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { profileId } = await req.json();
    if (!profileId) return NextResponse.json({ error: "Missing profileId" }, { status: 400 });

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get(n) { return cookieStore.get(n)?.value; } } }
    );

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Get profile
    let profileData: any = null;
    let targetProfileId = profileId;

    if (profileId === "self") {
      const { data: fProfile } = await supabase
        .from('family_profiles').select('*').eq('user_id', session.user.id).eq('relationship', 'Self').maybeSingle();
      if (fProfile) {
        profileData = fProfile;
        targetProfileId = fProfile.id;
      } else {
        const { data: lead } = await supabase
          .from('onboarding_leads').select('*').eq('email', session.user.email).order('created_at', { ascending: false }).limit(1).maybeSingle();
        if (lead) { 
          profileData = lead; 
          targetProfileId = lead.id;
        }
      }
    } else {
      const { data: fp } = await supabase.from("family_profiles").select("*").eq("id", profileId).eq("user_id", session.user.id).single();
      if (fp) profileData = fp;
      else {
        const { data: lead } = await supabase.from("onboarding_leads").select("*").eq("id", profileId).eq("email", session.user.email).single();
        if (lead) profileData = lead;
      }
    }
    if (!profileData) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const hash = generateBirthHash(profileData.dob, profileData.tob, profileData.pob);
    const reportType = "pro_horoscope_pdf";

    // 2. Check if already unlocked for this hash
    const { data: existing } = await admin.from("pdf_unlocks").select("storage_path").eq("hash", hash).eq("report_type", reportType).single();
    if (existing?.storage_path) {
      const { data: signed } = await admin.storage.from("pdf-reports").createSignedUrl(existing.storage_path, 3600);
      return NextResponse.json({ url: signed?.signedUrl, already_unlocked: true });
    }

    // 3. Check credits
    const { data: userProfile } = await supabase.from("user_profiles").select("credits").eq("id", session.user.id).single();
    if (!userProfile || userProfile.credits < PRO_CREDIT_COST) {
      return NextResponse.json({ error: "insufficient_credits", required: PRO_CREDIT_COST, available: userProfile?.credits ?? 0 }, { status: 402 });
    }

    // 4. Deduct credits
    const { error: creditErr } = await supabase
      .from("user_profiles")
      .update({ credits: userProfile.credits - PRO_CREDIT_COST })
      .eq("id", session.user.id);
    if (creditErr) throw new Error("Failed to deduct credits");

    // 5. Generate Pro PDF
    let d = 1, m = 1, y = 2000;
    if (profileData.dob?.includes('-')) {
      const parts = profileData.dob.split('-');
      if (parts[0].length === 4) {
        y = parseInt(parts[0]); m = parseInt(parts[1]); d = parseInt(parts[2]);
      } else {
        d = parseInt(parts[0]); m = parseInt(parts[1]); y = parseInt(parts[2]);
      }
    } else if (profileData.dob?.includes('/')) {
      const parts = profileData.dob.split('/');
      if (parts[2].length === 4) {
        d = parseInt(parts[0]); m = parseInt(parts[1]); y = parseInt(parts[2]);
      } else {
        y = parseInt(parts[0]); m = parseInt(parts[1]); d = parseInt(parts[2]);
      }
    }

    let h = 12, min = 0;
    if (profileData.tob) {
      const isPM = profileData.tob.toLowerCase().includes('pm');
      const cleanTob = profileData.tob.replace(/am|pm/gi, '').trim();
      const parts = cleanTob.split(':');
      h = parseInt(parts[0]);
      if (isPM && h < 12) h += 12;
      if (!isPM && h === 12) h = 0;
      min = parts.length > 1 ? parseInt(parts[1]) : 0;
    }
    let tzone = 5.5;
    const tzMatch = profileData.timezone?.match(/([+-]\d{2}):(\d{2})/);
    if (tzMatch) {
      const sign = tzMatch[1].startsWith("-") ? -1 : 1;
      tzone = sign * (Math.abs(parseInt(tzMatch[1])) + parseInt(tzMatch[2]) / 60);
    }

    let lat = profileData.lat;
    let lon = profileData.lng || profileData.lon;
    if (lat === undefined || lon === undefined) {
      if (profileData.pob) {
        const geo = await geocodePlace(profileData.pob);
        lat = geo.lat;
        lon = geo.lon;
      } else {
        return NextResponse.json({ error: "Missing place of birth" }, { status: 400 });
      }
    }

    // Build fully-branded payload (personalised name, full QK branding fields)
    const payload = buildPdfPayload(profileData, d, m, y, h, min, tzone, lat, lon);

    const pdfUrl = await callPdfApi("pro_horoscope_pdf", payload);
    const rawBuffer = await downloadPdf(pdfUrl);
    const cleanBuffer = await removeGemstonePages(rawBuffer);

    const storagePath = `pro/${hash}.pdf`;
    await storeInSupabase(admin, cleanBuffer, storagePath);

    await admin.from("pdf_unlocks").insert({
      user_id: session.user.id,
      profile_id: profileId,
      hash, report_type: reportType,
      storage_path: storagePath,
      credits_charged: PRO_CREDIT_COST,
    });

    const { data: signed } = await admin.storage.from("pdf-reports").createSignedUrl(storagePath, 3600);
    return NextResponse.json({ url: signed?.signedUrl, credits_used: PRO_CREDIT_COST });

  } catch (err: any) {
    console.error("PDF Report POST Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
