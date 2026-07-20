'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { registerAction } from '@/actions/auth';
import { Turnstile } from '@marsidev/react-turnstile';
import { createClient } from '@/lib/supabase/client';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import AuthInput from '@/components/auth/AuthInput';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthSubmitButton from '@/components/auth/AuthSubmitButton';
import SuccessMessage from '@/components/auth/SuccessMessage';

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!turnstileToken) {
      setError("Please complete the captcha.");
      setLoading(false);
      return;
    }

    const res = await registerAction(email, password, name, turnstileToken);

    if (!res.success) {
      setError(res.message);
      setLoading(false);
    } else {
      setSuccessMessage(res.message);
      setLoading(false);
      // Wait a few seconds then redirect to login
      if (!res.requireVerification) {
        setTimeout(() => router.push('/dashboard'), 2000);
      }
    }
  };

  if (successMessage) {
    return <SuccessMessage message={successMessage} />;
  }

  return (
    <div className="flex-1 max-w-md w-full mx-auto px-4 py-8">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
        <AuthHeader
          title="Create an Account"
          descriptionPrefix="Join"
          descriptionSuffix="today"
        />

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <GoogleSignInButton title="Continue with Google" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthInput
            id="name"
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AuthInput
              id="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <AuthInput
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex justify-center mt-2 mb-4">
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'} // Fallback testing key
              onSuccess={(token) => setTurnstileToken(token)}
            />
          </div>

          <AuthSubmitButton 
            loading={loading} 
            defaultText="Register" 
            loadingText="Registering..." 
          />
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account? <Link href="/login" replace className="text-brand-500 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
