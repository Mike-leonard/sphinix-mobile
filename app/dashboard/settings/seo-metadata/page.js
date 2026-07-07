import React from 'react';
import { getSettings } from '@/actions/settings';
import SeoMetadataForm from '@/app/dashboard/settings/seo-metadata/_components/SeoMetadataForm';

export default async function Page() {
  const settings = await getSettings();
  return <SeoMetadataForm initialSettings={settings} />;
}
