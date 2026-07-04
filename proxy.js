import { NextResponse } from 'next/server';

export function proxy(request) {
  const { pathname } = request.nextUrl;
  
  // Define privileged roles
  const PRIVILEGED_ROLES = ['Admin', 'Moderator', 'ContentWriter'];

  // Check if we are accessing a protected route
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/activities')) {
    const sessionCookie = request.cookies.get('session');
    
    if (!sessionCookie) {
      // Unauthenticated, redirect to login
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    try {
      const session = JSON.parse(sessionCookie.value);
      const isPrivileged = PRIVILEGED_ROLES.includes(session.role);
      
      // Dashboard restriction: only privileged users
      if (pathname.startsWith('/dashboard') && !isPrivileged) {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
      }

      // Activities restriction: only normal users (not privileged)
      if (pathname.startsWith('/activities') && isPrivileged) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
      }
    } catch (e) {
      // Invalid session format, redirect to login
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/activities/:path*',
  ],
};
