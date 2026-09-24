import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function BrandForm({
  formData,
  setFormData,
  isPending,
  handleAddBrand
}) {
  return (
    <div className="w-full lg:w-1/3 shrink-0">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Add New Brand</h2>
      <form onSubmit={handleAddBrand} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            disabled={isPending}
            placeholder="e.g., Apple"
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
            required
          />
          <p className="text-xs text-slate-500 mt-1.5">The name is how it appears on your site.</p>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
            H1 Heading (Optional)
          </label>
          <input
            type="text"
            value={formData.h1}
            onChange={(e) => setFormData(prev => ({ ...prev, h1: e.target.value }))}
            disabled={isPending}
            placeholder="e.g., Apple iPhone Specifications"
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
          />
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Leave empty to default to "{formData.name || 'Brand'} Phones".</p>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
            Intro Paragraph (Optional)
          </label>
          <textarea
            rows={3}
            value={formData.intro}
            onChange={(e) => setFormData(prev => ({ ...prev, intro: e.target.value }))}
            disabled={isPending}
            placeholder="e.g., Browse detailed specifications, prices, and camera details..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50 resize-none leading-relaxed"
          />
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">SEO copy indexed by search engines and screen readers.</p>
        </div>

        <Button 
          type="submit" 
          disabled={isPending || !formData.name.trim()}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-lg shadow-brand-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {isPending ? 'Saving...' : 'Add New Brand'}
        </Button>
      </form>
    </div>
  );
}
