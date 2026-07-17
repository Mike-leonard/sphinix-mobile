import React from 'react';
import { Button } from '@/components/ui/button';

export default function AttributeForm({
  newAttribute,
  setNewAttribute,
  newAttributeSlug,
  setNewAttributeSlug,
  newGroupIds,
  setNewGroupIds,
  availableGroups,
  isPending,
  handleAddAttribute
}) {
  return (
    <div className="w-full">
      <form onSubmit={handleAddAttribute} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Name
            </label>
            <input
              type="text"
              value={newAttribute}
              onChange={(e) => setNewAttribute(e.target.value)}
              disabled={isPending}
              placeholder="e.g., RAM"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Slug (Optional)
            </label>
            <input
              type="text"
              value={newAttributeSlug}
              onChange={(e) => setNewAttributeSlug(e.target.value)}
              disabled={isPending}
              placeholder={newAttribute.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || "e.g., ram"}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
            />
            <p className="text-xs text-slate-500 mt-2">Leave empty to auto-generate from name.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Groups
            </label>
            <div className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 max-h-32 overflow-y-auto">
              <div className="flex flex-col gap-2">
                {availableGroups.map(group => (
                  <label key={group} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={newGroupIds.includes(group)}
                      onChange={(e) => {
                        if (e.target.checked) setNewGroupIds([...newGroupIds, group]);
                        else setNewGroupIds(newGroupIds.filter(g => g !== group));
                      }}
                      disabled={isPending}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    {group}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <Button 
            type="submit" 
            disabled={isPending || !newAttribute.trim()}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-lg shadow-brand-500/25 disabled:opacity-50"
          >
            {isPending ? 'Saving...' : 'Add Attribute'}
          </Button>
        </div>
      </form>
    </div>
  );
}
