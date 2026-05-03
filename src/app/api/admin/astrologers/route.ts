import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  try {
    // Basic auth check - verify request comes from the admin user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user || user.email !== 'sandeshprasad7@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized Access' }, { status: 403 });
    }

    // 1. Fetch 10 most recent astrologer signups
    const { data: recentAstrologers, error: astroErr } = await supabaseAdmin
      .from('astrologers')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (astroErr) throw astroErr;

    // Get emails for these astrologers
    const astrologersWithEmails = await Promise.all(
      recentAstrologers.map(async (astro) => {
        const { data: userData } = await supabaseAdmin.auth.admin.getUserById(astro.id);
        return {
          ...astro,
          email: userData?.user?.email || 'Unknown',
        };
      })
    );

    // 2. Fetch API & LLM usage per astrologer
    // We get all logs for the IDs of the recent astrologers
    const astroIds = recentAstrologers.map(a => a.id);
    
    // token_usage_logs
    const { data: tokenLogs } = await supabaseAdmin
      .from('token_usage_logs')
      .select('user_id, input_tokens, output_tokens, total_tokens, cost_inr, model_name')
      .in('user_id', astroIds);

    // aggregate usage per astrologer
    const usagePerAstrologer: Record<string, any> = {};
    astroIds.forEach(id => {
      usagePerAstrologer[id] = { input: 0, output: 0, total: 0, cost: 0 };
    });

    if (tokenLogs) {
      tokenLogs.forEach(log => {
        if (usagePerAstrologer[log.user_id]) {
          usagePerAstrologer[log.user_id].input += log.input_tokens || 0;
          usagePerAstrologer[log.user_id].output += log.output_tokens || 0;
          usagePerAstrologer[log.user_id].total += log.total_tokens || 0;
          usagePerAstrologer[log.user_id].cost += parseFloat(log.cost_inr || 0);
        }
      });
    }

    // Combine astrologer data with usage
    const finalAstrologers = astrologersWithEmails.map(astro => ({
      ...astro,
      usage: usagePerAstrologer[astro.id]
    }));

    // 3. Fetch Overall input, output, tokens and cost grouped by Model
    const { data: allTokens } = await supabaseAdmin
      .from('token_usage_logs')
      .select('model_name, input_tokens, output_tokens, total_tokens, cost_inr');

    const overallMetrics = {
      gemini: { input: 0, output: 0, total: 0, cost: 0 },
      claude: { input: 0, output: 0, total: 0, cost: 0 },
      api: { cost: 0 } // Assuming astro API logs
    };

    if (allTokens) {
      allTokens.forEach(log => {
        const model = log.model_name || '';
        const cost = parseFloat(log.cost_inr || 0);
        if (model.toLowerCase().includes('gemini') || model.toLowerCase().includes('pro')) {
          overallMetrics.gemini.input += log.input_tokens || 0;
          overallMetrics.gemini.output += log.output_tokens || 0;
          overallMetrics.gemini.total += log.total_tokens || 0;
          overallMetrics.gemini.cost += cost;
        } else if (model.toLowerCase().includes('claude') || model.toLowerCase().includes('sonnet')) {
          overallMetrics.claude.input += log.input_tokens || 0;
          overallMetrics.claude.output += log.output_tokens || 0;
          overallMetrics.claude.total += log.total_tokens || 0;
          overallMetrics.claude.cost += cost;
        }
      });
    }

    // Fetch total AstroAPI costs
    const { data: apiLogs } = await supabaseAdmin
      .from('astroapi_logs')
      .select('cost_inr');
      
    if (apiLogs) {
      apiLogs.forEach(log => {
        overallMetrics.api.cost += parseFloat(log.cost_inr || 0);
      });
    }

    return NextResponse.json({
      recentAstrologers: finalAstrologers,
      overallMetrics
    });

  } catch (error: any) {
    console.error('Admin Fetch Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST to update astrologer status
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseAdmin.auth.getUser(token);
    
    if (!user || user.email !== 'sandeshprasad7@gmail.com') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { astrologerId, status } = await req.json();

    if (!astrologerId || !status) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('astrologers')
      .update({ status })
      .eq('id', astrologerId);

    if (error) throw error;

    return NextResponse.json({ success: true, message: `Status updated to ${status}` });
  } catch (error: any) {
    console.error('Admin Update Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
