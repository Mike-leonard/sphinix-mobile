import React from 'react';

export default function NetworkConfigSection({ settings, handleChange, handleNestedChange, selectedNetwork }) {
  return (
    <div className={`space-y-6 ${!settings.advertisements?.enableAds ? 'opacity-50 pointer-events-none' : ''}`}>
      <div>
        <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Active Ad Network</label>
        <select
          value={selectedNetwork}
          onChange={(e) => handleChange('network', e.target.value)}
          className="w-full sm:w-1/2 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 transition-all outline-none"
        >
          <option value="google_adsense">Google AdSense</option>
          <option value="journey_mv">Journey by Mediavine</option>
          <option value="monumetric">Monumetric</option>
          <option value="custom">Custom HTML/Scripts</option>
        </select>
      </div>

      <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/20">
        {selectedNetwork === 'google_adsense' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">AdSense Publisher ID (e.g. ca-pub-XXXXX)</label>
            <input
              type="text"
              value={settings.advertisements?.googleAdsense?.publisherId || ''}
              onChange={(e) => handleNestedChange('googleAdsense', 'publisherId', e.target.value)}
              placeholder="ca-pub-1234567890123456"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 transition-all outline-none"
            />
          </div>
        )}
        
        {selectedNetwork === 'journey_mv' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Journey Site ID</label>
            <input
              type="text"
              value={settings.advertisements?.journeyMv?.siteId || ''}
              onChange={(e) => handleNestedChange('journeyMv', 'siteId', e.target.value)}
              placeholder="Enter Journey Site ID"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 transition-all outline-none"
            />
          </div>
        )}

        {selectedNetwork === 'monumetric' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Monumetric Property ID</label>
            <input
              type="text"
              value={settings.advertisements?.monumetric?.propertyId || ''}
              onChange={(e) => handleNestedChange('monumetric', 'propertyId', e.target.value)}
              placeholder="Enter Property ID"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 transition-all outline-none"
            />
          </div>
        )}

        {selectedNetwork === 'custom' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Custom Ad Script / HTML</label>
            <textarea
              value={settings.advertisements?.custom?.htmlCode || ''}
              onChange={(e) => handleNestedChange('custom', 'htmlCode', e.target.value)}
              placeholder="<!-- Paste your custom ad network tags here -->"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-brand-500/50 transition-all outline-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}
