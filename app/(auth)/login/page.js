'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginAction } from '@/actions/auth';
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await loginAction(email, password);

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
        <h1  style={{fontSize: "var(--font-size-h1-auth, var(--font-size-h1-default))"}} className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h1>
        <p  style={{fontSize: "var(--font-size-p-default, var(--font-size-p-default))"}} className="text-slate-600 dark:text-slate-400 mb-6">Sign in to your <Link href={process.env.NEXT_PUBLIC_BASE_URL || '/'} style={{fontSize: "var(--font-size-link-inline, var(--font-size-link-default))"}} className="text-brand-500 hover:underline">Sphinix Mobile</Link> account</p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" 
              placeholder="you@example.com" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" 
              placeholder="••••••••" 
            />
          </div>
          <Button variant="none" size="none" style={{fontSize: "var(--font-size-button-primary, var(--font-size-button-default))"}}  
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-md px-4 py-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p  style={{fontSize: "var(--font-size-p-subtitle, var(--font-size-p-default))"}} className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Don't have an account? <Link href="/register" replace style={{fontSize: "var(--font-size-link-inline, var(--font-size-link-default))"}} className="text-brand-500 hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}
