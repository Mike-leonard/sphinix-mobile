'use client';

import React, { useState, useTransition } from 'react';
import { Save, CheckCircle2, RotateCcw } from 'lucide-react';
import { updateSettings } from '@/actions/settings';
import { Button } from "@/components/ui/button";

const defaultTypography = {
  h1Size: {
    "Global Default": "2.25rem",
    "Hero Section": "3rem",
    "Dashboard Headers": "1.875rem",
    "Auth Pages": "1.5rem",
    "Device Details": "1.875rem",
    "Blogs Header": "1.875rem",
    "Comparisons Header": "1.125rem"
  },
  h2Size: {
    "Global Default": "1.875rem",
    "Section Headers": "1.875rem",
    "Card Titles": "1.25rem",
    "Settings & Forms": "1.5rem",
    "Modal & Drawer Titles": "1.5rem"
  },
  h3Size: {
    "Global Default": "1.5rem",
    "Section Headers": "1.5rem",
    "Card Titles": "1.125rem",
    "Settings & Forms": "1.25rem",
    "Modal & Drawer Titles": "1.25rem"
  },
  pSize: {
    "Global Default": "1rem",
    "Section Subtitles": "0.875rem",
    "Card Descriptions": "0.875rem",
    "Form Text": "0.875rem",
    "Footer Text": "0.875rem"
  },
  navSize: "0.875rem",
  buttonSize: {
    "Global Default": "0.875rem",
    "Primary Actions": "1rem",
    "Secondary Actions": "0.875rem",
    "Sidebar & Nav Items": "0.875rem"
  },
  linkSize: {
    "Global Default": "1rem",
    "Navigation Links": "0.875rem",
    "Footer Links": "0.875rem",
    "Inline Links": "1rem"
  }
};

const POSITIONS = {
  h1Size: Object.keys(defaultTypography.h1Size),
  h2Size: Object.keys(defaultTypography.h2Size),
  h3Size: Object.keys(defaultTypography.h3Size),
  pSize: Object.keys(defaultTypography.pSize),
  buttonSize: Object.keys(defaultTypography.buttonSize),
  linkSize: Object.keys(defaultTypography.linkSize)
};

export default function TypographyForm({ initialSettings }) {
  // Gracefully handle if sizes are strings from old config
  const migratedSettings = { ...initialSettings };
  ['h1Size', 'h2Size', 'h3Size', 'pSize', 'buttonSize', 'linkSize'].forEach(key => {
    if (typeof migratedSettings.typography[key] === 'string') {
      migratedSettings.typography[key] = defaultTypography[key];
    }
  });

  const [settings, setSettings] = useState(migratedSettings);
  const [selectedPositions, setSelectedPositions] = useState({
    h1Size: "Global Default",
    h2Size: "Global Default",
    h3Size: "Global Default",
    pSize: "Global Default",
    buttonSize: "Global Default",
    linkSize: "Global Default"
  });

  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [isResetPending, setIsResetPending] = useState(false);

  const handlePositionChange = (key, pos) => {
    setSelectedPositions(prev => ({ ...prev, [key]: pos }));
  };

  const handleNestedChange = (key, value) => {
    const pos = selectedPositions[key];
    setSettings(prev => ({
      ...prev,
      typography: {
        ...prev.typography,
        [key]: {
          ...prev.typography[key],
          [pos]: value
        }
      }
    }));
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      typography: {
        ...prev.typography,
        [key]: value
      }
    }));
  };

  const handleReset = () => {
    setSettings(prev => ({
      ...prev,
      typography: defaultTypography
    }));
    setIsResetPending(true);
  };

  const handleTagReset = (key) => {
    setSettings(prev => ({
      ...prev,
      typography: {
        ...prev.typography,
        [key]: defaultTypography[key]
      }
    }));
  };

  const handleSave = () => {
    startTransition(async () => {
      const res = await updateSettings({ ['typography']: settings.typography });
      if (res.success) {
        setSuccess(true);
        setIsResetPending(false);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert(res.error || 'Failed to save settings');
      }
    });
  };

  const renderNestedField = (key, label) => {
    const pos = selectedPositions[key];
    return (
      <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
          <div className="flex items-center gap-2">
            <select
              value={pos}
              onChange={(e) => handlePositionChange(key, e.target.value)}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none text-sm"
            >
              {POSITIONS[key].map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <Button variant="default"
              onClick={() => handleTagReset(key)}
              title={`Reset all ${label} positions to default`}
              className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <input
          type="text"
          value={settings.typography[key][pos] || ''}
          onChange={(e) => handleNestedChange(key, e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none"
        />
        <p style={{ fontSize: "var(--font-size-p-form, var(--font-size-p-default))" }} className="text-xs text-slate-500 mt-2">
          Currently editing the font size for: <strong className="text-brand-600 dark:text-brand-400">{pos}</strong>
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h2 style={{ fontSize: "var(--font-size-h2-settings, var(--font-size-h2-default))" }} className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
        Typography
      </h2>

      <div className="space-y-6 max-w-2xl">
        {renderNestedField('h1Size', 'Heading 1 (h1)')}
        {renderNestedField('h2Size', 'Heading 2 (h2)')}
        {renderNestedField('h3Size', 'Heading 3 (h3)')}
        {renderNestedField('pSize', 'Paragraph (p)')}

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Navbar Menu</label>
          <input
            type="text"
            value={settings.typography.navSize || ''}
            onChange={(e) => handleChange('navSize', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none"
          />
        </div>

        {renderNestedField('buttonSize', 'Buttons')}
        {renderNestedField('linkSize', 'Links (a/Link)')}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-start gap-4">
        <Button variant="none" size="none" style={{fontSize: "var(--font-size-button-default, var(--font-size-button-default))"}}  
          onClick={handleSave}
          disabled={isPending}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all text-white ${success
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

        <Button variant="none" size="none" 
          style={{ fontSize: "var(--font-size-button-secondary, var(--font-size-button-default))" }} 
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none ${
            isResetPending
              ? 'bg-brand-100 text-brand-700 border border-brand-300 dark:bg-brand-900/30 dark:text-brand-400 dark:border-brand-700'
              : 'text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
          }`}
          onClick={handleReset}
          disabled={isPending}
        >
          <RotateCcw className={`w-5 h-5 ${isResetPending ? 'animate-spin-once' : ''}`} />
          Reset to Default
        </Button>
      </div>
    </div>
  );
}
