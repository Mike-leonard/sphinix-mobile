'use client';

import React, { useState, useTransition } from 'react';
import { Save, CheckCircle2, Share2, Globe } from 'lucide-react';
import { updateSettings } from '@/actions/settings';
import { Button } from "@/components/ui/button";

export default function SocialMediaForm({ initialSettings }) {
  const [settings, setSettings] = useState(initialSettings || {});
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  // Safe string values (handles case where pinterest was previously an object)
  const social = settings?.socialMedia || {};
  const pinterestValue = typeof social.pinterest === 'string' ? social.pinterest : '';

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      socialMedia: {
        ...prev?.socialMedia,
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    startTransition(async () => {
      const payload = {
        socialMedia: {
          facebook: settings?.socialMedia?.facebook || '',
          twitter: settings?.socialMedia?.twitter || '',
          instagram: settings?.socialMedia?.instagram || '',
          youtube: settings?.socialMedia?.youtube || '',
          pinterest: typeof settings?.socialMedia?.pinterest === 'string' ? settings.socialMedia.pinterest : '',
          threads: settings?.socialMedia?.threads || ''
        }
      };

      const res = await updateSettings(payload);
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
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <h2 
          style={{fontSize: "var(--font-size-h2-settings, var(--font-size-h2-default))"}} 
          className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"
        >
          <Share2 className="w-5 h-5 text-brand-500" />
          <span>Social Media Profiles</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Configure official public social media profile links for Sphinix Mobile. These links appear in your website footer and metadata.
        </p>
      </div>

      <div className="space-y-5 max-w-2xl">
        {/* Facebook */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Facebook URL
          </label>
          <input
            type="url"
            value={social.facebook || ''}
            onChange={(e) => handleChange('facebook', e.target.value)}
            placeholder="https://facebook.com/sphinixmobile"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none text-sm"
          />
        </div>

        {/* X / Twitter */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            X (Twitter) URL
          </label>
          <input
            type="url"
            value={social.twitter || ''}
            onChange={(e) => handleChange('twitter', e.target.value)}
            placeholder="https://x.com/sphinixmobile"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none text-sm"
          />
        </div>

        {/* Instagram */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Instagram URL
          </label>
          <input
            type="url"
            value={social.instagram || ''}
            onChange={(e) => handleChange('instagram', e.target.value)}
            placeholder="https://instagram.com/sphinixmobile"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none text-sm"
          />
        </div>

        {/* Threads */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Threads URL
          </label>
          <input
            type="url"
            value={social.threads || ''}
            onChange={(e) => handleChange('threads', e.target.value)}
            placeholder="https://threads.net/@sphinixmobile"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none text-sm"
          />
        </div>

        {/* YouTube */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            YouTube Channel URL
          </label>
          <input
            type="url"
            value={social.youtube || ''}
            onChange={(e) => handleChange('youtube', e.target.value)}
            placeholder="https://youtube.com/@sphinixmobile"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none text-sm"
          />
        </div>

        {/* Pinterest Profile */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Pinterest Profile URL
          </label>
          <input
            type="url"
            value={pinterestValue}
            onChange={(e) => handleChange('pinterest', e.target.value)}
            placeholder="https://pinterest.com/sphinixmobile"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none text-sm"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-start">
        <Button
          onClick={handleSave}
          disabled={isPending}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all text-white ${
            success 
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 active:scale-[0.98]'
          } disabled:opacity-70 disabled:pointer-events-none cursor-pointer`}
        >
          {isPending ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : success ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{success ? 'Saved!' : 'Save Settings'}</span>
        </Button>
      </div>
    </div>
  );
}
