import React from 'react';

export default function ThemeConfigurationSection({ settings, handleChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Primary Brand Color</label>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={settings.appearance.primaryColor || '#000000'}
            onChange={(e) => handleChange('primaryColor', e.target.value)}
            className="w-12 h-12 rounded-lg cursor-pointer border-0 p-0"
          />
          <input
            type="text"
            value={settings.appearance.primaryColor || ''}
            onChange={(e) => handleChange('primaryColor', e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none uppercase"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Theme Mode</label>
        <select
          value={settings.appearance.theme || 'system'}
          onChange={(e) => handleChange('theme', e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none"
        >
          <option value="system">System Default (Reset)</option>
          <option value="light">Light Mode</option>
          <option value="dark">Dark Mode</option>
        </select>
      </div>
    </div>
  );
}
