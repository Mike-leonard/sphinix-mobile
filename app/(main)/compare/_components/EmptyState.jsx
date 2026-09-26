'use client';

import React, { useEffect, useState } from 'react';
import { Smartphone, ArrowLeftRight, TrendingUp, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCompare } from '@/context/CompareContext';
import { useRouter } from 'next/navigation';
import CompareLoading from '@/components/skeletons/CompareLoading';
import { buildComparisonSlug } from '@/lib/devices/comparison-helpers';
import { getDeviceFirstImage, getDeviceImageAlt } from '@/lib/utils';

export default function EmptyState({ popularComparisons = [] }) {
  const { compareList } = useCompare();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (compareList && compareList.length > 0) {
      setIsRedirecting(true);
      const slug = buildComparisonSlug(compareList.map(item => item.id));
      if (slug) {
        router.replace(`/compare/${slug}`);
      }
    }
  }, [compareList, router]);

  if (isRedirecting || (compareList && compareList.length > 0)) {
    return <CompareLoading />;
  }

  return (
    <div className="flex-1 flex flex-col py-10 px-4 max-w-[1400px] w-full mx-auto">
      {/* Hero Welcome / Intro */}
      <div className="flex flex-col items-center justify-center text-center py-10 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/60 dark:to-slate-900/20 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm mb-12">
        <div className="bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/50 p-4 rounded-2xl mb-5 text-brand-600 dark:text-brand-400">
          <Smartphone className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
          Compare Smartphones Side-by-Side
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 text-center max-w-xl mb-6 leading-relaxed">
          Select any smartphones to contrast displays, processor benchmarks, camera systems, battery endurance, and live prices side-by-side.
        </p>
        <Link 
          href="/phones" 
          className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-sm"
        >
          <Sparkles className="w-4 h-4" />
          Browse Phones to Compare
        </Link>
      </div>

      {/* Trending / Popular Comparisons Grid */}
      {popularComparisons && popularComparisons.length > 0 && (
        <section className="w-full">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-orange-500/10 text-orange-500 dark:text-orange-400">
                <TrendingUp className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  Trending Smartphone Comparisons
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Most viewed head-to-head smartphone matchups
                </p>
              </div>
            </div>
            <Link
              href="/phones"
              className="text-xs sm:text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              All Phones &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {popularComparisons.map((pair) => {
              const { slug, deviceA, deviceB } = pair;
              const imgA = getDeviceFirstImage(deviceA);
              const altA = getDeviceImageAlt(deviceA);
              const imgB = getDeviceFirstImage(deviceB);
              const altB = getDeviceImageAlt(deviceB);

              return (
                <Link
                  key={slug}
                  href={`/compare/${slug}`}
                  className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500/60 dark:hover:border-brand-500/60 shadow-sm hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300 overflow-hidden"
                  title={`Compare ${deviceA.name} vs ${deviceB.name}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  {/* Device Pair Side-by-Side Visual */}
                  <div className="flex items-center justify-between gap-3 relative z-10">
                    {/* Device A */}
                    <div className="flex-1 flex flex-col items-center text-center min-w-0">
                      <div className="w-16 h-20 sm:w-20 sm:h-24 relative flex items-center justify-center mb-2">
                        {imgA ? (
                          <Image
                            src={imgA}
                            alt={altA}
                            fill
                            sizes="80px"
                            className="object-contain group-hover:scale-105 transition-transform duration-300"
                            unoptimized={typeof imgA === 'string' && imgA.startsWith('data:')}
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-[10px] text-slate-400">
                            {deviceA.brand || deviceA.brandName}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate w-full">
                        {deviceA.brand || deviceA.brandName}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate w-full mt-0.5">
                        {deviceA.name}
                      </h3>
                      {deviceA.price && (
                        <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 mt-1">
                          {deviceA.price}
                        </span>
                      )}
                    </div>

                    {/* VS Badge */}
                    <div className="flex flex-col items-center justify-center px-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-purple-600 text-white font-black text-[11px] flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-110 transition-transform">
                        VS
                      </div>
                      <span className="text-[9px] font-semibold text-slate-400 mt-1">SPECS</span>
                    </div>

                    {/* Device B */}
                    <div className="flex-1 flex flex-col items-center text-center min-w-0">
                      <div className="w-16 h-20 sm:w-20 sm:h-24 relative flex items-center justify-center mb-2">
                        {imgB ? (
                          <Image
                            src={imgB}
                            alt={altB}
                            fill
                            sizes="80px"
                            className="object-contain group-hover:scale-105 transition-transform duration-300"
                            unoptimized={typeof imgB === 'string' && imgB.startsWith('data:')}
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-[10px] text-slate-400">
                            {deviceB.brand || deviceB.brandName}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate w-full">
                        {deviceB.brand || deviceB.brandName}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate w-full mt-0.5">
                        {deviceB.name}
                      </h3>
                      {deviceB.price && (
                        <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 mt-1">
                          {deviceB.price}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-brand-600 dark:text-brand-400 group-hover:text-brand-500 transition-colors">
                    <span className="flex items-center gap-1.5">
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      View Full Comparison
                    </span>
                    <span className="text-slate-400 group-hover:translate-x-1 transition-transform">
                      &rarr;
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
