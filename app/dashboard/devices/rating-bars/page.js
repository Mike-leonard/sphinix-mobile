import React from 'react';
import DeviceTabsRoute from '../_components/manager/DeviceTabsRoute';

export const metadata = {
  title: 'Rating Bars | Device Management',
};

export default function RatingBarsPage() {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 style={{fontSize: "var(--font-size-h1-dashboard, var(--font-size-h1-default))"}} className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Rating Bars</h1>
        <p style={{fontSize: "var(--font-size-p-default, var(--font-size-p-default))"}} className="text-slate-600 dark:text-slate-400 mb-8">
          Manage rating bars for devices.
        </p>
        
        <DeviceTabsRoute />
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-500">
          Rating Bars management coming soon.
        </div>
      </div>
    </div>
  );
}
