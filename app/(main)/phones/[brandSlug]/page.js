import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import AdvancedFilters from '@/components/AdvancedFilters';
import Pagination from '@/components/Pagination';
import RightSidebar from '@/components/sidebar/RightSidebar';
import DeviceCatalogView from '../_components/DeviceCatalogView';
import { getDeviceBrandBySlug, getDeviceBrands } from '@/actions/device-brands';
import { getDeviceFilters } from '@/actions/device-filters';
import { publishedDevices, publishedDevicesCount, getDeviceViewMode } from '@/actions/devices';
import { getSettings } from '@/actions/settings';
import { rawOrigin } from '@/lib/utils';
import { getBrandSeoContent } from '@/lib/devices/brandSeoContent';

/**
 * Dynamic SEO Metadata for Brand Landing Pages
 */
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { brandSlug } = resolvedParams;

  const brand = await getDeviceBrandBySlug(brandSlug);
  if (!brand) {
    return {
      title: 'Brand Not Found | Sphinix Mobile',
      description: 'The requested smartphone manufacturer could not be found.',
    };
  }

  const fallbackContent = getBrandSeoContent(brand.slug || brand.name || brandSlug);
  const h1Text = brand.h1?.trim() || fallbackContent.h1;
  const introText = brand.intro?.trim() || fallbackContent.intro;

  const metaTitle = `${h1Text} - Full Specifications, Latest Models & Reviews | Sphinix Mobile`;
  const metaDescription = introText;
  const canonicalUrl = `${rawOrigin}/phones/${encodeURIComponent(brand.slug || brandSlug)}`;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: [
      brand.name,
      `${brand.name} phones`,
      `${brand.name} mobile specs`,
      `${brand.name} smartphones`,
      `${brand.name} prices`,
      ...(fallbackContent.series || []),
      'phone specifications',
      'mobile comparisons'
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
    },
  };
}

export default async function BrandLandingPage({ params, searchParams }) {
  const resolvedParams = await params;
  const { brandSlug } = resolvedParams;

  const brand = await getDeviceBrandBySlug(brandSlug);
  if (!brand) {
    return notFound();
  }

  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams?.page || "1", 10);
  const searchQuery = resolvedSearchParams?.q || "";

  // Extract active filter search params (e.g. filter_ram, filter_battery, filter_storage)
  const activeFilters = {};
  if (resolvedSearchParams) {
    Object.keys(resolvedSearchParams).forEach(key => {
      if (key.startsWith('filter_')) {
        let filterId = key;
        if (filterId.startsWith('filter_filter_')) {
          filterId = filterId.replace('filter_filter_', 'filter_');
        }
        const val = resolvedSearchParams[key];
        if (val) {
          activeFilters[filterId] = String(val).split(',').filter(Boolean);
        }
      }
    });
  }

  // 1. Fetch settings and current saved viewMode from cookies
  const [settings, cookieViewMode] = await Promise.all([
    getSettings(),
    getDeviceViewMode()
  ]);

  const viewMode = cookieViewMode || 'grid';
  const ITEMS_PER_PAGE = settings?.appearance?.phones?.deviceLimit ?? settings?.appearance?.devices?.deviceLimit ?? 12;
  const deviceCardSpecLimit = settings?.appearance?.phones?.deviceCardSpecLimit ?? settings?.appearance?.devices?.deviceCardSpecLimit ?? 3;
  const freq = settings?.advertisements?.injectionFrequency?.phonesPageGrid || 6;
  const offset = Math.max(0, (page - 1) * ITEMS_PER_PAGE);

  // 2. Query published devices and counts scoped to this brand at the database level
  const [devices, totalDevicesCount, filtersData, dbBrands] = await Promise.all([
    publishedDevices({
      limit: ITEMS_PER_PAGE,
      offset,
      query: searchQuery,
      brand: brand.name,
      filters: activeFilters
    }),
    publishedDevicesCount({
      query: searchQuery,
      brand: brand.name,
      filters: activeFilters
    }),
    getDeviceFilters(),
    getDeviceBrands()
  ]);

  const BRANDS = ["All", ...(dbBrands || [])];
  const totalPages = Math.ceil(totalDevicesCount / ITEMS_PER_PAGE) || 1;
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const fallbackContent = getBrandSeoContent(brand.slug || brand.name || brandSlug);
  const h1Text = brand.h1?.trim() || fallbackContent.h1;
  const introText = brand.intro?.trim() || fallbackContent.intro;

  // Structured JSON-LD schema for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: h1Text,
    description: introText,
    url: `${rawOrigin}/phones/${encodeURIComponent(brand.slug || brandSlug)}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: devices.map((device, idx) => ({
        '@type': 'ListItem',
        position: offset + idx + 1,
        url: `${rawOrigin}/phones/${encodeURIComponent(brand.slug || brandSlug)}/${device.id}`,
        name: device.name
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-6 flex-wrap">
          <Link href="/" className="hover:text-brand-500 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <Link href="/phones" className="hover:text-brand-500 transition-colors">Phones</Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <span className="text-slate-900 dark:text-white font-bold">{brand.name}</span>
        </div>

        {/* Semantic H1 & Intro for Search Engines & Accessibility (visually hidden) */}
        <header className="sr-only">
          <h1>{h1Text}</h1>
          <p>{introText}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Content Area */}
          <div className="lg:col-span-8">

            {/* Controls Bar & Products Grid/List Container */}
            <DeviceCatalogView
              devices={devices}
              initialViewMode={viewMode}
              selectedBrand={brand.name}
              BRANDS={BRANDS}
              filtersData={filtersData}
              deviceCardSpecLimit={deviceCardSpecLimit}
              freq={freq}
            />

            {/* Brand Page Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              </div>
            )}

          </div>

          {/* Right Sidebar */}
          <RightSidebar
            searchQuery={searchQuery}
            selectedBrand={brand.name}
            isDevicesRoute={true}
            advancedFiltersComponent={
              <AdvancedFilters
                filters={filtersData}
                isOpen={true}
                className="!mb-0"
              />
            }
          />

        </div>
      </div>
    </>
  );
}
