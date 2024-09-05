import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const sessionToken = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = request.nextUrl;
  if (!sessionToken && pathname !== '/login' && !pathname.startsWith('/js/')) {
    return NextResponse.redirect(new URL('/login', request.url), 302);
  }

  if (sessionToken && pathname === '/login') {
    return NextResponse.redirect(new URL('/all-file', request.url), 302);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|forget-password|signup|reset-password|public|.*\\.png$).*)',
  ],
};
