import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function ComparisonBreadcrumb({ title }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white dark:bg-[#1a2035] p-3 rounded-lg border border-slate-200 dark:border-slate-800 mb-6 gap-4 min-h-[64px]">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 flex-wrap">
        <Link href="/" style={{fontSize: "var(--font-size-link-inline, var(--font-size-link-default))"}} className="hover:text-brand-500 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 flex-shrink-0" />
        <Link href="/compare" style={{fontSize: "var(--font-size-link-inline, var(--font-size-link-default))"}} className="hover:text-brand-500 transition-colors">
          Compare
        </Link>
        <ChevronRight className="w-3 h-3 flex-shrink-0" />
        <span className="text-slate-900 dark:text-white line-clamp-1 break-all sm:break-normal font-bold">
          {title}
        </span>
      </div>
      <div className="text-xs sm:text-sm font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 px-3 py-1.5 rounded-md border border-brand-200 dark:border-brand-500/20 whitespace-nowrap flex-shrink-0">
        Comparison Mode
      </div>
    </div>
  );
}
