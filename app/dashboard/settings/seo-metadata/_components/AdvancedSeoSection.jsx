import React from 'react';

export default function AdvancedSeoSection({ currentData, handleChange }) {
  return (
    <div className="space-y-6 pt-4 animate-in fade-in duration-300">
      <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={currentData.generateSitemap || false}
              onChange={(e) => handleChange('generateSitemap', e.target.checked)}
            />
            <div className={`block w-14 h-8 rounded-full transition-colors ${currentData.generateSitemap ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${currentData.generateSitemap ? 'transform translate-x-6' : ''}`}></div>
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">Enable Dynamic Sitemap Generation</div>
            <div className="text-sm text-slate-500">Automatically builds and serves /sitemap.xml for search engines.</div>
          </div>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Robots.txt Content
        </label>
        <textarea
          value={currentData.robotsTxt || ''}
          onChange={(e) => handleChange('robotsTxt', e.target.value)}
          rows={4}
          className="w-full font-mono text-sm px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none resize-y"
          placeholder="User-agent: *&#10;Allow: /"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Global Structured Data (Schema.org JSON-LD)
        </label>
        <textarea
          value={currentData.globalStructuredData || ''}
          onChange={(e) => handleChange('globalStructuredData', e.target.value)}
          rows={8}
          className="w-full font-mono text-sm px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none resize-y"
          placeholder='{ "@context": "https://schema.org", "@type": "WebSite", "name": "Sphinix Mobile" }'
        />
        <p className="text-xs text-slate-500 mt-2">This schema will be injected on every page of your site.</p>
      </div>
    </div>
  );
}
