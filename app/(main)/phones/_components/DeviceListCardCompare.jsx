'use client';

import React from 'react';
import { useCompare } from '@/context/CompareContext';

export default function DeviceListCardCompare({ product, isComparing: propIsComparing, onToggleCompare: propOnToggleCompare }) {
  const compareContext = useCompare();

  const isComparing = propIsComparing ?? (product?.id ? compareContext?.compareList?.some(item => item?.id === product?.id) : false);
  const handleToggle = propOnToggleCompare ?? (() => {
    if (product && compareContext?.handleToggleCompare) {
      compareContext.handleToggleCompare(product);
    }
  });

  return (
    <label className="group/compare flex items-center gap-2 cursor-pointer py-1.5 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
      <input 
        type="checkbox"
        checked={isComparing || false}
        onChange={handleToggle}
        className="rounded border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-brand-600 dark:text-brand-500 focus:ring-brand-500 focus:ring-offset-white dark:focus:ring-offset-slate-900 w-4 h-4 cursor-pointer"
      />
      <span className={`text-sm font-semibold select-none transition-colors ${isComparing ? "text-brand-600 dark:text-brand-400 font-bold" : "text-slate-600 dark:text-slate-400 group-hover/compare:text-slate-900 dark:group-hover/compare:text-white"}`}>
        Add to Compare
      </span>
    </label>
  );
}
