'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { forgotPasswordAction } from '@/actions/auth';
import AuthInput from '@/components/auth/AuthInput';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthSubmitButton from '@/components/auth/AuthSubmitButton';
import { Turnstile } from '@marsidev/react-turnstile';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!turnstileToken) {
      setError("Please complete the captcha.");
      setLoading(false);
      return;
    }

    const res = await forgotPasswordAction(email, turnstileToken);

    if (!res.success) {
      setError(res.message);
    } else {
      setSuccess(res.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 max-w-md w-full mx-auto px-4 py-16">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
        <AuthHeader
          title="Reset Password"
          descriptionPrefix="Enter your email to"
          descriptionSuffix="reset it"
        />

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-200 text-green-700 rounded-md text-sm">
            {success}
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthInput
              id="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            
            <div className="flex justify-center mt-2 mb-4">
              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'} // Fallback testing key
                onSuccess={(token) => setTurnstileToken(token)}
              />
            </div>

            <AuthSubmitButton 
              loading={loading}
              defaultText="Send Reset Link"
              loadingText="Sending..."
            />
          </form>
        )}

        <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Remember your password?{' '}
          <Link href="/login" replace className="text-brand-600 hover:text-brand-500 font-medium transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
