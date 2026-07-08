'use client';

import React, { useState, useTransition } from 'react';
import { Save, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { updateSettings } from '@/actions/settings';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function MaintenanceForm({ initialSettings }) {
  const [settings, setSettings] = useState(initialSettings);
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      ['maintenance']: {
        ...prev['maintenance'],
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    startTransition(async () => {
      const res = await updateSettings({ ['maintenance']: settings['maintenance'] });
      if (res.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert(res.error || 'Failed to save settings');
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h2  style={{fontSize: "var(--font-size-h2-settings, var(--font-size-h2-default))"}} className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
        Maintenance
      </h2>
      
      <div className="space-y-6 max-w-2xl">
        {/* Status Banner */}
        <div className={`p-4 rounded-xl border ${settings['maintenance']?.maintenanceMode ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/30' : 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30'} flex items-start gap-4`}>
          <div className={`p-2 rounded-lg ${settings['maintenance']?.maintenanceMode ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400' : 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400'}`}>
            {settings['maintenance']?.maintenanceMode ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          </div>
          <div>
            <h3 className={`font-bold ${settings['maintenance']?.maintenanceMode ? 'text-orange-900 dark:text-orange-100' : 'text-green-900 dark:text-green-100'}`}>
              {settings['maintenance']?.maintenanceMode ? 'Maintenance Mode is Active' : 'System is Live'}
            </h3>
            <p className={`text-sm mt-1 ${settings['maintenance']?.maintenanceMode ? 'text-orange-800 dark:text-orange-200' : 'text-green-800 dark:text-green-200'}`}>
              {settings['maintenance']?.maintenanceMode 
                ? 'All public traffic is currently being redirected to the maintenance page. The dashboard remains accessible.'
                : 'The public website is fully accessible to all visitors.'}
            </p>
          </div>
        </div>

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
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-start">
        <Button variant="none" size="none" style={{fontSize: "var(--font-size-button-primary, var(--font-size-button-default))"}} 
          onClick={handleSave}
          disabled={isPending}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all text-white ${
            success 
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 active:scale-[0.98]'
          } disabled:opacity-70 disabled:pointer-events-none`}
        >
          {isPending ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : success ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {success ? 'Saved!' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
