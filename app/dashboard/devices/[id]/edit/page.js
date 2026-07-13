import React from 'react';
import { notFound } from 'next/navigation';
import { getDeviceById } from '@/actions/devices';
import DeviceEditor from '../../_components/editor/DeviceEditor';

export const metadata = {
  title: 'Edit Device | Dashboard',
  description: 'Edit device specifications.',
};

export default async function EditDevicePage({ params }) {
  const { id } = await params;
  const device = await getDeviceById(id);

  if (!device) {
    notFound();
  }

  return <DeviceEditor initialDevice={device} isEditMode={true} />;
}
