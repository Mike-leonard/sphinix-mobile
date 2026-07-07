import React from 'react';
import { getSettings } from '@/actions/settings';
import MediaForm from '@/app/dashboard/settings/media/_components/MediaForm';

export default async function Page() {
  const settings = await getSettings();
  return <MediaForm initialSettings={settings} />;
}
