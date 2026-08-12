import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { generateBrandSlug, getDeviceFirstImage, getDeviceImageAlt } from '@/lib/utils';
import DeviceListCardCompare from './DeviceListCardCompare';

export default function DeviceListCard({ product, isComparing, onToggleCompare, priority = false }) {
  const slug = product.id;
  const brandSlug = generateBrandSlug(product.brand || 'unknown');
  const deviceDetailUrl = `/phones/${brandSlug}/${slug}`;

  const firstImage = getDeviceFirstImage(product);
  const imageAlt = getDeviceImageAlt(product);

  return (
    <Card className="group rounded-2xl border-slate-200 dark:border-slate-800 hover:border-brand-500/40 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 flex flex-col sm:flex-row bg-white dark:bg-slate-900 overflow-hidden relative">
      
      {/* Left side: Image and visual showcase (Wrapped in Link for UX & SEO) */}
      <Link 
        href={deviceDetailUrl}
        aria-label={`View details for ${product.brand} ${product.name}`}
        className="w-full sm:w-1/3 min-h-[200px] p-4 sm:p-6 sm:border-r border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-center relative overflow-hidden group-hover:bg-slate-100 dark:group-hover:bg-slate-900/80 transition-colors block cursor-pointer shrink-0"
      >
        <div className={`absolute w-32 h-32 rounded-full bg-gradient-to-tr ${product.imageColor || 'from-brand-500 to-purple-500'} opacity-20 blur-2xl group-hover:scale-125 transition-transform duration-500`}></div>
        
        {firstImage ? (
          <div className="relative w-full h-44 z-10">
            <Image
              src={firstImage}
              alt={imageAlt}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
              unoptimized={typeof firstImage === 'string' && firstImage.startsWith('data:')}
            />
          </div>
        ) : (
          /* SVG-based SmartPhone illustration fallback */
          <div className="relative w-24 h-40 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 shadow-md p-1.5 flex flex-col group-hover:scale-105 transition-transform duration-300">
            <div className="w-8 h-2 bg-slate-50 dark:bg-slate-950 rounded-full mx-auto mb-1 border border-slate-200 dark:border-slate-800"></div>
            <div className={`flex-1 rounded-xl bg-gradient-to-br ${product.imageColor || 'from-brand-500 to-purple-500'} p-2 flex flex-col justify-end text-[8px] font-bold text-white/80`}>
              <div>{product.brand}</div>
              <div className="text-[10px] text-white truncate font-extrabold leading-tight">{product.name}</div>
            </div>
          </div>
        )}
      </Link>

      {/* Right side: Information and specs */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            {/* Device Name Header (Wrapped in Link for UX & SEO) */}
            <Link href={deviceDetailUrl} className="hover:underline">
              <h3 
                style={{fontSize: "var(--font-size-h3-section, var(--font-size-h3-default))"}} 
                className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors"
              >
                {product.name}
              </h3>
            </Link>

            <span className="bg-slate-600 dark:bg-slate-700 text-white text-sm font-bold px-3 py-1 rounded-full shadow-sm">
              {product.rating}
            </span>
          </div>

          <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-4">
            <p><strong className="text-slate-700 dark:text-slate-300">CPU:</strong> {product.specs?.chipset}</p>
            <p><strong className="text-slate-700 dark:text-slate-300">RAM:</strong> {product.specs?.ram}</p>
            <p><strong className="text-slate-700 dark:text-slate-300">Storage:</strong> {product.specs?.storage}</p>
            <p><strong className="text-slate-700 dark:text-slate-300">Display:</strong> {product.specs?.screen}</p>
            <p><strong className="text-slate-700 dark:text-slate-300">Camera:</strong> {product.specs?.camera}</p>
            <p><strong className="text-slate-700 dark:text-slate-300">OS:</strong> {product.specs?.os || 'Android'}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Link 
            href={deviceDetailUrl} 
            style={{fontSize: "var(--font-size-link-inline, var(--font-size-link-default))"}} 
            className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 text-sm font-semibold flex items-center gap-1 group/link"
          >
            View Details <span className="group-hover/link:translate-x-1 transition-transform">→</span>
          </Link>
          
          <DeviceListCardCompare 
            product={product} 
            isComparing={isComparing} 
            onToggleCompare={onToggleCompare} 
          />
        </div>
      </div>
      
    </Card>
  );
}
