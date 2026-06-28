import React from 'react';

export default function BrandList({ brands, selectedBrand, setSelectedBrand }) {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white tracking-tight">Popular Brands</h3>
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
            className={`text-xs py-2.5 px-1 text-center rounded-xl border font-bold truncate transition-all active:scale-95 ${selectedBrand === brand ? "bg-brand-600 border-brand-500 text-white shadow-md shadow-brand-600/10" : "bg-slate-950 border-slate-850 hover:bg-slate-850 text-slate-400 hover:text-white"}`}
          >
            {brand}
          </button>
        ))}
      </div>
    </div>
  );
}