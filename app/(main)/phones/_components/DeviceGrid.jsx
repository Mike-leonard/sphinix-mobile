import React from 'react';
import InFeedAd from '@/components/ads/InFeedAd';
import ProductCard from '@/app/(main)/_components/_cards/ProductCard';
import DeviceListCard from '@/app/(main)/phones/_components/DeviceListCard';
import { getDeviceViewMode } from '@/actions/devices';
import { getSettings } from '@/actions/settings';

export default async function DeviceGrid({ currentProducts = [] }) {
  const [viewMode, settings] = await Promise.all([
    getDeviceViewMode(),
    getSettings()
  ]);

  const freq = settings?.advertisements?.injectionFrequency?.phonesPageGrid || 6;
  const deviceCardSpecLimit = settings?.appearance?.phones?.deviceCardSpecLimit ?? settings?.appearance?.devices?.deviceCardSpecLimit ?? 3;

  if (currentProducts.length === 0) {
    return (
      <div className="py-20 text-center text-slate-500 dark:text-slate-400">
        <p style={{fontSize: "var(--font-size-p-default, var(--font-size-p-default))"}} className="text-xl font-bold mb-2">No devices found</p>
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
              limit={deviceCardSpecLimit}
            />
          ) : (
            <DeviceListCard
              product={product}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
