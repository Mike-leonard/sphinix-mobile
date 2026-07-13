import React from 'react';

export default function ImageOptimizationSection({ settings, handleChange }) {
  return (
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
  );
}
