'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';

export default function StoreInputCard({
  storeKey,
  displayName,
  data,
  currencySymbol,
  onUpdateStore,
  onDeleteStore
}) {
  return (
    <div className="flex flex-col gap-3 p-4 bg-slate-50/50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-brand-500/30 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 font-extrabold text-xs flex items-center justify-center">
            {displayName.charAt(0)}
          </div>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{displayName}</span>
        </div>

        <button
          type="button"
          onClick={() => onDeleteStore(storeKey)}
          className="text-slate-400 hover:text-rose-500 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Remove Store"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <input
            type="url"
            placeholder="Product URL"
            value={data.url || ''}
            onChange={(e) => onUpdateStore(storeKey, 'url', e.target.value)}
            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
          />
        </div>
        <div className="w-full sm:w-28 relative shrink-0">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            {currencySymbol}
          </span>
          <input
            type="text"
            placeholder="Price"
            value={data.price || ''}
            onChange={(e) => onUpdateStore(storeKey, 'price', e.target.value)}
            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-6 pr-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
          />
        </div>
      </div>
    </div>
  );
}
