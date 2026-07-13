import React from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function CdnConfigurationSection({ settings, handleChange, newDomain, setNewDomain, handleAddDomain, handleRemoveDomain }) {
  return (
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
  );
}
