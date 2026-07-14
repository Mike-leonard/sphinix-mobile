'use client';

import React, { useState, useTransition } from 'react';
import { Tag, Edit2, Trash2, Check, X, AlertTriangle } from 'lucide-react';
import { createDeviceBrand, deleteDeviceBrand, updateDeviceBrand } from '@/actions/device-brands';
import { Button } from '@/components/ui/button';

import { ArrowUpDown } from 'lucide-react';

export default function BrandManager({ initialBrands, brandCounts = {} }) {
  const [brands, setBrands] = useState(initialBrands);
  const [sortOrder, setSortOrder] = useState('asc');
  const [newBrand, setNewBrand] = useState('');
  const [isPending, startTransition] = useTransition();
  const [editingBrand, setEditingBrand] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleAddBrand = (e) => {
    e.preventDefault();
    if (!newBrand.trim()) return;

    startTransition(async () => {
      const res = await createDeviceBrand(newBrand);
      if (res.success) {
        setBrands([...brands, newBrand.trim()].sort((a, b) => a.localeCompare(b)));
        setNewBrand('');
      } else {
        alert(res.error);
      }
    });
  };

  const confirmDeleteBrand = (brandToDelete) => {
    if (confirm(`Are you sure you want to delete "${brandToDelete}"? Any devices assigned to this brand will be moved to "Other".`)) {
      startTransition(async () => {
        const res = await deleteDeviceBrand(brandToDelete);
        if (res.success) {
          setBrands(brands.filter(b => b !== brandToDelete));
        } else {
          alert(res.error);
        }
      });
    }
  };

  const handleSaveEdit = () => {
    if (!editValue.trim() || editValue.trim() === editingBrand) {
      setEditingBrand(null);
      return;
    }

    startTransition(async () => {
      const res = await updateDeviceBrand(editingBrand, editValue.trim());
      if (res.success) {
        const newBrands = brands.filter(b => b !== editingBrand);
        newBrands.push(editValue.trim());
        setBrands(newBrands.sort((a, b) => a.localeCompare(b)));
        setEditingBrand(null);
      } else {
        alert(res.error);
      }
    });
  };

  const toggleSort = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const sortedBrands = [...brands].sort((a, b) => {
    return sortOrder === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
  });

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Add New Brand Form */}
      <div className="w-full lg:w-1/3 shrink-0">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Add New Brand</h2>
        <form onSubmit={handleAddBrand} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Name
              </label>
              <input
                type="text"
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                disabled={isPending}
                placeholder="e.g., Apple"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
              />
              <p className="text-xs text-slate-500 mt-2">The name is how it appears on your site.</p>
            </div>
            <Button 
              type="submit" 
              disabled={isPending || !newBrand.trim()}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-lg shadow-brand-500/25 disabled:opacity-50"
            >
              {isPending ? 'Saving...' : 'Add New Brand'}
            </Button>
          </div>
        </form>
      </div>

      {/* Brands List Table */}
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
                    <td colSpan="2" className="py-8 text-center text-slate-500">No brands found.</td>
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
    </div>
  );
}
