import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { getOrBuildChart } from '@/lib/astrology/manager';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get('clientId');

  if (!clientId) {
    return NextResponse.json({ error: 'Client ID required' }, { status: 400 });
  }

  try {
    const supabaseAdmin = await createAdminClient();
    // 1. Fetch Client Details
    const { data: client, error: clientError } = await supabaseAdmin
      .from('astrologer_clients')
      .select('*')
      .eq('id', clientId)
      .single();

    if (clientError || !client) throw new Error('Client not found');

    // 2. Fetch Usage Metrics (Revenue)
    // We assume the astrologer is the one logged in, but for this admin-key API we just aggregate by client
    // In a real scenario, we'd filter by astrologer_id too
    const { data: usageLogs, error: usageError } = await supabaseAdmin
      .from('token_usage_logs')
      .select('tokens_used, cost_inr')
      .eq('astrologer_client_id', clientId);

    const totalTokens = usageLogs?.reduce((sum, log) => sum + (log.tokens_used || 0), 0) || 0;
    const totalCost = usageLogs?.reduce((sum, log) => sum + (Number(log.cost_inr) || 0), 0) || 0;

    // 3. Generate Timeline (Fetch real data from the Astrology Engine)
    const { chart } = await getOrBuildChart(
      client.dob,
      client.tob,
      client.pob,
      client.timezone || '+05:30'
    );

    const timeline = {
      mahadasha: {
        planet: chart.dasha.mahadasha,
        start: 'Current Cycle',
        end: chart.dasha.mahadashaEnd
      },
      antardasha: {
        planet: chart.dasha.antardasha,
        start: 'Current Cycle',
        end: chart.dasha.antardashaEnd
      },
      pratyantar: {
        planet: chart.dasha.pratyantar,
        start: 'Current Cycle',
        end: ''
      },
      nextMahadasha: {
        planet: (chart.dasha.full.currentDasha as any)._nextMahadasha || 'Next Cycle',
        start: (chart.dasha.full.currentDasha as any)._nextMahadashaStart || 'Future',
        end: (chart.dasha.full.currentDasha as any)._nextMahadashaEnd || ''
      }
    };

    return NextResponse.json({
      timeline,
      revenue: {
        totalTokens,
        totalCost,
        currency: 'INR'
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
