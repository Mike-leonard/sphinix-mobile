import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowLeftRight } from 'lucide-react';
import { getDeviceFirstImage, getDeviceImageAlt } from '@/lib/utils';

export default function DeviceComparisonsSection({ currentDevice, comparisons = [] }) {
  if (!comparisons || comparisons.length === 0) {
    return null;
  }

  const currentImg = getDeviceFirstImage(currentDevice);
  const currentAlt = getDeviceImageAlt(currentDevice);

  return (
    <section className="mt-14 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-6 bg-gradient-to-b from-brand-500 to-purple-600 rounded-full inline-block"></span>
            Popular Head-to-Head Comparisons
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Compare the {currentDevice.name} side-by-side with top market alternatives.
          </p>
        </div>
        <Link
          href="/compare"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors self-start sm:self-auto"
        >
          Compare any phone
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {comparisons.map(({ competitor, slug, url }) => {
          const competitorImg = getDeviceFirstImage(competitor);
          const competitorAlt = getDeviceImageAlt(competitor);

          return (
            <Link
              key={slug}
              href={url}
              className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 shadow-sm hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 overflow-hidden"
              title={`Compare ${currentDevice.name} vs ${competitor.name}`}
            >
              {/* Subtle gradient hover highlight */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              {/* Head-to-Head Visuals */}
              <div className="flex items-center justify-between gap-3 relative z-10">
                {/* Device 1 (Current) */}
                <div className="flex-1 flex flex-col items-center text-center min-w-0">
                  <div className="w-16 h-20 sm:w-20 sm:h-24 relative flex items-center justify-center mb-2">
                    {currentImg ? (
                      <Image
                        src={currentImg}
                        alt={currentAlt}
                        fill
                        sizes="80px"
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                        unoptimized={typeof currentImg === 'string' && currentImg.startsWith('data:')}
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-[10px] text-slate-400">
                        {currentDevice.brand}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate w-full">
                    {currentDevice.brand}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate w-full mt-0.5">
                    {currentDevice.name}
                  </h3>
                  {currentDevice.price && (
                    <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 mt-1">
                      {currentDevice.price}
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

                {/* Device 2 (Competitor) */}
                <div className="flex-1 flex flex-col items-center text-center min-w-0">
                  <div className="w-16 h-20 sm:w-20 sm:h-24 relative flex items-center justify-center mb-2">
                    {competitorImg ? (
                      <Image
                        src={competitorImg}
                        alt={competitorAlt}
                        fill
                        sizes="80px"
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                        unoptimized={typeof competitorImg === 'string' && competitorImg.startsWith('data:')}
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-[10px] text-slate-400">
                        {competitor.brand}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate w-full">
                    {competitor.brand}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate w-full mt-0.5">
                    {competitor.name}
                  </h3>
                  {competitor.price && (
                    <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 mt-1">
                      {competitor.price}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-brand-600 dark:text-brand-400 group-hover:text-brand-500 transition-colors">
                <span className="flex items-center gap-1.5">
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  Compare Differences
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
  );
}
