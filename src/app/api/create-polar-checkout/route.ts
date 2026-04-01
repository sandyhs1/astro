import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { customerEmail, customerName } = body;
        
        // Ensure success url dynamically routes back to where the user was
        const origin = req.headers.get("origin") || "http://localhost:3000";
        const successURL = `${origin}/?status=success`;
        
        console.log("Generating Polar Checkout Session for Email:", customerEmail);

        // Making direct REST API call to Polar to bypass potential shifting SDK types
        const response = await fetch("https://api.polar.sh/v1/checkouts/custom/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer polar_oat_7bupbeZxfczgai0LlN90nqAWmceSZFkfFP2EW2MTI8x`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                product_id: "bfc60e29-9982-453a-8637-68c4f8419664",
                customer_email: customerEmail || "",
                customer_name: customerName || "",
                success_url: successURL
            })
        });

        if (!response.ok) {
            const errorHtml = await response.text();
            throw new Error(`Polar HTTP Error: ${response.status} - ${errorHtml}`);
        }

        const data = await response.json();
        
        // Return exactly the url we need to redirect the user to
        return NextResponse.json({ checkoutUrl: data.url });
        
    } catch (error: any) {
        console.error("Polar Checkout Generation Error:", error);
        return NextResponse.json({ error: error.message || "Failed to create polar checkout session" }, { status: 500 });
    }
}
