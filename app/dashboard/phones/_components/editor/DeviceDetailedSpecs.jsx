'use client';

import React, { useState, useEffect } from 'react';
import { List, ChevronDown, Sparkles, Loader2, Wand2 } from 'lucide-react';
import { generateSingleAttributeValue } from '@/actions/ai';

export default function DeviceDetailedSpecs({ 
  specs, 
  onChange, 
  deviceGroups = [], 
  allAttributes = [],
  deviceName = '',
  brand = ''
}) {
  // Filter out 'Quick Specifications' as it is handled by DeviceQuickSpecs
  const detailedGroups = deviceGroups.filter(g => g !== 'Quick Specifications');
  
  const [selectedCategory, setSelectedCategory] = useState('');
  const activeCategory = selectedCategory || detailedGroups[0] || '';
  const [loadingAttrs, setLoadingAttrs] = useState({});
  const [isFetchingCategory, setIsFetchingCategory] = useState(false);

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

  const handleFetchSingleAttr = async (attr) => {
    if (!deviceName && !brand) {
      alert("Please enter the Device Brand and Name first.");
      return;
    }

    setLoadingAttrs(prev => ({ ...prev, [attr.slug]: true }));

    try {
      const res = await generateSingleAttributeValue(deviceName, brand, attr.name, activeCategory);
      if (res.success && res.data) {
        handleUpdateSpec(attr.slug, attr.name, res.data);
      } else {
        alert(res.error || `Could not fetch value for ${attr.name}`);
      }
    } catch (err) {
      console.error(`Error fetching spec for ${attr.name}:`, err);
    } finally {
      setLoadingAttrs(prev => ({ ...prev, [attr.slug]: false }));
    }
  };

  const handleFetchAllMissingCategoryAttrs = async () => {
    if (!deviceName && !brand) {
      alert("Please enter the Device Brand and Name first.");
      return;
    }

    const emptyAttrs = activeGroupAttributes.filter(attr => !getSpecValue(attr.slug, attr.name));
    if (emptyAttrs.length === 0) return;

    setIsFetchingCategory(true);

    try {
      for (const attr of emptyAttrs) {
        setLoadingAttrs(prev => ({ ...prev, [attr.slug]: true }));
        try {
          const res = await generateSingleAttributeValue(deviceName, brand, attr.name, activeCategory);
          if (res.success && res.data) {
            handleUpdateSpec(attr.slug, attr.name, res.data);
          }
        } catch (e) {
          console.warn(`Failed fetching ${attr.name}:`, e);
        } finally {
          setLoadingAttrs(prev => ({ ...prev, [attr.slug]: false }));
        }
      }
    } finally {
      setIsFetchingCategory(false);
    }
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
                onClick={() => setSelectedCategory(cat)}
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">
              {activeCategory} Specifications
            </h3>

            {activeGroupAttributes.some(attr => !getSpecValue(attr.slug, attr.name)) && (
              <button
                type="button"
                onClick={handleFetchAllMissingCategoryAttrs}
                disabled={isFetchingCategory}
                className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isFetchingCategory ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Fetching Empty Specs...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Fetch Empty Fields</span>
                  </>
                )}
              </button>
            )}
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
                const isLoading = !!loadingAttrs[attr.slug];
                const queryHint = `${brand} ${deviceName} ${attr.name}`.trim();
                
                return (
                  <div key={attr.id} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start border-b border-slate-100 dark:border-slate-800 pb-4 last:border-0 last:pb-0">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 pt-2 sm:text-right px-2">
                      {attr.name}
                    </label>
                    
                    <div className="sm:col-span-2 flex items-center gap-2">
                      <div className="relative flex-1 min-w-0">
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

                      {(!currentValue || isLoading) && (
                        <button
                          type="button"
                          onClick={() => handleFetchSingleAttr(attr)}
                          disabled={isLoading}
                          title={`AI Search for: "${queryHint}"`}
                          className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 border border-purple-500/20 transition-all shrink-0 cursor-pointer disabled:opacity-50"
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Sparkles className="w-4 h-4" />
                          )}
                        </button>
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

