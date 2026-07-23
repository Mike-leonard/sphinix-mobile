'use client';

import React from 'react';

// Filters are now passed as props from the database

export default function AdvancedFilters({ isOpen = true, filters = [], selectedFilters = {}, onToggleFilter, className }) {
  if (!isOpen) return null;

  if (!filters || filters.length === 0) {
    return null;
  }

  return (
    <div className={`w-full bg-slate-100 dark:bg-[#1a2035] border border-slate-200 dark:border-slate-800 rounded-lg p-6 ${className || ''}`}>
      <div className="grid grid-cols-1 gap-6">
        {filters.map((filter) => (
          <div key={filter.id}>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{filter.title}</h4>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {filter.options?.map((option) => {
                const isSelected = selectedFilters[filter.id]?.includes(option);
                return (
                  <label key={option} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox"
                      checked={isSelected || false}
                      onChange={() => onToggleFilter && onToggleFilter(filter.id, option)}
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
        ))}
      </div>
    </div>
  );
}
