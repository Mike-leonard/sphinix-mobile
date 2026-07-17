import React from 'react';
import { getDevices } from '@/actions/devices';
import { getDeviceBrands } from '@/actions/device-brands';
import DevicesManager from './_components/manager/DevicesManager';

export const metadata = {
  title: 'Device Management | Dashboard',
  description: 'Manage devices and their specifications.',
};

export default async function DevicesPage() {
  const devices = await getDevices();
  const brands = await getDeviceBrands();
  
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 style={{fontSize: "var(--font-size-h1-dashboard, var(--font-size-h1-default))"}} className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Device Management</h1>
        <p style={{fontSize: "var(--font-size-p-default, var(--font-size-p-default))"}} className="text-slate-600 dark:text-slate-400 mb-8">
          Manage the devices catalog, their specifications, and images.
        </p>
        
        <DevicesManager initialDevices={devices} initialBrands={brands} />
      </div>
    </div>
  );
}
