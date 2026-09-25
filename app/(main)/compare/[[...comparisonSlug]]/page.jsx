import React from 'react';
import { redirect, permanentRedirect } from 'next/navigation';
import { getSettings } from '@/actions/settings';
import { getPublishedDevicesByIds, publishedDevices } from '@/actions/devices';
import { rawOrigin } from '@/lib/utils';
import { buildComparisonSlug, parseComparisonSlug, generateComparisonPairs } from '@/lib/devices/comparison-helpers';
import EmptyState from '../_components/EmptyState';
import ComparisonHeader from '../_components/ComparisonHeader';
import ComparisonBody from '../_components/ComparisonBody';
import ComparisonBreadcrumb from '../_components/ComparisonBreadcrumb';
import RightSidebar from '@/components/sidebar/RightSidebar';

/**
 * Dynamic SEO Metadata for Device Comparisons
 */
export async function generateMetadata({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const settings = await getSettings();

  const rawSlug = resolvedParams?.comparisonSlug ? resolvedParams.comparisonSlug.join('/') : '';
  let ids = parseComparisonSlug(rawSlug);

  // Fallback to legacy query parameters if no slug provided
  if (ids.length === 0 && resolvedSearchParams?.ids) {
    ids = String(resolvedSearchParams.ids).split(',').filter(Boolean);
  }

  const baseTitle = settings?.seo?.comparisons?.title || "Compare Smartphones & Specifications | Sphinix Mobile";
  const baseDesc = settings?.seo?.comparisons?.description || "Compare mobile phone specifications side by side. Contrast displays, processors, cameras, battery life, and prices.";
  const baseKeywords = settings?.seo?.comparisons?.keywords
    ? settings.seo.comparisons.keywords.split(',').map(k => k.trim()).filter(Boolean)
    : ["compare phones", "smartphone comparison", "mobile specs comparison"];

  if (ids.length === 0) {
    return {
      title: baseTitle,
      description: baseDesc,
      keywords: baseKeywords,
      alternates: {
        canonical: `${rawOrigin}/compare`,
      },
      openGraph: {
        title: settings?.seo?.comparisons?.ogTitle || baseTitle,
        description: settings?.seo?.comparisons?.ogDescription || baseDesc,
        images: settings?.seo?.comparisons?.ogImage ? [{ url: settings.seo.comparisons.ogImage }] : []
      }
    };
  }

  const devices = await getPublishedDevicesByIds(ids);
  if (!devices || devices.length === 0) {
    return {
      title: baseTitle,
      description: baseDesc,
      keywords: baseKeywords,
      alternates: {
        canonical: `${rawOrigin}/compare`,
      },
    };
  }

  const canonicalSlug = buildComparisonSlug(devices.map(d => d.id));
  const comparisonNames = devices.map(d => d.name).join(' vs ');

  // Dynamic SEO Page Title & Description
  const pageTitle = `${comparisonNames} - Full Comparison & Specs Differences | Sphinix Mobile`;
  const pageDesc = `Compare ${comparisonNames} side-by-side. Detailed breakdown of display brightness, cameras, processor performance, battery life, and pricing.`;

  const deviceKeywords = devices.flatMap(d => [d.name, d.brand, `${d.name} specs`, `${d.name} price`]);
  const combinedKeywords = Array.from(new Set([...deviceKeywords, ...baseKeywords, `${comparisonNames} comparison`]));

  const ogImage = settings?.seo?.comparisons?.ogImage
    ? settings.seo.comparisons.ogImage
    : (devices[0]?.image || '');

  const canonicalUrl = `${rawOrigin}/compare/${encodeURIComponent(canonicalSlug)}`;

  return {
    title: pageTitle,
    description: pageDesc,
    keywords: combinedKeywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: canonicalUrl,
      images: ogImage ? [{ url: ogImage }] : []
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDesc,
    }
  };
}

export default async function ComparePage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const rawSlug = resolvedParams?.comparisonSlug ? resolvedParams.comparisonSlug.join('/') : '';
  let ids = parseComparisonSlug(rawSlug);

  // If query parameters are used on /compare?ids=a,b, redirect to clean slug
  if (ids.length === 0 && resolvedSearchParams?.ids) {
    const queryIds = String(resolvedSearchParams.ids).split(',').filter(Boolean);
    const cleanSlug = buildComparisonSlug(queryIds);
    if (cleanSlug) {
      redirect(`/compare/${cleanSlug}`);
    }
  }

  let compareList = [];
  if (ids.length > 0) {
    compareList = await getPublishedDevicesByIds(ids);
  }

  // Canonical redirect: If the devices are not in canonical alphabetical order, redirect to canonical slug
  if (compareList.length > 1) {
    const canonicalSlug = buildComparisonSlug(compareList.map(d => d.id));
    if (rawSlug && rawSlug !== canonicalSlug) {
      permanentRedirect(`/compare/${canonicalSlug}`);
    }
  }

  if (!compareList || compareList.length === 0) {
    const popularCandidates = await publishedDevices({ limit: 12 });
    const popularComparisons = generateComparisonPairs(popularCandidates || [], 6);
    return <EmptyState popularComparisons={popularComparisons} />;
  }

  // Dynamic grid column class based on number of devices
  const gridColsClass = compareList.length === 1
    ? "grid-cols-2"
    : compareList.length === 2
      ? "grid-cols-3"
      : "grid-cols-4";

  const comparisonTitle = compareList.map(d => d.name).join(' vs ');
  const canonicalSlug = buildComparisonSlug(compareList.map(d => d.id));

  // Structured JSON-LD schema for Google Rich Results
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${comparisonTitle} Comparison`,
    description: `Side-by-side comparison of ${comparisonTitle} specifications and features.`,
    url: `${rawOrigin}/compare/${encodeURIComponent(canonicalSlug)}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: compareList.map((device, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: device.name,
        url: `${rawOrigin}/phones/${encodeURIComponent(device.brand?.toLowerCase() || 'phone')}/${device.id}`
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative flex-1">
        <h1 className="sr-only">{comparisonTitle} Comparison & Technical Specifications</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* MAIN CONTENT AREA */}
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

          {/* RIGHT SIDEBAR */}
          <RightSidebar />
        </div>
      </div>
    </>
  );
}
