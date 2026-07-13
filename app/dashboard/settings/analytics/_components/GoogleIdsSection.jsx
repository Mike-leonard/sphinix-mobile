import React from 'react';

export default function GoogleIdsSection({ settings, handleChange }) {
  return (
    <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/20 space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Google Analytics Measurement ID</label>
        <input
          type="text"
          value={settings['analytics']?.googleAnalyticsId || ''}
          onChange={(e) => handleChange('googleAnalyticsId', e.target.value)}
          placeholder="G-XXXXXXXXXX"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none"
        />
        <p className="text-xs text-slate-500 mt-2">Find this in your Google Analytics dashboard (starts with G-).</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Google Search Console Verification Code</label>
        <input
          type="text"
          value={settings['analytics']?.googleSearchConsoleId || ''}
          onChange={(e) => handleChange('googleSearchConsoleId', e.target.value)}
          placeholder="e.g. j7x..._1sA"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none"
        />
        <p className="text-xs text-slate-500 mt-2">Paste the 'content' value from your HTML tag verification method.</p>
      </div>
    </div>
  );
}
