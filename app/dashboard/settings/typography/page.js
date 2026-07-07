import React from 'react';
import { getSettings } from '@/actions/settings';
import TypographyForm from '@/app/dashboard/settings/typography/_components/TypographyForm';

export default async function Page() {
  const settings = await getSettings();
  return <TypographyForm initialSettings={settings} />;
}
