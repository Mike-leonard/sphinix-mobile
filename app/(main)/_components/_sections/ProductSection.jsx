import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/app/(main)/_components/_cards/ProductCard';
import InFeedAd from '@/components/ads/InFeedAd';
import { publishedDevices } from '@/actions/devices';
import { getSettings } from '@/actions/settings';

export default async function ProductSection({
  limit = 8,
  isHomePage = false
}) {
  const [settings, devices] = await Promise.all([
    getSettings(),
    publishedDevices({ limit })
  ]);

  const freq = isHomePage 
    ? (settings?.advertisements?.injectionFrequency?.homePagePhones || 6)
    : (settings?.advertisements?.injectionFrequency?.phonesPageGrid || 6);

  const deviceCardSpecLimit = isHomePage 
    ? (settings?.appearance?.home?.deviceCardSpecLimit || 3) 
    : (settings?.appearance?.devices?.deviceCardSpecLimit || 3);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ fontSize: "var(--font-size-h2-section, var(--font-size-h2-default))" }} className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Latest Products</h2>
          <p style={{ fontSize: "var(--font-size-p-subtitle, var(--font-size-p-default))" }} className="text-xs text-slate-600 dark:text-slate-400">Showing {devices.length} devices</p>
        </div>
      </div>
      {devices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center text-slate-600 dark:text-slate-400">
          <svg className="w-12 h-12 mx-auto mb-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p style={{ fontSize: "var(--font-size-p-default, var(--font-size-p-default))" }} className="font-semibold text-lg text-slate-700 dark:text-slate-300">No products found</p>
          <p style={{ fontSize: "var(--font-size-p-subtitle, var(--font-size-p-default))" }} className="text-sm mt-1">Check back later for new arrivals.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {devices.map((device, index) => (
              <React.Fragment key={device.id}>
                {index > 0 && index % freq === 0 && (
                  <div className="col-span-full w-full py-2">
                    <InFeedAd placement="homePageInFeed" />
                  </div>
                )}
                <ProductCard
                  product={device}
                  limit={deviceCardSpecLimit}
                />
              </React.Fragment>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <Link
              href="/phones"
              style={{ fontSize: "var(--font-size-link-inline, var(--font-size-link-default))" }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-slate-900 dark:text-white font-bold hover:bg-brand-100 dark:hover:bg-brand-500/20 hover:text-brand-600 dark:hover:text-brand-400 transition-colors border border-brand-200 dark:border-brand-500/30"
            >
              View All Phones
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </>
      )}
    </section>
  );
}