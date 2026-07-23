'use client';

import React from 'react';
import { CardFooter } from '@/components/ui/card';
import { useCompare } from '@/context/CompareContext';

export default function ProductCardFooter({ price, product, isComparing: propIsComparing, onToggleCompare: propToggleCompare }) {
  const compareContext = useCompare();

  const isComparing = propIsComparing ?? (product?.id ? compareContext?.compareList?.some(item => item?.id === product?.id) : false);
  const handleToggle = propToggleCompare ?? (() => {
    if (product && compareContext?.handleToggleCompare) {
      compareContext.handleToggleCompare(product);
    }
  });

  return (
    <CardFooter className="p-5 pt-2 flex items-center justify-between">
      <span className="text-xl font-extrabold text-slate-900 dark:text-white">
        {price}
      </span>
      
      <label className="group flex items-center gap-2 cursor-pointer py-1.5 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
        <input 
          type="checkbox"
          checked={isComparing || false}
          onChange={handleToggle}
          className="rounded border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-brand-600 dark:text-brand-500 focus:ring-brand-500 focus:ring-offset-white dark:focus:ring-offset-slate-900 w-4 h-4 cursor-pointer"
        />
        <span className={`text-xs font-semibold select-none transition-colors ${isComparing ? "text-brand-600 dark:text-brand-400 font-bold" : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"}`}>
          {isComparing ? "Selected" : "Compare"}
        </span>
      </label>
    </CardFooter>
  );
}
