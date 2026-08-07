import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export default function DeviceDetailLoading() {
  return (
    <div className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* MAIN CONTENT AREA */}
        <div className="lg:col-span-8 flex flex-col min-h-0 space-y-6">
          
          {/* Breadcrumb Shimmer */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <Skeleton className="h-4 w-20" />
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <Skeleton className="h-4 w-24" />
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <Skeleton className="h-4 w-36" />
          </div>

          {/* Top Section Card: Gallery (Left) + Quick Info (Right) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm mb-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              
              {/* Device Gallery Left Shimmer */}
              <div className="space-y-4">
                <Skeleton className="w-full h-80 rounded-2xl" />
                <div className="flex gap-3 justify-center">
                  <Skeleton className="w-16 h-16 rounded-xl" />
                  <Skeleton className="w-16 h-16 rounded-xl" />
                  <Skeleton className="w-16 h-16 rounded-xl" />
                  <Skeleton className="w-16 h-16 rounded-xl" />
                </div>
              </div>

              {/* Device Quick Info Right Shimmer */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-5 w-24 rounded-full" />
                </div>
                <Skeleton className="h-9 w-4/5" />
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-8 w-28 rounded-lg" />
                
                {/* 4 Quick Spec Boxes */}
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <Skeleton className="h-16 rounded-xl" />
                  <Skeleton className="h-16 rounded-xl" />
                  <Skeleton className="h-16 rounded-xl" />
                  <Skeleton className="h-16 rounded-xl" />
                </div>
              </div>

            </div>
          </div>

          {/* Tabbed Content Specs Table Shimmer */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6">
            <div className="flex gap-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-8 w-28" />
            </div>
            
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between py-3 border-b border-slate-50 dark:border-slate-800/50">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              ))}
            </div>
          </div>

          {/* Device Ad Banner Shimmer */}
          <Skeleton className="h-24 w-full rounded-2xl" />

          {/* Related Devices Grid Shimmer (3 Cards) */}
          <div className="space-y-4 pt-4">
            <Skeleton className="h-7 w-40" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900">
                  <Skeleton className="w-full h-36 rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT SIDEBAR SHIMMER */}
        <div className="lg:col-span-4 space-y-8">
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
