import React from 'react'

export function Search({searchQuery,setSearchQuery,selectedCategory,setSelectedCategory}) {
  return (
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
  )
}
