import React from 'react';
import DeviceEditor from '../_components/editor/DeviceEditor';

import { getDeviceBrands } from '@/actions/device-brands';
import { getDeviceAttributes } from '@/actions/device-attributes';

export const metadata = {
  title: 'Add New Device | Dashboard',
  description: 'Add a new device to the catalog.',
};

export default async function NewDevicePage() {
  const brands = await getDeviceBrands();
  const attributes = await getDeviceAttributes();

  return <DeviceEditor brands={brands} allAttributes={attributes} />;
}
