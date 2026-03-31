import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This middleware is used to protect dashboard routes from unauthenticated access.
// Since we are using mock authentication for this demo, we'll check for a cookie.
// In a real app, you would verify a JWT or session token here.

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Define protected routes
  const isDashboardRoute = pathname.startsWith('/dashboard') || 
                           pathname.startsWith('/(dashboard)') ||
                           pathname.startsWith('/anggota') ||
                           pathname.startsWith('/produksi') ||
                           pathname.startsWith('/gudang') ||
                           pathname.startsWith('/pasar') ||
                           pathname.startsWith('/logistik') ||
                           pathname.startsWith('/keuangan') ||
                           pathname.startsWith('/ai') ||
                           pathname.startsWith('/assistant') ||
                           pathname.startsWith('/command-center')

  // In this demo, the AuthProvider doesn't set cookies, so we'll simulate the check.
  // Ideally, loginAs should set a 'kopdes-session' cookie.
  const session = request.cookies.get('kopdes-session')

  // If it's a dashboard route and no session exists, redirect to login
  if (isDashboardRoute && !session) {
    const url = new URL('/login', request.url)
    // Avoid redirect loop if already on login
    if (pathname !== '/login') {
      return NextResponse.redirect(url)
    }
  }

  // If session exists and user is on login page, redirect to dashboard
  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - icon.svg, apple-icon.png (public icons)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|icon-light-32x32.png|icon-dark-32x32.png).*)',
  ],
}
