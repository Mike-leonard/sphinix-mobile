'use client';

import React, { useState, useTransition, useRef } from 'react';
import { Save, CheckCircle2, Shield, Brain, Database, Upload, Download, Plus, X } from 'lucide-react';
import { updateSettings } from '@/actions/settings';
import { createBackup, restoreBackup } from '@/actions/backup';
import { Button } from "@/components/ui/button";

export default function SecurityForm({ initialSettings }) {
  const [settings, setSettings] = useState(initialSettings);
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [backupMsg, setBackupMsg] = useState('');
  const [activeTab, setActiveTab] = useState('access');
  
  const [newWhitelistIP, setNewWhitelistIP] = useState('');
  const [newBlacklistIP, setNewBlacklistIP] = useState('');
  const fileInputRef = useRef(null);

  const handleChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleArrayAdd = (section, key, value, setInputValue) => {
    if (!value.trim()) return;
    const currentArray = settings[section]?.[key] || [];
    if (!currentArray.includes(value.trim())) {
      handleChange(section, key, [...currentArray, value.trim()]);
    }
    setInputValue('');
  };

  const handleArrayRemove = (section, key, valueToRemove) => {
    const currentArray = settings[section]?.[key] || [];
    handleChange(section, key, currentArray.filter(v => v !== valueToRemove));
  };

  const handleSave = () => {
    startTransition(async () => {
      const res = await updateSettings({ 
        security: settings.security,
        ai: settings.ai,
        recaptcha: settings.recaptcha,
        backups: settings.backups
      });
      if (res.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert(res.error || 'Failed to save settings');
      }
    });
  };

  const handleCreateBackup = async () => {
    setBackupMsg('Creating backup...');
    const res = await createBackup();
    if (res.success) {
      setBackupMsg(`Success: ${res.fileName}`);
    } else {
      setBackupMsg('Error creating backup.');
    }
    setTimeout(() => setBackupMsg(''), 5000);
  };

  const handleRestoreBackup = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm('Are you sure? Restoring a backup will overwrite all current settings!')) {
      e.target.value = '';
      return;
    }

    setBackupMsg('Restoring backup...');
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await restoreBackup(formData);
    if (res.success) {
      alert('Backup restored successfully! Please refresh the page to see the changes.');
      window.location.reload();
    } else {
      setBackupMsg(res.error || 'Failed to restore backup.');
      setTimeout(() => setBackupMsg(''), 5000);
    }
  };

  const renderSaveButton = () => (
    <div className="flex justify-end pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
      <Button variant="none" size="none" style={{fontSize: "var(--font-size-button-primary, var(--font-size-button-default))"}} 
        onClick={handleSave}
        disabled={isPending}
        className={`flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all text-white shadow-lg ${
          success 
            ? 'bg-green-500 hover:bg-green-600 shadow-green-500/25'
            : 'bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 active:scale-[0.98] shadow-brand-500/25'
        } disabled:opacity-70 disabled:pointer-events-none`}
      >
        {isPending ? (
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : success ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : (
          <Save className="w-5 h-5" />
        )}
        {success ? 'Saved!' : 'Save Changes'}
      </Button>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-300 pb-20">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <h2 style={{fontSize: "var(--font-size-h2-settings, var(--font-size-h2-default))"}} className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-brand-500" />
          Advanced Security & Configuration
        </h2>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-px">
        {[
          { id: 'access', label: 'Access & IPs', icon: Shield },
          { id: 'ai', label: 'AI Configuration', icon: Brain },
          { id: 'recaptcha', label: 'reCAPTCHA', icon: Shield },
          { id: 'backup', label: 'Backups', icon: Database }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab.id 
                ? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10' 
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="max-w-3xl">
        
        {/* --- SECURITY & ACCESS --- */}
        {activeTab === 'access' && (
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
                <Button type="button" onClick={() => handleArrayAdd('security', 'ipWhitelist', newWhitelistIP, setNewWhitelistIP)} className="bg-brand-600 text-white rounded-xl px-4"><Plus className="w-5 h-5" /></Button>
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
                <Button type="button" onClick={() => handleArrayAdd('security', 'ipBlacklist', newBlacklistIP, setNewBlacklistIP)} className="bg-brand-600 text-white rounded-xl px-4"><Plus className="w-5 h-5" /></Button>
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
        )}

        {/* --- AI CONFIGURATION --- */}
        {activeTab === 'ai' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.ai?.enableAiFeatures || false}
                onChange={(e) => handleChange('ai', 'enableAiFeatures', e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Enable AI Features globally</label>
            </div>

            {settings.ai?.enableAiFeatures && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">API Key</label>
                  <input
                    type="password"
                    placeholder="sk-..."
                    value={settings.ai?.apiKey || ''}
                    onChange={(e) => handleChange('ai', 'apiKey', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">AI Model</label>
                  <select
                    value={settings.ai?.model || 'gpt-4-turbo'}
                    onChange={(e) => handleChange('ai', 'model', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none"
                  >
                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                    <option value="gpt-4o">GPT-4o</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                    <option value="claude-3-opus">Claude 3 Opus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Temperature ({settings.ai?.temperature || 0.7})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={settings.ai?.temperature || 0.7}
                    onChange={(e) => handleChange('ai', 'temperature', parseFloat(e.target.value))}
                    className="w-full accent-brand-600"
                  />
                </div>
              </div>
            )}
            {renderSaveButton()}
          </div>
        </div>
        )}

        {/* --- RECAPTCHA --- */}
        {activeTab === 'recaptcha' && (
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
        )}

        {/* --- BACKUPS --- */}
        {activeTab === 'backup' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="space-y-6">
            <div className="flex gap-4">
              <Button type="button" onClick={handleCreateBackup} className="bg-brand-600 hover:bg-brand-700 text-white flex-1 gap-2">
                <Database className="w-4 h-4" /> Create Local Backup
              </Button>
              <Button type="button" asChild className="bg-slate-100 hover:bg-slate-200 text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white flex-1 gap-2">
                <a href="/api/backup/download" download>
                  <Download className="w-4 h-4" /> Download Latest
                </a>
              </Button>
            </div>

            <div className="pt-2">
              <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleRestoreBackup} />
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full border-dashed border-2 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 gap-2">
                <Upload className="w-4 h-4" /> Upload & Restore Backup
              </Button>
              {backupMsg && <p className="text-sm mt-3 text-brand-600 dark:text-brand-400 text-center font-medium">{backupMsg}</p>}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.backups?.automaticBackups || false}
                  onChange={(e) => handleChange('backups', 'automaticBackups', e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Enable Automatic Backups</label>
              </div>
              {settings.backups?.automaticBackups && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Backup Schedule</label>
                  <select
                    value={settings.backups?.schedule || 'daily'}
                    onChange={(e) => handleChange('backups', 'schedule', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  <p className="text-xs text-slate-500 mt-2">Note: Automatic backups require an external cron trigger to call your backup API endpoint.</p>
                </div>
              )}
            </div>
            {renderSaveButton()}
          </div>
        </div>
        )}

      </div>
    </div>
  );
}
