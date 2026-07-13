import React from 'react';
import { Upload, Link as LinkIcon } from 'lucide-react';

export default function GeneralSeoSection({ currentData, handleChange, activeTab }) {
  return (
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
  );
}
