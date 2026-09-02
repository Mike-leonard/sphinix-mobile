'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Save, CheckCircle2, Share2, ExternalLink, RefreshCw, Send, AlertCircle, Unlink } from 'lucide-react';
import { updateSettings } from '@/actions/settings';
import { 
  getPinterestAuthLinkAction, 
  fetchPinterestBoardsAction, 
  disconnectPinterestAction, 
  sendTestPinAction 
} from '@/actions/pinterest';
import { Button } from "@/components/ui/button";

export default function SocialMediaForm({ initialSettings }) {
  const [settings, setSettings] = useState(initialSettings);
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  // Pinterest state
  const pinterestConfig = settings?.socialMedia?.pinterest || {};
  const isPinterestConnected = Boolean(pinterestConfig.accessToken);
  const [boards, setBoards] = useState([]);
  const [loadingBoards, setLoadingBoards] = useState(isPinterestConnected);
  const [testPinState, setTestPinState] = useState({ loading: false, message: '', error: '' });
  const [authLoading, setAuthLoading] = useState(false);

  // Fetch Pinterest boards if connected
  useEffect(() => {
    let active = true;
    if (isPinterestConnected) {
      fetchPinterestBoardsAction().then((res) => {
        if (!active) return;
        setLoadingBoards(false);
        if (res.success && Array.isArray(res.boards)) {
          setBoards(res.boards);
        }
      });
    }
    return () => {
      active = false;
    };
  }, [isPinterestConnected]);

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [key]: value
      }
    }));
  };

  const handlePinterestChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        pinterest: {
          ...prev.socialMedia?.pinterest,
          [key]: value
        }
      }
    }));
  };

  const handleConnectPinterest = async () => {
    try {
      setAuthLoading(true);
      const origin = window.location.origin.replace('0.0.0.0', 'localhost');
      const redirectUri = `${origin}/api/pinterest/callback`;
      const res = await getPinterestAuthLinkAction(redirectUri);
      if (res.success && res.url) {
        window.location.href = res.url;
      } else {
        alert(res.error || 'Failed to start Pinterest authorization');
        setAuthLoading(false);
      }
    } catch (err) {
      alert(err.message || 'Error connecting to Pinterest');
      setAuthLoading(false);
    }
  };

  const handleDisconnectPinterest = async () => {
    if (!confirm('Are you sure you want to disconnect Pinterest? Auto-pinning will stop.')) return;
    const res = await disconnectPinterestAction();
    if (res.success) {
      setSettings(prev => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          pinterest: {
            enabled: false,
            autoPinPhones: false,
            autoPinBlogs: false,
            boardId: '',
            boardName: '',
            accessToken: '',
            refreshToken: '',
            tokenExpiresAt: null,
            username: ''
          }
        }
      }));
      setBoards([]);
    } else {
      alert(res.error || 'Failed to disconnect Pinterest');
    }
  };

  const handleSendTestPin = async () => {
    setTestPinState({ loading: true, message: '', error: '' });
    const res = await sendTestPinAction();
    if (res.success) {
      setTestPinState({ loading: false, message: 'Test Pin successfully created on your Pinterest board!', error: '' });
    } else {
      setTestPinState({ loading: false, message: '', error: res.error || 'Failed to send test pin.' });
    }
  };

  const handleSave = () => {
    startTransition(async () => {
      const res = await updateSettings({ socialMedia: settings.socialMedia });
      if (res.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert(res.error || 'Failed to save settings');
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <h2 style={{ fontSize: "var(--font-size-h2-settings, var(--font-size-h2-default))" }} className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
        Social Media & Auto-Publishing
      </h2>

      {/* PINTEREST AUTO-PIN INTEGRATION CARD */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-red-500/5 via-slate-50 to-slate-100 dark:from-red-950/10 dark:via-slate-900 dark:to-slate-950 border border-red-200 dark:border-red-900/30 shadow-sm space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-red-600/20 shrink-0">
              P
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Pinterest Auto-Pin Integration</h3>
                {isPinterestConnected ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected {pinterestConfig.username ? `@${pinterestConfig.username}` : ''}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-300 dark:border-amber-500/20">
                    Not Connected
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Automatically publish high-res phone photos & blog articles with specs and backlinks to your Pinterest boards.
              </p>
            </div>
          </div>

          {/* Connect / Disconnect Action Button */}
          <div>
            {isPinterestConnected ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnectPinterest}
                className="text-xs border-red-200 dark:border-red-900/40 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 gap-1.5"
              >
                <Unlink className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </Button>
            ) : (
              <Button
                onClick={handleConnectPinterest}
                disabled={authLoading}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 h-9 rounded-xl shadow-md shadow-red-600/20 gap-2 cursor-pointer transition-all"
              >
                {authLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
                <span>Connect Pinterest Account</span>
              </Button>
            )}
          </div>
        </div>

        {/* Connected Settings Controls */}
        {isPinterestConnected && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 space-y-5">
            
            {/* Board Selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Target Pinterest Board
                </label>
                {loadingBoards ? (
                  <div className="flex items-center gap-2 text-xs text-slate-500 py-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Loading your Pinterest boards...</span>
                  </div>
                ) : boards.length > 0 ? (
                  <select
                    value={pinterestConfig.boardId || ''}
                    onChange={(e) => {
                      const selected = boards.find(b => b.id === e.target.value);
                      handlePinterestChange('boardId', e.target.value);
                      if (selected) {
                        handlePinterestChange('boardName', selected.name);
                      }
                    }}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500/50 outline-none"
                  >
                    <option value="">-- Select a Pinterest Board --</option>
                    {boards.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.privacy || 'PUBLIC'})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={pinterestConfig.boardId || ''}
                    onChange={(e) => handlePinterestChange('boardId', e.target.value)}
                    placeholder="Enter your Pinterest Board ID"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500/50 outline-none"
                  />
                )}
                <p className="text-[11px] text-slate-500 mt-1">
                  New smartphone and article pins will be posted directly to this board.
                </p>
              </div>

              {/* 1-Year Auto-Renew Status */}
              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex flex-col justify-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Authentication Token</span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 365-Day Refresh Token Active
                </span>
                <p className="text-[11px] text-slate-500 mt-1">
                  Your server automatically refreshes short-lived tokens in the background. Zero manual re-logins needed.
                </p>
              </div>
            </div>

            {/* Auto-Pin Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <label className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pinterestConfig.autoPinPhones !== false}
                  onChange={(e) => handlePinterestChange('autoPinPhones', e.target.checked)}
                  className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-300"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">Auto-Pin Smartphones on Publish</span>
                  <span className="text-[11px] text-slate-500 block">Pins gallery photo, specs & review backlink.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pinterestConfig.autoPinBlogs !== false}
                  onChange={(e) => handlePinterestChange('autoPinBlogs', e.target.checked)}
                  className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-300"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">Auto-Pin Blog Articles on Publish</span>
                  <span className="text-[11px] text-slate-500 block">Pins article cover, excerpt & post backlink.</span>
                </div>
              </label>
            </div>

            {/* Test Pin Section */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSendTestPin}
                  disabled={testPinState.loading || !pinterestConfig.boardId}
                  className="text-xs border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 gap-1.5 cursor-pointer"
                >
                  {testPinState.loading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5 text-red-500" />
                  )}
                  <span>Send Test Pin to Board</span>
                </Button>
                <span className="text-xs text-slate-500">Verifies your Pinterest API credentials and board connection.</span>
              </div>
            </div>

            {/* Test Pin Alerts */}
            {testPinState.message && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{testPinState.message}</span>
              </div>
            )}
            {testPinState.error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-xs font-medium text-red-700 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{testPinState.error}</span>
              </div>
            )}

          </div>
        )}

      </div>

      {/* STANDARD SOCIAL MEDIA PROFILES */}
      <div className="space-y-6 max-w-2xl">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Public Social Media Profile Links
        </h3>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Facebook URL</label>
          <input
            type="text"
            value={settings.socialMedia.facebook || ''}
            onChange={(e) => handleChange('facebook', e.target.value)}
            placeholder="https://facebook.com/sphinixmobile"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Twitter / X URL</label>
          <input
            type="text"
            value={settings.socialMedia.twitter || ''}
            onChange={(e) => handleChange('twitter', e.target.value)}
            placeholder="https://x.com/sphinixmobile"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Instagram URL</label>
          <input
            type="text"
            value={settings.socialMedia.instagram || ''}
            onChange={(e) => handleChange('instagram', e.target.value)}
            placeholder="https://instagram.com/sphinixmobile"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">YouTube URL</label>
          <input
            type="text"
            value={settings.socialMedia.youtube || ''}
            onChange={(e) => handleChange('youtube', e.target.value)}
            placeholder="https://youtube.com/@sphinixmobile"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none"
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
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          <span>{success ? 'Saved!' : 'Save Settings'}</span>
        </Button>
      </div>
    </div>
  );
}
