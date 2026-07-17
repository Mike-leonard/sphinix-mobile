import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export default function FilterForm({
  newTitle,
  setNewTitle,
  newAttributeSlug,
  setNewAttributeSlug,
  allAttributes,
  handleAddFilter,
  isPending
}) {
  return (
    <form onSubmit={handleAddFilter} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Create New Filter</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Filter Display Title</label>
          <input 
            type="text" 
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="e.g. Storage Capacity"
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Map to Attribute</label>
          <select 
            value={newAttributeSlug}
            onChange={e => setNewAttributeSlug(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50"
            required
          >
            <option value="" disabled>Select an attribute</option>
            {allAttributes.map(a => (
              <option key={a.slug} value={a.slug}>{a.name} ({a.slug})</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button type="button" onClick={handleAddFilter} disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-2 flex items-center gap-2">
          <Check className="w-4 h-4" />
          Save Filter
        </Button>
      </div>
    </form>
  );
}
