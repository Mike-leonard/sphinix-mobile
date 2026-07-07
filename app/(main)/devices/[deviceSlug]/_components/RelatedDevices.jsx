import React, { useMemo } from 'react';
import ProductCard from '@/app/(main)/_components/_cards/ProductCard';
import MOCK_PRODUCTS from '@/data/products.json';
import { useCompare } from '@/context/CompareContext';

export default function RelatedDevices({ currentDevice }) {
  const { compareList, handleToggleCompare } = useCompare();

  const relatedDevices = useMemo(() => {
    // Filter out the current device
    const otherDevices = MOCK_PRODUCTS.filter(p => p.id !== currentDevice.id);
    
    // Find devices with the same brand first
    const sameBrand = otherDevices.filter(p => p.brand === currentDevice.brand);
    const differentBrand = otherDevices.filter(p => p.brand !== currentDevice.brand);
    
    // Take up to 3 devices (prioritizing same brand)
    return [...sameBrand, ...differentBrand].slice(0, 3);
  }, [currentDevice]);

  if (!relatedDevices || relatedDevices.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2  style={{fontSize: "var(--font-size-h2-default, var(--font-size-h2-default))"}} className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="w-2 h-6 bg-brand-500 rounded-full inline-block"></span>
          Related Devices
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedDevices.map((device) => (
          <ProductCard
            key={device.id}
            product={device}
            isComparing={compareList.some(item => item.id === device.id)}
            onToggleCompare={() => handleToggleCompare(device)}
          />
        ))}
      </div>
    </div>
  );
}
