import { NextResponse } from 'next/server';

const SECRET = process.env.SESSION_SECRET || 'fallback_secret_do_not_use_in_prod';

async function verifySignature(payload, signature) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(JSON.stringify(payload)));
  const expectedSignature = Array.from(new Uint8Array(signatureBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  return expectedSignature === signature;
}

export async function proxy(request) {
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
      const sessionData = JSON.parse(sessionCookie.value);
      const { signature, ...session } = sessionData;
      
      const isValid = await verifySignature(session, signature);
      if (!isValid) {
        throw new Error('Invalid signature');
      }

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
