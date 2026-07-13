import React from 'react';

export default function GlobalAdControl({ settings, handleChange }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
      <input
        type="checkbox"
        checked={settings.advertisements?.enableAds || false}
        onChange={(e) => handleChange('enableAds', e.target.checked)}
        className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
      />
      <div>
        <label className="text-base font-bold text-slate-900 dark:text-white">Enable Advertisements Globally</label>
        <p className="text-sm text-slate-500 dark:text-slate-400">Turn this off to instantly hide all ad placeholders across the entire application.</p>
      </div>
    </div>
  );
}
