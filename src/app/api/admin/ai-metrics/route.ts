import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// ── INR pricing constants ──────────────────────────────────────────────────────
// Claude Sonnet 4.6 via Bedrock (USD → INR @ 84)
const CLAUDE_INPUT_PER_1K  = (3.00  / 1000) * 84;  // ₹0.252 per 1K input tokens
const CLAUDE_OUTPUT_PER_1K = (15.00 / 1000) * 84;  // ₹1.26  per 1K output tokens
// Gemini 3.1 Pro
const GEMINI_INPUT_PER_1K  = (1.25  / 1000) * 84;  // ₹0.105 per 1K input tokens
const GEMINI_OUTPUT_PER_1K = (5.00  / 1000) * 84;  // ₹0.42  per 1K output tokens
// Gemini Flash Lite (gatekeeper)
const FLASH_PER_1K         = (0.075 / 1000) * 84;  // ₹0.0063 per 1K tokens
// AstrologyAPI.com (pay-per-call)
const ASTRO_API_COST_INR   = 0.084; // ₹0.084 per API call (~$0.001)

function computeTokenCostInr(model: string, inputTokens: number, outputTokens: number): number {
  const m = (model || '').toLowerCase();
  if (m.includes('claude') || m.includes('bedrock')) {
    return (inputTokens / 1000) * CLAUDE_INPUT_PER_1K + (outputTokens / 1000) * CLAUDE_OUTPUT_PER_1K;
  }
  if (m.includes('flash') || m.includes('lite')) {
    return ((inputTokens + outputTokens) / 1000) * FLASH_PER_1K;
  }
  if (m.includes('gemini')) {
    return (inputTokens / 1000) * GEMINI_INPUT_PER_1K + (outputTokens / 1000) * GEMINI_OUTPUT_PER_1K;
  }
  return 0;
}

