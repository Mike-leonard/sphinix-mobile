import React from 'react';

export default function BlogPageHeader({ totalCount }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white dark:bg-[#1a2035] p-3 rounded-lg border border-slate-200 dark:border-slate-800 mb-6 gap-4 min-h-[64px]">
      <div>
        <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight">Blogs & News</h1>
        <p className="text-xs text-slate-500 mt-0.5">Stay updated with the latest mobile trends.</p>
      </div>
      <div className="text-sm font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700">
        {totalCount} Articles
      </div>
    </div>
  );
}
