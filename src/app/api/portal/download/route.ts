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

        // Verify again
        const { data, error } = await supabase
            .from('client_portals')
            .select('report_url, full_name')
            .eq('access_token', token)
            .eq('access_pin', pin)
            .single();

        if (error || !data || !data.report_url) {
            return NextResponse.json({ error: 'Report not available or unauthorized' }, { status: 401 });
        }

        // Extract filename from URL (stored as 'client-reports/filename.pdf' or just 'filename.pdf')
        const filePath = data.report_url;

        // Generate signed URL valid for 3600 seconds (1 hour)
        const { data: signedData, error: signedError } = await supabase
            .storage
            .from('client-reports')
            .createSignedUrl(filePath, 3600, {
                download: `YNTRA_Birth_Chart_${data.full_name.replace(/\s+/g, '_')}.pdf`
            });

        if (signedError || !signedData?.signedUrl) {
            console.error('❌ Failed to generate signed URL:', signedError);
            return NextResponse.json({ error: 'Failed to access file' }, { status: 500 });
        }

        return NextResponse.json({ success: true, url: signedData.signedUrl }, { status: 200 });

    } catch (err: any) {
        console.error('❌ Download Portal Exception:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
