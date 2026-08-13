import React from 'react';
import { redirect } from 'next/navigation';
import { verifySession } from '@/actions/auth';
import SettingsNavList from './_components/SettingsNavList';

export default async function SettingsLayout({ children }) {
  const session = await verifySession();
  if (!session || !['Admin', 'Moderator'].includes(session.role)) {
    redirect('/dashboard');
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 style={{fontSize: "var(--font-size-h1-dashboard, var(--font-size-h1-default))"}} className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Settings</h1>
          <p style={{fontSize: "var(--font-size-p-default, var(--font-size-p-default))"}} className="text-slate-600 dark:text-slate-400">
            Configure site-wide settings, metadata, and preferences.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Settings Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <SettingsNavList />
          </div>

          {/* Settings Content Area */}
          <div className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
