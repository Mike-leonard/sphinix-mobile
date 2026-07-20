import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

let prisma;
if (process.env.NODE_ENV === 'production') {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });
} else {
  if (!globalThis.prisma) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    globalThis.prisma = new PrismaClient({ adapter });
  }
  prisma = globalThis.prisma;
}

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data?.session?.user) {
      // The user successfully verified their email. Update Prisma.
      const user = data.session.user;
      
      try {
        const dbUser = await prisma.user.upsert({
          where: { id: user.id },
          update: { emailVerified: true },
          create: {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || 'User',
            role: 'Normal',
            password: 'SUPABASE_MANAGED',
            emailVerified: true,
          }
        });

        // Redirect based on role, just like the normal login form!
        if (['Admin', 'Moderator', 'ContentWriter'].includes(dbUser.role)) {
          return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
        } else {
          return NextResponse.redirect(`${requestUrl.origin}/`);
        }
      } catch (err) {
        console.error("Error updating emailVerified in Prisma:", err);
      }
    }
  }

  // Fallback redirect if something above fails or no code was provided
  return NextResponse.redirect(`${requestUrl.origin}/`);
}
