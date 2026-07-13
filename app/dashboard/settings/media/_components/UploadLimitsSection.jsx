import React from 'react';

export default function UploadLimitsSection({ settings, handleChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Upload Limits</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Max Upload Size (MB)</label>
          <input
            type="number"
            value={settings['media']?.maxUploadSizeMB || ''}
            onChange={(e) => handleChange('maxUploadSizeMB', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Allowed Formats</label>
          <input
            type="text"
            value={settings['media']?.allowedFormats || ''}
            onChange={(e) => handleChange('allowedFormats', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none"
          />
        </div>
      </div>
    </div>
  );
}
