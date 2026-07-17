import React from 'react';
import InFeedAd from '@/components/ads/InFeedAd';
import ProductCard from '@/app/(main)/_components/_cards/ProductCard';
import DeviceListCard from '@/app/(main)/phones/_components/DeviceListCard';
import { useSettings } from '@/context/SettingsContext';

export default function DeviceGrid({ currentProducts, viewMode, compareList, handleToggleCompare }) {
  const settings = useSettings();
  const freq = settings?.advertisements?.injectionFrequency?.phonesPageGrid || 6;
  if (currentProducts.length === 0) {
    return (
      <div className="py-20 text-center text-slate-500 dark:text-slate-400">
        <p  style={{fontSize: "var(--font-size-p-default, var(--font-size-p-default))"}} className="text-xl font-bold mb-2">No devices found</p>
        <p>Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className={viewMode === 'grid'
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      : "flex flex-col gap-6"
    }>
      {currentProducts.map((product, index) => (
        <React.Fragment key={product.id}>
          {index > 0 && index % freq === 0 && (
            <div className="col-span-full w-full py-2">
              <InFeedAd placement="homePageInFeed" />
            </div>
          )}
          {viewMode === 'grid' ? (
            <ProductCard
              product={product}
              isComparing={compareList.some(item => item.id === product.id)}
              onToggleCompare={() => handleToggleCompare(product)}
            />
          ) : (
            <DeviceListCard
              product={product}
              isComparing={compareList.some(item => item.id === product.id)}
              onToggleCompare={() => handleToggleCompare(product)}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
