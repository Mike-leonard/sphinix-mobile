'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cookie, ShieldCheck, X } from 'lucide-react';

export default function CookieConsent() {
  const pathname = usePathname();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Don't show cookie banner inside dashboard routes
    if (pathname && pathname.startsWith('/dashboard')) {
      setShowBanner(false);
      return;
    }

    // Check saved consent state in localStorage
    const savedConsent = localStorage.getItem('sphinix_cookie_consent');
    if (!savedConsent) {
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const handleConsent = (status) => {
    localStorage.setItem('sphinix_cookie_consent', status);
    setShowBanner(false);

    // Notify listeners (like AnalyticsWrapper) of consent update
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: status }));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-[9999] animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-5 shadow-2xl shadow-slate-900/20 text-slate-900 dark:text-slate-100 flex flex-col gap-4">
        
        {/* Header with Icon */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 shrink-0">
              <Cookie className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                We value your privacy
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Global Privacy & Cookie Choice
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => handleConsent('declined')}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          We use essential cookies for site functionality and optional analytics/advertising cookies to personalize content and measure performance.{' '}
          <Link href="/privacy-policy" className="text-brand-600 dark:text-brand-400 font-semibold underline underline-offset-2 hover:opacity-80">
            Read Privacy Policy
          </Link>
        </p>

        {/* Dual Consent Buttons for Global Compliance */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => handleConsent('declined')}
            className="flex-1 px-4 py-2.5 rounded-2xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors text-center"
          >
            Essential Only
          </button>

          <button
            onClick={() => handleConsent('accepted')}
            className="flex-1 px-4 py-2.5 rounded-2xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            Accept All
          </button>
        </div>

      </div>
    </div>
  );
}
