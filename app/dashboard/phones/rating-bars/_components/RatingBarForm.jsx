import React from 'react';
import { Button } from '@/components/ui/button';

export default function RatingBarForm({ name, handleNameChange, slug, setSlug, description, setDescription, defaultValue, setDefaultValue, handleAdd, isPending }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 h-fit">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Add New Rating Bar</h2>
      <form onSubmit={handleAdd} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            required
          />
          <p className="text-xs text-slate-500 mt-1">The name is how it appears on your site.</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Slug</label>
          <input 
            type="text" 
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            required
          />
          <p className="text-xs text-slate-500 mt-1">The "slug" is the URL-friendly version of the name.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Default Value</label>
          <input 
            type="number" 
            min="1" max="5" step="1"
            value={defaultValue}
            onChange={(e) => setDefaultValue(e.target.value)}
            className="w-24 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            required
          />
          <p className="text-xs text-slate-500 mt-1">Select Default value for this rating bar (1-5).</p>
        </div>

        <Button type="submit" disabled={isPending} className="w-full bg-brand-600 hover:bg-brand-700 text-white rounded-xl py-6 mt-4">
          {isPending ? 'Adding...' : 'Add New Rating Bar'}
        </Button>
      </form>
    </div>
  );
}
