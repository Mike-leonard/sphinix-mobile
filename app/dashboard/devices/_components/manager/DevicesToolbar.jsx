'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Plus, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DevicesToolbar({
  search,
  setSearch,
  setCurrentPage,
  selectedBrand,
  setSelectedBrand,
  brands,
  viewMode,
  setViewMode
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input 
            type="text" 
            placeholder="Search devices..." 
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-full sm:w-64 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select 
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
          >
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => { setViewMode('active'); setCurrentPage(1); }}
            className={cn(
              "flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-all",
              viewMode === 'active' 
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm" 
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            Active
          </button>
          <button
            onClick={() => { setViewMode('trash'); setCurrentPage(1); }}
            className={cn(
              "flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-all",
              viewMode === 'trash' 
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm" 
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            Trash
          </button>
        </div>

        <Link 
          href="/dashboard/devices/new" 
          className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Add Device
        </Link>
      </div>
    </div>
  );
}
