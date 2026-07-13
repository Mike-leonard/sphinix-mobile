import React from 'react';
import { Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BlogSEOSettings({ formData, setFormData, handleGenerateSEO, isGeneratingSEO }) {
  return (
    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-brand-500" />
          Search Engine Optimization
        </h3>
        <Button 
          type="button" 
          onClick={handleGenerateSEO} 
          disabled={isGeneratingSEO}
          variant="outline"
          className="gap-2 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl text-xs h-8"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>
          {isGeneratingSEO ? 'Analyzing...' : 'Auto-Fill SEO'}
        </Button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meta Title</label>
          <input 
            type="text" 
            value={formData.seo.metaTitle} 
            onChange={e => setFormData({ ...formData, seo: { ...formData.seo, metaTitle: e.target.value } })} 
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/50 text-sm" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meta Description</label>
          <textarea 
            rows={2} 
            value={formData.seo.metaDescription} 
            onChange={e => setFormData({ ...formData, seo: { ...formData.seo, metaDescription: e.target.value } })} 
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/50 text-sm resize-none" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Keywords</label>
          <input 
            type="text" 
            placeholder="tech, smartphones, review"
            value={formData.seo.keywords} 
            onChange={e => setFormData({ ...formData, seo: { ...formData.seo, keywords: e.target.value } })} 
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/50 text-sm" 
          />
        </div>
      </div>
    </div>
  );
}
