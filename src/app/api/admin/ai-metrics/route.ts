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
      supabase.from('token_usage_logs').select('*').order('created_at', { ascending: false }).limit(500),
      supabase.from('astroapi_logs').select('*').order('created_at', { ascending: false }).limit(500),
    ]);

    if (usersRes.error) throw usersRes.error;
    const users    = usersRes.data  || [];
    const logs     = logsRes.data   || [];
    const astroLogs= astroLogsRes.data || [];

    // ── LLM Global Aggregates ──────────────────────────────────────────────────
    const totalInputTokens  = logs.reduce((a, l) => a + (l.input_tokens  || 0), 0);
    const totalOutputTokens = logs.reduce((a, l) => a + (l.output_tokens || 0), 0);
    const totalLLMCostInr   = logs.reduce((a, l) => a + parseFloat(l.cost_inr || 0), 0);
    const totalCreditsUsed  = logs.reduce((a, l) => a + (l.credits_used  || 0), 0);

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
    const userStats = users.map((u) => {
      const userLogs     = logs.filter((l) => l.user_id === u.id);
      const userAstro    = astroLogs.filter((l) => l.user_id === u.id);
      const inputTokens  = userLogs.reduce((a, l) => a + (l.input_tokens  || 0), 0);
      const outputTokens = userLogs.reduce((a, l) => a + (l.output_tokens || 0), 0);
      const llmCostInr   = userLogs.reduce((a, l) => a + parseFloat(l.cost_inr || 0), 0);
      const astroCostInr = userAstro.length * ASTRO_API_COST_INR;
      const creditsUsed  = userLogs.reduce((a, l) => a + (l.credits_used  || 0), 0);
      const models       = Array.from(new Set(userLogs.map((l) => l.model_name).filter(Boolean)));

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
        creditsUsed,
        creditsRemaining: u.credits ?? 0,
        modelsUsed:       models,
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
        totalAstroCalls,
        totalAstroCostInr,
        totalCostInr: totalLLMCostInr + totalAstroCostInr,
        modelUsage,
        astroEndpointUsage,
      },
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
