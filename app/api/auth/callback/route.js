import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { upsertUserEmailVerified } from '@/queries/users';

function getOrigin(request) {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, '');
  }
  if (process.env.BASE_URL) {
    return process.env.BASE_URL.replace(/\/$/, '');
  }

  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`.replace('0.0.0.0', 'localhost');
  }

  const requestUrl = new URL(request.url);
  return requestUrl.origin.replace('0.0.0.0', 'localhost');
}

export async function GET(request) {
  const origin = getOrigin(request);
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next');

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data?.session?.user) {
      // The user successfully verified their email. Update Prisma.
      const user = data.session.user;
      
      try {
        const dbUser = await upsertUserEmailVerified(user);

        // Redirect based on role, just like the normal login form!
        // If a 'next' redirect is explicitly requested (e.g., password reset), prioritize it.
        if (next) {
          return NextResponse.redirect(`${origin}${next}`);
        } else if (['Admin', 'Moderator', 'ContentWriter'].includes(dbUser.role)) {
          return NextResponse.redirect(`${origin}/dashboard`);
        } else {
          return NextResponse.redirect(`${origin}/`);
        }
      } catch (err) {
        console.error("Error updating emailVerified in Prisma:", err);
      }
    }
  }

  // Fallback redirect if something above fails or no code was provided
  if (next) {
    return NextResponse.redirect(`${origin}${next}`);
  }
  return NextResponse.redirect(`${origin}/`);
}
