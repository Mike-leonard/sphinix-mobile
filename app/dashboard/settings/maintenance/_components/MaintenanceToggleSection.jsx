import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export default function MaintenanceToggleSection({ settings, handleChange }) {
  return (
    <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/20 space-y-6">
      <div className="flex items-center gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
        <input
          type="checkbox"
          checked={settings['maintenance']?.maintenanceMode || false}
          onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
          className="w-5 h-5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
        />
        <div>
          <label className="text-base font-bold text-slate-900 dark:text-white">Enable Maintenance Mode</label>
          <p className="text-sm text-slate-500 dark:text-slate-400">Toggle this to take the public site offline instantly.</p>
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Maintenance Message</label>
          <Link href="/maintenance" target="_blank" className="text-xs text-brand-600 hover:underline flex items-center gap-1 font-medium">
            Preview Page <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
        <textarea
          value={settings['maintenance']?.maintenanceMessage || ''}
          onChange={(e) => handleChange('maintenanceMessage', e.target.value)}
          rows={4}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none resize-none"
          placeholder="e.g. We are currently performing scheduled maintenance..."
        />
      </div>
    </div>
  );
}
