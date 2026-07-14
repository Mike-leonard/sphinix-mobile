'use client';

import React from 'react';
import { Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DeviceBasicInfo({ formData, setFormData, brands = [] }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const colorPresets = [
    { label: 'Slate', value: 'from-slate-600 to-zinc-800' },
    { label: 'Emerald', value: 'from-emerald-600 to-teal-800' },
    { label: 'Blue', value: 'from-blue-600 to-indigo-800' },
    { label: 'Purple', value: 'from-purple-600 to-fuchsia-800' },
    { label: 'Amber', value: 'from-amber-700 to-amber-900' },
    { label: 'Rose', value: 'from-rose-600 to-pink-800' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        <Settings className="h-5 w-5 text-brand-500" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Basic Information</h2>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Device Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., iPhone 16 Pro Max"
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Brand *
          </label>
          <select
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            required
          >
            <option value="" disabled>Select a brand</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Price
          </label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="e.g., $1,199"
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Card Gradient Theme
          </label>
          <div className="grid grid-cols-6 gap-2">
            {colorPresets.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => setFormData({ ...formData, imageColor: preset.value })}
                title={preset.label}
                className={cn(
                  "h-10 rounded-lg bg-gradient-to-br transition-all relative",
                  preset.value,
                  formData.imageColor === preset.value ? "ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-slate-900 scale-110 z-10" : "hover:scale-105 opacity-80 hover:opacity-100"
                )}
              />
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                name="isNew"
                checked={formData.isNew}
                onChange={handleChange}
                className="peer sr-only"
              />
              <div className="w-10 h-5.5 bg-slate-200 dark:bg-slate-700 rounded-full peer-checked:bg-brand-500 transition-colors"></div>
              <div className="absolute left-1 top-1 bg-white w-3.5 h-3.5 rounded-full transition-transform peer-checked:translate-x-4.5 shadow-sm"></div>
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
              Mark as "New"
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                name="isTopRated"
                checked={formData.isTopRated}
                onChange={handleChange}
                className="peer sr-only"
              />
              <div className="w-10 h-5.5 bg-slate-200 dark:bg-slate-700 rounded-full peer-checked:bg-brand-500 transition-colors"></div>
              <div className="absolute left-1 top-1 bg-white w-3.5 h-3.5 rounded-full transition-transform peer-checked:translate-x-4.5 shadow-sm"></div>
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
              Top Rated Badge
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
