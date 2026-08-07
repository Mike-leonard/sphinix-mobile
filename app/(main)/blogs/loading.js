import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogsLoading() {
  return (
    <div className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* MAIN CONTENT AREA */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Blog Page Header Shimmer */}
          <div className="flex items-center justify-between bg-white dark:bg-[#1a2035] p-3 rounded-lg border border-slate-200 dark:border-slate-800 mb-6 min-h-[64px]">
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-3.5 w-60" />
            </div>
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>

          {/* Blog List Shimmer (6 Horizontal Cards) */}
          <div className="grid grid-cols-1 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Skeleton className="w-full sm:w-40 h-28 rounded-xl shrink-0" />
                <div className="flex-1 space-y-3 w-full">
                  <Skeleton className="h-4 w-20 rounded-full" />
                  <Skeleton className="h-6 w-5/6" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex items-center gap-3 pt-1">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Shimmer */}
          <div className="mt-8 flex justify-center">
            <Skeleton className="h-10 w-64 rounded-xl" />
          </div>

        </div>

        {/* RIGHT SIDEBAR SHIMMER */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Search Input Shimmer */}
          <Skeleton className="h-12 w-full rounded-2xl" />

          {/* Trending Articles Widget Shimmer */}
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

          {/* Blog Categories Widget Shimmer */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full rounded-xl" />
              ))}
            </div>
          </div>

          {/* Sticky Sidebar Ad Shimmer */}
          <div className="sticky top-24">
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>

        </div>

      </div>
    </div>
  );
}
