'use client';

import React from 'react';
import { Zap } from 'lucide-react';

export default function DeviceQuickSpecs({ specs, onChange }) {
  const highlightFields = [
    { key: 'screen', label: 'Screen / Display', placeholder: 'e.g., 6.8" QHD+ 120Hz' },
    { key: 'chipset', label: 'Chipset', placeholder: 'e.g., Snapdragon 8 Gen 3' },
    { key: 'camera', label: 'Main Camera', placeholder: 'e.g., 200MP + 50MP + 12MP' },
    { key: 'battery', label: 'Battery & Charging', placeholder: 'e.g., 5000 mAh (45W)' },
    { key: 'ram', label: 'RAM', placeholder: 'e.g., 12GB LPDDR5X' },
    { key: 'storage', label: 'Storage', placeholder: 'e.g., 256GB / 512GB' }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        <Zap className="h-5 w-5 text-amber-500" />
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Quick Specifications</h2>
          <p className="text-sm text-slate-500">These appear on the device card and top hero section.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {highlightFields.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              {label}
            </label>
            <input
              type="text"
              value={specs?.[key] || ''}
              onChange={(e) => onChange(key, e.target.value)}
              placeholder={placeholder}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
