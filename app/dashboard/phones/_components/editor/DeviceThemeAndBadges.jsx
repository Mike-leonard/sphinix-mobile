import React from 'react';

export default function DeviceThemeAndBadges({ formData, handleChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-1">
      <label className="flex-1 flex items-center justify-between p-4 bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 rounded-2xl cursor-pointer group hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-colors">
        <div>
          <span className="block text-sm font-bold text-brand-900 dark:text-brand-300">
            New Release
          </span>
          <span className="text-xs text-brand-600/70 dark:text-brand-400/70 mt-0.5 block">
            Show &quot;New&quot; badge on card
          </span>
        </div>
        <div className="relative flex items-center">
          <input
            type="checkbox"
            name="isNew"
            checked={formData.isNew}
            onChange={handleChange}
            className="peer sr-only"
          />
          <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer-checked:bg-brand-500 transition-colors"></div>
          <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5 shadow-sm"></div>
        </div>
      </label>

      <label className="flex-1 flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-2xl cursor-pointer group hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors">
        <div>
          <span className="block text-sm font-bold text-amber-900 dark:text-amber-300">
            Top Rated
          </span>
          <span className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-0.5 block">
            Highlight as top tier
          </span>
        </div>
        <div className="relative flex items-center">
          <input
            type="checkbox"
            name="isTopRated"
            checked={formData.isTopRated}
            onChange={handleChange}
            className="peer sr-only"
          />
          <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer-checked:bg-amber-500 transition-colors"></div>
          <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5 shadow-sm"></div>
        </div>
      </label>
    </div>
  );
}
