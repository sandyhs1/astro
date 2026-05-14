import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { createDualmarkMiddleware } from '@dualmark/nextjs'

const dualmarkMw = createDualmarkMiddleware({ siteUrl: 'https://quantumkarma.tech' })

export async function middleware(request: NextRequest) {
  // First, let Supabase handle auth and session updates
  const response = await updateSession(request)

  // Run Dualmark middleware for content negotiation
  const dmResponse = await dualmarkMw(request) as NextResponse

  // If Dualmark intercepted the request (e.g., rewriting to /md/ or throwing 406),
  // we want to return that response, but carry over the auth cookies Supabase set.
  if (dmResponse.headers.has('x-middleware-rewrite') || dmResponse.status !== 200) {
    const cookies = response.headers.getSetCookie()
    cookies.forEach((cookie) => {
      dmResponse.headers.append('set-cookie', cookie)
    })
    return dmResponse
  }

  // Otherwise, it's a regular HTML request. Dualmark added AEO headers (like Link).
  if (dmResponse.headers.has('Link')) {
    response.headers.set('Link', dmResponse.headers.get('Link')!)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - md/ (dualmark internal route)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|md/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
