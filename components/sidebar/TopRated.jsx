import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getTopRatedDevices } from '@/actions/devices';
import { getDeviceFirstImage, getDeviceImageAlt } from '@/lib/utils';

export default async function TopRated({ topRated: propTopRated, limit = 3 }) {
  let devices = propTopRated;

  if (!devices || devices.length === 0) {
    devices = await getTopRatedDevices(limit);
  }

  if (!devices || devices.length === 0) return null;

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
      <h3 style={{fontSize: "var(--font-size-h3-section, var(--font-size-h3-default))"}} className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Top Rated</h3>

      <div className="space-y-3">
        {devices.slice(0, limit).map(prod => {
          const firstImage = getDeviceFirstImage(prod);
          const imageAlt = getDeviceImageAlt(prod);

          return (
            <Link
              key={prod.id}
              href={`/phones?q=${encodeURIComponent(prod.name)}`}
              className="flex gap-4 items-center bg-slate-100/80 dark:bg-slate-950/40 p-2.5 rounded-xl border border-slate-300 dark:border-slate-850/60 hover:border-brand-500/20 cursor-pointer transition-colors"
            >
              <div className="relative w-12 h-14 bg-slate-50 dark:bg-slate-950 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 p-1">
                <div className="absolute w-6 h-6 rounded-full bg-gradient-to-tr from-brand-500 to-purple-600 opacity-20 blur-lg"></div>
                {firstImage ? (
                  <Image
                    src={firstImage}
                    alt={imageAlt}
                    fill
                    sizes="48px"
                    className="object-contain drop-shadow-sm"
                    unoptimized={typeof firstImage === 'string' && firstImage.startsWith('data:')}
                  />
                ) : (
                  <div className="w-5 h-9 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded flex flex-col justify-end p-0.5">
                    <div className="flex-1 rounded bg-gradient-to-br from-brand-500 to-purple-600" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-brand-400 font-extrabold uppercase tracking-wide block">{prod.brand}</span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate leading-tight">{prod.name}</h4>
                <div className="flex gap-1 items-center mt-1">
                  <span className="text-[10px] text-yellow-500">★ {prod.rating}</span>
                  <span className="text-[9px] text-slate-500 font-medium">({(prod.rating * 10).toFixed(0)} votes)</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-slate-900 dark:text-white block">{prod.price}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}