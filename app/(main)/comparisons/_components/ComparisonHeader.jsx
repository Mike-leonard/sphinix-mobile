'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useCompare } from '@/context/CompareContext';
import { useRouter } from 'next/navigation';

import Image from 'next/image';
import { getDeviceFirstImage, getDeviceImageAlt } from '@/lib/utils';

export default function ComparisonHeader({ compareList, gridColsClass, handleToggleCompare: propHandleToggleCompare }) {
  const { handleToggleCompare: contextToggle } = useCompare();
  const router = useRouter();

  const handleRemove = (device) => {
    if (propHandleToggleCompare) {
      propHandleToggleCompare(device);
    } else {
      if (contextToggle) contextToggle(device);
      const remaining = compareList.filter(d => d.id !== device.id);
      const ids = remaining.map(d => d.id).join(',');
      router.push(ids ? `/comparisons?ids=${ids}` : '/comparisons');
    }
  };

  return (
    <div className={`sticky top-[64px] z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200 dark:border-slate-800 grid ${gridColsClass} divide-x divide-slate-200 dark:divide-slate-800 rounded-2xl shadow-sm`}>
      {/* Empty first cell for the 'labels' column */}
      <div className="p-2 md:p-6 flex items-center justify-center text-center">
        <span className="text-[9px] md:text-sm font-bold md:font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider md:tracking-widest">Specs</span>
      </div>

      {/* Device Columns */}
      {compareList.map((device) => {
        const firstImage = getDeviceFirstImage(device);
        const imageAlt = getDeviceImageAlt(device);

        return (
          <div key={device.id} className="p-4 md:p-6 relative group text-center flex flex-col items-center">
            <Button variant="none" size="none" style={{fontSize: "var(--font-size-button-default, var(--font-size-button-default))"}}  
              onClick={() => handleRemove(device)}
              className="absolute top-2 right-2 md:top-4 md:right-4 p-1.5 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-500/40 transition-colors opacity-0 group-hover:opacity-100 z-10"
              title="Remove from comparison"
            >
              <X className="w-4 h-4" />
            </Button>
            
            <div className={`relative w-20 h-24 md:w-28 md:h-36 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 mb-4 flex items-center justify-center p-2 overflow-hidden shadow-sm`}>
              <div className="absolute w-16 h-16 rounded-full bg-gradient-to-tr from-brand-500 to-purple-600 opacity-20 blur-xl"></div>
              {firstImage ? (
                <Image
                  src={firstImage}
                  alt={imageAlt}
                  fill
                  priority
                  sizes="(max-width: 768px) 80px, 112px"
                  className="object-contain drop-shadow-sm transition-transform group-hover:scale-105"
                  unoptimized={typeof firstImage === 'string' && firstImage.startsWith('data:')}
                />
              ) : (
                <span className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">{device.brand}</span>
              )}
            </div>
            
            <h3 style={{fontSize: "var(--font-size-h3-default, var(--font-size-h3-default))"}} className="font-extrabold text-sm md:text-lg text-slate-900 dark:text-white leading-tight mb-1">{device.name}</h3>
            <p style={{fontSize: "var(--font-size-p-subtitle, var(--font-size-p-default))"}} className="text-xs md:text-sm font-bold text-brand-600 dark:text-brand-400">{device.price}</p>
          </div>
        );
      })}
    </div>
  );
}
