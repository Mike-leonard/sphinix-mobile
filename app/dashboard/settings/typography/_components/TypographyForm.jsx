'use client';

import React, { useState, useTransition } from 'react';
import { Save, CheckCircle2, RotateCcw } from 'lucide-react';
import { updateSettings } from '@/actions/settings';
import { Button } from "@/components/ui/button";

import { defaultTypography } from './constants';
import TypographyFieldCard from './TypographyFieldCard';

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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h2 style={{ fontSize: "var(--font-size-h2-settings, var(--font-size-h2-default))" }} className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
        Typography
      </h2>

      <div className="space-y-6 max-w-2xl">
        <TypographyFieldCard
          settingKey="h1Size"
          label="Heading 1 (h1)"
          settings={settings}
          selectedPosition={selectedPositions.h1Size}
          onPositionChange={handlePositionChange}
          onValueChange={handleNestedChange}
          onReset={handleTagReset} />

        <TypographyFieldCard
          settingKey="h2Size"
          label="Heading 2 (h2)"
          settings={settings}
          selectedPosition={selectedPositions.h2Size}
          onPositionChange={handlePositionChange}
          onValueChange={handleNestedChange}
          onReset={handleTagReset} />

        <TypographyFieldCard
          settingKey="h3Size"
          label="Heading 3 (h3)"
          settings={settings}
          selectedPosition={selectedPositions.h3Size}
          onPositionChange={handlePositionChange}
          onValueChange={handleNestedChange}
          onReset={handleTagReset} />

        <TypographyFieldCard
          settingKey="pSize"
          label="Paragraph (p)"
          settings={settings}
          selectedPosition={selectedPositions.pSize}
          onPositionChange={handlePositionChange}
          onValueChange={handleNestedChange}
          onReset={handleTagReset} />

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Navbar Menu</label>
          <input
            type="text"
            value={settings.typography.navSize || ''}
            onChange={(e) => handleChange('navSize', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none"
          />
        </div>

        <TypographyFieldCard
          settingKey="buttonSize"
          label="Buttons"
          settings={settings}
          selectedPosition={selectedPositions.buttonSize}
          onPositionChange={handlePositionChange}
          onValueChange={handleNestedChange}
          onReset={handleTagReset} />

        <TypographyFieldCard
          settingKey="linkSize"
          label="Links (a/Link)"
          settings={settings}
          selectedPosition={selectedPositions.linkSize}
          onPositionChange={handlePositionChange}
          onValueChange={handleNestedChange}
          onReset={handleTagReset} />
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-start gap-4">
        <Button variant="none" size="none" style={{ fontSize: "var(--font-size-button-default, var(--font-size-button-default))" }}
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
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none ${isResetPending
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
