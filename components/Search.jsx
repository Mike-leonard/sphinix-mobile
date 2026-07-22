'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchIcon, X, Smartphone, FileText, Loader2 } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import MOCK_PRODUCTS from '@/data/products.json';
import { publishedBlogs } from '@/actions/blogs';

export function Search({ searchQuery: propQuery, setSearchQuery: propSetQuery }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const containerRef = useRef(null);

  // 1. Input & Debounced Query States
  const urlQuery = searchParams ? (searchParams.get('q') || searchParams.get('search') || '') : '';
  const [internalQuery, setInternalQuery] = useState(propQuery || urlQuery || '');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // 2. Component UI & Results States
  const [activeScope, setActiveScope] = useState("All");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Sync internalQuery when propQuery or urlQuery updates externally
  useEffect(() => {
    if (propQuery !== undefined && propQuery !== null && propQuery !== '') {
      setInternalQuery(propQuery);
    } else if (urlQuery) {
      setInternalQuery(urlQuery);
    }
  }, [propQuery, urlQuery]);

  // Debounce Effect (300ms delay to avoid excessive server calls)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(internalQuery.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [internalQuery]);

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

  // Fetch search results on-demand using debouncedQuery and publishedBlogs server action
  useEffect(() => {
    if (!debouncedQuery) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    let isCancelled = false;
    setIsSearching(true);

    async function executeSearch() {
      const queryLower = debouncedQuery.toLowerCase();
      const results = [];

      // 1. Search Devices (from local products database)
      if (activeScope === "All" || activeScope === "Phones") {
        const matchedDevices = MOCK_PRODUCTS.filter(p =>
          p.name.toLowerCase().includes(queryLower) ||
          p.brand.toLowerCase().includes(queryLower)
        ).slice(0, 5).map(p => ({
          type: 'device',
          id: p.id,
          title: p.name,
          subtitle: p.brand,
          icon: Smartphone
        }));
        results.push(...matchedDevices);
      }

      // 2. Search Published Blogs (via server action on-demand)
      if (activeScope === "All" || activeScope === "Blogs") {
        try {
          const blogs = await publishedBlogs({ query: debouncedQuery, limit: 5 });
          if (!isCancelled && Array.isArray(blogs)) {
            const matchedBlogs = blogs.map(b => ({
              type: 'blog',
              id: b.id,
              title: b.title,
              subtitle: `Blog • ${b.category || 'General'}`,
              icon: FileText
            }));
            results.push(...matchedBlogs);
          }
        } catch (error) {
          console.error("Error executing blog search server action:", error);
        }
      }

      if (!isCancelled) {
        setSearchResults(results.slice(0, 10));
        setIsSearching(false);
      }
    }

    executeSearch();

    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery, activeScope]);

  // Event Handlers
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInternalQuery(val);
    if (typeof propSetQuery === 'function') {
      propSetQuery(val);
    }
    if (val.trim().length > 0) {
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsDropdownOpen(false);
      const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
      if (internalQuery.trim()) {
        params.set('q', internalQuery.trim());
      } else {
        params.delete('q');
        params.delete('search');
      }
      params.delete('page');
      const targetPath = pathname === '/blogs' ? '/blogs' : '/phones';
      const queryString = params.toString();
      router.push(queryString ? `${targetPath}?${queryString}` : targetPath);
    }
  };

  const clearSearch = () => {
    setInternalQuery("");
    setDebouncedQuery("");
    setSearchResults([]);
    if (typeof propSetQuery === 'function') {
      propSetQuery("");
    }
    setIsDropdownOpen(false);
    if (pathname === '/blogs' || pathname === '/phones') {
      const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
      params.delete('q');
      params.delete('search');
      params.delete('page');
      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
    }
  };

  const handleResultClick = (result) => {
    setIsDropdownOpen(false);
    if (result.type === 'device') {
      router.push(`/phones?q=${encodeURIComponent(result.title)}`);
    } else {
      router.push(`/blogs?q=${encodeURIComponent(result.title)}`);
    }
  };

  return (
    <div ref={containerRef} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm relative z-40">
      <h3 style={{ fontSize: "var(--font-size-h3-section, var(--font-size-h3-default))" }} className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Search Database</h3>

      <div className="relative">
        <Input
          type="text"
          value={internalQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (internalQuery.length > 0) setIsDropdownOpen(true); }}
          placeholder="Search model, brand, processor..."
          className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl h-12 pl-10 pr-16 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-brand-500 transition-colors"
        />
        <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        {internalQuery && (
          <Button
            variant="secondary"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-2.5 text-xs rounded-lg cursor-pointer"
          >
            Clear
          </Button>
        )}

        {/* Dropdown Results Overlay */}
        {isDropdownOpen && internalQuery.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl max-h-[300px] overflow-y-auto overflow-x-hidden z-50">
            {isSearching ? (
              <div className="p-4 flex items-center justify-center gap-2 text-sm text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
                <span>Searching articles & devices...</span>
              </div>
            ) : searchResults.length > 0 ? (
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
                No results found for "{internalQuery}" in {activeScope}.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Scope Selector */}
      <div className="space-y-1.5">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Product Filter Type</span>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge
            variant={activeScope === "All" ? "default" : "outline"}
            onClick={() => { setActiveScope("All"); if (internalQuery) setIsDropdownOpen(true); }}
            className={`cursor-pointer px-3 py-1 text-xs font-semibold transition-colors ${activeScope === "All" ? "bg-brand-600 hover:bg-brand-700 text-white" : "text-slate-600 dark:text-slate-400"}`}
          >
            All Types
          </Badge>
          <Badge
            variant={activeScope === "Phones" ? "default" : "outline"}
            onClick={() => { setActiveScope("Phones"); if (internalQuery) setIsDropdownOpen(true); }}
            className={`cursor-pointer px-3 py-1 text-xs font-semibold transition-colors ${activeScope === "Phones" ? "bg-brand-600 hover:bg-brand-700 text-white" : "text-slate-600 dark:text-slate-400"}`}
          >
            Phones
          </Badge>
          <Badge
            variant={activeScope === "Blogs" ? "default" : "outline"}
            onClick={() => { setActiveScope("Blogs"); if (internalQuery) setIsDropdownOpen(true); }}
            className={`cursor-pointer px-3 py-1 text-xs font-semibold transition-colors ${activeScope === "Blogs" ? "bg-brand-600 hover:bg-brand-700 text-white" : "text-slate-600 dark:text-slate-400"}`}
          >
            Blogs
          </Badge>
        </div>
      </div>
    </div>
  );
}
