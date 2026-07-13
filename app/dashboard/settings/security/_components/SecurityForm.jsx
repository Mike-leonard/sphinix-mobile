'use client';

import React, { useState, useTransition, useRef } from 'react';
import { Save, CheckCircle2, Shield, Database } from 'lucide-react';
import { updateSettings } from '@/actions/settings';
import { createBackup, restoreBackup } from '@/actions/backup';
import { Button } from "@/components/ui/button";

import AccessSecuritySection from './AccessSecuritySection';
import RecaptchaSection from './RecaptchaSection';
import BackupSection from './BackupSection';

export default function SecurityForm({ initialSettings }) {
  const [settings, setSettings] = useState(initialSettings);
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [backupMsg, setBackupMsg] = useState('');
  const [activeTab, setActiveTab] = useState('access');
  
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
        {activeTab === 'access' && (
          <AccessSecuritySection 
            settings={settings} 
            handleChange={handleChange} 
            handleArrayAdd={handleArrayAdd} 
            handleArrayRemove={handleArrayRemove} 
            renderSaveButton={renderSaveButton} 
          />
        )}

        {activeTab === 'recaptcha' && (
          <RecaptchaSection 
            settings={settings} 
            handleChange={handleChange} 
            renderSaveButton={renderSaveButton} 
          />
        )}

        {activeTab === 'backup' && (
          <BackupSection 
            settings={settings} 
            handleChange={handleChange} 
            handleCreateBackup={handleCreateBackup} 
            handleRestoreBackup={handleRestoreBackup} 
            backupMsg={backupMsg} 
            fileInputRef={fileInputRef} 
            renderSaveButton={renderSaveButton} 
          />
        )}
      </div>
    </div>
  );
}
