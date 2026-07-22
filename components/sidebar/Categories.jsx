import React from 'react';
import Link from 'next/link';
import { getCategoryListWithCounts } from '@/actions/categories';

export default async function Categories({ selectedCategory: propSelectedCategory }) {
  const categories = await getCategoryListWithCounts();

  if (!categories || categories.length === 0) return null;

  const activeCategory = propSelectedCategory || "All";

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm">
      <h3 style={{ fontSize: "var(--font-size-h3-section, var(--font-size-h3-default))" }} className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
        Categories
      </h3>

      <div className="flex flex-wrap gap-2">
        {categories.map(cat => {
          const isSelected = activeCategory.toLowerCase() === cat.name.toLowerCase() || (activeCategory === "All" && cat.name === "All");
          const href = cat.name === 'All' ? '/blogs' : `/blogs?category=${encodeURIComponent(cat.name)}`;

          return (
            <Link
              key={cat.name}
              href={href}
              className={`cursor-pointer px-3.5 py-1.5 rounded-xl text-xs font-medium inline-flex items-center gap-2 transition-all duration-200 border ${
                isSelected
                  ? 'bg-brand-500 text-white border-brand-500 shadow-sm shadow-brand-500/20 font-semibold scale-[1.02]'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200/60 dark:border-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{cat.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold transition-colors ${
                isSelected
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-200/80 dark:bg-slate-700/80 text-slate-500 dark:text-slate-400'
              }`}>
                {cat.count}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}