import React from 'react';
import { getSettings } from '@/actions/settings';
import SecurityForm from '@/app/dashboard/settings/security/_components/SecurityForm';

export default async function Page() {
  const settings = await getSettings();
  return <SecurityForm initialSettings={settings} />;
}
