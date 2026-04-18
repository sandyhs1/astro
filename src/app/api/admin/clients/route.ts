import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Simple middleware to check if request is authenticated
const isAuthenticated = (req: Request) => {
    const authHeader = req.headers.get('Authorization');
    const expectedToken = Buffer.from(process.env.ADMIN_PASSWORD || '').toString('base64');
    return authHeader === `Bearer ${expectedToken}`;
};

export async function GET(req: Request) {
    if (!isAuthenticated(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    try {
        const { data, error } = await supabase
            .from('client_portals')
            .select(`
                id,
                lead_id,
                full_name,
                email,
                access_token,
                access_pin,
                report_url,
                status,
                created_at,
                last_accessed_at,
                onboarding_leads (
                    dob,
                    tob,
                    pob,
                    questions,
                    payment_status
                )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        return NextResponse.json({ success: true, clients: data }, { status: 200 });
    } catch (error: any) {
        console.error('❌ Fetch Clients Exception:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
