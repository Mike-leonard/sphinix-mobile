'use client';

import React from 'react';
import { Zap } from 'lucide-react';
export default function DeviceQuickSpecs({ specs, onChange, allAttributes = [] }) {
  const quickSpecs = allAttributes.filter(attr => attr.groupIds?.includes('Quick Specifications') || attr.groupId === 'Quick Specifications');

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
        {quickSpecs.length === 0 ? (
          <div className="col-span-full py-4 text-center text-sm text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
            No attributes assigned to the "Quick Specifications" group yet. Go to Attributes Manager to assign some.
          </div>
        ) : (
          quickSpecs.map((attr) => (
            <div key={attr.id}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
                {attr.name}
              </label>
              <input
                type="text"
                value={specs?.[attr.slug] || ''}
                onChange={(e) => onChange(attr.slug, e.target.value)}
                placeholder={`e.g. ${attr.name} specs`}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
