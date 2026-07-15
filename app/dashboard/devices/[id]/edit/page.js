import React from 'react';
import { notFound } from 'next/navigation';
import { getDeviceById } from '@/actions/devices';
import DeviceEditor from '../../_components/editor/DeviceEditor';

import { getDeviceBrands } from '@/actions/device-brands';
import { getDeviceAttributes } from '@/actions/device-attributes';
import { getRatingBars } from '@/actions/rating-bars';

export const metadata = {
  title: 'Edit Device | Dashboard',
  description: 'Edit device specifications.',
};

export default async function EditDevicePage({ params }) {
  const { id } = await params;
  const device = await getDeviceById(id);
  const brands = await getDeviceBrands();
  const attributes = await getDeviceAttributes();
  const ratingBars = await getRatingBars();

  if (!device) {
    notFound();
  }

  return <DeviceEditor initialDevice={device} brands={brands} allAttributes={attributes} ratingBars={ratingBars} />;
}
