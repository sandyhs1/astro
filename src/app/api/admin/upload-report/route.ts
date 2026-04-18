import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// App Router config to allow larger uploads
export const config = {
    api: {
        bodyParser: false,
    },
};

const isAuthenticated = (req: Request) => {
    const authHeader = req.headers.get('Authorization');
    const expectedToken = Buffer.from(process.env.ADMIN_PASSWORD || '').toString('base64');
    return authHeader === `Bearer ${expectedToken}`;
};

export async function POST(req: Request) {
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
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const portalId = formData.get('portalId') as string;

        if (!file || !portalId) {
            return NextResponse.json({ error: 'Missing file or portalId' }, { status: 400 });
        }

        // Validate file is PDF
        if (file.type !== 'application/pdf') {
            return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 });
        }

        // Generate unique filename
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.\-]/g, '_');
        const fileName = `${portalId}_${timestamp}_${safeName}`;
        const filePath = `${fileName}`; // Uploads directly to bucket root

        console.log(`📤 Uploading file ${fileName} to Supabase Storage...`);

        // Upload to Supabase Storage 'client-reports' bucket
        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('client-reports')
            .upload(filePath, buffer, {
                contentType: 'application/pdf',
                upsert: true
            });

        if (uploadError) {
            console.error('❌ Supabase Upload Error:', uploadError);
            throw uploadError;
        }

        // Update the client_portals row
        const { error: updateError } = await supabase
            .from('client_portals')
            .update({
                report_url: filePath,
                report_uploaded_at: new Date().toISOString(),
                status: 'ready'
            })
            .eq('id', portalId);

        if (updateError) {
            console.error('❌ Supabase Update Error:', updateError);
            // Ideally rollback the storage upload, but leaving it is fine for now
            throw updateError;
        }

        console.log(`✅ Upload complete & DB updated for portal ${portalId}`);
        return NextResponse.json({ success: true, filePath }, { status: 200 });
    } catch (error: any) {
        console.error('❌ Upload API Exception:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
