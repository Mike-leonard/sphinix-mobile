import React from 'react';
import { Sparkles, Image as ImageIcon, Loader2, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BlogSidebar({ 
  formData, 
  setFormData, 
  categories, 
  sourceUrl, 
  setSourceUrl, 
  handleGenerateFromUrl, 
  isGeneratingFromUrl 
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-500" />
          AI Tools
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Generate from URL</label>
            <div className="flex gap-2 items-center">
              <input 
                type="url" 
                placeholder="https://example.com/article"
                value={sourceUrl}
                onChange={e => setSourceUrl(e.target.value)}
                className="flex-1 px-4 h-[42px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/50 text-sm" 
              />
              <Button 
                type="button" 
                title="Generate from URL"
                onClick={handleGenerateFromUrl}
                disabled={isGeneratingFromUrl || !sourceUrl}
                className="cursor-pointer shrink-0 w-[42px] h-[42px] p-0 flex items-center justify-center bg-brand-600 hover:bg-brand-700 text-white rounded-xl"
              >
                {isGeneratingFromUrl ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2">Paste a link to any article and AI will rewrite it perfectly for your blog.</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Post Settings</h3>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
            <div className="relative">
              <select 
                value={formData.category} 
                onChange={e => setFormData({ ...formData, category: e.target.value })} 
                className="w-full pl-4 pr-8 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/50 text-sm appearance-none" 
              >
                <option value="" disabled>Select a category...</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Author</label>
            <input 
              type="text" 
              value={formData.author} 
              onChange={e => setFormData({ ...formData, author: e.target.value })} 
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/50 text-sm" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cover Image</label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="url" 
                placeholder="https://..."
                value={formData.image} 
                onChange={e => setFormData({ ...formData, image: e.target.value })} 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/50 text-sm" 
              />
            </div>
            {formData.image && (
              <div className="mt-2 rounded-xl overflow-hidden h-32 border border-slate-200 dark:border-slate-800">
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Short Excerpt</label>
            <textarea 
              rows={4} 
              value={formData.excerpt} 
              onChange={e => setFormData({ ...formData, excerpt: e.target.value })} 
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/50 text-sm resize-none" 
            />
            <p className="text-xs text-slate-500 mt-1">This will be shown on the blog cards.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
