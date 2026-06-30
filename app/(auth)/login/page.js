import React from 'react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex-1 max-w-md w-full mx-auto px-4 py-16">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Sign in to your <Link href={process.env.BASE_URL} className="text-brand-500 hover:underline">Sphinix Mobile</Link> account</p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Email Address</label>
            <input type="email" className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Password</label>
            <input type="password" className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="••••••••" />
          </div>
          <button type="button" className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-md px-4 py-2 transition-colors">
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Don't have an account? <Link href="/register" replace className="text-brand-500 hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}
