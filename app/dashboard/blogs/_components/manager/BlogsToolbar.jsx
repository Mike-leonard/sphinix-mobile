import React from 'react';
import Link from 'next/link';
import { Search, Trash2, Tags, Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BlogsToolbar({ 
  search, 
  setSearch, 
  setCurrentPage, 
  selectedCategory, 
  setSelectedCategory, 
  categories, 
  viewMode, 
  setViewMode 
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="relative w-full sm:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search blogs..." 
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-brand-500/50 outline-none text-sm"
        />
      </div>
      
      <div className="flex w-full sm:w-auto items-center gap-3">
        <div className="relative">
          <select 
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            className="pl-4 pr-8 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none cursor-pointer appearance-none"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        <Button 
          variant={viewMode === 'trash' ? 'default' : 'outline'} 
          onClick={() => { setViewMode(viewMode === 'active' ? 'trash' : 'active'); setCurrentPage(1); }} 
          className={`cursor-pointer gap-2 rounded-xl ${viewMode === 'trash' ? 'bg-red-600 hover:bg-red-700 text-white border-transparent' : 'text-slate-600 dark:text-slate-300'}`}
        >
          <Trash2 className="w-4 h-4" /> {viewMode === 'trash' ? 'Exit Trash' : 'Trash'}
        </Button>
        <Link href="/dashboard/blogs/categories">
          <Button variant="outline" className="cursor-pointer gap-2 rounded-xl text-slate-600 dark:text-slate-300">
            <Tags className="w-4 h-4" /> Manage Categories
          </Button>
        </Link>
        <Link href="/dashboard/blogs/new">
          <Button className="cursor-pointer bg-brand-600 hover:bg-brand-700 text-white gap-2 rounded-xl">
            <Plus className="w-4 h-4" /> New Blog
          </Button>
        </Link>
      </div>
    </div>
  );
}
