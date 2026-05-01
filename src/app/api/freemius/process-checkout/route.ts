import { NextResponse } from 'next/server';
import { freemius, processPurchase, LIVE_SUPABASE_URL, LIVE_FRONTEND_URL } from '@/lib/freemius';

export async function GET(request: Request) {
  const currentUrl = request.url;
  
  try {
    const url = new URL(currentUrl);
    const modifiedCurrentUrl = new URL(LIVE_SUPABASE_URL);
    modifiedCurrentUrl.search = url.search;
    const modifiedCurrentUrlString = modifiedCurrentUrl.toString();

    // Validate the redirect
    const redirectInfo = await freemius.checkout.processRedirect(
      modifiedCurrentUrlString,
      LIVE_SUPABASE_URL
    );

    if (redirectInfo?.license_id) {
      await processPurchase(redirectInfo.license_id);
    }

    // Redirect to frontend checkout-result
    return NextResponse.redirect(`${LIVE_FRONTEND_URL}/accounts?success=true`);
  } catch (error) {
    console.error('Error processing checkout redirect:', error);
    return NextResponse.redirect(`${LIVE_FRONTEND_URL}/accounts?error=checkout_failed`);
  }
}
