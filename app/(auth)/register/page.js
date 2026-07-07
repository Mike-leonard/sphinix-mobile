import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <div className="flex-1 max-w-md w-full mx-auto px-4 py-16">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1  style={{fontSize: "var(--font-size-h1-auth, var(--font-size-h1-default))"}} className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Create an Account</h1>
        <p  style={{fontSize: "var(--font-size-p-default, var(--font-size-p-default))"}} className="text-slate-600 dark:text-slate-400 mb-6">Join <Link href={process.env.BASE_URL} style={{fontSize: "var(--font-size-link-inline, var(--font-size-link-default))"}} className="text-brand-500 hover:underline">Sphinix Mobile</Link> today</p>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Full Name</label>
            <input type="text" className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Email Address</label>
            <input type="email" className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Password</label>
            <input type="password" className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="••••••••" />
          </div>
          <Button variant="none" size="none" style={{fontSize: "var(--font-size-button-primary, var(--font-size-button-default))"}}  type="button" className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-md px-4 py-2 transition-colors mt-2">
            Register
          </Button>
        </form>

        <p  style={{fontSize: "var(--font-size-p-subtitle, var(--font-size-p-default))"}} className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account? <Link href="/login" replace style={{fontSize: "var(--font-size-link-inline, var(--font-size-link-default))"}} className="text-brand-500 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
