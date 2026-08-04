import React from 'react';

export default function CdnConfigurationSection({ settings, handleChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">CDN Configuration</h3>
      
      <div className="flex items-center gap-3 mb-2">
        <input
          type="checkbox"
          checked={settings['media']?.cdnEnabled || false}
          onChange={(e) => handleChange('cdnEnabled', e.target.checked)}
          className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
        />
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Enable External CDN Delivery</label>
      </div>

      {settings['media']?.cdnEnabled && (
        <div className="animate-in slide-in-from-top-2 fade-in duration-200 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">CDN Base URL</label>
            <input
              type="url"
              placeholder="https://cdn.example.com"
              value={settings['media']?.cdnUrl || ''}
              onChange={(e) => handleChange('cdnUrl', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none"
            />
            <p className="text-xs text-slate-500 mt-2">All uploaded media assets will be served from this base URL.</p>
          </div>
        </div>
      )}
    </div>
  );
}
