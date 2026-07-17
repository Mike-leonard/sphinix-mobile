import React from 'react';
import DeviceTabsRoute from '../_components/manager/DeviceTabsRoute';
import BrandManager from './_components/BrandManager';
import { getDeviceBrands } from '@/actions/device-brands';
import { getDevices } from '@/actions/devices';

export const metadata = {
  title: 'Brands | Device Management',
};

export default async function BrandsPage() {
  const brands = await getDeviceBrands();
  const devices = await getDevices();
  
  const brandCounts = devices.reduce((acc, device) => {
    if (device.status === 'published' && device.brand) {
      acc[device.brand] = (acc[device.brand] || 0) + 1;
    }
    return acc;
  }, {});

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 style={{fontSize: "var(--font-size-h1-dashboard, var(--font-size-h1-default))"}} className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Brands</h1>
        <p style={{fontSize: "var(--font-size-p-default, var(--font-size-p-default))"}} className="text-slate-600 dark:text-slate-400 mb-8">
          Manage device brands.
        </p>
        
        <DeviceTabsRoute />
        <BrandManager initialBrands={brands} brandCounts={brandCounts} />
      </div>
    </div>
  );
}
