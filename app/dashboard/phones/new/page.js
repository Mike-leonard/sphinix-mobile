import React from 'react';
import DeviceEditor from '../_components/editor/DeviceEditor';

import { getDeviceBrands } from '@/actions/device-brands';
import { getDeviceAttributes } from '@/actions/device-attributes';
import { getRatingBars } from '@/actions/rating-bars';
import { getDeviceGroups } from '@/actions/device-groups';

export const metadata = {
  title: 'Add New Device | Dashboard',
  description: 'Add a new device to the catalog.',
};

export default async function NewDevicePage() {
  const brands = await getDeviceBrands();
  const attributes = await getDeviceAttributes();
  const ratingBars = await getRatingBars();
  const groups = await getDeviceGroups();

  return <DeviceEditor brands={brands} allAttributes={attributes} ratingBars={ratingBars} deviceGroups={groups} />;
}
