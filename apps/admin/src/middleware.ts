import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// Minimal middleware to protect admin routes
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Public paths that don't need auth
  const isPublicPath = path === '/login' || path.startsWith('/api/public')

  // Get the token from cookies
  const token = request.cookies.get('admin_token')?.value || ''

  try {
    if (token) {
      // Verify token
      const secret = new TextEncoder().encode(process.env.ADMIN_PASSWORD || 'default_secret')
      await jwtVerify(token, secret)
      
      // If valid and trying to access login, redirect to dashboard
      if (isPublicPath && path === '/login') {
        return NextResponse.redirect(new URL('/', request.nextUrl))
      }
    } else {
      // No token found
      if (!isPublicPath) {
        return NextResponse.redirect(new URL('/login', request.nextUrl))
      }
    }
  } catch (error) {
    // Invalid token
    if (!isPublicPath) {
      return NextResponse.redirect(new URL('/login', request.nextUrl))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
