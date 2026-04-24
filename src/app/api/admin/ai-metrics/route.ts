import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
      const cookieStore = await cookies();
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          cookies: {
            getAll() { return cookieStore.getAll(); },
            setAll() {},
          },
        }
      );

      // Fetch all users with live credit balance
      const { data: users, error: userErr } = await supabase
        .from('user_profiles')
        .select('id, full_name, created_at, credits');
      if (userErr) throw userErr;

      // Fetch all usage logs newest-first
      const { data: logs, error: logErr } = await supabase
        .from('token_usage_logs')
        .select('*')
        .order('created_at', { ascending: false });
      if (logErr && logErr.code !== '42P01') throw logErr;

      const safeLogs = logs || [];

      // ── Global aggregates ──
      const totalInputTokens  = safeLogs.reduce((a: number, l: any) => a + (l.input_tokens  || 0), 0);
      const totalOutputTokens = safeLogs.reduce((a: number, l: any) => a + (l.output_tokens || 0), 0);
      const totalCost         = safeLogs.reduce((a: number, l: any) => a + parseFloat(l.cost_inr || 0), 0);
      const totalCreditsUsed  = safeLogs.reduce((a: number, l: any) => a + (l.credits_used  || 0), 0);

      const modelUsage: Record<string, { tokens: number; count: number; cost: number }> = {};
      safeLogs.forEach((log: any) => {
        if (!modelUsage[log.model_name]) modelUsage[log.model_name] = { tokens: 0, count: 0, cost: 0 };
        modelUsage[log.model_name].tokens += (log.total_tokens || 0);
        modelUsage[log.model_name].count  += 1;
        modelUsage[log.model_name].cost   += parseFloat(log.cost_inr || 0);
      });

      // ── Per-user stats with live credit balance ──
      const userStats = (users || []).map((u: any) => {
        const userLogs    = safeLogs.filter((l: any) => l.user_id === u.id);
        const input       = userLogs.reduce((a: number, l: any) => a + (l.input_tokens  || 0), 0);
        const output      = userLogs.reduce((a: number, l: any) => a + (l.output_tokens || 0), 0);
        const cost        = userLogs.reduce((a: number, l: any) => a + parseFloat(l.cost_inr || 0), 0);
        const creditsUsed = userLogs.reduce((a: number, l: any) => a + (l.credits_used  || 0), 0);
        const models      = Array.from(new Set(userLogs.map((l: any) => l.model_name).filter(Boolean)));

        return {
          id:               u.id,
          name:             u.full_name,
          joinedAt:         u.created_at,
          inputTokens:      input,
          outputTokens:     output,
          totalTokens:      input + output,
          costInr:          cost,
          creditsUsed,
          creditsRemaining: u.credits ?? 0,
          modelsUsed:       models,
        };
      });

      return NextResponse.json({
        global: {
          totalInputTokens,
          totalOutputTokens,
          totalTokens: totalInputTokens + totalOutputTokens,
          totalCostInr: totalCost,
          totalCreditsUsed,
          modelUsage,
        },
        users: userStats,
        fetchedAt: new Date().toISOString(),
      });

  } catch (error: any) {
      console.error('Admin metrics error:', error);
      if (error.code === '42P01') {
        return NextResponse.json({
          global: { totalInputTokens: 0, totalOutputTokens: 0, totalTokens: 0, totalCostInr: 0, totalCreditsUsed: 0, modelUsage: {} },
          users: [],
          fetchedAt: new Date().toISOString(),
        });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
