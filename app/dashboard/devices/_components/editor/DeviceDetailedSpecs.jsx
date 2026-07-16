'use client';

import React, { useState, useEffect } from 'react';
import { List, ChevronDown } from 'lucide-react';

export default function DeviceDetailedSpecs({ specs, onChange, deviceGroups = [], allAttributes = [] }) {
  // Filter out 'Quick Specifications' as it is handled by DeviceQuickSpecs
  const detailedGroups = deviceGroups.filter(g => g !== 'Quick Specifications');
  
  const [activeCategory, setActiveCategory] = useState(detailedGroups[0] || '');

  useEffect(() => {
    if (detailedGroups.length > 0 && !activeCategory) {
      setActiveCategory(detailedGroups[0]);
    }
  }, [detailedGroups, activeCategory]);

  const activeGroupAttributes = allAttributes.filter(attr => 
    attr.groupIds?.includes(activeCategory) || attr.groupId === activeCategory
  );

  const activeSpecsList = specs?.[activeCategory] || [];

  const handleUpdateSpec = (attrSlug, attrName, newValue) => {
    const currentList = [...(specs?.[activeCategory] || [])];
    const existingIndex = currentList.findIndex(s => s.label === attrName || s.slug === attrSlug);
    
    if (existingIndex >= 0) {
      currentList[existingIndex] = { ...currentList[existingIndex], value: newValue };
    } else {
      currentList.push({ label: attrName, slug: attrSlug, value: newValue });
    }

    onChange({
      ...specs,
      [activeCategory]: currentList
    });
  };

  const getSpecValue = (attrSlug, attrName) => {
    // Also try to find it by name for backwards compatibility
    const spec = activeSpecsList.find(s => s.slug === attrSlug || s.label === attrName);
    return spec ? spec.value : '';
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-2">
        <List className="h-5 w-5 text-indigo-500" />
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Detailed Specifications</h2>
          <p className="text-sm text-slate-500">Manage the comprehensive spec sheet grouped by categories.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-full">
        {/* Categories Sidebar */}
        <div className="w-full md:w-48 lg:w-56 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-4 shrink-0 flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto gap-1">
          {detailedGroups.map((cat) => {
            const specCount = specs?.[cat]?.filter(s => !!s.value)?.length || 0;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'
                    : 'text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
                {specCount > 0 && (
                  <span className="ml-2 text-xs opacity-60">({specCount})</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Specs Editor */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">
              {activeCategory} Specifications
            </h3>
          </div>

          <div className="space-y-4">
            {activeGroupAttributes.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                No attributes configured for this group in the Attribute Manager.
              </div>
            ) : (
              activeGroupAttributes.map((attr) => {
                const currentValue = getSpecValue(attr.slug, attr.name);
                const hasTerms = attr.terms && attr.terms.length > 0;
                
                return (
                  <div key={attr.id} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start border-b border-slate-100 dark:border-slate-800 pb-4 last:border-0 last:pb-0">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 pt-2 sm:text-right px-2">
                      {attr.name}
                    </label>
                    
                    <div className="sm:col-span-2 relative">
                      {hasTerms ? (
                        <div className="relative">
                          <input
                            type="text"
                            list={`list-${attr.id}`}
                            value={String(currentValue)}
                            onChange={(e) => handleUpdateSpec(attr.slug, attr.name, e.target.value)}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 pr-8 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            placeholder={attr.placeholder || "Select or enter value..."}
                          />
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                          <datalist id={`list-${attr.id}`}>
                            {attr.terms.map((term, i) => (
                              <option key={i} value={term} />
                            ))}
                          </datalist>
                        </div>
                      ) : (
                        <textarea
                          rows={1}
                          value={String(currentValue)}
                          onChange={(e) => handleUpdateSpec(attr.slug, attr.name, e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-y min-h-[38px]"
                          placeholder={attr.placeholder || "Enter value..."}
                        />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