export async function GET(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];
  if (!token || !process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Verify token matches base64(ADMIN_PASSWORD) — same as auth route generates
  const expectedToken = Buffer.from(process.env.ADMIN_PASSWORD).toString('base64');
  if (token !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
    );

    // ── Fetch data in parallel ─────────────────────────────────────────────────
    const [usersRes, logsRes, astroLogsRes] = await Promise.all([
      supabase.from('user_profiles').select('id, full_name, email, created_at, credits'),
      supabase.from('token_usage_logs').select('*').order('created_at', { ascending: false }).limit(2000),
      supabase.from('astroapi_logs').select('*').order('created_at', { ascending: false }).limit(2000),
    ]);

    if (usersRes.error) throw usersRes.error;
    const users    = usersRes.data  || [];
    const logs     = logsRes.data   || [];
    const astroLogs= astroLogsRes.data || [];

    // ── Feature catalog (the 12 user-visible features) ────────────────────────
    // Stable feature keys → human-readable labels, used for grouping in the
    // admin dashboard. The order here drives column order in the UI tables.
    const FEATURE_CATALOG: Array<{ key: string; label: string; engine: 'llm' | 'astro_pdf' }> = [
      { key: 'karma_dna',              label: 'Karma DNA',                 engine: 'llm' },
      { key: 'karmic_patterns',        label: 'Karmic Patterns',           engine: 'llm' },
      { key: 'your_purpose',           label: 'Your Purpose',              engine: 'llm' },
      { key: 'year_ahead',             label: 'Year Ahead',                engine: 'llm' },
      { key: 'royal_roast',            label: 'Royal Roast',               engine: 'llm' },
      { key: 'remedy',                 label: 'Remedy',                    engine: 'llm' },
      { key: 'your_gotra',             label: 'Your Gotra',                engine: 'llm' },
      { key: 'ishta_devata',           label: 'Ishta Devata',              engine: 'llm' },
      { key: 'nakshatra_ascendant',    label: 'Nakshatra + Ascendant',     engine: 'llm' },
      { key: 'core_horoscope',         label: 'Core Horoscope (PDF)',      engine: 'astro_pdf' },
      { key: 'professional_horoscope', label: 'Professional Horoscope',    engine: 'astro_pdf' },
      { key: 'chat',                   label: 'Oracle Chat',               engine: 'llm' },
    ];

    // ── LLM Global Aggregates ──────────────────────────────────────────────────
    const CREDIT_VALUE_INR_GLOBAL = 35.98; // ₹1799 / 50 credits
    const totalInputTokens   = logs.reduce((a, l) => a + (l.input_tokens  || 0), 0);
    const totalOutputTokens  = logs.reduce((a, l) => a + (l.output_tokens || 0), 0);
    const totalLLMCostInr    = logs.reduce((a, l) => a + parseFloat(l.cost_inr || 0), 0);
    const totalCreditsUsed   = logs.reduce((a, l) => a + (l.credits_used  || 0), 0); // = deducted (2×)
    const totalActualCredits = parseFloat((totalLLMCostInr / CREDIT_VALUE_INR_GLOBAL).toFixed(4)); // real cost
    const totalCreditsDeducted = totalCreditsUsed; // alias for clarity in admin UI

    // ── Model Breakdown ────────────────────────────────────────────────────────
    const modelUsage: Record<string, { tokens: number; count: number; costInr: number; inputTokens: number; outputTokens: number }> = {};
    for (const log of logs) {
      const m = log.model_name || 'unknown';
      if (!modelUsage[m]) modelUsage[m] = { tokens: 0, count: 0, costInr: 0, inputTokens: 0, outputTokens: 0 };
      modelUsage[m].inputTokens  += log.input_tokens  || 0;
      modelUsage[m].outputTokens += log.output_tokens || 0;
      modelUsage[m].tokens       += (log.input_tokens || 0) + (log.output_tokens || 0);
      modelUsage[m].count        += 1;
      modelUsage[m].costInr      += parseFloat(log.cost_inr || 0);
    }

    // ── AstrologyAPI Aggregates ────────────────────────────────────────────────
    const totalAstroCalls   = astroLogs.length;
    const totalAstroCostInr = astroLogs.reduce((a, l) => a + parseFloat(l.cost_inr || ASTRO_API_COST_INR), 0);
    const astroEndpointUsage: Record<string, { count: number; costInr: number }> = {};
    for (const log of astroLogs) {
      const ep = log.endpoint || 'unknown';
      if (!astroEndpointUsage[ep]) astroEndpointUsage[ep] = { count: 0, costInr: 0 };
      astroEndpointUsage[ep].count  += 1;
      astroEndpointUsage[ep].costInr += parseFloat(log.cost_inr || ASTRO_API_COST_INR);
    }

    // ── Per-User Stats ─────────────────────────────────────────────────────────
    const CREDIT_VALUE_INR = 35.98; // ₹1799 / 50 credits

    // Helper: classify a token-log row into a feature key. Falls back to a
    // best-effort match on question_preview for legacy rows that pre-date
    // the `feature` column.
    const featureFromLog = (l: any): string => {
      if (l.feature) return l.feature;
      const q = (l.question_preview || '').toLowerCase();
      if (q.startsWith('karma dna'))         return 'karma_dna';
      if (q.startsWith('karmic patterns'))   return 'karmic_patterns';
      if (q.startsWith('your purpose'))      return 'your_purpose';
      if (q.startsWith('year ahead'))        return 'year_ahead';
      if (q.startsWith('royal roast'))       return 'royal_roast';
      if (q.startsWith('remedy'))            return 'remedy';
      if (q.startsWith('gotra'))             return 'your_gotra';
      if (q.startsWith('ishta devata'))      return 'ishta_devata';
      if (q.startsWith('nakshatra'))         return 'nakshatra_ascendant';
      if (q.length > 0)                      return 'chat';
      return 'other';
    };
    const featureFromAstro = (l: any): string => {
      if (l.feature) return l.feature;
      if (l.endpoint === 'basic_horoscope_pdf') return 'core_horoscope';
      if (l.endpoint === 'pro_horoscope_pdf')   return 'professional_horoscope';
      return 'chart_prep';
    };

    // ── Global per-feature aggregates ─────────────────────────────────────────
    type FeatureBucket = {
      key: string; label: string; engine: 'llm' | 'astro_pdf';
      calls: number;
      inputTokens: number; outputTokens: number; totalTokens: number;
      llmCostInr: number; astroCostInr: number; totalCostInr: number;
      creditsCharged: number;
      uniqueUsers: Set<string>;
    };
    const featureGlobal: Record<string, FeatureBucket> = {};
    const ensureBucket = (key: string): FeatureBucket => {
      if (!featureGlobal[key]) {
        const meta = FEATURE_CATALOG.find(f => f.key === key);
        featureGlobal[key] = {
          key,
          label: meta?.label ?? key,
          engine: meta?.engine ?? 'llm',
          calls: 0,
          inputTokens: 0, outputTokens: 0, totalTokens: 0,
          llmCostInr: 0, astroCostInr: 0, totalCostInr: 0,
          creditsCharged: 0,
          uniqueUsers: new Set(),
        };
      }
      return featureGlobal[key];
    };
    for (const l of logs) {
      const key = featureFromLog(l);
      const b = ensureBucket(key);
      b.calls          += 1;
      b.inputTokens    += l.input_tokens  || 0;
      b.outputTokens   += l.output_tokens || 0;
      b.totalTokens    += (l.input_tokens || 0) + (l.output_tokens || 0);
      const cost        = parseFloat(l.cost_inr || 0);
      b.llmCostInr     += cost;
      b.totalCostInr   += cost;
      b.creditsCharged += l.credits_used || 0;
      if (l.user_id) b.uniqueUsers.add(l.user_id);
    }
    for (const l of astroLogs) {
      const key = featureFromAstro(l);
      // chart_prep is internal — only surface it under "Other" if there's no
      // matching feature in the catalog. Skipping it from the per-feature
      // table keeps the UI focused on the 12 user-facing reports.
      if (key === 'chart_prep') continue;
      const b = ensureBucket(key);
      b.calls          += 1;
      const cost        = parseFloat(l.cost_inr || ASTRO_API_COST_INR);
      b.astroCostInr   += cost;
      b.totalCostInr   += cost;
      if (l.user_id) b.uniqueUsers.add(l.user_id);
    }
    const featureBreakdown = FEATURE_CATALOG
      .map(f => featureGlobal[f.key])
      .filter((b): b is FeatureBucket => !!b)
      .map(b => ({
        key: b.key, label: b.label, engine: b.engine,
        calls: b.calls,
        uniqueUsers: b.uniqueUsers.size,
        inputTokens: b.inputTokens,
        outputTokens: b.outputTokens,
        totalTokens: b.totalTokens,
        llmCostInr: parseFloat(b.llmCostInr.toFixed(6)),
        astroCostInr: parseFloat(b.astroCostInr.toFixed(6)),
        totalCostInr: parseFloat(b.totalCostInr.toFixed(6)),
        creditsCharged: b.creditsCharged,
      }));

    // ── Per-User Stats ─────────────────────────────────────────────────────────
    const userStats = users.map((u) => {
      const userLogs     = logs.filter((l) => l.user_id === u.id);
      const userAstro    = astroLogs.filter((l) => l.user_id === u.id);
      const inputTokens  = userLogs.reduce((a, l) => a + (l.input_tokens  || 0), 0);
      const outputTokens = userLogs.reduce((a, l) => a + (l.output_tokens || 0), 0);
      const llmCostInr   = userLogs.reduce((a, l) => a + parseFloat(l.cost_inr || 0), 0);
      const astroCostInr = userAstro.length * ASTRO_API_COST_INR;
      // creditsUsed = what was DEDUCTED from user (2× actual, the dynamic system)
      const creditsDeducted  = userLogs.reduce((a, l) => a + (l.credits_used  || 0), 0);
      // actualCreditCost = what it TRULY cost in credits (costInr / 35.98)
      const actualCreditCost = llmCostInr / CREDIT_VALUE_INR;
      const models       = Array.from(new Set(userLogs.map((l) => l.model_name).filter(Boolean)));

      // ── Per-feature breakdown for THIS user ──────────────────────────────
      // Returns one row per feature the user has actually consumed, ordered
      // by total cost (most expensive first). Used by the admin "User × Feature"
      // matrix table.
      const userFeatureMap: Record<string, {
        key: string; label: string; engine: 'llm' | 'astro_pdf';
        calls: number;
        inputTokens: number; outputTokens: number; totalTokens: number;
        llmCostInr: number; astroCostInr: number; totalCostInr: number;
        creditsCharged: number;
        lastUsedAt: string | null;
      }> = {};
      const ensureUserBucket = (key: string) => {
        if (!userFeatureMap[key]) {
          const meta = FEATURE_CATALOG.find(f => f.key === key);
          userFeatureMap[key] = {
            key,
            label: meta?.label ?? key,
            engine: meta?.engine ?? 'llm',
            calls: 0,
            inputTokens: 0, outputTokens: 0, totalTokens: 0,
            llmCostInr: 0, astroCostInr: 0, totalCostInr: 0,
            creditsCharged: 0,
            lastUsedAt: null,
          };
        }
        return userFeatureMap[key];
      };
      for (const l of userLogs) {
        const b = ensureUserBucket(featureFromLog(l));
        b.calls          += 1;
        b.inputTokens    += l.input_tokens  || 0;
        b.outputTokens   += l.output_tokens || 0;
        b.totalTokens    += (l.input_tokens || 0) + (l.output_tokens || 0);
        const cost        = parseFloat(l.cost_inr || 0);
        b.llmCostInr     += cost;
        b.totalCostInr   += cost;
        b.creditsCharged += l.credits_used || 0;
        if (!b.lastUsedAt || new Date(l.created_at) > new Date(b.lastUsedAt)) {
          b.lastUsedAt = l.created_at;
        }
      }
      for (const l of userAstro) {
        const key = featureFromAstro(l);
        if (key === 'chart_prep') continue;
        const b = ensureUserBucket(key);
        b.calls         += 1;
        const cost       = parseFloat(l.cost_inr || ASTRO_API_COST_INR);
        b.astroCostInr  += cost;
        b.totalCostInr  += cost;
        if (!b.lastUsedAt || new Date(l.created_at) > new Date(b.lastUsedAt)) {
          b.lastUsedAt = l.created_at;
        }
      }
      const featureBreakdown = Object.values(userFeatureMap)
        .map(b => ({
          ...b,
          llmCostInr:   parseFloat(b.llmCostInr.toFixed(6)),
          astroCostInr: parseFloat(b.astroCostInr.toFixed(6)),
          totalCostInr: parseFloat(b.totalCostInr.toFixed(6)),
        }))
        .sort((a, b) => b.totalCostInr - a.totalCostInr);

      // Last activity
      const lastLog = userLogs[0];
      return {
        id:               u.id,
        name:             u.full_name || u.email || 'Unknown',
        email:            u.email,
        joinedAt:         u.created_at,
        lastActivityAt:   lastLog?.created_at || null,
        inputTokens,
        outputTokens,
        totalTokens:      inputTokens + outputTokens,
        llmCostInr,
        astroCalls:       userAstro.length,
        astroCostInr,
        totalCostInr:     llmCostInr + astroCostInr,
        creditsUsed:      creditsDeducted,       // alias kept for backward-compat with admin UI
        creditsDeducted,                          // 2× — what user was charged
        actualCreditCost: parseFloat(actualCreditCost.toFixed(4)), // real cost in credits
        profitMultiple:   creditsDeducted > 0 ? parseFloat((creditsDeducted / actualCreditCost).toFixed(2)) : null,
        creditsRemaining: u.credits ?? 0,
        modelsUsed:       models,
        featureBreakdown,                         // ← per-feature rows for this user
      };
    });

    // Sort by most active (total tokens)
    userStats.sort((a, b) => b.totalTokens - a.totalTokens);

    // ── Recent Activity Feed (last 20 events combined) ─────────────────────────
    const recentLLM = logs.slice(0, 10).map((l) => ({
      type: 'llm' as const,
      timestamp: l.created_at,
      userId: l.user_id,
      model: l.model_name,
      inputTokens: l.input_tokens,
      outputTokens: l.output_tokens,
      costInr: parseFloat(l.cost_inr || 0),
    }));
    const recentAstro = astroLogs.slice(0, 10).map((l) => ({
      type: 'astro' as const,
      timestamp: l.created_at,
      userId: l.user_id,
      endpoint: l.endpoint,
      cached: l.from_cache,
      costInr: parseFloat(l.cost_inr || ASTRO_API_COST_INR),
    }));
    const recentActivity = [...recentLLM, ...recentAstro]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20);

    return NextResponse.json({
      global: {
        totalInputTokens,
        totalOutputTokens,
        totalTokens: totalInputTokens + totalOutputTokens,
        totalLLMCostInr,
        totalCreditsUsed,
        totalActualCredits,      // real cost in credits (costInr / 35.98)
        totalCreditsDeducted,    // 2× — what was actually taken from users
        totalAstroCalls,
        totalAstroCostInr,
        totalCostInr: totalLLMCostInr + totalAstroCostInr,
        modelUsage,
        astroEndpointUsage,
        featureBreakdown,        // ← per-feature aggregates across all users
      },
      featureCatalog: FEATURE_CATALOG,  // ← stable list of the 12 features for the UI
      users: userStats,
      recentActivity,
      fetchedAt: new Date().toISOString(),
      pricing: {
        claudeInputPer1kINR:  CLAUDE_INPUT_PER_1K,
        claudeOutputPer1kINR: CLAUDE_OUTPUT_PER_1K,
        geminiInputPer1kINR:  GEMINI_INPUT_PER_1K,
        geminiOutputPer1kINR: GEMINI_OUTPUT_PER_1K,
        astroApiPerCallINR:   ASTRO_API_COST_INR,
        usdToInr:             84,
      },
    });

  } catch (error: any) {
    console.error('Admin metrics error:', error);
    // Gracefully handle missing tables
    return NextResponse.json({
      global: {
        totalInputTokens: 0, totalOutputTokens: 0, totalTokens: 0,
        totalLLMCostInr: 0, totalCreditsUsed: 0,
        totalAstroCalls: 0, totalAstroCostInr: 0, totalCostInr: 0,
        modelUsage: {}, astroEndpointUsage: {},
      },
      users: [], recentActivity: [],
      fetchedAt: new Date().toISOString(),
      error: error.message,
    });
  }
}
