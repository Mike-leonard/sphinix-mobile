import React from 'react';
import { getSettings } from '@/actions/settings';
import AnalyticsForm from '@/app/dashboard/settings/analytics/_components/AnalyticsForm';

export default async function Page() {
  const settings = await getSettings();
  return <AnalyticsForm initialSettings={settings} />;
}
