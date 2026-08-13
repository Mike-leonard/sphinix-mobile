import React from 'react';
import { notFound } from 'next/navigation';
import { getPublishedDeviceById, publishedDevices } from '@/actions/devices';
import { getRatingBars } from '@/actions/rating-bars';
import { getDeviceAttributes } from '@/actions/device-attributes';

import DeviceBreadcrumb from './_components/DeviceBreadcrumb';
import DeviceGallery from './_components/DeviceGallery';
import DeviceQuickInfo from './_components/DeviceQuickInfo';
import DeviceTabs from './_components/DeviceTabs';
import RelatedDevices from './_components/RelatedDevices';
import AdBanner from '@/components/ads/AdBanner';
import DevicePageSidebar from './_components/DevicePageSidebar';

/**
 * Generates dynamic SEO metadata (Title, Description, OpenGraph, Twitter, Keywords) per phone route.
 */
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { deviceSlug } = resolvedParams;

  const device = await getPublishedDeviceById(deviceSlug);
  if (!device) {
    return {
      title: 'Device Not Found',
      description: 'The requested smartphone record could not be found.',
    };
  }

  const seo = device.seo || {};
  const metaTitle = seo.metaTitle || `${device.name} - Full Specifications, Price & Review`;
  const metaDescription =
    seo.metaDescription ||
    `Full specifications, features, price (${device.price || 'N/A'}), camera details, battery specs and expert review for ${device.name} by ${device.brand}.`;

  const keywordsList = seo.keywords
    ? (typeof seo.keywords === 'string' ? seo.keywords.split(',').map(k => k.trim()) : seo.keywords)
    : [device.name, device.brand, `${device.name} specs`, `${device.name} price`, `${device.brand} smartphones`].filter(Boolean);

  const heroImage = (device.images && device.images.find(img => Boolean(img))) || '';

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: keywordsList,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: 'article',
      images: heroImage ? [{ url: heroImage, alt: device.name }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: heroImage ? [heroImage] : [],
    },
  };
}

export default async function DeviceDetailsPage({ params }) {
  const resolvedParams = await params;
  const { deviceSlug } = resolvedParams;

  const [device, ratingBars, attrs] = await Promise.all([
    getPublishedDeviceById(deviceSlug),
    getRatingBars(),
    getDeviceAttributes()
  ]);

  if (!device || device.status !== 'published') {
    return notFound();
  }

  const quickSpecs = attrs.filter(a => a.groupIds?.includes('Quick Specifications') || a.groupId === 'Quick Specifications');

  // Fetch related devices from database
  const relatedList = await publishedDevices({ limit: 4, brand: device.brand });
  const relatedDevices = (relatedList || []).filter(p => p.id !== device.id).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': device.name,
    'image': device.images?.filter(Boolean) || [],
    'description': device.seo?.metaDescription || `Full specifications, features, price and expert review for ${device.name}`,
    'brand': {
      '@type': 'Brand',
      'name': device.brand
    },
    'offers': {
      '@type': 'Offer',
      'priceCurrency': 'USD',
      'price': device.price ? String(device.price).replace(/[^0-9.]/g, '') || '0' : '0',
      'availability': 'https://schema.org/InStock'
    },
    ...(device.rating ? {
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': device.rating,
        'bestRating': '5',
        'worstRating': '1',
        'ratingCount': '1'
      }
    } : {})
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
      </div>
    </>
  );
}