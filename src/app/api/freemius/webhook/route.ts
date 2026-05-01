import { NextResponse } from 'next/server';
import { freemius, processPurchase, deleteEntitlement } from '@/lib/freemius';
import { WebhookAuthenticationMethod, WebhookEventType } from '@freemius/sdk';

const listener = freemius.webhook.createListener({
  authenticationMethod: WebhookAuthenticationMethod.Api,
});

const licenseEvents: WebhookEventType[] = [
  'license.created',
  'license.extended',
  'license.shortened',
  'license.updated',
  'license.cancelled',
  'license.expired',
  'license.plan.changed',
];

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

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    
    // Convert Headers to standard JS object as required by SDK
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
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
