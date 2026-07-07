'use client';

import React, { useState, useTransition } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import { updateSettings } from '@/actions/settings';
import { Button } from "@/components/ui/button";

export default function AdvertisementsForm({ initialSettings }) {
  const [settings, setSettings] = useState(initialSettings);
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      advertisements: {
        ...prev.advertisements,
        [key]: value
      }
    }));
  };

  const handleNestedChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      advertisements: {
        ...prev.advertisements,
        [section]: {
          ...(prev.advertisements?.[section] || {}),
          [key]: value
        }
      }
    }));
  };

  const handleSave = () => {
    startTransition(async () => {
      const res = await updateSettings({ ['advertisements']: settings['advertisements'] });
      if (res.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert(res.error || 'Failed to save settings');
      }
    });
  };

  const selectedNetwork = settings.advertisements?.network || 'google_adsense';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h2 style={{fontSize: "var(--font-size-h2-settings, var(--font-size-h2-default))"}} className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
        Advertisements & Monetization
      </h2>
      
      <div className="space-y-8 max-w-3xl">
        {/* Global Control */}
        <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
          <input
            type="checkbox"
            checked={settings.advertisements?.enableAds || false}
            onChange={(e) => handleChange('enableAds', e.target.checked)}
            className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          <div>
            <label className="text-base font-bold text-slate-900 dark:text-white">Enable Advertisements Globally</label>
            <p className="text-sm text-slate-500 dark:text-slate-400">Turn this off to instantly hide all ad placeholders across the entire application.</p>
          </div>
        </div>

        {/* Network Selection */}
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

          {/* Network Specific Configurations */}
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

        {/* Placements */}
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
              <input type="checkbox" checked={settings.advertisements?.placements?.devicesPageSidebar ?? true} onChange={(e) => handleNestedChange('placements', 'devicesPageSidebar', e.target.checked)} className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Devices Page Sidebar</span>
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

        {/* Injection Frequency */}
        <div className={`space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800 ${!settings.advertisements?.enableAds ? 'opacity-50 pointer-events-none' : ''}`}>
          <h3 className="text-md font-bold text-slate-900 dark:text-white">Injection Frequency</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Set how many items should pass before an ad is injected dynamically.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Home Page Devices Freq.</label>
              <input
                type="number"
                min="1"
                value={settings.advertisements?.injectionFrequency?.homePageDevices || 6}
                onChange={(e) => handleNestedChange('injectionFrequency', 'homePageDevices', parseInt(e.target.value))}
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
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Devices Page Freq.</label>
              <input
                type="number"
                min="1"
                value={settings.advertisements?.injectionFrequency?.devicesPageGrid || 6}
                onChange={(e) => handleNestedChange('injectionFrequency', 'devicesPageGrid', parseInt(e.target.value))}
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
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-start">
        <Button variant="none" size="none" style={{fontSize: "var(--font-size-button-primary, var(--font-size-button-default))"}} 
          onClick={handleSave}
          disabled={isPending}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all text-white ${
            success 
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 active:scale-[0.98]'
          } disabled:opacity-70 disabled:pointer-events-none`}
        >
          {isPending ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : success ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {success ? 'Saved!' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
