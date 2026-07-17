import React from 'react';

export default function AdPlacementsSection({ settings, handleNestedChange }) {
  return (
    <div className={`space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800 ${!settings.advertisements?.enableAds ? 'opacity-50 pointer-events-none' : ''}`}>
      <h3 className="text-md font-bold text-slate-900 dark:text-white">Ad Placements</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Select where you want ad units to appear.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <input type="checkbox" checked={settings.advertisements?.placements?.homePageBanner ?? true} onChange={(e) => handleNestedChange('placements', 'homePageBanner', e.target.checked)} className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Home Page Banner</span>
        </label>
        
        <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <input type="checkbox" checked={settings.advertisements?.placements?.homePageInFeed ?? true} onChange={(e) => handleNestedChange('placements', 'homePageInFeed', e.target.checked)} className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Home Page In-Feed</span>
        </label>

        <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <input type="checkbox" checked={settings.advertisements?.placements?.phonesPageSidebar ?? true} onChange={(e) => handleNestedChange('placements', 'phonesPageSidebar', e.target.checked)} className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Phones Page Sidebar</span>
        </label>
        
        <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <input type="checkbox" checked={settings.advertisements?.placements?.blogsPageSidebar ?? true} onChange={(e) => handleNestedChange('placements', 'blogsPageSidebar', e.target.checked)} className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Blogs Page Sidebar</span>
        </label>

        <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <input type="checkbox" checked={settings.advertisements?.placements?.blogDetailsInFeed ?? true} onChange={(e) => handleNestedChange('placements', 'blogDetailsInFeed', e.target.checked)} className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Blog Details In-Feed</span>
        </label>

        <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <input type="checkbox" checked={settings.advertisements?.placements?.deviceDetailsBanner ?? true} onChange={(e) => handleNestedChange('placements', 'deviceDetailsBanner', e.target.checked)} className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Device Details Banner</span>
        </label>

        <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <input type="checkbox" checked={settings.advertisements?.placements?.comparisonsBanner ?? true} onChange={(e) => handleNestedChange('placements', 'comparisonsBanner', e.target.checked)} className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Comparisons Banner</span>
        </label>
      </div>
    </div>
  );
}
