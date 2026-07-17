import React from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { POSITIONS } from './constants';

export default function TypographyFieldCard({ settingKey, label, settings, selectedPosition, onPositionChange, onValueChange, onReset }) {
  const currentValue = settings.typography?.[settingKey]?.[selectedPosition] || '';

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
        <div className="flex items-center gap-2">
          <select
            value={selectedPosition}
            onChange={(e) => onPositionChange(settingKey, e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none text-sm"
          >
            {POSITIONS[settingKey].map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <Button variant="default"
            onClick={() => onReset(settingKey)}
            title={`Reset all ${label} positions to default`}
            className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <input
        type="text"
        value={currentValue}
        onChange={(e) => onValueChange(settingKey, e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none"
      />
      <p style={{ fontSize: "var(--font-size-p-form, var(--font-size-p-default))" }} className="text-xs text-slate-500 mt-2">
        Currently editing the font size for: <strong className="text-brand-600 dark:text-brand-400">{selectedPosition}</strong>
      </p>
    </div>
  );
}
