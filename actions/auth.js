'use server';

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

export async function verifySession() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      return null;
    }
    if (!user) {
      return null;
    }
    
    console.log(`[AUTH DEBUG] verifySession: Supabase user found (${user.email}). Fetching Prisma user...`);
    
    // Fetch the extended user profile from our Prisma database
    let dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    });
    
    if (!dbUser) {
      // Auto-sync Supabase user to Prisma if they don't exist yet (handles email & OAuth signups)
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || 'User',
          role: 'Normal',
          password: 'SUPABASE_MANAGED', // Password is managed by Supabase Auth
          emailVerified: !!user.email_confirmed_at,
        }
      });
    } else {
      // Auto-sync email verification status if it changed (e.g. verified on different browser)
      if (!dbUser.emailVerified && user.email_confirmed_at) {
        dbUser = await prisma.user.update({
          where: { id: user.id },
          data: { emailVerified: true }
        });
      }
    }
    
    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role,
    };
  } catch (error) {
    console.error("Session verification error:", error);
    return null;
  }
}

export async function loginAction(email, password, turnstileToken) {
  try {
    if (!turnstileToken) {
      return { success: false, message: 'Please complete the captcha verification' };
    }

    const supabase = await createClient();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        captchaToken: turnstileToken,
      }
    });

    if (error) {
      return { success: false, message: error.message };
    }

    // Verify session to get the role
    const sessionUser = await verifySession();
    
    const role = sessionUser?.role || 'Normal';

    return { success: true, role };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'An error occurred during login' };
  }
}

export async function registerAction(email, password, name, turnstileToken) {
  try {
    if (!turnstileToken) {
      return { success: false, message: 'Please complete the captcha verification' };
    }

    const supabase = await createClient();
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
        captchaToken: turnstileToken,
      }
    });

    if (error) {
      return { success: false, message: error.message };
    }

    // Immediately create the user in Prisma so they exist before email verification
    if (data?.user) {
      try {
        await prisma.user.create({
          data: {
            id: data.user.id,
            email: email,
            name: name,
            role: 'Normal',
            password: 'SUPABASE_MANAGED',
            emailVerified: false,
          }
        });
      } catch (prismaError) {
        console.error('Error syncing new user to Prisma:', prismaError);
        // We don't fail the registration if Prisma sync fails, as verifySession will try again later
      }
    }

    // If confirmation is required, Supabase returns user but no session
    if (data?.user && !data?.session) {
      return { success: true, message: 'Registration successful! Please check your email to verify your account.', requireVerification: true };
    }

    return { success: true, message: 'Registration successful!' };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'An error occurred during registration' };
  }
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return { success: true };
}
