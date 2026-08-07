import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { getDeviceViewMode } from '@/actions/devices';

export default async function PhonesLoading() {
  const viewMode = await getDeviceViewMode();

  return (
    <div className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* MAIN CONTENT AREA */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Controls Bar Shimmer (Display mode toggle & dropdowns) */}
          <div className="flex items-center justify-between bg-white dark:bg-[#1a2035] p-3 rounded-lg border border-slate-200 dark:border-slate-800 mb-6">
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-32 rounded-md" />
              <Skeleton className="h-9 w-28 rounded-md" />
            </div>
          </div>

          {/* DYNAMIC PRODUCTS SHIMMER (Grid vs List Layout) */}
          {viewMode === 'grid' ? (
            /* 3-Column Grid Shimmer Layout */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 bg-white dark:bg-slate-900/50">
                  <Skeleton className="w-full h-48 rounded-xl" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Full-Width Horizontal List Shimmer Layout */
            <div className="flex flex-col gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-6 items-center bg-white dark:bg-slate-900/50">
                  <Skeleton className="w-full sm:w-40 h-40 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-3 w-full">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Shimmer */}
          <div className="mt-8 flex justify-center">
            <Skeleton className="h-10 w-64 rounded-xl" />
          </div>

        </div>

        {/* RIGHT SIDEBAR SHIMMER */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Search Box Shimmer */}
          <Skeleton className="h-12 w-full rounded-2xl" />
          
          {/* Advanced Filters Box Shimmer */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-6">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>

          {/* Trending Articles Shimmer */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-4">
            <Skeleton className="h-6 w-36" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              ))}
            </div>
          </div>

          {/* Top Rated Widget Shimmer */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-4">
            <Skeleton className="h-6 w-28" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <Skeleton className="w-14 h-14 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Brands Chips Shimmer */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-xl" />
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
