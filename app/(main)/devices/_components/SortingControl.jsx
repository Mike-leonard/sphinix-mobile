import React from 'react';
import { LayoutGrid, List } from 'lucide-react';

export default function SortingControl({ viewMode, setViewMode, sortOption, setSortOption, selectedBrand, setSelectedBrand, BRANDS, setShowFilters, showFilters }) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white dark:bg-[#1a2035] p-3 rounded-lg border border-slate-200 dark:border-slate-800 mb-6 gap-4">

            <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Display:</span>
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-md p-1">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded-sm transition-colors ${viewMode === 'grid' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded-sm transition-colors ${viewMode === 'list' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm rounded-md px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 w-full sm:w-auto"
                >
                    <option>Date (default)</option>
                    <option>Price (Low to High)</option>
                    <option>Price (High to Low)</option>
                    <option>Rating</option>
                </select>

                <select
                    value={selectedBrand}
                    onChange={(e) => { setSelectedBrand(e.target.value); setCurrentPage(1); }}
                    className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm rounded-md px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 w-full sm:w-auto"
                >
                    {BRANDS.map(b => <option key={b} value={b}>{b === 'All' ? 'Brands' : b}</option>)}
                </select>
            </div>

            <button
                onClick={() => setShowFilters(!showFilters)}
                className="text-sm font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
                Filters
                <span className={`transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`}>▾</span>
            </button>
        </div>
    );
}