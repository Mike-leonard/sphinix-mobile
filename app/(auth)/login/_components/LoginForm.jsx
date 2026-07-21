'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginAction } from '@/actions/auth';
import { Button } from "@/components/ui/button";
import { createClient } from '@/lib/supabase/client';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import AuthInput from '@/components/auth/AuthInput';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthSubmitButton from '@/components/auth/AuthSubmitButton';
import { Turnstile } from '@marsidev/react-turnstile';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!turnstileToken) {
      setError("Please complete the captcha.");
      setLoading(false);
      return;
    }

    const res = await loginAction(email, password, turnstileToken);

    if (!res.success) {
      setError(res.message);
      setLoading(false);
    } else {
      // Redirect based on role
      if (['Admin', 'Moderator', 'ContentWriter'].includes(res.role)) {
        router.push('/dashboard');
      } else {
        router.push('/');
      }
    }
  };

  return (
    <div className="flex-1 max-w-md w-full mx-auto px-4 py-16">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
        <AuthHeader
          title="Welcome Back"
          descriptionPrefix="Sign in to your"
          descriptionSuffix="account"
        />

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <GoogleSignInButton title="Continue with Google" />

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
          <div className="flex flex-col gap-1 -mt-2 mb-2">
            <AuthInput
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <div className="flex justify-end pr-1">
              <Link href="/forgot-password" replace className="text-sm text-brand-600 hover:text-brand-500 font-medium transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>
          <div className="flex justify-center mt-2 mb-4">
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'} // Fallback testing key
              onSuccess={(token) => setTurnstileToken(token)}
            />
          </div>
          <AuthSubmitButton 
            loading={loading} 
            defaultText="Sign In" 
            loadingText="Signing in..." 
            disabled={!turnstileToken}
          />
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Don't have an account? <Link href="/register" replace className="text-brand-500 hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}
