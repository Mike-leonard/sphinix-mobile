import React from 'react';
import { ANGLES } from './constants';

export default function GalleryThumbnails({ device, activeIndex, setActiveIndex }) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4">
      {ANGLES.map((angle, idx) => (
        <button 
          key={idx}
          onClick={() => setActiveIndex(idx)}
          className={`w-full aspect-square rounded-xl border-2 transition-all flex flex-col items-center justify-center bg-white dark:bg-slate-950 overflow-hidden relative shadow-sm ${activeIndex === idx ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-slate-200 dark:border-slate-700 hover:border-brand-300'}`}
        >
          {/* Small phone preview inside thumbnail */}
          <div className={`w-8 h-12 rounded border border-slate-300 dark:border-slate-600 bg-gradient-to-br ${device.imageColor} mb-2 shadow-sm ${angle.scale}`}></div>
          <span className={`relative text-[9px] font-bold text-center px-1 leading-tight ${activeIndex === idx ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500 dark:text-slate-400'}`}>
            {angle.label}
          </span>
        </button>
      ))}
    </div>
  );
}
