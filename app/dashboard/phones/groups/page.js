import React from 'react';
import DeviceTabsRoute from '../_components/manager/DeviceTabsRoute';
import GroupManager from './_components/GroupManager';
import { getDeviceGroups } from '@/actions/device-groups';
import { getDeviceAttributes } from '@/actions/device-attributes';

export const metadata = {
  title: 'Groups | Device Management',
};

export default async function GroupsPage() {
  const [groups, attributes] = await Promise.all([
    getDeviceGroups(),
    getDeviceAttributes()
  ]);

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 style={{fontSize: "var(--font-size-h1-dashboard, var(--font-size-h1-default))"}} className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Groups</h1>
        <p style={{fontSize: "var(--font-size-p-default, var(--font-size-p-default))"}} className="text-slate-600 dark:text-slate-400 mb-8">
          Manage device groups.
        </p>
        
        <DeviceTabsRoute />
        <GroupManager initialGroups={groups} allAttributes={attributes} />
      </div>
    </div>
  );
}
