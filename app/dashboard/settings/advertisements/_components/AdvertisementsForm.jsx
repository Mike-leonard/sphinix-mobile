'use client';

import React, { useState, useTransition } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import { updateSettings } from '@/actions/settings';

export default function AdvertisementsForm({ initialSettings }) {
  const [settings, setSettings] = useState(initialSettings);
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      ['advertisements']: {
        ...prev['advertisements'],
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    startTransition(async () => {
      const res = await updateSettings({ ['advertisements']: settings['advertisements'] });
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
      <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
        Advertisements
      </h2>
      
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings['advertisements'].enableAds || false}
            onChange={(e) => handleChange('enableAds', e.target.checked)}
            className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Enable Advertisements</label>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">AdSense Publisher ID</label>
          <input
            type="text"
            value={settings['advertisements'].adsensePublisherId || ''}
            onChange={(e) => handleChange('adsensePublisherId', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none"
          />
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-start">
        <button
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
        </button>
      </div>
    </div>
  );
}
