import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
// @ts-ignore
import api from 'astrologyapi';
import crypto from 'crypto';
import { geocodePlace } from '@/lib/astrology/client';

function generateBirthHash(dob: string, tob: string, pob: string): string {
  const str = `${dob}-${tob}-${pob}`.toLowerCase().replace(/\s+/g, '');
  return crypto.createHash('md5').update(str).digest('hex');
}

// Reports that should never be cached (change daily)
const NO_CACHE_REPORTS = ['biorhythm'];

// Reports that need varshaphal_year param
const VARSHAPHAL_REPORTS = ['varshaphal_month_chart', 'varshaphal_yoga'];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get('profileId');
    const reportType = searchParams.get('reportType');

    if (!profileId) return NextResponse.json({ error: "Missing profileId" }, { status: 400 });
    if (!reportType) return NextResponse.json({ error: "Missing reportType" }, { status: 400 });

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get(n: string) { return cookieStore.get(n)?.value; } } }
    );

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userEmail = session.user.email;

    // 1. Get profile data — check family_profiles first, then onboarding_leads
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
          .from('onboarding_leads').select('*').eq('email', userEmail).order('created_at', { ascending: false }).limit(1).maybeSingle();
        if (lead) { 
          profileData = lead; 
          targetProfileId = lead.id;
        }
      }
    } else {
      const { data: fProfile } = await supabase
        .from('family_profiles').select('*').eq('id', profileId).eq('user_id', session.user.id).single();
      if (fProfile) {
        profileData = fProfile;
      } else {
        const { data: lead } = await supabase
          .from('onboarding_leads').select('*').eq('id', profileId).eq('email', userEmail).single();
        if (lead) { profileData = lead; }
      }
    }

    if (!profileData) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const hash = generateBirthHash(profileData.dob, profileData.tob, profileData.pob);
    const shouldCache = !NO_CACHE_REPORTS.includes(reportType);

    // 2. Check cache for cacheable reports
    if (shouldCache) {
      try {
        const { data: cacheData, error: cacheErr } = await supabase
          .from('reports_cache')
          .select('data')
          .eq('hash', hash)
          .eq('report_type', reportType)
          .single();

        if (!cacheErr && cacheData) {
          return NextResponse.json({ source: 'cache', data: cacheData.data });
        }
      } catch (_) {
        // Table might not exist yet — proceed to live fetch
      }
    }

    // 3. Parse birth data robustly
    let d = 1, m = 1, y = 2000;
    if (profileData.dob?.includes('-')) {
      // YYYY-MM-DD
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
      const sign = tzMatch[1].startsWith('-') ? -1 : 1;
      tzone = sign * (Math.abs(parseInt(tzMatch[1])) + parseInt(tzMatch[2]) / 60);
    } else if (profileData.timezone) {
      tzone = parseFloat(profileData.timezone);
    }

    const astro = new api({
      userId: process.env.ASTROLOGY_API_USER_ID!,
      apiKey: process.env.ASTROLOGY_API_KEY!
    });

    let lat = profileData.lat;
    let lon = profileData.lng || profileData.lon;
    if (lat === undefined || lon === undefined) {
      if (profileData.pob) {
        const geo = await geocodePlace(profileData.pob);
        lat = geo.lat;
        lon = geo.lon;
      } else {
        return NextResponse.json({ error: "Missing place of birth and coordinates." }, { status: 400 });
      }
    }

    const basePayload: Record<string, any> = {
      day: d, month: m, year: y, hour: h, min,
      lat, lon, tzone
    };

    // Varshaphal endpoints need the current year
    if (VARSHAPHAL_REPORTS.includes(reportType)) {
      basePayload.varshaphal_year = new Date().getFullYear();
    }

    const apiRes = await astro.customRequest({
      method: 'POST',
      endpoint: reportType,
      params: basePayload
    });

    // 4. Save to cache if applicable
    if (shouldCache) {
      try {
        await supabase.from('reports_cache').insert({
          user_id: session.user.id,
          profile_id: profileId,
          hash,
          report_type: reportType,
          data: apiRes
        });
      } catch (_) {
        // Ignore — table might not exist yet
      }
    }

    return NextResponse.json({ source: 'api', data: apiRes });

  } catch (error: any) {
    console.error("Report API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
