import React from 'react';
import DeviceTabsRoute from '../_components/manager/DeviceTabsRoute';
import RatingBarManager from './_components/RatingBarManager';
import { getRatingBars } from '@/actions/rating-bars';

export const metadata = {
  title: 'Rating Bars | Device Management',
};

export default async function RatingBarsPage() {
  const ratingBars = await getRatingBars();

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 style={{fontSize: "var(--font-size-h1-dashboard, var(--font-size-h1-default))"}} className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Rating Bars</h1>
        <p style={{fontSize: "var(--font-size-p-default, var(--font-size-p-default))"}} className="text-slate-600 dark:text-slate-400 mb-8">
          Manage rating bars for devices.
        </p>
        
        <DeviceTabsRoute />
        <div className="mt-8">
          <RatingBarManager initialBars={ratingBars} />
        </div>
      </div>
    </div>
  );
}
