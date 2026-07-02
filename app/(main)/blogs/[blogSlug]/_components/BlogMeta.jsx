import React from 'react';

export default function BlogMeta({ blog }) {
  return (
    <div className="flex flex-wrap items-center gap-4 p-6 border-b border-slate-100 dark:border-slate-800 text-sm text-slate-500 font-medium bg-slate-50 dark:bg-[#0b1120]">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-500 flex items-center justify-center font-bold text-xs border border-brand-200 dark:border-brand-500/20">
          {blog.author.charAt(0)}
        </div>
        <span className="text-slate-900 dark:text-slate-300">{blog.author}</span>
      </div>
      <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
      <span>{blog.date}</span>
      <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
      <span>{blog.readTime}</span>
    </div>
  );
}
