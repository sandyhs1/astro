import { DodoPayments } from "dodopayments";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { productId, customerEmail, customerName, currency } = await req.json();

        const client = new DodoPayments({
            bearerToken: process.env.DODO_PAYMENTS_API_KEY || process.env.NEXT_PUBLIC_DODO_API_KEY,
            environment: 'live_mode',
        });

        if (!productId) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        const session = await client.checkoutSessions.create({
            product_cart: [{
                product_id: productId,
                quantity: 1,
                amount: currency === 'USD' ? 9730 : 479900,
            }],
            customer: {
                email: customerEmail,
                name: customerName,
            },
            billing_currency: currency,
            billing_address: currency === 'INR' ? {
                country: "IN",
            } : undefined,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/?status=success`,
        });

        return NextResponse.json({ checkout_url: session.checkout_url });
    } catch (error: any) {
        console.error("Dodo Payment Error:", error);
        return NextResponse.json({ error: error.message || "Failed to create checkout session" }, { status: 500 });
    }
}
