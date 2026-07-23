'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdvancedFilters({ 
  isOpen = true, 
  filters = [], 
  selectedFilters: propSelectedFilters, 
  onToggleFilter, 
  className 
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!isOpen || !filters || filters.length === 0) return null;

  // Derive active filters from URL query params if prop not supplied
  const getActiveSelected = () => {
    if (propSelectedFilters) return propSelectedFilters;
    const selected = {};
    if (!searchParams) return selected;

    searchParams.forEach((val, key) => {
      if (key.startsWith('filter_')) {
        const filterId = key;
        selected[filterId] = val.split(',').filter(Boolean);
      }
    });
    return selected;
  };

  const selectedFilters = getActiveSelected();

  const handleToggle = (filterId, option) => {
    if (onToggleFilter) {
      onToggleFilter(filterId, option);
      return;
    }

    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    const paramKey = filterId.startsWith('filter_') ? filterId : `filter_${filterId}`;
    const current = (params.get(paramKey) || '').split(',').filter(Boolean);

    let updated;
    if (current.includes(option)) {
      updated = current.filter(o => o !== option);
    } else {
      updated = [...current, option];
    }

    if (updated.length > 0) {
      params.set(paramKey, updated.join(','));
    } else {
      params.delete(paramKey);
    }

    params.delete('page');
    router.push(`?${params.toString()}`);
  };

  return (
    <div className={`w-full bg-slate-100 dark:bg-[#1a2035] border border-slate-200 dark:border-slate-800 rounded-lg p-6 ${className || ''}`}>
      <div className="grid grid-cols-1 gap-6">
        {filters.map((filter) => {
          const filterKey = filter.id;
          return (
            <div key={filter.id}>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{filter.title}</h4>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {filter.options?.map((option) => {
                  const isSelected = selectedFilters[filterKey]?.includes(option);
                  return (
                    <label key={option} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={isSelected || false}
                        onChange={() => handleToggle(filterKey, option)}
                        className="rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors select-none">
                        {option}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
