import React from 'react';

export default function LayoutLimitsSection({ settings, handleNestedChange }) {
  return (
    <>
      <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h3 className="text-md font-semibold text-slate-800 dark:text-slate-200">Home Page Layout Limits</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Devices to Show</label>
            <input
              type="number"
              min="1"
              value={settings.appearance.home?.deviceLimit || 8}
              onChange={(e) => handleNestedChange('home', 'deviceLimit', parseInt(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Blogs to Show</label>
            <input
              type="number"
              min="1"
              value={settings.appearance.home?.blogLimit || 3}
              onChange={(e) => handleNestedChange('home', 'blogLimit', parseInt(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Card Specs Limit</label>
            <input
              type="number"
              min="1"
              max="4"
              value={settings.appearance.home?.deviceCardSpecLimit || 3}
              onChange={(e) => handleNestedChange('home', 'deviceCardSpecLimit', parseInt(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h3 className="text-md font-semibold text-slate-800 dark:text-slate-200">Phones Page Layout Limits</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Items Per Page</label>
            <input
              type="number"
              min="1"
              value={settings.appearance.phones?.deviceLimit || 12}
              onChange={(e) => handleNestedChange('devices', 'deviceLimit', parseInt(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Card Specs Limit</label>
            <input
              type="number"
              min="1"
              max="4"
              value={settings.appearance.phones?.deviceCardSpecLimit || 3}
              onChange={(e) => handleNestedChange('devices', 'deviceCardSpecLimit', parseInt(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h3 className="text-md font-semibold text-slate-800 dark:text-slate-200">Blogs Page Layout Limits</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Items Per Page</label>
            <input
              type="number"
              min="1"
              value={settings.appearance.blogs?.blogLimit || 9}
              onChange={(e) => handleNestedChange('blogs', 'blogLimit', parseInt(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none"
            />
          </div>
        </div>
      </div>
    </>
  );
}
