'use client';

import React, { useState } from 'react';
import { Check, Sparkles, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';

const ANGLES = ['Front View', 'Back View', 'Camera', 'Side Profile'];

export default function DeviceGalleryInputs({ formData, setFormData }) {
  const [editingGallery, setEditingGallery] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);

  const imageAlts = Array.isArray(formData.imageAlts)
    ? formData.imageAlts
    : typeof formData.imageAlts === 'object' && formData.imageAlts !== null
    ? [formData.imageAlts[0] || '', formData.imageAlts[1] || '', formData.imageAlts[2] || '', formData.imageAlts[3] || '']
    : ['', '', '', ''];

  const handleUpdateImage = (idx, value) => {
    const newImages = [...(formData.images || ['', '', '', ''])];
    newImages[idx] = value;
    setFormData({ ...formData, images: newImages });
  };

  const handleUpdateAlt = (idx, value) => {
    const newAlts = [...imageAlts];
    newAlts[idx] = value;
    setFormData({ ...formData, imageAlts: newAlts });
  };

  const handleAutoSuggestAlt = (idx, label) => {
    const brand = formData.brand || '';
    const name = formData.name || '';
    const suggestedAlt = `${brand} ${name} ${label}`.trim() || `${label} Photo`;
    handleUpdateAlt(idx, suggestedAlt);
  };

  const filledImagesCount = (formData.images || []).filter((img) => img && img.trim() !== '').length;

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950 p-4 transition-all">
      {/* Clickable Header Row for Collapsing / Expanding */}
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider cursor-pointer group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Gallery Images & SEO Alt Texts
              </label>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                {filledImagesCount} / 4 Images
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Custom Alt text boosts Google Image Search SEO
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="p-1.5 rounded-xl text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 group-hover:bg-slate-100 dark:group-hover:bg-slate-900 transition-colors">
            {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </div>
        </div>
      </button>

      {/* Collapsed Summary Banner */}
      {isCollapsed && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
          {ANGLES.map((label, idx) => {
            const url = formData.images?.[idx];
            if (!url) return null;
            return (
              <div
                key={`summary-${label}`}
                className="flex items-center gap-2 px-2.5 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs shrink-0"
              >
                <img src={url} alt="" className="w-4 h-4 object-cover rounded" />
                <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">{label}</span>
              </div>
            );
          })}
          {filledImagesCount === 0 && (
            <span className="text-xs text-slate-400 italic">No gallery images added yet</span>
          )}
        </div>
      )}

      {/* Collapsible Main Content */}
      {!isCollapsed && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          {/* Badges for completed items */}
          <div className="flex flex-wrap gap-2">
            {ANGLES.map((label, idx) => {
              const url = formData.images?.[idx];
              const altText = imageAlts[idx];
              const isEditing = editingGallery[idx] || !url;
              if (isEditing) return null;

              return (
                <button
                  type="button"
                  key={`badge-${label}`}
                  onClick={() => setEditingGallery({ ...editingGallery, [idx]: true })}
                  className="flex items-center gap-2 px-3 py-1.5 bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 text-brand-700 dark:text-brand-300 rounded-xl hover:bg-brand-100 dark:hover:bg-brand-500/30 transition-colors text-left cursor-pointer"
                >
                  <div className="w-6 h-6 rounded overflow-hidden bg-white shrink-0 border border-slate-200 dark:border-slate-700">
                    <img src={url} alt={altText || label} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold leading-none">{label}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[140px] mt-0.5">
                      {altText ? `Alt: "${altText}"` : 'No Alt text set'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Inputs grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ANGLES.map((label, idx) => {
              const url = formData.images?.[idx];
              const altText = imageAlts[idx] || '';
              const isEditing = editingGallery[idx] || !url;
              if (!isEditing) return null;

              return (
                <div
                  key={`card-${label}`}
                  className="flex flex-col gap-3 p-4 bg-slate-50/50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-brand-500/30 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      {label}
                    </span>
                    {url && (
                      <button
                        type="button"
                        onClick={() => setEditingGallery({ ...editingGallery, [idx]: false })}
                        className="text-slate-400 hover:text-brand-500 p-1 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                        title="Done editing"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Image URL Input */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Image URL
                    </label>
                    <input
                      type="url"
                      placeholder={`https://...`}
                      value={formData.images?.[idx] || ''}
                      onChange={(e) => handleUpdateImage(idx, e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                    />
                  </div>

                  {/* Image Alt Text Input */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        SEO Alt Text
                      </label>
                      <button
                        type="button"
                        onClick={() => handleAutoSuggestAlt(idx, label)}
                        className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                        title="Auto generate Alt text from device name"
                      >
                        <Sparkles className="w-3 h-3" /> Auto Alt
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder={`e.g. ${formData.brand || 'Brand'} ${formData.name || 'Device'} ${label}`}
                      value={altText}
                      onChange={(e) => handleUpdateAlt(idx, e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
