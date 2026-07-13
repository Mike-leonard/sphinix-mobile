import React from 'react';
import DeviceEditor from '../_components/editor/DeviceEditor';

export const metadata = {
  title: 'Add New Device | Dashboard',
  description: 'Add a new device to the catalog.',
};

export default function NewDevicePage() {
  return <DeviceEditor />;
}
