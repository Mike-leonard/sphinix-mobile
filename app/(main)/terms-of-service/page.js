import React from 'react';
import { Scale, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { rawOrigin } from '@/lib/utils';

export const metadata = {
  title: 'Terms of Service | Sphinix Mobile',
  description: 'Terms of Service for Sphinix Mobile. Read our rules, user guidelines, and content licensing.'
};

export default function TermsOfServicePage() {
  return (
    <div className="flex-1 max-w-[1000px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-8 bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Header */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-6 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold">
            <Scale className="w-4 h-4" /> User Agreement
          </div>
          <h1 style={{ fontSize: "var(--font-size-h1-default, var(--font-size-h1-default))" }} className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Terms of Service
          </h1>
          <p style={{ fontSize: "var(--font-size-p-subtitle, var(--font-size-p-default))" }} className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Last Updated: January 24, 2026
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            Welcome to <strong>Sphinix Mobile</strong>. These terms and conditions outline the rules and regulations for the use of Sphinix Mobile's Website, accessible at <Link href={rawOrigin} className="text-brand-600 dark:text-brand-400 font-semibold">sphinix.xyz</Link>.
          </p>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs sm:text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use Sphinix Mobile if you do not agree to all of the terms stated on this page.
            </div>
          </div>

          <h2 style={{ fontSize: "var(--font-size-h2-default, var(--font-size-h2-default))" }} className="text-xl font-bold text-slate-900 dark:text-white pt-4">
            1. Intellectual Property & License
          </h2>
          <p>
            Unless otherwise stated, Sphinix Mobile and/or its licensors own the intellectual property rights for all material on Sphinix Mobile. All intellectual property rights are reserved. You may access this for your own personal use subjected to restrictions set in these terms.
          </p>

          <div className="space-y-2 pl-4 border-l-2 border-brand-500">
            <div className="font-semibold text-slate-900 dark:text-white">You must not:</div>
            <ul className="list-disc pl-6 space-y-1 text-xs sm:text-sm">
              <li>Republish material from Sphinix Mobile without written attribution.</li>
              <li>Sell, rent, or sub-license technical comparison data for commercial APIs.</li>
              <li>Reproduce, duplicate, or copy database material for automated scraper aggregators.</li>
            </ul>
          </div>

          <h2 style={{ fontSize: "var(--font-size-h2-default, var(--font-size-h2-default))" }} className="text-xl font-bold text-slate-900 dark:text-white pt-4">
            2. User Comments & Content Submissions
          </h2>
          <p>
            Parts of this website offer an opportunity for users to post opinions and information in article comments. Sphinix Mobile does not filter, edit, publish, or review comments prior to their presence on the website. Comments reflect the views of the person who posts them.
          </p>

          <h2 style={{ fontSize: "var(--font-size-h2-default, var(--font-size-h2-default))" }} className="text-xl font-bold text-slate-900 dark:text-white pt-4">
            3. Accuracy of Specifications & Product Data
          </h2>
          <p>
            While our lab team and AI tools work diligently to verify mobile specifications, benchmark scores, and launch prices, Sphinix Mobile does not warrant that all specification details are 100% accurate, complete, or error-free. We recommend verifying details with manufacturers prior to purchasing decisions.
          </p>

          <h2 style={{ fontSize: "var(--font-size-h2-default, var(--font-size-h2-default))" }} className="text-xl font-bold text-slate-900 dark:text-white pt-4">
            4. Limitation of Liability
          </h2>
          <p>
            In no event shall Sphinix Mobile, nor any of its officers, directors, or employees, be held liable for anything arising out of or in any way connected with your use of this website whether such liability is under contract.
          </p>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Thank you for being part of the Sphinix Mobile tech community.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
