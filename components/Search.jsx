import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SearchIcon, X } from 'lucide-react'

export function Search({searchQuery,setSearchQuery,selectedCategory,setSelectedCategory}) {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Search Database</h3>
        
        <div className="relative">
          <Input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search model, brand, processor..." 
            className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl h-12 pl-10 pr-16 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-brand-500 transition-colors"
          />
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          {searchQuery && (
            <Button 
              variant="secondary"
              size="sm"
              onClick={() => setSearchQuery("")} 
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-2.5 text-xs rounded-lg"
            >
              Clear
            </Button>
          )}
        </div>

        {/* Category selector */}
        <div className="space-y-1.5">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Product Filter Type</span>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge 
              variant={selectedCategory === "All" ? "default" : "outline"}
              onClick={() => setSelectedCategory("All")}
              className={`cursor-pointer px-3 py-1 text-xs font-semibold transition-colors ${selectedCategory === "All" ? "bg-brand-600 hover:bg-brand-700 text-white" : "text-slate-600 dark:text-slate-400"}`}
            >
              All Types
            </Badge>
            <Badge 
              variant={selectedCategory === "Devices" ? "default" : "outline"}
              onClick={() => setSelectedCategory("Devices")}
              className={`cursor-pointer px-3 py-1 text-xs font-semibold transition-colors ${selectedCategory === "Devices" ? "bg-brand-600 hover:bg-brand-700 text-white" : "text-slate-600 dark:text-slate-400"}`}
            >
              Devices
            </Badge>
            <Badge 
              variant={selectedCategory === "Blogs" ? "default" : "outline"}
              onClick={() => setSelectedCategory("Blogs")}
              className={`cursor-pointer px-3 py-1 text-xs font-semibold transition-colors ${selectedCategory === "Blogs" ? "bg-brand-600 hover:bg-brand-700 text-white" : "text-slate-600 dark:text-slate-400"}`}
            >
              Blogs
            </Badge>
          </div>
        </div>
      </div>
  )
}
