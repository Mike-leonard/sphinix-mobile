'use client';

import React, { useState, useTransition } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import { updateSettings } from '@/actions/settings';
import { Button } from "@/components/ui/button";

import GlobalAdControl from './GlobalAdControl';
import NetworkConfigSection from './NetworkConfigSection';
import AdPlacementsSection from './AdPlacementsSection';
import InjectionFrequencySection from './InjectionFrequencySection';

export default function AdvertisementsForm({ initialSettings }) {
  const [settings, setSettings] = useState(initialSettings);
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      advertisements: {
        ...prev.advertisements,
        [key]: value
      }
    }));
  };

  const handleNestedChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      advertisements: {
        ...prev.advertisements,
        [section]: {
          ...(prev.advertisements?.[section] || {}),
          [key]: value
        }
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

  const selectedNetwork = settings.advertisements?.network || 'google_adsense';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h2 style={{fontSize: "var(--font-size-h2-settings, var(--font-size-h2-default))"}} className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
        Advertisements & Monetization
      </h2>
      
      <div className="space-y-8 max-w-3xl">
        <GlobalAdControl settings={settings} handleChange={handleChange} />
        
        <NetworkConfigSection 
          settings={settings} 
          handleChange={handleChange} 
          handleNestedChange={handleNestedChange} 
          selectedNetwork={selectedNetwork} 
        />
        
        <AdPlacementsSection settings={settings} handleNestedChange={handleNestedChange} />
        
        <InjectionFrequencySection settings={settings} handleNestedChange={handleNestedChange} />
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
