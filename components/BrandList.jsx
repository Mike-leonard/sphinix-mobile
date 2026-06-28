import React from 'react';

export default function BrandList({ brands, selectedBrand, setSelectedBrand }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Popular Brands</h3>
        {selectedBrand !== "All" && (
          <button
            onClick={() => setSelectedBrand("All")}
            className="text-[10px] text-brand-400 hover:underline"
          >
            Show All
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {brands.map(brand => (
          <button
            key={brand}
            onClick={() => setSelectedBrand(brand)}
            className={`text-xs py-2.5 px-1 text-center rounded-xl border font-bold truncate transition-all active:scale-95 ${selectedBrand === brand ? "bg-brand-600 border-brand-500 text-slate-900 dark:text-white shadow-md shadow-brand-600/10" : "bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-850 hover:bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white"}`}
          >
            {brand}
          </button>
        ))}
      </div>
    </div>
  );
}