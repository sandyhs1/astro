import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
        console.error('❌ Razorpay credentials missing from environment variables.');
        return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 500 });
    }

    const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
    });

    try {
        const body = await req.json();
        const { amount, currency = 'INR', plan = 'test' } = body;

        if (!amount || amount < 100) {
            return NextResponse.json({ error: 'Amount must be at least ₹1 (100 paise)' }, { status: 400 });
        }

        const order = await razorpay.orders.create({
            amount: Number(amount), // in paise
            currency,
            receipt: `receipt_${plan}_${Date.now()}`,
            notes: {
                plan,
                source: 'YNTRA Landing Page',
            },
        });

        return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency }, { status: 200 });
    } catch (err: any) {
        console.error('❌ Razorpay Order Creation Error:', err);
        return NextResponse.json({ error: err?.error?.description || err.message || 'Failed to create order' }, { status: 500 });
    }
}
