'use client';

import React, { useState } from 'react';
import { Sparkles, Wand2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateDeviceSEO, generateDeviceDataFromUrl } from '@/actions/ai';

export default function DeviceEditorSidebar({ formData, setFormData }) {
  const [isGeneratingSEO, setIsGeneratingSEO] = useState(false);
  const [url, setUrl] = useState('');
  const [isGeneratingUrl, setIsGeneratingUrl] = useState(false);

  const handleGenerateFromUrl = async () => {
    if (!url) {
      alert("Please enter a URL first.");
      return;
    }
    
    setIsGeneratingUrl(true);
    const res = await generateDeviceDataFromUrl(url);
    setIsGeneratingUrl(false);
    
    if (res.success && res.data) {
      const mergedSpecs = {
        ...formData.specs,
        ...res.data.quickSpecs
      };
      
      if (res.data.detailedSpecs) {
        Object.entries(res.data.detailedSpecs).forEach(([groupName, specsList]) => {
          mergedSpecs[groupName] = specsList;
        });
      }

      setFormData(prev => ({
        ...prev,
        // Optional: you can auto-fill the name if the AI extracted a title, but be careful not to overwrite user input
        // name: prev.name || res.data.extractedName,
        price: res.data.price || prev.price,
        description: res.data.description || prev.description,
        specs: mergedSpecs
      }));
      
      setUrl(''); // Clear the URL input after success
    } else {
      alert(res.error || "Failed to extract device data from URL");
    }
  };

  const handleGenerateSEO = async () => {
    if (!formData.name) {
      alert("Please enter a device name first.");
      return;
    }
    
    setIsGeneratingSEO(true);
    const res = await generateDeviceSEO(formData.name, formData.brand, formData.description);
    setIsGeneratingSEO(false);
    
    if (res.success && res.data) {
      setFormData({
        ...formData,
        seo: res.data
      });
    } else {
      alert(res.error || "Failed to generate SEO");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">AI Tools</h2>
        </div>
        
        <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Generate from URL
              </label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/specs"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
                <Button 
                  type="button"
                  onClick={handleGenerateFromUrl}
                  disabled={isGeneratingUrl}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-xl"
                >
                  <Wand2 className={`w-4 h-4 ${isGeneratingUrl ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-2">Paste a link to any device specs page and AI will auto-fill the fields.</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Community</h2>
        </div>
        
        <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Allow User Reviews
                </label>
                <p className="text-xs text-slate-500 mt-1">Enable public comments and ratings</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={formData?.allowReviews !== false}
                  onChange={(e) => setFormData && setFormData({ ...formData, allowReviews: e.target.checked })}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-brand-600"></div>
              </label>
            </div>
        </div>
      </div>

      {/* SEO Controls Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">SEO Settings</h2>
            </div>
            <Button 
              type="button" 
              onClick={handleGenerateSEO} 
              disabled={isGeneratingSEO}
              variant="outline"
              className="gap-2 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl text-xs h-8 px-3"
            >
              <Sparkles className="w-3 h-3" />
              {isGeneratingSEO ? 'Analyzing...' : 'Auto-Fill SEO'}
            </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meta Title</label>
            <input 
              type="text" 
              value={formData?.seo?.metaTitle || ''} 
              onChange={e => setFormData && setFormData({ ...formData, seo: { ...(formData.seo || {}), metaTitle: e.target.value } })} 
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/50 text-sm" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meta Description</label>
            <textarea 
              rows={3} 
              value={formData?.seo?.metaDescription || ''} 
              onChange={e => setFormData && setFormData({ ...formData, seo: { ...(formData.seo || {}), metaDescription: e.target.value } })} 
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/50 text-sm resize-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Keywords</label>
            <input 
              type="text" 
              placeholder="e.g. smartphone, specs, review"
              value={formData?.seo?.keywords || ''} 
              onChange={e => setFormData && setFormData({ ...formData, seo: { ...(formData.seo || {}), keywords: e.target.value } })} 
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/50 text-sm" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
