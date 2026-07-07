import React from 'react';
import { getSettings } from '@/actions/settings';
import SocialMediaForm from '@/app/dashboard/settings/social-media/_components/SocialMediaForm';

export default async function Page() {
  const settings = await getSettings();
  return <SocialMediaForm initialSettings={settings} />;
}
