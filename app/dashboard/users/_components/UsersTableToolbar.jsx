import React from 'react';
import { Search, Loader2 } from 'lucide-react';

export default function UsersTableToolbar({ searchQuery, setSearchQuery, isPending }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="relative w-full sm:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow text-slate-900 dark:text-white"
        />
      </div>
      
      {isPending && (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Updating...
        </div>
      )}
    </div>
  );
}
