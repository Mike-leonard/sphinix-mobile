import React from 'react';
import { notFound } from 'next/navigation';
import CompareDrawer from '@/components/CompareDrawer';
import { getDeviceById, publishedDevices } from '@/actions/devices';
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
  const { deviceSlug } = resolvedParams;

  const [device, ratingBars, attrs] = await Promise.all([
    getDeviceById(deviceSlug),
    getRatingBars(),
    getDeviceAttributes()
  ]);

  if (!device || device.status !== 'published') {
    return notFound();
  }

  const quickSpecs = attrs.filter(a => a.groupIds?.includes('Quick Specifications') || a.groupId === 'Quick Specifications');

  // Fetch related devices from database
  const relatedList = await publishedDevices({ limit: 6, brand: device.brand });
  const relatedDevices = (relatedList || []).filter(p => p.id !== device.id).slice(0, 3);

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
          <RelatedDevices relatedDevices={relatedDevices} />

        </div>

        {/* Right Sidebar */}
        <DevicePageSidebar />

      </div>

      <CompareDrawer />
    </div>
  );
}