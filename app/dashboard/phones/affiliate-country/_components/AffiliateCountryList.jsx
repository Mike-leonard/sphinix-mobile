'use client';

import React from 'react';
import { Star, ShoppingBag, Edit2, Trash2 } from 'lucide-react';

export default function AffiliateCountryList({
  countries,
  onToggleEnabled,
  onSetDefault,
  onEdit,
  onDelete
}) {
  return (
    <div className="lg:col-span-8 space-y-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white">Active Affiliate Markets ({countries.length})</h3>
          <span className="text-xs text-slate-500">US is default market fallback for all visitors</span>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {countries.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No affiliate countries configured yet. Add one on the left!
            </div>
          ) : (
            countries.map((c) => {
              const storeList = Array.isArray(c.stores)
                ? c.stores.map((s) => (typeof s === 'string' ? s : s.name || s.id))
                : [];

              return (
                <div
                  key={c.id}
                  className="p-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{c.flag}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">{c.name}</span>
                          <span className="px-2 py-0.5 text-[11px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
                            {c.code}
                          </span>
                          {c.isDefault && (
                            <span className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-md">
                              <Star className="w-3 h-3 fill-current" /> Global Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Currency:{' '}
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            {c.currencySymbol} ({c.currencyCode})
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Display Default Retailers */}
                    {storeList.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <ShoppingBag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-xs text-slate-500 font-medium">Default Stores:</span>
                        {storeList.map((st) => (
                          <span
                            key={st}
                            className="px-2 py-0.5 text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md border border-slate-200 dark:border-slate-700"
                          >
                            {st}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => onToggleEnabled(c)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        c.enabled
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {c.enabled ? 'Active' : 'Disabled'}
                    </button>

                    {!c.isDefault && (
                      <button
                        type="button"
                        onClick={() => onSetDefault(c)}
                        className="p-2 text-slate-400 hover:text-amber-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Set as Default"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onEdit(c)}
                      className="p-2 text-slate-400 hover:text-brand-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Edit Country & Default Stores"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {!c.isDefault && (
                      <button
                        type="button"
                        onClick={() => onDelete(c.id)}
                        className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Delete Country"
                      >
                        <Trash2 className="w-4 h-4" />
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
  );
}
