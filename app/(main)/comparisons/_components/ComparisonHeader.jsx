
import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function ComparisonHeader({ compareList, gridColsClass, handleToggleCompare }) {
  return (
    <div className={`sticky top-[64px] z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200 dark:border-slate-800 grid ${gridColsClass} divide-x divide-slate-200 dark:divide-slate-800 rounded-2xl shadow-sm`}>
      {/* Empty first cell for the 'labels' column */}
      <div className="p-2 md:p-6 flex items-center justify-center text-center">
        <span className="text-[9px] md:text-sm font-bold md:font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider md:tracking-widest">Specs</span>
      </div>

      {/* Device Columns */}
      {compareList.map((device) => (
        <div key={device.id} className="p-4 md:p-6 relative group text-center flex flex-col items-center">
          <Button variant="none" size="none" style={{fontSize: "var(--font-size-button-default, var(--font-size-button-default))"}}  
            onClick={() => handleToggleCompare(device)}
            className="absolute top-2 right-2 md:top-4 md:right-4 p-1.5 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-500/40 transition-colors opacity-0 group-hover:opacity-100"
            title="Remove from comparison"
          >
            <X className="w-4 h-4" />
          </Button>
          
          <div className={`w-16 h-20 md:w-24 md:h-28 rounded-lg bg-gradient-to-br ${device.imageColor || 'from-slate-200 to-slate-300'} mb-4 shadow-inner flex items-center justify-center`}>
            <span className="text-white/50 text-xs font-bold uppercase tracking-widest">{device.brand}</span>
          </div>
          
          <h3  style={{fontSize: "var(--font-size-h3-default, var(--font-size-h3-default))"}} className="font-extrabold text-sm md:text-lg text-slate-900 dark:text-white leading-tight mb-1">{device.name}</h3>
          <p  style={{fontSize: "var(--font-size-p-subtitle, var(--font-size-p-default))"}} className="text-xs md:text-sm font-bold text-brand-600 dark:text-brand-400">{device.price}</p>
        </div>
      ))}
    </div>
  );
}
