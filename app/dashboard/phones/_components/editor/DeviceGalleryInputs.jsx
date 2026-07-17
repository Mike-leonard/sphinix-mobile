import React, { useState } from 'react';
import { Check } from 'lucide-react';

export default function DeviceGalleryInputs({ formData, setFormData }) {
  const [editingGallery, setEditingGallery] = useState({});

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
        Gallery Images (URLs)
      </label>
      
      {/* Badges for completed items */}
      <div className="flex flex-wrap gap-2 mb-4">
        {['Front View', 'Back View', 'Camera', 'Side Profile'].map((label, idx) => {
          const url = formData.images?.[idx];
          const isEditing = editingGallery[idx] || !url;
          if (isEditing) return null;
          return (
            <button 
              type="button"
              key={`badge-${label}`}
              onClick={() => setEditingGallery({ ...editingGallery, [idx]: true })}
              className="flex items-center gap-2 px-3 py-1.5 bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 text-brand-700 dark:text-brand-300 rounded-xl hover:bg-brand-100 dark:hover:bg-brand-500/30 transition-colors"
            >
              <span className="text-sm font-medium">{label}</span>
              <div className="w-5 h-5 rounded overflow-hidden bg-white">
                <img src={url} alt="" className="w-full h-full object-cover" />
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['Front View', 'Back View', 'Camera', 'Side Profile'].map((label, idx) => {
          const url = formData.images?.[idx];
          const isEditing = editingGallery[idx] || !url;
          if (!isEditing) return null;

          return (
            <div key={`card-${label}`} className="flex flex-col gap-2 p-4 bg-slate-50/50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-brand-500/30 transition-colors group">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
                {url && (
                  <button 
                    type="button"
                    onClick={() => setEditingGallery({ ...editingGallery, [idx]: false })}
                    className="text-slate-400 hover:text-brand-500 p-1 bg-white dark:bg-slate-800 rounded shadow-sm border border-slate-200 dark:border-slate-700 transition-colors"
                    title="Done editing"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
              <input
                type="url"
                placeholder={`https://...`}
                value={formData.images?.[idx] || ''}
                onChange={(e) => {
                  const newImages = [...(formData.images || ['', '', '', ''])];
                  newImages[idx] = e.target.value;
                  setFormData({ ...formData, images: newImages });
                }}
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
