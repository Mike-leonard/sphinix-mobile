import React from 'react';
import ProductCard from '@/app/(main)/_components/_cards/ProductCard';

export default function RelatedDevices({ relatedDevices = [] }) {
  if (!relatedDevices || relatedDevices.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 style={{fontSize: "var(--font-size-h2-default, var(--font-size-h2-default))"}} className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="w-2 h-6 bg-brand-500 rounded-full inline-block"></span>
          Related Devices
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedDevices.map((device) => (
          <ProductCard
            key={device.id}
            product={device}
          />
        ))}
      </div>
    </div>
  );
}
