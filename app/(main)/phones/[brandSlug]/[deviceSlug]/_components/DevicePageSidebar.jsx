'use client';
import React, { useState } from 'react';
import RightSidebar from '@/components/sidebar/RightSidebar';

export default function DevicePageSidebar({ newArrivals, topRated }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");

  return (
    <RightSidebar
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      selectedBrand={selectedBrand}
      setSelectedBrand={setSelectedBrand}
      selectedCategory="All"
      setSelectedCategory={() => {}}
      newArrivals={newArrivals}
      topRated={topRated}
      brands={[]}
      isDevicesRoute={true}
    />
  );
}
