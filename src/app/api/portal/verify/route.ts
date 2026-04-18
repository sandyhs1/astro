import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    try {
        const body = await req.json();
        const { token, pin } = body;

        if (!token || !pin) {
            return NextResponse.json({ error: 'Missing token or PIN' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('client_portals')
            .select('id, full_name, status, last_accessed_at, report_url')
            .eq('access_token', token)
            .eq('access_pin', pin)
            .single();

        if (error || !data) {
            return NextResponse.json({ error: 'Invalid token or PIN' }, { status: 401 });
        }

        // Update last accessed time
        await supabase
            .from('client_portals')
            .update({ last_accessed_at: new Date().toISOString() })
            .eq('id', data.id);

        const welcomeMessage = `Welcome, ${data.full_name}. Your cosmic blueprint awaits.`;

        return NextResponse.json({ 
            success: true, 
            client: {
                fullName: data.full_name,
                status: data.status,
                welcomeMessage,
                hasReport: !!data.report_url
            }
        }, { status: 200 });

    } catch (err: any) {
        console.error('❌ Verify Portal Exception:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
