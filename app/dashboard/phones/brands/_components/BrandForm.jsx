import React from 'react';
import { Button } from '@/components/ui/button';

export default function BrandForm({ newBrand, setNewBrand, isPending, handleAddBrand }) {
  return (
    <div className="w-full lg:w-1/3 shrink-0">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Add New Brand</h2>
      <form onSubmit={handleAddBrand} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Name
            </label>
            <input
              type="text"
              value={newBrand}
              onChange={(e) => setNewBrand(e.target.value)}
              disabled={isPending}
              placeholder="e.g., Apple"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
            />
            <p className="text-xs text-slate-500 mt-2">The name is how it appears on your site.</p>
          </div>
          <Button 
            type="submit" 
            disabled={isPending || !newBrand.trim()}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-lg shadow-brand-500/25 disabled:opacity-50"
          >
            {isPending ? 'Saving...' : 'Add New Brand'}
          </Button>
        </div>
      </form>
    </div>
  );
}
