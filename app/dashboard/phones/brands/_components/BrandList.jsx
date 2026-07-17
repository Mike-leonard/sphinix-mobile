import React from 'react';
import { Edit2, Trash2, Check, X, ArrowUpDown } from 'lucide-react';

export default function BrandList({
  sortedBrands,
  brandCounts,
  editingBrand,
  setEditingBrand,
  editValue,
  setEditValue,
  isPending,
  toggleSort,
  handleSaveEdit,
  confirmDeleteBrand,
}) {
  return (
    <div className="w-full lg:w-2/3">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th 
                  className="py-4 px-6 font-medium text-slate-500 dark:text-slate-400 text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                  onClick={toggleSort}
                >
                  <div className="flex items-center gap-2">
                    Name
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="py-4 px-6 font-medium text-slate-500 dark:text-slate-400 text-sm w-32 text-center">Published</th>
                <th className="py-4 px-6 font-medium text-slate-500 dark:text-slate-400 text-sm w-32 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedBrands.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-8 text-center text-slate-500">No brands found.</td>
                </tr>
              ) : (
                sortedBrands.map(brand => {
                  const isProtected = brand === 'Other';
                  const count = brandCounts[brand] || 0;
                  return (
                    <tr key={brand} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/25 transition-colors group">
                      <td className="py-3 px-6">
                        {editingBrand === brand ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="flex-1 bg-white dark:bg-slate-950 border border-brand-500 rounded-lg px-3 py-1.5 text-sm text-slate-900 dark:text-white focus:outline-none"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit();
                                if (e.key === 'Escape') setEditingBrand(null);
                              }}
                            />
                            <button onClick={handleSaveEdit} disabled={isPending} className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md">
                              <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditingBrand(null)} disabled={isPending} className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="font-medium text-brand-600 dark:text-brand-400 flex items-center gap-2">
                            {brand}
                            {isProtected && (
                              <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                Default
                              </span>
                            )}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-6 text-center text-slate-500 dark:text-slate-400">
                        {count}
                      </td>
                      <td className="py-3 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isProtected && editingBrand !== brand && (
                            <>
                              <button
                                onClick={() => {
                                  setEditingBrand(brand);
                                  setEditValue(brand);
                                }}
                                disabled={isPending}
                                className="p-1.5 text-slate-400 hover:text-brand-600 transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => confirmDeleteBrand(brand)}
                                disabled={isPending}
                                className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
