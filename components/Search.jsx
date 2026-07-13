'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchIcon, X, Smartphone, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MOCK_PRODUCTS from '@/data/products.json';
import MOCK_BLOGS from '@/data/blogs.json';

export function Search({ searchQuery, setSearchQuery }) {
  const router = useRouter();
  const containerRef = useRef(null);
  
  const [activeScope, setActiveScope] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim().length > 0) {
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsDropdownOpen(false);
  };

  const handleResultClick = (result) => {
    // Navigate to the respective item (placeholder for now)
    if (result.type === 'device') {
      console.log(`Navigating to device ${result.id}`);
    } else {
      console.log(`Navigating to blog ${result.id}`);
    }
    setIsDropdownOpen(false);
  };

  // Compute unified search results
  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.trim().length === 0) return [];
    
    const query = searchQuery.toLowerCase();
    const results = [];

    // Filter Devices
    if (activeScope === "All" || activeScope === "Devices") {
      const matchedDevices = MOCK_PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.brand.toLowerCase().includes(query)
      ).map(p => ({
        type: 'device',
        id: p.id,
        title: p.name,
        subtitle: p.brand,
        icon: Smartphone
      }));
      results.push(...matchedDevices);
    }

    // Filter Blogs
    if (activeScope === "All" || activeScope === "Blogs") {
      const matchedBlogs = MOCK_BLOGS.filter(b => 
        (b.title.toLowerCase().includes(query) || 
        b.excerpt.toLowerCase().includes(query)) && b.status === 'published'
      ).map(b => ({
        type: 'blog',
        id: b.id,
        title: b.title,
        subtitle: `Blog • ${b.category}`,
        icon: FileText
      }));
      results.push(...matchedBlogs);
    }

    return results.slice(0, 10); // Limit to top 10 results
  }, [searchQuery, activeScope]);

  return (
    <div ref={containerRef} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm relative z-40">
      <h3 style={{fontSize: "var(--font-size-h3-section, var(--font-size-h3-default))"}} className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Search Database</h3>
      
      <div className="relative">
        <Input 
          type="text" 
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => { if (searchQuery.length > 0) setIsDropdownOpen(true); }}
          placeholder="Search model, brand, processor..." 
          className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl h-12 pl-10 pr-16 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-brand-500 transition-colors"
        />
        <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        {searchQuery && (
          <Button 
            variant="secondary"
            size="sm"
            onClick={clearSearch} 
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-2.5 text-xs rounded-lg"
          >
            Clear
          </Button>
        )}

        {/* Dropdown Results Overlay */}
        {isDropdownOpen && searchQuery.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl max-h-[300px] overflow-y-auto overflow-x-hidden z-50">
            {searchResults.length > 0 ? (
              <ul className="py-2">
                {searchResults.map((result) => {
                  const Icon = result.icon;
                  return (
                    <li 
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultClick(result)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800/50 last:border-0"
                    >
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">{result.title}</span>
                        <span className="text-xs text-slate-500 truncate">{result.subtitle}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="p-4 text-center text-sm text-slate-500">
                No results found for "{searchQuery}" in {activeScope}.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Category selector */}
      <div className="space-y-1.5">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Product Filter Type</span>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge 
            variant={activeScope === "All" ? "default" : "outline"}
            onClick={() => { setActiveScope("All"); if(searchQuery) setIsDropdownOpen(true); }}
            className={`cursor-pointer px-3 py-1 text-xs font-semibold transition-colors ${activeScope === "All" ? "bg-brand-600 hover:bg-brand-700 text-white" : "text-slate-600 dark:text-slate-400"}`}
          >
            All Types
          </Badge>
          <Badge 
            variant={activeScope === "Devices" ? "default" : "outline"}
            onClick={() => { setActiveScope("Devices"); if(searchQuery) setIsDropdownOpen(true); }}
            className={`cursor-pointer px-3 py-1 text-xs font-semibold transition-colors ${activeScope === "Devices" ? "bg-brand-600 hover:bg-brand-700 text-white" : "text-slate-600 dark:text-slate-400"}`}
          >
            Devices
          </Badge>
          <Badge 
            variant={activeScope === "Blogs" ? "default" : "outline"}
            onClick={() => { setActiveScope("Blogs"); if(searchQuery) setIsDropdownOpen(true); }}
            className={`cursor-pointer px-3 py-1 text-xs font-semibold transition-colors ${activeScope === "Blogs" ? "bg-brand-600 hover:bg-brand-700 text-white" : "text-slate-600 dark:text-slate-400"}`}
          >
            Blogs
          </Badge>
        </div>
      </div>
    </div>
  );
}
