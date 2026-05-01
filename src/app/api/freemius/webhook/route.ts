import { NextResponse } from 'next/server';
import { getFreemius, processPurchase, deleteEntitlement } from '@/lib/freemius';
import { WebhookAuthenticationMethod, WebhookEventType } from '@freemius/sdk';

// NOTE: The listener is created lazily inside the POST handler to avoid
// instantiating the Freemius SDK at module-load time (which crashes when
// env vars are undefined during Vercel's build-time static analysis).

const licenseEvents: WebhookEventType[] = [
  'license.created',
  'license.extended',
  'license.shortened',
  'license.updated',
  'license.cancelled',
  'license.expired',
  'license.plan.changed',
];

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    
    // Convert Headers to standard JS object as required by SDK
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // Create listener lazily at request time — env vars are guaranteed to
    // be present in the runtime environment.
    const listener = getFreemius().webhook.createListener({
      authenticationMethod: WebhookAuthenticationMethod.Api,
    });

    listener.on(licenseEvents, async ({ objects: { license } }) => {
      if (license && license.id) {
        console.log(`Processing license event for license ID: ${license.id}`);
        await processPurchase(license.id);
      }
    });

    listener.on('license.deleted', async ({ data }) => {
      console.log(`Processing license.deleted for license ID: ${data.license_id}`);
      await deleteEntitlement(data.license_id);
    });

    // Process asynchronously to avoid holding up the webhook response
    listener
      .process({
        headers: headers,
        rawBody: rawBody,
      })
      .catch((error) => {
        console.error('Error processing Freemius webhook:', error);
      });

    // Pass a 2xx response to Freemius immediately
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook endpoint error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
