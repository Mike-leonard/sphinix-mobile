import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function AccessSecuritySection({ settings, handleChange, handleArrayAdd, handleArrayRemove, renderSaveButton }) {
  const [newWhitelistIP, setNewWhitelistIP] = useState('');
  const [newBlacklistIP, setNewBlacklistIP] = useState('');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.security?.twoFactorAuth || false}
            onChange={(e) => handleChange('security', 'twoFactorAuth', e.target.checked)}
            className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Require Two-Factor Auth (Admins)</label>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Max Login Attempts</label>
          <input
            type="number"
            value={settings.security?.maxLoginAttempts || 5}
            onChange={(e) => handleChange('security', 'maxLoginAttempts', parseInt(e.target.value) || 5)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <input
              type="checkbox"
              checked={settings.security?.rateLimit?.enabled || false}
              onChange={(e) => handleChange('security', 'rateLimit', { ...settings.security?.rateLimit, enabled: e.target.checked })}
              className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Enable API Rate Limiting</label>
          </div>

          {settings.security?.rateLimit?.enabled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 animate-in fade-in">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Max Requests</label>
                <input
                  type="number"
                  value={settings.security?.rateLimit?.maxRequests || 100}
                  onChange={(e) => handleChange('security', 'rateLimit', { ...settings.security?.rateLimit, maxRequests: parseInt(e.target.value) || 100 })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Time Window (Minutes)</label>
                <input
                  type="number"
                  value={settings.security?.rateLimit?.timeWindowMinutes || 15}
                  onChange={(e) => handleChange('security', 'rateLimit', { ...settings.security?.rateLimit, timeWindowMinutes: parseInt(e.target.value) || 15 })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none"
                />
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">IP Whitelist</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="e.g. 192.168.1.1"
              value={newWhitelistIP}
              onChange={(e) => setNewWhitelistIP(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleArrayAdd('security', 'ipWhitelist', newWhitelistIP, setNewWhitelistIP))}
              className="flex-1 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none"
            />
            <Button type="button" onClick={() => handleArrayAdd('security', 'ipWhitelist', newWhitelistIP, setNewWhitelistIP)} className="bg-brand-600 text-white rounded-xl px-4 hover:bg-brand-700"><Plus className="w-5 h-5" /></Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(Array.isArray(settings.security?.ipWhitelist) ? settings.security.ipWhitelist : []).map((ip, i) => (
              <span key={i} className="flex items-center gap-1 px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs border border-green-200 dark:border-green-800">
                {ip} <X className="w-3 h-3 cursor-pointer" onClick={() => handleArrayRemove('security', 'ipWhitelist', ip)} />
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">IP Blacklist</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="e.g. 10.0.0.5"
              value={newBlacklistIP}
              onChange={(e) => setNewBlacklistIP(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleArrayAdd('security', 'ipBlacklist', newBlacklistIP, setNewBlacklistIP))}
              className="flex-1 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none"
            />
            <Button type="button" onClick={() => handleArrayAdd('security', 'ipBlacklist', newBlacklistIP, setNewBlacklistIP)} className="bg-brand-600 text-white rounded-xl px-4 hover:bg-brand-700"><Plus className="w-5 h-5" /></Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(Array.isArray(settings.security?.ipBlacklist) ? settings.security.ipBlacklist : []).map((ip, i) => (
              <span key={i} className="flex items-center gap-1 px-2.5 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-xs border border-red-200 dark:border-red-800">
                {ip} <X className="w-3 h-3 cursor-pointer" onClick={() => handleArrayRemove('security', 'ipBlacklist', ip)} />
              </span>
            ))}
          </div>
        </div>
        {renderSaveButton()}
      </div>
    </div>
  );
}
