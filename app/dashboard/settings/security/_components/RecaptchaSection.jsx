import React from 'react';

export default function RecaptchaSection({ settings, handleChange, renderSaveButton }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.recaptcha?.enabled || false}
            onChange={(e) => handleChange('recaptcha', 'enabled', e.target.checked)}
            className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Enable reCAPTCHA on forms</label>
        </div>
        {settings.recaptcha?.enabled && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Site Key</label>
              <input
                type="text"
                value={settings.recaptcha?.siteKey || ''}
                onChange={(e) => handleChange('recaptcha', 'siteKey', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Secret Key</label>
              <input
                type="password"
                value={settings.recaptcha?.secretKey || ''}
                onChange={(e) => handleChange('recaptcha', 'secretKey', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none"
              />
            </div>
          </div>
        )}
        {renderSaveButton()}
      </div>
    </div>
  );
}
