import React from 'react';
import { getSettings } from '@/actions/settings';
import { getDevicesByIds } from '@/actions/devices';
import EmptyState from './_components/EmptyState';
import ComparisonHeader from './_components/ComparisonHeader';
import ComparisonBody from './_components/ComparisonBody';
import ComparisonBreadcrumb from './_components/ComparisonBreadcrumb';
import RightSidebar from '@/components/sidebar/RightSidebar';

export async function generateMetadata({ searchParams }) {
  const resolvedParams = await searchParams;
  const settings = await getSettings();

  let ids = [];
  if (resolvedParams?.ids) {
    ids = String(resolvedParams.ids).split(',').filter(Boolean);
  } else if (resolvedParams?.q) {
    ids = String(resolvedParams.q).split(',').filter(Boolean);
  }

  const baseTitle = settings?.seo?.comparisons?.title || "Compare Smartphones & Specifications | Sphinix Mobile";
  const baseDesc = settings?.seo?.comparisons?.description || "Compare mobile phone specifications side by side.";
  const baseKeywords = settings?.seo?.comparisons?.keywords
    ? settings.seo.comparisons.keywords.split(',').map(k => k.trim()).filter(Boolean)
    : ["compare phones", "smartphone comparison", "mobile specs comparison"];

  if (ids.length === 0) {
    return {
      title: baseTitle,
      description: baseDesc,
      keywords: baseKeywords,
      openGraph: {
        title: settings?.seo?.comparisons?.ogTitle || baseTitle,
        description: settings?.seo?.comparisons?.ogDescription || baseDesc,
        images: settings?.seo?.comparisons?.ogImage ? [{ url: settings.seo.comparisons.ogImage }] : []
      }
    };
  }

  const devices = await getDevicesByIds(ids);
  if (!devices || devices.length === 0) {
    return {
      title: baseTitle,
      description: baseDesc,
      keywords: baseKeywords,
    };
  }

  const comparisonNames = devices.map(d => d.name).join(' vs ');

  // Dynamic SEO Page Title
  let pageTitle = `${comparisonNames} - Full Comparison & Specs`;
  if (settings?.seo?.comparisons?.title) {
    pageTitle = `${comparisonNames} | ${settings.seo.comparisons.title}`;
  } else {
    pageTitle = `${comparisonNames} - Full Comparison & Specs | Sphinix Mobile`;
  }

  // Dynamic SEO Meta Description
  let pageDesc = `Compare ${comparisonNames} side-by-side. Detailed breakdown of display, camera, processor, battery, and price.`;
  if (settings?.seo?.comparisons?.description) {
    pageDesc = `Compare ${comparisonNames} side-by-side. ${settings.seo.comparisons.description}`;
  }

  const deviceKeywords = devices.flatMap(d => [d.name, d.brand, `${d.name} specs`]);
  const combinedKeywords = Array.from(new Set([...deviceKeywords, ...baseKeywords]));

  const ogImage = settings?.seo?.comparisons?.ogImage
    ? settings.seo.comparisons.ogImage
    : (devices[0]?.image || '');

  return {
    title: pageTitle,
    description: pageDesc,
    keywords: combinedKeywords,
    openGraph: {
      title: `${comparisonNames} - Phone Comparison`,
      description: pageDesc,
      images: ogImage ? [{ url: ogImage }] : []
    }
  };
}

export default async function ComparisonsPage({ searchParams }) {
  const resolvedParams = await searchParams;

  let ids = [];
  if (resolvedParams?.ids) {
    ids = String(resolvedParams.ids).split(',').filter(Boolean);
  } else if (resolvedParams?.q) {
    ids = String(resolvedParams.q).split(',').filter(Boolean);
  }

  let compareList = [];
  if (ids.length > 0) {
    compareList = await getDevicesByIds(ids);
  }

  if (!compareList || compareList.length === 0) {
    return <EmptyState />;
  }

  // Dynamic grid column class based on number of devices
  const gridColsClass = compareList.length === 1
    ? "grid-cols-2"
    : compareList.length === 2
      ? "grid-cols-3"
      : "grid-cols-4";

  const comparisonTitle = compareList?.map(d => d.name).join(' vs ');

  return (
    <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative flex-1">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* MAIN CONTENT AREA (3 Cols) */}
        <div className="lg:col-span-8">
          <ComparisonBreadcrumb title={comparisonTitle} />

          <div className="flex flex-col gap-6">
            <ComparisonHeader
              compareList={compareList}
              gridColsClass={gridColsClass}
            />
            <ComparisonBody
              compareList={compareList}
              gridColsClass={gridColsClass}
            />
          </div>
        </div>

        {/* RIGHT SIDEBAR (1 Col) */}
        <RightSidebar />
      </div>
    </div>
  );
}
