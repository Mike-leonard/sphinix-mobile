import React from 'react';
import { ANGLES } from './constants';
import { Button } from "@/components/ui/button";

export default function GalleryThumbnails({ device, activeIndex, setActiveIndex }) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4">
      {ANGLES.map((angle, idx) => (
        <Button variant="none" size="none" style={{fontSize: "var(--font-size-button-default, var(--font-size-button-default))"}}  
          key={idx}
          onClick={() => setActiveIndex(idx)}
          className={`w-full aspect-square rounded-xl border-2 transition-all flex flex-col items-center justify-center bg-white dark:bg-slate-950 overflow-hidden relative shadow-sm ${activeIndex === idx ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-slate-200 dark:border-slate-700 hover:border-brand-300'}`}
        >
          {/* Small phone preview inside thumbnail */}
          {device.images && device.images[idx] ? (
            <div className="w-10 h-12 mb-2 flex items-center justify-center">
              <img 
                src={device.images[idx]} 
                alt={`${device.brand} ${device.name} - ${angle.label} thumbnail`}
                className={`max-w-full max-h-full object-contain ${angle.scale}`}
              />
            </div>
          ) : (
            <div className={`w-8 h-12 rounded border border-slate-300 dark:border-slate-600 bg-gradient-to-br ${device.imageColor} mb-2 shadow-sm ${angle.scale}`}></div>
          )}
          <span className={`relative text-[9px] font-bold text-center px-1 leading-tight ${activeIndex === idx ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500 dark:text-slate-400'}`}>
            {angle.label}
          </span>
        </Button>
      ))}
    </div>
  );
}
