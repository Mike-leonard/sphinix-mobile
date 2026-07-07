import React from 'react';

export default function NewArrivals({ newArrivals, setSelectedBrand, setSearchQuery }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
      <h3 style={{fontSize: "var(--font-size-h3-section, var(--font-size-h3-default))"}} className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center justify-between">
        <span>New Arrivals</span>
        <span className="px-2 py-0.5 bg-brand-500/10 text-brand-400 border border-brand-500/20 text-[9px] font-extrabold uppercase rounded-full tracking-wider animate-pulse">Hot</span>
      </h3>

      <div className="grid grid-cols-3 gap-2">
        {newArrivals.slice(0, 6).map(prod => (
          <div
            key={prod.id}
            onClick={() => { setSelectedBrand(prod.brand); setSearchQuery(prod.name); }}
            className="group bg-slate-50 dark:bg-slate-950 rounded-xl p-2 border border-slate-300 dark:border-slate-850/60 hover:border-brand-500/30 text-center cursor-pointer transition-colors"
          >
            <div className="relative h-16 w-full bg-white dark:bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden mb-1.5">
              <div className={`absolute w-10 h-10 rounded-full bg-gradient-to-tr ${prod.imageColor} opacity-10 blur-xl`}></div>
              <div className="w-8 h-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded flex flex-col justify-end p-0.5">
                <div className={`flex-1 rounded bg-gradient-to-br ${prod.imageColor}`} />
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block truncate group-hover:text-brand-400">
              {prod.name.split(' ')[0]}
            </span>
            <span className="text-[9px] text-brand-500 font-extrabold">
              {prod.price}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}