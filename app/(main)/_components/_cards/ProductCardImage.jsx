import React from 'react';
import Image from 'next/image';
import { getDeviceFirstImage, getDeviceImageAlt } from '@/lib/utils';

export default function ProductCardImage({ product, priority = false }) {
  const firstImage = getDeviceFirstImage(product);
  const imageAlt = getDeviceImageAlt(product);

  return (
    <div className="relative rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950 p-4 h-48 flex items-center justify-center group-hover:scale-[1.01] transition-transform duration-300">
      <div className="absolute w-32 h-32 rounded-full bg-gradient-to-tr from-brand-500 to-purple-600 opacity-20 blur-2xl"></div>
      
      {firstImage ? (
        <div className="relative w-full h-36 z-10">
          <Image
            src={firstImage}
            alt={imageAlt}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
            unoptimized={typeof firstImage === 'string' && firstImage.startsWith('data:')}
          />
        </div>
      ) : (
        /* SVG-based SmartPhone illustration fallback */
        <div className="relative w-24 h-40 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 shadow-md p-1.5 flex flex-col">
          <div className="w-8 h-2 bg-slate-50 dark:bg-slate-950 rounded-full mx-auto mb-1 border border-slate-200 dark:border-slate-800"></div>
          <div className="flex-1 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 p-2 flex flex-col justify-end text-[8px] font-bold text-white/80">
            <div>{product?.brand}</div>
            <div className="text-[10px] text-white truncate font-extrabold leading-tight">{product?.name}</div>
          </div>
        </div>
      )}

      {/* Badge */}
      {product?.brand && (
        <span className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 text-brand-600 dark:text-brand-400 border border-slate-200 dark:border-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm z-20">
          {product.brand}
        </span>
      )}

      {/* Rating badge */}
      {product?.rating !== undefined && (
        <span className="absolute top-3 right-3 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm z-20">
          ★ {product.rating}
        </span>
      )}
    </div>
  );
}
