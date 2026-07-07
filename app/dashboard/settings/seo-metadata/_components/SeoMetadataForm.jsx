'use client';

import React, { useState, useTransition } from 'react';
import { Save, CheckCircle2, Upload, Link as LinkIcon } from 'lucide-react';
import { updateSettings } from '@/actions/settings';
import { Button } from "@/components/ui/button";

export default function SeoMetadataForm({ initialSettings }) {
  const [settings, setSettings] = useState(initialSettings);
  const [activeTab, setActiveTab] = useState('home');
  const [activeSubTab, setActiveSubTab] = useState('general');
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'devices', label: 'Devices' },
    { id: 'blogs', label: 'Blogs' },
    { id: 'comparisons', label: 'Comparisons' },
    { id: 'advanced', label: 'Advanced SEO' },
  ];

  const subTabs = [
    { id: 'general', label: 'General Search Appearance' },
    { id: 'opengraph', label: 'OpenGraph (Social Media)' },
  ];

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        [activeTab]: {
          ...prev.seo[activeTab],
          [key]: value
        }
      }
    }));
  };

  const handleSave = () => {
    startTransition(async () => {
      const res = await updateSettings({ seo: settings.seo });
      if (res.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert(res.error || 'Failed to save settings');
      }
    });
  };

  const currentData = settings.seo[activeTab] || {};

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col gap-4">
        <h2  style={{fontSize: "var(--font-size-h2-settings, var(--font-size-h2-default))"}} className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          SEO & Metadata
        </h2>
        
        {/* Main Tab Navigation (Pages) */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <Button variant="none" size="none" style={{fontSize: "var(--font-size-button-default, var(--font-size-button-default))"}} 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-semibold text-sm transition-colors whitespace-nowrap rounded-t-lg ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-t border-l border-r border-slate-200 dark:border-slate-800 -mb-[1px]'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white border-b border-transparent hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-950 rounded-b-xl rounded-tr-xl">
        {/* Sub Tab Navigation (General vs OpenGraph) - Hidden for Advanced Tab */}
        {activeTab !== 'advanced' && (
          <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 overflow-x-auto scrollbar-hide">
            {subTabs.map((tab) => (
              <Button variant="none" size="none" style={{fontSize: "var(--font-size-button-default, var(--font-size-button-default))"}} 
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-6 py-3 font-semibold text-sm transition-colors whitespace-nowrap rounded-t-lg ${
                  activeSubTab === tab.id
                    ? 'bg-slate-50 dark:bg-slate-900/50 text-brand-600 dark:text-brand-400 border-t border-l border-r border-slate-200 dark:border-slate-800 -mb-[1px]'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white border-b border-transparent hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        )}

        <div className="px-2 max-w-3xl">
          {/* General SEO Section */}
          {activeTab !== 'advanced' && activeSubTab === 'general' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Page Title
                </label>
                <input
                  type="text"
                  value={currentData.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none"
                  placeholder="e.g. Sphinix Mobile | Expert Reviews"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={currentData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none resize-none"
                  placeholder="A brief summary of the page for search results..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Keywords
                </label>
                <input
                  type="text"
                  value={currentData.keywords || ''}
                  onChange={(e) => handleChange('keywords', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none"
                  placeholder="e.g. smartphones, tech, reviews (comma separated)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Structured Data (Schema.org JSON-LD)
                </label>
                <textarea
                  value={currentData.structuredData || ''}
                  onChange={(e) => handleChange('structuredData', e.target.value)}
                  rows={6}
                  className="w-full font-mono text-sm px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none resize-y"
                  placeholder='{ "@context": "https://schema.org", "@type": "WebPage", "name": "..." }'
                />
              </div>
              {/* Favicon Upload (Only visible on Home) */}
              {activeTab === 'home' && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Favicon URL
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center shrink-0 overflow-hidden">
                      {currentData.favicon ? (
                        <img src={currentData.favicon} alt="Favicon" className="w-6 h-6 object-contain" />
                      ) : (
                        <Upload className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <LinkIcon style={{fontSize: "var(--font-size-link-inline, var(--font-size-link-default))"}} className="w-4 h-4 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        value={currentData.favicon || ''}
                        onChange={(e) => handleChange('favicon', e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none text-sm"
                        placeholder="/favicon.ico or https://..."
                      />
                    </div>
                  </div>
                  <p  style={{fontSize: "var(--font-size-p-form, var(--font-size-p-default))"}} className="text-xs text-slate-500 mt-2">Provide a URL to your favicon image (ico, png, svg).</p>
                </div>
              )}
            </div>
          )}

          {/* OpenGraph Section */}
          {activeTab !== 'advanced' && activeSubTab === 'opengraph' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  OG Title
                </label>
                <input
                  type="text"
                  value={currentData.ogTitle || ''}
                  onChange={(e) => handleChange('ogTitle', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none"
                  placeholder="Leave blank to use Page Title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  OG Description
                </label>
                <textarea
                  value={currentData.ogDescription || ''}
                  onChange={(e) => handleChange('ogDescription', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none resize-none"
                  placeholder="Leave blank to use Meta Description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  OG Image URL
                </label>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <LinkIcon style={{fontSize: "var(--font-size-link-inline, var(--font-size-link-default))"}} className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={currentData.ogImage || ''}
                      onChange={(e) => handleChange('ogImage', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none"
                      placeholder="https://example.com/social-preview.jpg"
                    />
                  </div>
                </div>
                {currentData.ogImage && (
                  <div className="mt-4 aspect-video max-w-lg rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={currentData.ogImage} alt="OG Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Advanced SEO Section */}
          {activeTab === 'advanced' && (
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
          )}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
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
