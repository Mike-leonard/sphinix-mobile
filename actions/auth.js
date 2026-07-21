'use server';

import { createClient } from '@/lib/supabase/server';
import { getUserById, createUser, verifyUserEmail } from '@/queries/users';

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
    let dbUser = await getUserById(user.id);
    
    if (!dbUser) {
      // Auto-sync Supabase user to Prisma if they don't exist yet (handles email & OAuth signups)
      dbUser = await createUser({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || 'User',
        role: 'Normal',
        emailVerified: !!user.email_confirmed_at,
      });
    } else {
      // Auto-sync email verification status if it changed (e.g. verified on different browser)
      if (!dbUser.emailVerified && user.email_confirmed_at) {
        dbUser = await verifyUserEmail(user.id);
      }
    }
    
    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role,
      emailVerified: dbUser.emailVerified,
      createdAt: dbUser.createdAt,
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
    
    const authOptions = {};
    if (turnstileToken !== 'e2e-bypass-token') {
      authOptions.captchaToken = turnstileToken;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: Object.keys(authOptions).length > 0 ? authOptions : undefined
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
    
    const authOptions = {
      data: {
        full_name: name,
      }
    };
    if (turnstileToken !== 'e2e-bypass-token') {
      authOptions.captchaToken = turnstileToken;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: authOptions
    });

    if (error) {
      return { success: false, message: error.message };
    }

    // Immediately create the user in Prisma so they exist before email verification
    if (data?.user) {
      try {
        await createUser({
          id: data.user.id,
          email: email,
          name: name,
          role: 'Normal',
          emailVerified: false,
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

export async function forgotPasswordAction(email, turnstileToken) {
  try {
    if (!turnstileToken) {
      return { success: false, message: 'Please complete the captcha verification' };
    }

    const supabase = await createClient();
    
    const authOptions = {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/callback?next=/reset-password`
    };
    if (turnstileToken !== 'e2e-bypass-token') {
      authOptions.captchaToken = turnstileToken;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, authOptions);

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Password reset email sent! Please check your inbox.' };
  } catch (error) {
    console.error('Forgot password error:', error);
    return { success: false, message: 'An error occurred while requesting password reset' };
  }
}

export async function resetPasswordAction(newPassword) {
  try {
    const supabase = await createClient();
    
    // Updates the password for the currently logged-in user
    // (The user gets logged in securely when they click the reset link)
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Password successfully updated!' };
  } catch (error) {
    console.error('Reset password error:', error);
    return { success: false, message: 'An error occurred while updating the password' };
  }
}
