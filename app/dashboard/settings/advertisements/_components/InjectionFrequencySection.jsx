import React from 'react';

export default function InjectionFrequencySection({ settings, handleNestedChange }) {
  return (
    <div className={`space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800 ${!settings.advertisements?.enableAds ? 'opacity-50 pointer-events-none' : ''}`}>
      <h3 className="text-md font-bold text-slate-900 dark:text-white">Injection Frequency</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Set how many items should pass before an ad is injected dynamically.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Home Page Devices Freq.</label>
          <input
            type="number"
            min="1"
            value={settings.advertisements?.injectionFrequency?.homePagePhones || 6}
            onChange={(e) => handleNestedChange('injectionFrequency', 'homePagePhones', parseInt(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Home Page Blogs Freq.</label>
          <input
            type="number"
            min="1"
            value={settings.advertisements?.injectionFrequency?.homePageBlogs || 4}
            onChange={(e) => handleNestedChange('injectionFrequency', 'homePageBlogs', parseInt(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phones Page Freq.</label>
          <input
            type="number"
            min="1"
            value={settings.advertisements?.injectionFrequency?.phonesPageGrid || 6}
            onChange={(e) => handleNestedChange('injectionFrequency', 'phonesPageGrid', parseInt(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Blogs Page Freq.</label>
          <input
            type="number"
            min="1"
            value={settings.advertisements?.injectionFrequency?.blogsPageGrid || 4}
            onChange={(e) => handleNestedChange('injectionFrequency', 'blogsPageGrid', parseInt(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Comparisons Freq.</label>
          <input
            type="number"
            min="1"
            value={settings.advertisements?.injectionFrequency?.comparisons || 3}
            onChange={(e) => handleNestedChange('injectionFrequency', 'comparisons', parseInt(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
