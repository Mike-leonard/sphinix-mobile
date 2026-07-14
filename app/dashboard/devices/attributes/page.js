import React from 'react';
import DeviceTabsRoute from '../_components/manager/DeviceTabsRoute';
import AttributeManager from './_components/AttributeManager';
import { getDeviceAttributes } from '@/actions/device-attributes';
import { getDeviceGroups } from '@/actions/device-groups';

export const metadata = {
  title: 'Attributes | Device Management',
};

export default async function AttributesPage() {
  const [attributes, groups] = await Promise.all([
    getDeviceAttributes(),
    getDeviceGroups()
  ]);

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 style={{fontSize: "var(--font-size-h1-dashboard, var(--font-size-h1-default))"}} className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Attributes</h1>
        <p style={{fontSize: "var(--font-size-p-default, var(--font-size-p-default))"}} className="text-slate-600 dark:text-slate-400 mb-8">
          Manage device attributes.
        </p>
        
        <DeviceTabsRoute />
        <AttributeManager initialAttributes={attributes} availableGroups={groups} />
      </div>
    </div>
  );
}
