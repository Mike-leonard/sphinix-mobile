import React from 'react';
import RightSidebar from '@/components/sidebar/RightSidebar';

export default function DevicePageSidebar({ newArrivals, topRated }) {
  return (
    <RightSidebar
      selectedCategory="All"
      isDevicesRoute={true}
    />
  );
}
