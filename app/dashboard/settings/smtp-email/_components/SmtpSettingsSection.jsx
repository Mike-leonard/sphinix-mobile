'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Server, Key, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { getResolvedSettings, updateSmtpSettings } from '@/actions/settings';
import { Button } from "@/components/ui/button";

export default function SmtpSettingsSection() {
  const [smtp, setSmtp] = useState({
    host: 'smtp.gmail.com',
    port: 587,
    user: '',
    pass: '',
    from: '',
    receiverEmail: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    async function loadSettings() {
      try {
        const resolved = await getResolvedSettings();
        if (resolved?.smtp) {
          setSmtp({
            host: resolved.smtp.host || 'smtp.gmail.com',
            port: resolved.smtp.port || 587,
            user: resolved.smtp.user || '',
            pass: resolved.smtp.pass || '',
            from: resolved.smtp.from || '',
            receiverEmail: resolved.smtp.receiverEmail || ''
          });
        }
      } catch (err) {
        console.error('Failed to load SMTP settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSmtp((prev) => ({
      ...prev,
      [name]: name === 'port' ? parseInt(value, 10) || '' : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const res = await updateSmtpSettings(smtp);
      if (res.success) {
        setStatusMessage({ type: 'success', text: 'SMTP & Email settings updated successfully!' });
      } else {
        setStatusMessage({ type: 'error', text: res.error || 'Failed to update SMTP settings.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'An error occurred while saving.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
        <span>Loading SMTP configuration...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Mail className="w-4 h-4" /> Email & Dispatcher Configuration
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">SMTP Mail Server Settings</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Configure Nodemailer SMTP credentials to dispatch contact support tickets directly to your email inbox. Environment variables in <code className="text-brand-600 dark:text-brand-400 font-mono">.env</code> will take priority over these database settings if defined.
        </p>
      </div>

      {statusMessage.text && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
            : 'bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SMTP Host */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              SMTP Server Host *
            </label>
            <div className="relative">
              <Server className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="host"
                required
                value={smtp.host}
                onChange={handleChange}
                placeholder="smtp.gmail.com"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>
          </div>

          {/* SMTP Port */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              SMTP Server Port *
            </label>
            <input
              type="number"
              name="port"
              required
              value={smtp.port}
              onChange={handleChange}
              placeholder="587"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SMTP User */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              SMTP Username / Email *
            </label>
            <input
              type="text"
              name="user"
              value={smtp.user}
              onChange={handleChange}
              placeholder="support@sphinix-mobile.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>

          {/* SMTP Pass */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              SMTP Password / App Secret *
            </label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                name="pass"
                value={smtp.pass}
                onChange={handleChange}
                placeholder="••••••••••••••••"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sender From Header */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Sender "From" Address Header
            </label>
            <input
              type="text"
              name="from"
              value={smtp.from}
              onChange={handleChange}
              placeholder='"Sphinix Support" <noreply@sphinix-mobile.com>'
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>

          {/* Target Support Receiver Email */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Target Support Receiver Email *
            </label>
            <input
              type="email"
              name="receiverEmail"
              value={smtp.receiverEmail}
              onChange={handleChange}
              placeholder="support@sphinix-mobile.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
            <p className="text-[11px] text-slate-500">
              All submitted contact support tickets will be delivered to this email address.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <Button
            type="submit"
            disabled={saving}
            className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </span>
            ) : (
              'Save SMTP Settings'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
