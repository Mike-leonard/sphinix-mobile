import React from 'react';
import { notFound } from 'next/navigation';
import MOCK_PRODUCTS from '@/data/products.json';
import MOCK_BLOGS from '@/data/blogs.json';
import CompareDrawer from '@/components/CompareDrawer';
import { getRatingBars } from '@/actions/rating-bars';
import { getDeviceAttributes } from '@/actions/device-attributes';

import DeviceBreadcrumb from './_components/DeviceBreadcrumb';
import DeviceGallery from './_components/DeviceGallery';
import DeviceQuickInfo from './_components/DeviceQuickInfo';
import DeviceTabs from './_components/DeviceTabs';
import RelatedDevices from './_components/RelatedDevices';
import AdBanner from '@/components/ads/AdBanner';
import DevicePageSidebar from './_components/DevicePageSidebar';

export default async function DeviceDetailsPage({ params }) {
  const resolvedParams = await params;
  const { brandSlug, deviceSlug } = resolvedParams;

  const device = MOCK_PRODUCTS.find(p => p.id === deviceSlug);

  const [ratingBars, attrs] = await Promise.all([
    getRatingBars(),
    getDeviceAttributes()
  ]);

  const quickSpecs = attrs.filter(a => a.groupIds?.includes('Quick Specifications') || a.groupId === 'Quick Specifications');

  const newArrivals = MOCK_PRODUCTS.filter(p => p.isNew);
  const topRated = MOCK_PRODUCTS.filter(p => p.isTopRated);

  if (!device || device.status !== 'published') {
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
              <DeviceQuickInfo device={device} quickSpecs={quickSpecs} />
            </div>
          </div>

          {/* Tabbed Content: Specs, Overview, Reviews */}
          <DeviceTabs device={device} ratingBars={ratingBars} />

          <AdBanner placement="deviceDetailsBanner" className='mt-10'/>
          {/* Related Devices */}
          <RelatedDevices currentDevice={device} />

        </div>

        {/* Right Sidebar */}
        <DevicePageSidebar 
          newArrivals={newArrivals}
          topRated={topRated}
        />

      </div>

      <CompareDrawer />
    </div>
  );
}