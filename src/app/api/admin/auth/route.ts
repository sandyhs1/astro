import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { password } = await req.json();
        
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

        if (!ADMIN_PASSWORD) {
            console.error('❌ ADMIN_PASSWORD is not set in environment variables');
            return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
        }

        if (password === ADMIN_PASSWORD) {
            // Give out a simple static token since the admin panel is internal
            // More secure would be JWT, but this suffices for single-admin use-case over HTTPS
            const token = Buffer.from(ADMIN_PASSWORD).toString('base64');
            
            return NextResponse.json({ success: true, token }, { status: 200 });
        }

        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
