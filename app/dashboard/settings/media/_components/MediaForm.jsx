'use client';

import React, { useState, useTransition } from 'react';
import { Save, CheckCircle2, Plus, X } from 'lucide-react';
import { updateSettings } from '@/actions/settings';
import { Button } from "@/components/ui/button";

export default function MediaForm({ initialSettings }) {
  const [settings, setSettings] = useState(initialSettings);
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [newDomain, setNewDomain] = useState('');

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      ['media']: {
        ...prev['media'],
        [key]: value
      }
    }));
  };

  const handleAddDomain = () => {
    if (!newDomain.trim()) return;
    
    // Clean up domain (remove http://, https://, and trailing slashes)
    const cleanDomain = newDomain.replace(/^https?:\/\//, '').replace(/\/$/, '').trim();
    
    const currentDomains = settings.media.cdnDomains || [];
    if (!currentDomains.includes(cleanDomain)) {
      handleChange('cdnDomains', [...currentDomains, cleanDomain]);
    }
    setNewDomain('');
  };

  const handleRemoveDomain = (domainToRemove) => {
    const currentDomains = settings.media.cdnDomains || [];
    handleChange('cdnDomains', currentDomains.filter(d => d !== domainToRemove));
  };

  const handleSave = () => {
    startTransition(async () => {
      const res = await updateSettings({ ['media']: settings['media'] });
      if (res.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert(res.error || 'Failed to save settings');
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h2  style={{fontSize: "var(--font-size-h2-settings, var(--font-size-h2-default))"}} className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
        Media
      </h2>
      
      <div className="space-y-8 max-w-2xl">
        {/* Upload Limits */}
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

        {/* Image Optimization */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Image Optimization</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Image Quality (%)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={settings['media']?.imageQuality || 80}
                onChange={(e) => handleChange('imageQuality', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Thumbnail Size</label>
              <input
                type="text"
                placeholder="e.g. 300x300"
                value={settings['media']?.thumbnailSize || ''}
                onChange={(e) => handleChange('thumbnailSize', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-slate-900 dark:text-white">Enable Image Compression</label>
                <p className="text-xs text-slate-500">Automatically compress uploaded images to save space.</p>
              </div>
              <input
                type="checkbox"
                checked={settings['media']?.imageCompression || false}
                onChange={(e) => handleChange('imageCompression', e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
              <div>
                <label className="text-sm font-medium text-slate-900 dark:text-white">Convert to WebP</label>
                <p className="text-xs text-slate-500">Serve modern WebP formats for faster page loads.</p>
              </div>
              <input
                type="checkbox"
                checked={settings['media']?.webpConversion || false}
                onChange={(e) => handleChange('webpConversion', e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* CDN Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">CDN Configuration</h3>
          
          <div className="flex items-center gap-3 mb-2">
            <input
              type="checkbox"
              checked={settings['media']?.cdnEnabled || false}
              onChange={(e) => handleChange('cdnEnabled', e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Enable External CDN Delivery</label>
          </div>

          {settings['media']?.cdnEnabled && (
            <div className="animate-in slide-in-from-top-2 fade-in duration-200 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">CDN Base URL</label>
                <input
                  type="url"
                  placeholder="https://cdn.example.com"
                  value={settings['media']?.cdnUrl || ''}
                  onChange={(e) => handleChange('cdnUrl', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none"
                />
                <p className="text-xs text-slate-500 mt-2">All uploaded media assets will be served from this base URL.</p>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Allowed CDN Domains (Whitelist)</label>
                <p className="text-xs text-slate-500 mb-3">Next.js requires strict domain whitelisting for external images. <strong className="text-orange-500">You must restart the server after adding domains.</strong></p>
                
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="e.g. images.unsplash.com"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDomain())}
                    className="flex-1 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none"
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddDomain}
                    className="bg-brand-600 hover:bg-brand-700 text-white rounded-xl px-4"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(settings['media']?.cdnDomains) ? settings['media'].cdnDomains : []).map((domain, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300"
                    >
                      <span>{domain}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveDomain(domain)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {(!Array.isArray(settings['media']?.cdnDomains) || settings['media'].cdnDomains.length === 0) && (
                    <span className="text-sm text-slate-400 italic">No domains whitelisted.</span>
                  )}
                </div>
              </div>
            </div>
          )}
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
