import React from 'react';

export default function DeviceSpecBlock({ icon: Icon, label, value }) {
  return (
    <div className="relative flex items-stretch overflow-hidden rounded-md border border-slate-200 dark:border-brand-500/20 bg-slate-100 dark:bg-slate-900/40 text-slate-800 dark:text-white cursor-default group transition-all duration-300 before:absolute before:inset-0 before:bg-brand-600 dark:before:bg-brand-600/90 before:-translate-x-full hover:before:translate-x-0 before:transition-transform before:duration-500 before:ease-out">
      <div className="relative z-10 p-3 flex items-center justify-center w-12 shrink-0 border-r border-slate-200 dark:border-brand-500/20 bg-brand-600 text-white dark:bg-brand-600/20 group-hover:bg-transparent group-hover:text-white dark:group-hover:text-white transition-colors duration-300">
        <Icon className="w-5 h-5" />
      </div>
      <div className="relative z-10 px-4 py-3 flex-1 text-sm flex items-center group-hover:text-white transition-colors duration-300">
        <span className="font-bold mr-1">{label}:</span> {value}
      </div>
    </div>
  );
}
