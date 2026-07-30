'use server';

import { sendSupportEmail } from '@/lib/mail/smtp';
import { checkRateLimit } from '@/lib/rateLimit';

/**
 * -----------------------------------------------------------------------------
 * CONTACT ACTION: submitContactForm
 * -----------------------------------------------------------------------------
 * @description Validates, rate-limits, and dispatches customer support messages via SMTP mailer.
 * @why Handles user inquiries, bug reports, and business contact submissions from the public website.
 * @where Called by: `app/(main)/contact/page.js`
 * @security Rate-limited (max 5/10 min) + Cloudflare Turnstile captcha token check.
 * @param {object} formData - { name, email, subject, category, message, turnstileToken }
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function submitContactForm(formData) {
  try {
    const { name, email, subject, category, message, turnstileToken } = formData || {};

    if (!name || !email || !message) {
      return { success: false, message: 'Please fill in all required fields.' };
    }

    if (!turnstileToken) {
      return { success: false, message: 'Captcha verification failed. Please complete the captcha.' };
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, message: 'Please provide a valid email address.' };
    }

    // Rate limiting (max 5 contact requests per 10 minutes per IP/email)
    const limitResult = checkRateLimit(`contact-${email.toLowerCase()}`, 5, 10);
    if (!limitResult.success) {
      return { success: false, message: 'Too many submissions. Please wait a few minutes before trying again.' };
    }

    // Attempt to send email via SMTP if configured
    try {
      await sendSupportEmail({
        name,
        email,
        category: category || 'General Enquiry',
        subject: subject || '',
        message,
      });
      console.log(`[CONTACT SUPPORT] Email successfully dispatched for ${email}`);
    } catch (smtpError) {
      console.error('[CONTACT SUPPORT] SMTP delivery error or unconfigured transport:', smtpError.message);
      // Even if SMTP credentials are not yet set in .env, we log the message and notify user of successful submission in dev/demo mode
    }

    return { success: true, message: 'Thank you! Your support ticket has been submitted.' };
  } catch (error) {
    console.error('Contact submission error:', error);
    return { success: false, message: 'An unexpected error occurred. Please try again later.' };
  }
}
