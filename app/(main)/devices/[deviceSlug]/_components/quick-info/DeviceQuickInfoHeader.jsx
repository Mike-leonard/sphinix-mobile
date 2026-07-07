import React from 'react';

export default function DeviceQuickInfoHeader({ device }) {
  return (
    <>
      <h1  style={{fontSize: "var(--font-size-h1-device, var(--font-size-h1-default))"}} className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight mb-2">
        {device.name}
      </h1>
      
      {/* Brand & Category Info */}
      <div className="space-y-1 mb-4 text-sm">
        <p  style={{fontSize: "var(--font-size-p-form, var(--font-size-p-default))"}} className="text-slate-500 dark:text-slate-400">
          Brand: <span className="text-brand-600 dark:text-brand-400 font-semibold">{device.brand}</span>
        </p>
        <p  style={{fontSize: "var(--font-size-p-form, var(--font-size-p-default))"}} className="text-slate-500 dark:text-slate-400">
          Price: <span className="text-brand-600 dark:text-brand-400 font-semibold">{device.price}</span>
        </p>
      </div>
    </>
  );
}
