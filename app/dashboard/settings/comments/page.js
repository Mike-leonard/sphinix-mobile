import React from 'react';
import { getSettings } from '@/actions/settings';
import CommentsForm from '@/app/dashboard/settings/comments/_components/CommentsForm';

export default async function Page() {
  const settings = await getSettings();
  return <CommentsForm initialSettings={settings} />;
}
