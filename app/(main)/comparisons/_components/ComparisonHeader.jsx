import React from 'react';
import { X } from 'lucide-react';

export default function ComparisonHeader({ compareList, gridColsClass, handleToggleCompare }) {
  return (
    <div className={`sticky top-[64px] z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 grid ${gridColsClass} divide-x divide-slate-200 dark:divide-slate-800 rounded-t-2xl shadow-sm`}>
      {/* Empty first cell for the 'labels' column */}
      <div className="p-4 md:p-6 flex items-center justify-center">
        <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Specifications</span>
      </div>

      {/* Device Columns */}
      {compareList.map((device) => (
        <div key={device.id} className="p-4 md:p-6 relative group text-center flex flex-col items-center">
          <button 
            onClick={() => handleToggleCompare(device)}
            className="absolute top-2 right-2 md:top-4 md:right-4 p-1.5 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-500/40 transition-colors opacity-0 group-hover:opacity-100"
            title="Remove from comparison"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className={`w-16 h-20 md:w-24 md:h-28 rounded-lg bg-gradient-to-br ${device.imageColor || 'from-slate-200 to-slate-300'} mb-4 shadow-inner flex items-center justify-center`}>
            <span className="text-white/50 text-xs font-bold uppercase tracking-widest">{device.brand}</span>
          </div>
          
          <h3 className="font-extrabold text-sm md:text-lg text-slate-900 dark:text-white leading-tight mb-1">{device.name}</h3>
          <p className="text-xs md:text-sm font-bold text-brand-600 dark:text-brand-400">{device.price}</p>
        </div>
      ))}
    </div>
  );
}
