import React from 'react';

export default function Sidebar({
  searchQuery,
  setSearchQuery,
  selectedBrand,
  setSelectedBrand,
  selectedCategory,
  setSelectedCategory,
  newArrivals,
  topRated,
  categories,
  brands,
}) {
  return (
    <div className="lg:col-span-4 space-y-8">
      {/* SEARCH AND FILTERS */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
        <h3 className="text-base font-bold text-white tracking-tight">Search Database</h3>
        
        <div className="relative">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search model, brand, processor..." 
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
          />
          <svg className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")} 
              className="absolute right-3 top-3 text-slate-400 hover:text-white text-xs bg-slate-850 px-1.5 py-0.5 rounded"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category selector */}
        <div className="space-y-1.5">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Product Filter Type</span>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setSelectedCategory("All")}
              className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-colors ${selectedCategory === "All" ? "bg-brand-600 border-brand-500 text-white" : "bg-slate-950 border-slate-850 hover:bg-slate-850 text-slate-400 hover:text-white"}`}
            >
              All Types
            </button>
            <button 
              onClick={() => setSelectedCategory("Mobiles")}
              className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-colors ${selectedCategory === "Mobiles" ? "bg-brand-600 border-brand-500 text-white" : "bg-slate-950 border-slate-850 hover:bg-slate-850 text-slate-400 hover:text-white"}`}
            >
              Mobiles
            </button>
          </div>
        </div>
      </div>

      {/* NEW ARRIVALS */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
        <h3 className="text-base font-bold text-white tracking-tight flex items-center justify-between">
          <span>New Arrivals</span>
          <span className="px-2 py-0.5 bg-brand-500/10 text-brand-400 border border-brand-500/20 text-[9px] font-extrabold uppercase rounded-full tracking-wider animate-pulse">Hot</span>
        </h3>

        <div className="grid grid-cols-3 gap-2">
          {newArrivals.slice(0, 6).map(prod => (
            <div 
              key={prod.id} 
              onClick={() => { setSelectedBrand(prod.brand); setSearchQuery(prod.name); }}
              className="group bg-slate-950 rounded-xl p-2 border border-slate-850/60 hover:border-brand-500/30 text-center cursor-pointer transition-colors"
            >
              <div className="relative h-16 w-full bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden mb-1.5">
                <div className={`absolute w-10 h-10 rounded-full bg-gradient-to-tr ${prod.imageColor} opacity-10 blur-xl`}></div>
                <div className="w-8 h-12 bg-slate-950 border border-slate-800 rounded flex flex-col justify-end p-0.5">
                  <div className={`flex-1 rounded bg-gradient-to-br ${prod.imageColor}`} />
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-300 block truncate group-hover:text-brand-400">
                {prod.name.split(' ')[0]}
              </span>
              <span className="text-[9px] text-brand-500 font-extrabold">
                {prod.price}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* TOP RATED */}
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

      {/* CATEGORIES */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
        <h3 className="text-base font-bold text-white tracking-tight">Product Categories</h3>
        
        <ul className="space-y-2">
          {categories.map(cat => (
            <li key={cat.name}>
              <button 
                onClick={() => { setSelectedCategory(cat.name); }}
                className={`w-full flex items-center justify-between text-xs py-2 px-3 rounded-lg transition-colors ${selectedCategory === cat.name ? "bg-brand-600/10 text-brand-400 border border-brand-500/20 font-bold" : "text-slate-400 hover:text-slate-200 hover:bg-slate-850/50"}`}
              >
                <span className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${cat.count > 0 ? "bg-brand-500" : "bg-slate-700"}`}></span>
                  {cat.name}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cat.count > 0 ? "bg-slate-950 text-brand-400" : "bg-slate-900 text-slate-600"}`}>
                  {cat.count}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* BRANDS LIST CHIPS */}
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
    </div>
  );
}
