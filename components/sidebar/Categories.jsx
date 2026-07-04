import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Categories({ categories, selectedCategory, setSelectedCategory }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
      <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Product Categories</h3>

      <ul className="space-y-2">
        {categories.map(cat => (
          <li key={cat.name}>
            <Button
              variant={selectedCategory === cat.name ? "secondary" : "ghost"}
              onClick={() => { setSelectedCategory(cat.name); }}
              className={`cursor-pointer w-full justify-between h-auto py-2 px-3 ${selectedCategory === cat.name ? "bg-brand-600/10 text-brand-400 border border-brand-500/20 font-bold hover:bg-brand-600/20" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"}`}
            >
              <span className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${cat.count > 0 ? "bg-brand-500" : "bg-slate-300 dark:bg-slate-700"}`}></span>
                {cat.name}
              </span>
              <Badge 
                variant="outline" 
                className={`text-[10px] px-1.5 py-0 rounded-full font-bold ${cat.count > 0 ? "text-brand-400 border-brand-400/30" : "text-slate-400 border-slate-200 dark:border-slate-800"}`}
              >
                {cat.count}
              </Badge>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}