import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ANGLES } from './constants';

export default function MainImageView({ device, activeIndex, handlePrevious, handleNext }) {
  return (
    <div className="w-full h-96 sm:h-[28rem] rounded-2xl bg-white dark:bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-sm group">
      <div className={`absolute w-72 h-72 rounded-full bg-gradient-to-tr ${device.imageColor} opacity-20 blur-3xl transition-transform duration-700`}></div>
      
      {/* Navigation Arrows */}
      <button 
        onClick={handlePrevious}
        className="absolute left-2 sm:left-4 z-10 w-10 h-10 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-slate-200 dark:border-slate-700 shadow flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-brand-500 dark:hover:text-brand-400 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:scale-110 active:scale-95"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button 
        onClick={handleNext}
        className="absolute right-2 sm:right-4 z-10 w-10 h-10 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-slate-200 dark:border-slate-700 shadow flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-brand-500 dark:hover:text-brand-400 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:scale-110 active:scale-95"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
      
      {/* SVG-based SmartPhone illustration (Simulated) */}
      <div className={`relative w-48 h-[22rem] rounded-[2.5rem] bg-white dark:bg-slate-900 border-[6px] border-slate-300 dark:border-slate-800 shadow-2xl p-2 flex flex-col transition-all duration-500 ${ANGLES[activeIndex].scale}`}>
        <div className="w-16 h-2 bg-slate-200 dark:bg-slate-950 rounded-full mx-auto mb-3"></div>
        <div className={`flex-1 rounded-3xl bg-gradient-to-br ${device.imageColor} p-6 flex flex-col justify-end text-sm font-bold text-white/90`}>
          <div>{device.brand}</div>
          <div className="text-xl text-white font-extrabold leading-tight">{ANGLES[activeIndex].label}</div>
        </div>
      </div>
    </div>
  );
}
