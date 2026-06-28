import React from 'react';
import { Button } from '@/components/ui/button';

export default function BrandList({ brands, selectedBrand, setSelectedBrand }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Popular Brands</h3>
        {selectedBrand !== "All" && (
          <Button
            variant="link"
            onClick={() => setSelectedBrand("All")}
            className="text-[10px] text-brand-400 h-auto p-0"
          >
            Show All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {brands.map(brand => (
          <Button
            key={brand}
            variant={selectedBrand === brand ? "default" : "ghost"}
            onClick={() => setSelectedBrand(brand)}
            className={`text-xs py-2.5 px-1 h-auto text-center rounded-xl font-bold truncate transition-all active:scale-95 border ${selectedBrand === brand ? "bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/10 border-brand-500" : "bg-slate-50 border-slate-300 hover:bg-slate-100 text-slate-600 hover:text-slate-900 dark:bg-slate-800/80 dark:border-slate-700/60 dark:hover:bg-slate-700 dark:text-slate-400 dark:hover:text-white"}`}
          >
            {brand}
          </Button>
        ))}
      </div>
    </div>
  );
}