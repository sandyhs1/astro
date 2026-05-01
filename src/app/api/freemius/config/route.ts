import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    productId: process.env.FREEMIUS_PRODUCT_ID,
    publicKey: process.env.FREEMIUS_PUBLIC_KEY,
  });
}
