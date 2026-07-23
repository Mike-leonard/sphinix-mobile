'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LayoutGrid, List } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { setDeviceViewMode } from '@/actions/devices';
import MobileFiltersSheet from './MobileFiltersSheet';

export default function SortingControl({ 
  selectedBrand = "All", 
  BRANDS = [],
  filters = []
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState('grid');
  const [sortOption, setSortOption] = useState('Date (default)');
  const [showFilters, setShowFilters] = useState(false);

  const handleViewModeToggle = async (mode) => {
    setViewMode(mode);
    await setDeviceViewMode(mode);
  };

  const handleBrandChange = (newBrand) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    if (newBrand && newBrand !== 'All') {
      params.set('brand', newBrand);
    } else {
      params.delete('brand');
    }
    params.delete('page');
    router.push(`?${params.toString()}`);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white dark:bg-[#1a2035] p-3 rounded-lg border border-slate-200 dark:border-slate-800 mb-6 gap-4">

        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Display:</span>
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-md p-1">
            <Button variant="none" size="none" style={{fontSize: "var(--font-size-button-default, var(--font-size-button-default))"}} 
              onClick={() => handleViewModeToggle('grid')}
              className={`cursor-pointer p-1.5 rounded-sm transition-colors ${viewMode === 'grid' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button variant="none" size="none" style={{fontSize: "var(--font-size-button-default, var(--font-size-button-default))"}} 
              onClick={() => handleViewModeToggle('list')}
              className={`cursor-pointer p-1.5 rounded-sm transition-colors ${viewMode === 'list' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="cursor-pointer bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm rounded-md px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 w-full sm:w-auto"
          >
            <option>Date (default)</option>
            <option>Price (Low to High)</option>
            <option>Price (High to Low)</option>
            <option>Rating</option>
          </select>

          <select
            value={selectedBrand}
            onChange={(e) => handleBrandChange(e.target.value)}
            className="cursor-pointer bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm rounded-md px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 w-full sm:w-auto"
          >
            {BRANDS.map(b => <option key={b} value={b}>{b === 'All' ? 'Brands' : b}</option>)}
          </select>
        </div>

        <Button variant="none" size="none" style={{fontSize: "var(--font-size-button-default, var(--font-size-button-default))"}} 
          onClick={() => setShowFilters(!showFilters)}
          className="cursor-pointer lg:hidden text-sm font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
        >
          Filters
          <span className={`transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`}>▾</span>
        </Button>
      </div>

      <MobileFiltersSheet
        filters={filters}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />
    </>
  );
}