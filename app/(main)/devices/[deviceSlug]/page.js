'use client';
import React, { useState, useMemo } from 'react';
import { notFound } from 'next/navigation';
import RightSidebar from '@/components/sidebar/RightSidebar';
import MOCK_PRODUCTS from '@/data/products.json';
import MOCK_BLOGS from '@/data/blogs.json';
import { generateDeviceSlug } from '@/lib/utils';
import CompareDrawer from '@/components/CompareDrawer';

import DeviceBreadcrumb from './_components/DeviceBreadcrumb';
import DeviceGallery from './_components/DeviceGallery';
import DeviceQuickInfo from './_components/DeviceQuickInfo';
import DeviceTabs from './_components/DeviceTabs';
import RelatedDevices from './_components/RelatedDevices';

export default function DeviceDetailsPage({ params }) {
  const resolvedParams = React.use(params);
  const { deviceSlug } = resolvedParams;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");

  const device = useMemo(() => {
    return MOCK_PRODUCTS.find(p => generateDeviceSlug(p.name) === deviceSlug);
  }, [deviceSlug]);

  const newArrivals = useMemo(() => MOCK_PRODUCTS.filter(p => p.isNew), []);
  const topRated = useMemo(() => MOCK_PRODUCTS.filter(p => p.isTopRated), []);

  if (!device) {
    return notFound();
  }

  return (
    <div className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-8 flex flex-col min-h-0">
          
          <DeviceBreadcrumb device={device} />

          {/* Top Section: Gallery + Quick Info */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <DeviceGallery device={device} />
              <DeviceQuickInfo device={device} />
            </div>
          </div>

          {/* Tabbed Content: Specs, Overview, Reviews */}
          <DeviceTabs device={device} />

          {/* Related Devices */}
          <RelatedDevices currentDevice={device} />

        </div>

        {/* Right Sidebar */}
        <RightSidebar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          selectedCategory="All"
          setSelectedCategory={() => {}}
          newArrivals={newArrivals}
          topRated={topRated}
          categories={[]} 
          brands={[]}
        />

      </div>

      <CompareDrawer />
    </div>
  );
}