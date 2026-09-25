import React from 'react';
import { getDeviceQuickSpecs } from '@/lib/devices/spec-normalizer';

export default function ProductCardSpecs({ specs, limit = 3 }) {
  const quick = getDeviceQuickSpecs(specs);

  const chipsetShort = quick.chipset ? quick.chipset.split(' ')[0] : '—';
  const displayParts = quick.screen ? quick.screen.split(' ') : [];
  const displayShort = displayParts.length > 0 ? displayParts.slice(0, 2).join(' ') : '—';
  const cameraShort = quick.camera ? `${quick.camera.split(' ')[0]} Primary` : '—';
  const ramShort = quick.ram || '—';

  const specItems = [
    (
      <div key="processor">
        <span className="text-slate-500 dark:text-slate-400 font-bold block uppercase text-[10px] tracking-wider mb-1">Processor</span> 
        <span className="inline-flex px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-md font-bold text-xs border border-slate-200 dark:border-slate-700/50 shadow-sm">{chipsetShort} <br/></span>
      </div>
    ),
    (
      <div key="display">
        <span className="text-slate-500 dark:text-slate-400 font-bold block uppercase text-[10px] tracking-wider mb-1">Display</span> 
        <span className="inline-flex px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-md font-bold text-xs border border-slate-200 dark:border-slate-700/50 shadow-sm">{displayShort}</span>
      </div>
    ),
    (
      <div key="camera" className="col-span-2">
        <span className="text-slate-500 dark:text-slate-400 font-bold block uppercase text-[10px] tracking-wider mb-1">Camera</span> 
        <span className="inline-flex px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-md font-bold text-xs border border-slate-200 dark:border-slate-700/50 shadow-sm">{cameraShort}</span>
      </div>
    ),
    (
      <div key="ram" className="col-span-2">
        <span className="text-slate-500 dark:text-slate-400 font-bold block uppercase text-[10px] tracking-wider mb-1">RAM</span> 
        <span className="inline-flex px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-md font-bold text-xs border border-slate-200 dark:border-slate-700/50 shadow-sm">{ramShort}</span>
      </div>
    )
  ];

  return (
    <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400 border-t border-b border-slate-200 dark:border-slate-800/60 py-4">
      {specItems.slice(0, limit)}
    </div>
  );
}
