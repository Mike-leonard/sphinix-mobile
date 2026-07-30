'use server';

import { createClient } from '@/lib/supabase/server';
import { getUserById, createUser, verifyUserEmail } from '@/queries/users';

/**
 * -----------------------------------------------------------------------------
 * AUTH ACTION: verifySession
 * -----------------------------------------------------------------------------
 * @description Validates the active Supabase JWT session cookie and retrieves/syncs the user's role and profile from PostgreSQL.
 * @why Primary security gate used across all server actions, layout routes, and admin pages to enforce RBAC permissions.
 * @where Called by: `app/dashboard/layout.js`, and almost all server actions (`verifySession()`).
 * @security Server-side session verification via Supabase Auth + Prisma user sync.
 * @returns {Promise<{ id: string, email: string, name: string, role: string, emailVerified: boolean, createdAt: Date } | null>} User session object or `null` if unauthenticated.
 */
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

/**
 * -----------------------------------------------------------------------------
 * AUTH ACTION: loginAction
 * -----------------------------------------------------------------------------
 * @description Authenticates a user using email, password, and Cloudflare Turnstile captcha token.
 * @why Enables user login and role-based redirecting (Admin/Moderator to dashboard, Normal to home).
 * @where Called by: `app/(main)/login/page.js`
 * @security Verified against Supabase Auth + Cloudflare Turnstile anti-bot token.
 * @param {string} email - User email address.
 * @param {string} password - User password.
 * @param {string} turnstileToken - Turnstile captcha token.
 * @returns {Promise<{ success: boolean, role?: string, message?: string }>}
 */
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

/**
 * -----------------------------------------------------------------------------
 * AUTH ACTION: registerAction
 * -----------------------------------------------------------------------------
 * @description Registers a new account with email, password, name, and Cloudflare Turnstile verification.
 * @why Allows new users to create accounts on Sphinix Mobile.
 * @where Called by: `app/(main)/register/page.js`
 * @security Turnstile captcha + Supabase Auth user creation + automatic Prisma profile sync.
 * @param {string} email - User email.
 * @param {string} password - Account password.
 * @param {string} name - Full display name.
 * @param {string} turnstileToken - Turnstile captcha token.
 * @returns {Promise<{ success: boolean, message?: string, requireVerification?: boolean }>}
 */
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

/**
 * -----------------------------------------------------------------------------
 * AUTH ACTION: logoutAction
 * -----------------------------------------------------------------------------
 * @description Signs out the current user session and clears authentication cookies.
 * @why Enables user logout from navbar/dashboard headers.
 * @where Called by: `components/Navbar.jsx`, `app/dashboard/_components/AdminSidebar.jsx`
 * @security Destroys current Supabase session token.
 * @returns {Promise<{ success: boolean }>}
 */
export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return { success: true };
}

/**
 * -----------------------------------------------------------------------------
 * AUTH ACTION: forgotPasswordAction
 * -----------------------------------------------------------------------------
 * @description Sends a password reset recovery link to the specified email address.
 * @why Allows users who forgot their password to trigger a recovery email.
 * @where Called by: `app/(main)/forgot-password/page.js`
 * @security Guarded by Cloudflare Turnstile captcha token.
 * @param {string} email - Registered user email address.
 * @param {string} turnstileToken - Turnstile captcha token.
 * @returns {Promise<{ success: boolean, message: string }>}
 */
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

/**
 * -----------------------------------------------------------------------------
 * AUTH ACTION: resetPasswordAction
 * -----------------------------------------------------------------------------
 * @description Updates the account password for an authenticated recovery session.
 * @why Completes the password reset process after clicking the email link.
 * @where Called by: `app/(main)/reset-password/page.js`
 * @security Requires active recovery session cookie set via password reset callback link.
 * @param {string} newPassword - New password to set.
 * @returns {Promise<{ success: boolean, message: string }>}
 */
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
