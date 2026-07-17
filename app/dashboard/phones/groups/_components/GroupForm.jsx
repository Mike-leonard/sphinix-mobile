import React from 'react';
import { Button } from '@/components/ui/button';

export default function GroupForm({ newGroup, setNewGroup, isPending, handleAddGroup }) {
  return (
    <div className="w-full">
      <form onSubmit={handleAddGroup} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Name
            </label>
            <input
              type="text"
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
              disabled={isPending}
              placeholder="e.g., Battery"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
            />
            <p className="text-xs text-slate-500 mt-2">The name is how the group appears in the editor.</p>
          </div>
          <Button 
            type="submit" 
            disabled={isPending || !newGroup.trim()}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-lg shadow-brand-500/25 disabled:opacity-50"
          >
            {isPending ? 'Saving...' : 'Add New Group'}
          </Button>
        </div>
      </form>
    </div>
  );
}
