import React from 'react';
import { getSettings } from '@/actions/settings';
import { Wrench } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function MaintenancePage() {
  const settings = await getSettings();

  // If maintenance mode is OFF, don't let people sit on the maintenance page
  if (!settings.maintenance?.maintenanceMode) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="mx-auto w-24 h-24 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center mb-8">
          <Wrench className="w-12 h-12 text-brand-600 dark:text-brand-400" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
          Under Maintenance
        </h1>
        
        <p className="text-lg text-slate-600 dark:text-slate-400">
          {settings.maintenance?.maintenanceMessage || "We are currently undergoing scheduled maintenance. Please check back soon."}
        </p>

        <div className="pt-8">
          <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto overflow-hidden">
            <div className="w-full h-full bg-brand-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
