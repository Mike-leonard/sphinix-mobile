import React from 'react';

export default function VisitorStatsSection({ settings, handleChange }) {
  return (
    <div className="flex items-center gap-3 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
      <input
        type="checkbox"
        checked={settings['analytics']?.enableVisitorStats ?? true}
        onChange={(e) => handleChange('enableVisitorStats', e.target.checked)}
        className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
      />
      <div>
        <label className="text-base font-bold text-slate-900 dark:text-white">Enable Visitor Statistics Tracking</label>
        <p className="text-sm text-slate-500 dark:text-slate-400">Toggle this to track basic page views and display visitor stats on the dashboard.</p>
      </div>
    </div>
  );
}
