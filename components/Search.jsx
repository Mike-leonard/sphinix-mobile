'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchIcon, X, Smartphone, FileText, Loader2 } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { publishedDevices } from '@/actions/devices';
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

  // Fetch search results on-demand using debouncedQuery and server actions
  useEffect(() => {
    if (!debouncedQuery) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    let isCancelled = false;
    setIsSearching(true);

    async function executeSearch() {
      const results = [];

      // 1. Search Devices (via server action on-demand from PostgreSQL)
      if (activeScope === "All" || activeScope === "Phones") {
        try {
          const devices = await publishedDevices({ limit: 5, query: debouncedQuery });
          if (!isCancelled && Array.isArray(devices)) {
            const matchedDevices = devices.map(p => ({
              type: 'device',
              id: p.id,
              slug: p.slug || p.id,
              brand: p.brand,
              title: p.name,
              subtitle: p.brand,
              icon: Smartphone
            }));
            results.push(...matchedDevices);
          }
        } catch (error) {
          console.error("Error executing device search server action:", error);
        }
      }

      // 2. Search Published Blogs (via server action on-demand from PostgreSQL)
      if (activeScope === "All" || activeScope === "Blogs") {
        try {
          const blogs = await publishedBlogs({ query: debouncedQuery, limit: 5 });
          if (!isCancelled && Array.isArray(blogs)) {
            const matchedBlogs = blogs.map(b => ({
              type: 'blog',
              id: b.id,
              slug: b.slug || b.id,
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
      const brandSlug = (result.brand || 'phone').toLowerCase().replace(/\s+/g, '-');
      router.push(`/phones/${brandSlug}/${result.slug}`);
    } else {
      router.push(`/blogs?q=${encodeURIComponent(result.title)}`);
    }
  };

  return (
    <div ref={containerRef} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm relative z-40">
      <h3 style={{ fontSize: "var(--font-size-h3-section, var(--font-size-h3-default))" }} className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Search Database</h3>

      {/* Scope Selector Badges */}
      <div className="flex gap-2">
        {["All", "Phones", "Blogs"].map((scope) => (
          <Badge
            key={scope}
            variant={activeScope === scope ? "default" : "outline"}
            className={`cursor-pointer transition-all ${
              activeScope === scope
                ? "bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800"
            }`}
            onClick={() => setActiveScope(scope)}
          >
            {scope}
          </Badge>
        ))}
      </div>

      {/* Search Input Box */}
      <div className="relative">
        <Input
          type="text"
          placeholder={`Search ${activeScope.toLowerCase()}...`}
          value={internalQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (internalQuery.trim().length > 0) setIsDropdownOpen(true);
          }}
          className="pr-16 bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/60 focus:bg-white dark:focus:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all rounded-xl"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {internalQuery && (
            <Button
              variant="none"
              size="none"
              style={{ fontSize: "var(--font-size-button-default, var(--font-size-button-default))" }}
              onClick={clearSearch}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="none"
            size="none"
            style={{ fontSize: "var(--font-size-button-default, var(--font-size-button-default))" }}
            onClick={() => handleKeyDown({ key: 'Enter' })}
            className="p-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors cursor-pointer"
          >
            <SearchIcon className="w-4 h-4" />
          </Button>
        </div>

        {/* Live Search Dropdown */}
        {isDropdownOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            {isSearching ? (
              <div className="p-4 flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
                <span>Searching database...</span>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto">
                {searchResults.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <div
                      key={`${item.type}-${item.id}`}
                      onClick={() => handleResultClick(item)}
                      className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer flex items-center gap-3 transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 group-hover:scale-105 transition-transform shrink-0">
                        <ItemIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                No matching results found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
