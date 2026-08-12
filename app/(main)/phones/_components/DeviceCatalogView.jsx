'use client';

import React, { useState, useTransition, useEffect } from 'react';
import SortingControl from './SortingControl';
import DeviceGrid from './DeviceGrid';
import { Skeleton } from '@/components/ui/skeleton';
import { setDeviceViewMode } from '@/actions/devices';
import { useRouter } from 'next/navigation';

function ViewModeShimmer({ mode }) {
  if (mode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-150">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 bg-white dark:bg-slate-900/50 shadow-sm">
            <Skeleton className="w-full h-48 rounded-xl bg-slate-200 dark:bg-slate-800" />
            <Skeleton className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800" />
            <Skeleton className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
              <Skeleton className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-150">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex flex-col sm:flex-row gap-6 shadow-sm">
          <Skeleton className="w-full sm:w-1/3 h-44 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="flex justify-between items-start">
              <Skeleton className="h-6 w-1/2 bg-slate-200 dark:bg-slate-800" />
              <Skeleton className="h-6 w-12 rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>
            <Skeleton className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800" />
            <Skeleton className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800" />
            <Skeleton className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800" />
            <div className="pt-4 flex justify-between items-center">
              <Skeleton className="h-5 w-24 bg-slate-200 dark:bg-slate-800" />
              <Skeleton className="h-8 w-28 rounded-lg bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DeviceCatalogView({
  devices = [],
  initialViewMode = 'grid',
  selectedBrand = 'All',
  BRANDS = [],
  filtersData = [],
  deviceCardSpecLimit = 3,
  freq = 6
}) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState(initialViewMode);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setViewMode(initialViewMode);
  }, [initialViewMode]);

  const handleViewModeToggle = (newMode) => {
    if (newMode === viewMode && !isPending) return;
    setViewMode(newMode);
    startTransition(async () => {
      await setDeviceViewMode(newMode);
      router.refresh();
    });
  };

  return (
    <>
      {/* Controls Bar */}
      <SortingControl
        selectedBrand={selectedBrand}
        BRANDS={BRANDS}
        filters={filtersData}
        viewMode={viewMode}
        onViewModeToggle={handleViewModeToggle}
        isPending={isPending}
      />

      {/* Products Grid or List with Shimmer Transition */}
      {isPending ? (
        <ViewModeShimmer mode={viewMode} />
      ) : (
        <DeviceGrid
          currentProducts={devices}
          viewMode={viewMode}
          deviceCardSpecLimit={deviceCardSpecLimit}
          freq={freq}
        />
      )}
    </>
  );
}
