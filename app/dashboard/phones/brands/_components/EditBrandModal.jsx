'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EditBrandModal({
  isOpen,
  brand,
  onClose,
  onSave,
  isPending
}) {
  const [name, setName] = useState('');
  const [h1, setH1] = useState('');
  const [intro, setIntro] = useState('');

  useEffect(() => {
    if (brand) {
      setName(brand.name || '');
      setH1(brand.h1 || '');
      setIntro(brand.intro || '');
    }
  }, [brand]);

  if (!isOpen || !brand) return null;

  const isProtected = brand.name === 'Other';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      oldName: brand.name,
      newName: name.trim(),
      h1: h1.trim(),
      intro: intro.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-500">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Edit Brand — {brand.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Update display name, custom H1 heading, and SEO intro paragraph.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Brand Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Brand Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending || isProtected}
              placeholder="e.g., Apple"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
              required
            />
            {isProtected && (
              <p className="text-xs text-amber-500 mt-1.5">The default "Other" brand cannot be renamed.</p>
            )}
          </div>

          {/* SEO H1 Heading */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Page H1 Heading (SEO)
            </label>
            <input
              type="text"
              value={h1}
              onChange={(e) => setH1(e.target.value)}
              disabled={isPending}
              placeholder={`e.g., ${name || 'Brand'} Phones`}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
              Targeted heading indexed by search engines and screen readers (e.g., "Apple iPhone Specifications").
            </p>
          </div>

          {/* SEO Intro Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Intro Paragraph (SEO Description)
            </label>
            <textarea
              rows={4}
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              disabled={isPending}
              placeholder={`Explore ${name || 'brand'} smartphones, full technical specifications, prices, and comparisons...`}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50 leading-relaxed resize-none"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
              Unique introduction tailored with keyword series (Galaxy, Pixel, Nord, etc.) for Google indexation and meta tags.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !name.trim()}
              className="px-5 py-2 text-xs bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-lg shadow-brand-500/25 flex items-center gap-2"
            >
              {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
