import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const sessionToken =
    request.cookies.get('__Secure-authjs.session-token') ||
    request.cookies.get('authjs.session-token') ||
    request.cookies.get('next-auth.session-token');

  const adminRoleCookie = request.cookies.get('simplifypdf_role')?.value;
  const adminMfaVerified = request.cookies.get('simplifypdf_mfa_verified')?.value;

  // Enforce ADMIN or SUPER_ADMIN role verification
  if (adminRoleCookie && adminRoleCookie !== 'ADMIN' && adminRoleCookie !== 'SUPER_ADMIN') {
    return new NextResponse('403 Forbidden: Insufficient Admin Privileges', { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
