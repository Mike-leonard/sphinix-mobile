import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export default function ComparisonsLoading() {
  return (
    <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative flex-1 animate-in fade-in duration-200">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* MAIN CONTENT AREA */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Breadcrumb Shimmer */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <Skeleton className="h-4 w-24" />
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <Skeleton className="h-4 w-40" />
          </div>

          {/* Comparison Header Cards Shimmer (2 Column Comparison Grid) */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-6">
            <Skeleton className="h-8 w-64" />

            <div className="grid grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
              {/* Specs Label Col */}
              <div className="space-y-4 justify-center flex flex-col">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>

              {/* Device 1 Shimmer */}
              <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center space-y-3">
                <Skeleton className="w-28 h-36 rounded-xl" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>

              {/* Device 2 Shimmer */}
              <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center space-y-3">
                <Skeleton className="w-28 h-36 rounded-xl" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
          </div>

          {/* Comparison Body Specs Table Shimmer */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-20" />
            </div>

            {/* Spec Spec Row Shimmers */}
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="grid grid-cols-3 gap-4 py-3 border-b border-slate-50 dark:border-slate-800/50 items-center">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT SIDEBAR SHIMMER */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Search Box Shimmer */}
          <Skeleton className="h-12 w-full rounded-2xl" />

          {/* New Arrivals Widget Shimmer */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <Skeleton className="w-14 h-14 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
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
