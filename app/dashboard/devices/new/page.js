import React from 'react';
import DeviceEditor from '../_components/editor/DeviceEditor';

import { getDeviceBrands } from '@/actions/device-brands';

export const metadata = {
  title: 'Add New Device | Dashboard',
  description: 'Add a new device to the catalog.',
};

export default async function NewDevicePage() {
  const brands = await getDeviceBrands();
  return <DeviceEditor brands={brands} />;
}
