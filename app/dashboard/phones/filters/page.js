import React from 'react';
import DeviceTabsRoute from '../_components/manager/DeviceTabsRoute';
import FilterManager from './_components/FilterManager';
import { getDeviceFilters } from '@/actions/device-filters';
import { getDeviceAttributes } from '@/actions/device-attributes';

export const metadata = {
  title: 'Filters | Device Management',
};

export default async function FiltersPage() {
  const filters = await getDeviceFilters();
  const attributes = await getDeviceAttributes();

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Filters</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Manage device filters shown on the frontend.
        </p>
        
        <DeviceTabsRoute />
        <FilterManager initialFilters={filters} allAttributes={attributes} />
      </div>
    </div>
  );
}
