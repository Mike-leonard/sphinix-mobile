import React from 'react';

export default function TopRated({ topRated, setSelectedBrand, setSearchQuery }) {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
      <h3 className="text-base font-bold text-white tracking-tight">Top Rated</h3>

      <div className="space-y-3">
        {topRated.slice(0, 3).map(prod => (
          <div
            key={prod.id}
            onClick={() => { setSelectedBrand(prod.brand); setSearchQuery(prod.name); }}
            className="flex gap-4 items-center bg-slate-950/40 p-2.5 rounded-xl border border-slate-850/60 hover:border-brand-500/20 cursor-pointer transition-colors"
          >
            <div className="relative w-12 h-12 bg-slate-950 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
              <div className={`absolute w-6 h-6 rounded-full bg-gradient-to-tr ${prod.imageColor} opacity-20 blur-lg`}></div>
              <div className="w-5 h-9 bg-slate-900 border border-slate-800 rounded flex flex-col justify-end p-0.5">
                <div className={`flex-1 rounded bg-gradient-to-br ${prod.imageColor}`} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-brand-400 font-extrabold uppercase tracking-wide block">{prod.brand}</span>
              <h4 className="text-xs font-bold text-white truncate leading-tight">{prod.name}</h4>
              <div className="flex gap-1 items-center mt-1">
                <span className="text-[10px] text-yellow-500">★ {prod.rating}</span>
                <span className="text-[9px] text-slate-500 font-medium">({(prod.rating * 10).toFixed(0)} votes)</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-white block">{prod.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}