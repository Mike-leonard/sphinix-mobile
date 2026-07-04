import React from 'react';

export default function ProductCardSpecs({ specs }) {
  return (
    <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400 border-t border-b border-slate-200 dark:border-slate-800/60 py-4">
      <div>
        <span className="text-slate-500 dark:text-slate-400 font-bold block uppercase text-[10px] tracking-wider mb-1">Processor</span> 
        <span className="inline-flex px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-md font-bold text-xs border border-slate-200 dark:border-slate-700/50 shadow-sm">{specs.chipset.split(' ')[0]} <br/></span>
      </div>
      <div>
        <span className="text-slate-500 dark:text-slate-400 font-bold block uppercase text-[10px] tracking-wider mb-1">Display</span> 
        <span className="inline-flex px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-md font-bold text-xs border border-slate-200 dark:border-slate-700/50 shadow-sm">{specs.screen.split(' ')[0]} {specs.screen.split(' ')[1]}</span>
      </div>
      <div className="col-span-2">
        <span className="text-slate-500 dark:text-slate-400 font-bold block uppercase text-[10px] tracking-wider mb-1">Camera</span> 
        <span className="inline-flex px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-md font-bold text-xs border border-slate-200 dark:border-slate-700/50 shadow-sm">{specs.camera.split(' ')[0]} Primary</span>
      </div>
    </div>
  );
}
