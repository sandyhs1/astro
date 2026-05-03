import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { getOrBuildChart } from '@/lib/astrology/manager';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id1 = searchParams.get('id1');
  const id2 = searchParams.get('id2');

  if (!id1 || !id2) {
    return NextResponse.json({ error: 'Two Client IDs required' }, { status: 400 });
  }

  try {
    const supabaseAdmin = await createAdminClient();
    const { data: clients, error } = await supabaseAdmin
      .from('astrologer_clients')
      .select('*')
      .in('id', [id1, id2]);

    if (error || !clients || clients.length < 2) throw new Error('Clients not found');

    const p1 = clients.find(c => c.id === id1);
    const p2 = clients.find(c => c.id === id2);

    const { chart: chart1 } = await getOrBuildChart(p1.dob, p1.tob, p1.pob, p1.timezone || '+05:30');
    const { chart: chart2 } = await getOrBuildChart(p2.dob, p2.tob, p2.pob, p2.timezone || '+05:30');

    return NextResponse.json({
      p1: { 
        name: p1.name, 
        planets: chart1.d1.planets.map(p => ({
          name: p.name,
          sign: p.sign,
          degree: p.normDegree.toFixed(2)
        }))
      },
      p2: { 
        name: p2.name, 
        planets: chart2.d1.planets.map(p => ({
          name: p.name,
          sign: p.sign,
          degree: p.normDegree.toFixed(2)
        }))
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
