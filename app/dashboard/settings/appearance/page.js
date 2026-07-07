import React from 'react';
import { getSettings } from '@/actions/settings';
import AppearanceForm from '@/app/dashboard/settings/appearance/_components/AppearanceForm';

export default async function Page() {
  const settings = await getSettings();
  return <AppearanceForm initialSettings={settings} />;
}
