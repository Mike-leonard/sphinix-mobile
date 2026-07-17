import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DeviceThemeAndBadges({ formData, setFormData, handleChange }) {
  const colorPresets = [
    { label: 'Slate', value: 'from-slate-600 to-zinc-800' },
    { label: 'Emerald', value: 'from-emerald-600 to-teal-800' },
    { label: 'Blue', value: 'from-blue-600 to-indigo-800' },
    { label: 'Purple', value: 'from-purple-600 to-fuchsia-800' },
    { label: 'Amber', value: 'from-amber-700 to-amber-900' },
    { label: 'Rose', value: 'from-rose-600 to-pink-800' },
  ];

  return (
    <>
      {/* Card Gradient Theme */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Card Gradient Theme
        </label>
        <div className="flex flex-wrap gap-3">
          {colorPresets.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => setFormData({ ...formData, imageColor: preset.value })}
              title={preset.label}
              className={cn(
                "w-12 h-12 rounded-full bg-gradient-to-br transition-all relative flex items-center justify-center shadow-sm",
                preset.value,
                formData.imageColor === preset.value 
                  ? "ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-slate-950 scale-110 z-10" 
                  : "hover:scale-110 opacity-70 hover:opacity-100"
              )}
            >
              {formData.imageColor === preset.value && (
                <Check className="w-5 h-5 text-white drop-shadow-md" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Separator */}
      <div className="h-px w-full bg-slate-100 dark:bg-slate-800"></div>

      {/* Badges / Toggles */}
      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <label className="flex-1 flex items-center justify-between p-4 bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 rounded-2xl cursor-pointer group hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-colors">
          <div>
            <span className="block text-sm font-bold text-brand-900 dark:text-brand-300">
              New Release
            </span>
            <span className="text-xs text-brand-600/70 dark:text-brand-400/70 mt-0.5 block">
              Show "New" badge on card
            </span>
          </div>
          <div className="relative flex items-center">
            <input
              type="checkbox"
              name="isNew"
              checked={formData.isNew}
              onChange={handleChange}
              className="peer sr-only"
            />
            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer-checked:bg-brand-500 transition-colors"></div>
            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5 shadow-sm"></div>
          </div>
        </label>

        <label className="flex-1 flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-2xl cursor-pointer group hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors">
          <div>
            <span className="block text-sm font-bold text-amber-900 dark:text-amber-300">
              Top Rated
            </span>
            <span className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-0.5 block">
              Highlight as top tier
            </span>
          </div>
          <div className="relative flex items-center">
            <input
              type="checkbox"
              name="isTopRated"
              checked={formData.isTopRated}
              onChange={handleChange}
              className="peer sr-only"
            />
            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer-checked:bg-amber-500 transition-colors"></div>
            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5 shadow-sm"></div>
          </div>
        </label>
      </div>
    </>
  );
}
