import React from 'react';
import { getSettings } from '@/actions/settings';
import LocalizationForm from '@/app/dashboard/settings/localization/_components/LocalizationForm';

export default async function Page() {
  const settings = await getSettings();
  return <LocalizationForm initialSettings={settings} />;
}
