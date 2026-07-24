import React from 'react';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Sphinix Mobile',
  description: 'Privacy Policy for Sphinix Mobile. Learn how we collect, use, and protect your personal data.'
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex-1 max-w-[1000px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-8 bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Header */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-6 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" /> Legal Document
          </div>
          <h1 style={{ fontSize: "var(--font-size-h1-default, var(--font-size-h1-default))" }} className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Privacy Policy
          </h1>
          <p style={{ fontSize: "var(--font-size-p-subtitle, var(--font-size-p-default))" }} className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Last Updated: January 24, 2026
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            At <strong>Sphinix Mobile</strong>, accessible from <span className="text-brand-600 dark:text-brand-400 font-semibold">sphinix-mobile.com</span>, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Sphinix Mobile and how we use it.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Lock className="w-4 h-4 text-brand-500" /> Data Security
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                We employ industry-standard encryption protocols and secure database connections to protect user account integrity.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Eye className="w-4 h-4 text-brand-500" /> Transparency
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                We never sell, trade, or rent your personal identification information to third parties.
              </p>
            </div>
          </div>

          <h2 style={{ fontSize: "var(--font-size-h2-default, var(--font-size-h2-default))" }} className="text-xl font-bold text-slate-900 dark:text-white pt-4">
            1. Information We Collect
          </h2>
          <p>
            When you register for an account, subscribe to our tech newsletter, or leave comments on reviews, we may collect personal information including your name, email address, and profile preferences.
          </p>

          <h2 style={{ fontSize: "var(--font-size-h2-default, var(--font-size-h2-default))" }} className="text-xl font-bold text-slate-900 dark:text-white pt-4">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, operate, and maintain our smartphone database and comparison features.</li>
            <li>Improve, personalize, and expand article recommendation content.</li>
            <li>Understand and analyze how visitors interact with benchmark charts.</li>
            <li>Develop new tech evaluation tools, services, and specification features.</li>
            <li>Prevent fraud and enhance security against malicious automated bots.</li>
          </ul>

          <h2 style={{ fontSize: "var(--font-size-h2-default, var(--font-size-h2-default))" }} className="text-xl font-bold text-slate-900 dark:text-white pt-4">
            3. Log Files & Cookie Technologies
          </h2>
          <p>
            Sphinix Mobile follows a standard procedure of using log files. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and number of clicks. These are not linked to any information that is personally identifiable.
          </p>

          <h2 style={{ fontSize: "var(--font-size-h2-default, var(--font-size-h2-default))" }} className="text-xl font-bold text-slate-900 dark:text-white pt-4">
            4. Third Party Privacy Policies
          </h2>
          <p>
            Sphinix Mobile's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of third-party ad servers (such as Google AdSense) for more detailed information.
          </p>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-500">
            <FileText className="w-4 h-4 text-brand-500" />
            <span>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact support.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
