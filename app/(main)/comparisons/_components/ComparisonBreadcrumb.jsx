
import React from 'react';

export default function ComparisonBreadcrumb({ title }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white dark:bg-[#1a2035] p-4 rounded-lg border border-slate-200 dark:border-slate-800 mb-6 gap-4 min-h-[64px]">
      <div className="flex items-center gap-2 flex-wrap">
        <h1 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white line-clamp-1 break-all sm:break-normal">
          {title}
        </h1>
      </div>
      <div className="text-xs sm:text-sm font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 px-3 py-1.5 rounded-md border border-brand-200 dark:border-brand-500/20 whitespace-nowrap flex-shrink-0">
        Comparison Mode
      </div>
    </div>
  );
}
