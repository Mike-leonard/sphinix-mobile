'use client';

import React, { useState, useTransition } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import { updateSettings } from '@/actions/settings';
import { Button } from "@/components/ui/button";

import GeneralSeoSection from './GeneralSeoSection';
import OpenGraphSection from './OpenGraphSection';
import AdvancedSeoSection from './AdvancedSeoSection';

export default function SeoMetadataForm({ initialSettings }) {
  const [settings, setSettings] = useState(initialSettings);
  const [activeTab, setActiveTab] = useState('home');
  const [activeSubTab, setActiveSubTab] = useState('general');
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'phones', label: 'Phones' },
    { id: 'blogs', label: 'Blogs' },
    { id: 'comparisons', label: 'Comparisons' },
    { id: 'advanced', label: 'Advanced SEO' },
  ];

  const subTabs = [
    { id: 'general', label: 'General Search Appearance' },
    { id: 'opengraph', label: 'OpenGraph (Social Media)' },
  ];

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        [activeTab]: {
          ...prev.seo[activeTab],
          [key]: value
        }
      }
    }));
  };

  const handleSave = () => {
    startTransition(async () => {
      const res = await updateSettings({ seo: settings.seo });
      if (res.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert(res.error || 'Failed to save settings');
      }
    });
  };

  const currentData = settings.seo[activeTab] || {};

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col gap-4">
        <h2 style={{fontSize: "var(--font-size-h2-settings, var(--font-size-h2-default))"}} className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          SEO & Metadata
        </h2>
        
        {/* Main Tab Navigation (Pages) */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <Button variant="none" size="none" style={{fontSize: "var(--font-size-button-default, var(--font-size-button-default))"}} 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-semibold text-sm transition-colors whitespace-nowrap rounded-t-lg ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-t border-l border-r border-slate-200 dark:border-slate-800 -mb-[1px]'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white border-b border-transparent hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-950 rounded-b-xl rounded-tr-xl">
        {/* Sub Tab Navigation (General vs OpenGraph) - Hidden for Advanced Tab */}
        {activeTab !== 'advanced' && (
          <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 overflow-x-auto scrollbar-hide">
            {subTabs.map((tab) => (
              <Button variant="none" size="none" style={{fontSize: "var(--font-size-button-default, var(--font-size-button-default))"}} 
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-6 py-3 font-semibold text-sm transition-colors whitespace-nowrap rounded-t-lg ${
                  activeSubTab === tab.id
                    ? 'bg-slate-50 dark:bg-slate-900/50 text-brand-600 dark:text-brand-400 border-t border-l border-r border-slate-200 dark:border-slate-800 -mb-[1px]'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white border-b border-transparent hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        )}

        <div className="px-2 max-w-3xl">
          {activeTab !== 'advanced' && activeSubTab === 'general' && (
            <GeneralSeoSection currentData={currentData} handleChange={handleChange} activeTab={activeTab} />
          )}

          {activeTab !== 'advanced' && activeSubTab === 'opengraph' && (
            <OpenGraphSection currentData={currentData} handleChange={handleChange} />
          )}

          {activeTab === 'advanced' && (
            <AdvancedSeoSection currentData={currentData} handleChange={handleChange} />
          )}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
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
