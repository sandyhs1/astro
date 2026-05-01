import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getFreemius, getUserEntitlement } from '@/lib/freemius';

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const url = new URL(request.url);
  const paymentId = url.searchParams.get('payment_id');

  if (!paymentId) {
    return new Response('Missing payment_id', { status: 400 });
  }

  try {
    const entitlement = await getUserEntitlement(user.id);
    if (!entitlement) {
      return new Response('No active subscription found', { status: 403 });
    }

    // Pass the fsUserId associated with the entitlement and the payment ID
    const invoiceUrl = await getFreemius().api.user.retrieveInvoice(entitlement.fsUserId, paymentId);
    
    // In SDK, retrieveInvoice returns string (url) or the actual file stream.
    // If it's a URL, we can fetch it or redirect.
    // Assuming the SDK method gives us a URL, we can redirect to it.
    if (typeof invoiceUrl === 'string') {
      return NextResponse.redirect(invoiceUrl);
    }
    
    // If it returns a Buffer or ArrayBuffer, we return it as application/pdf.
    return new Response(invoiceUrl, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="invoice.pdf"',
      },
    });
  } catch (error) {
    console.error('Error downloading invoice:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
