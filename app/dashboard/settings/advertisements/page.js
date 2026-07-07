import React from 'react';
import { getSettings } from '@/actions/settings';
import AdvertisementsForm from '@/app/dashboard/settings/advertisements/_components/AdvertisementsForm';

export default async function Page() {
  const settings = await getSettings();
  return <AdvertisementsForm initialSettings={settings} />;
}
