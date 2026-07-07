import React from 'react';
import { getSettings } from '@/actions/settings';
import MaintenanceForm from '@/app/dashboard/settings/maintenance/_components/MaintenanceForm';

export default async function Page() {
  const settings = await getSettings();
  return <MaintenanceForm initialSettings={settings} />;
}
