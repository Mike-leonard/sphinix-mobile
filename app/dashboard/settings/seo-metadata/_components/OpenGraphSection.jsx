import React from 'react';
import { Link as LinkIcon } from 'lucide-react';

export default function OpenGraphSection({ currentData, handleChange }) {
  return (
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
  );
}
