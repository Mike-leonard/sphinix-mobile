import React from 'react';

export default function Categories({ categories, selectedCategory, setSelectedCategory }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
      <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Product Categories</h3>

      <ul className="space-y-2">
        {categories.map(cat => (
          <li key={cat.name}>
            <button
              onClick={() => { setSelectedCategory(cat.name); }}
              className={`w-full flex items-center justify-between text-xs py-2 px-3 rounded-lg transition-colors ${selectedCategory === cat.name ? "bg-brand-600/10 text-brand-400 border border-brand-500/20 font-bold" : "text-slate-600 dark:text-slate-400 hover:text-slate-200 hover:bg-slate-100/50 dark:bg-slate-850/50"}`}
            >
              <span className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${cat.count > 0 ? "bg-brand-500" : "bg-slate-700"}`}></span>
                {cat.name}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cat.count > 0 ? "bg-slate-50 dark:bg-slate-950 text-brand-400" : "bg-white dark:bg-slate-900 text-slate-600"}`}>
                {cat.count}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}