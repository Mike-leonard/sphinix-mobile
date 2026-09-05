import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ANGLES } from './constants';
import { Button } from "@/components/ui/button";

export default function MainImageView({ device, activeIndex, handlePrevious, handleNext }) {
  const customAlt = Array.isArray(device.imageAlts)
    ? device.imageAlts[activeIndex]
    : typeof device.imageAlts === 'object' && device.imageAlts !== null
    ? device.imageAlts[activeIndex]
    : null;

  const altText =
    customAlt && customAlt.trim() !== ''
      ? customAlt.trim()
      : `${device.brand || ''} ${device.name || ''} - ${ANGLES[activeIndex]?.label || ''}`.trim();

  return (
    <div className="w-full h-96 sm:h-[28rem] rounded-2xl bg-white dark:bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-sm group">
      <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-brand-500 to-purple-600 opacity-20 blur-3xl transition-transform duration-700 pointer-events-none"></div>
      
      {/* Device Image or Simulated SVG Container */}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-6">
        {device.images && device.images[activeIndex] ? (
          <img 
            src={device.images[activeIndex]} 
            alt={altText}
            className={`w-auto h-auto max-w-[80%] max-h-[85%] object-contain drop-shadow-2xl transition-all duration-500 ${ANGLES[activeIndex]?.scale || ''}`}
          />
        ) : (
          <div className={`w-48 h-[22rem] rounded-[2.5rem] bg-white dark:bg-slate-900 border-[6px] border-slate-300 dark:border-slate-800 shadow-2xl p-2 flex flex-col transition-all duration-500 ${ANGLES[activeIndex]?.scale || ''}`}>
            <div className="w-16 h-2 bg-slate-200 dark:bg-slate-950 rounded-full mx-auto mb-3"></div>
            <div className="flex-1 rounded-3xl bg-gradient-to-br from-brand-500 to-purple-600 p-6 flex flex-col justify-end text-sm font-bold text-white/90">
              <div>{device.brand}</div>
              <div className="text-xl text-white font-extrabold leading-tight">{ANGLES[activeIndex]?.label}</div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Arrows (Rendered on top layer z-30) */}
      <Button 
        variant="none" 
        size="none" 
        onClick={handlePrevious}
        className="absolute left-2 sm:left-4 z-30 w-10 h-10 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-brand-500 dark:hover:text-brand-400 opacity-100 sm:opacity-80 hover:opacity-100 transition-all hover:scale-110 active:scale-95 cursor-pointer pointer-events-auto"
        title="Previous Image"
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>

      <Button 
        variant="none" 
        size="none" 
        onClick={handleNext}
        className="absolute right-2 sm:right-4 z-30 w-10 h-10 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-brand-500 dark:hover:text-brand-400 opacity-100 sm:opacity-80 hover:opacity-100 transition-all hover:scale-110 active:scale-95 cursor-pointer pointer-events-auto"
        title="Next Image"
      >
        <ChevronRight className="w-6 h-6" />
      </Button>
    </div>
  );
}
