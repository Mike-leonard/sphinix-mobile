'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function SuccessMessage({
  title = "Check your email",
  message,
  buttonText = "Return to Login",
  redirectTo = "/login"
}) {
  const router = useRouter();

  return (
    <div className="flex-1 max-w-md w-full mx-auto px-4 py-16">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{title}</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">{message}</p>
        <Button onClick={() => router.push(redirectTo)} className="cursor-pointer w-full bg-brand-500 hover:bg-brand-600 text-white">
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
