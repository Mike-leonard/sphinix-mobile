import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export default function MainLoading() {
  return (
    <div className="text-slate-800 dark:text-slate-100 animate-in fade-in duration-200">
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT COLUMN: Hero slider, Products Grid, Blogs */}
          <div className="lg:col-span-8 space-y-12">

            {/* TOP LEADERBOARD AD SHIMMER */}
            <div className="hidden sm:block w-full">
              <Skeleton className="h-24 w-full rounded-2xl" />
            </div>

            {/* HERO CAROUSEL SHIMMER */}
            <div className="w-full h-[320px] sm:h-[400px] rounded-3xl overflow-hidden relative">
              <Skeleton className="w-full h-full" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end space-y-4">
                <Skeleton className="h-6 w-32 bg-slate-300 dark:bg-slate-700" />
                <Skeleton className="h-10 w-3/4 max-w-md bg-slate-300 dark:bg-slate-700" />
                <Skeleton className="h-4 w-1/2 max-w-sm bg-slate-300 dark:bg-slate-700" />
              </div>
            </div>

            {/* LATEST PRODUCTS SECTION SHIMMER (4 Cards) */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>

              {/* 4 Product Cards Grid (Matching 2x2 layout on home page) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 bg-white dark:bg-slate-900/50">
                    <Skeleton className="w-full h-48 rounded-xl" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Phones Button Shimmer */}
              <div className="flex justify-center pt-4">
                <Skeleton className="h-12 w-48 rounded-xl" />
              </div>
            </div>

            {/* IN-FEED AD BANNER SHIMMER */}
            <div className="w-full">
              <Skeleton className="h-24 w-full rounded-2xl" />
            </div>

            {/* LATEST NEWS / BLOG SECTION SHIMMER (5 Cards) */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-80" />
              </div>

              {/* 5 Horizontal Blog Card Shimmers */}
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <Skeleton className="w-full sm:w-36 h-28 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-3 w-full">
                      <Skeleton className="h-4 w-20 rounded-full" />
                      <Skeleton className="h-6 w-5/6" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Read More Blogs Button Shimmer */}
              <div className="flex justify-center pt-4">
                <Skeleton className="h-12 w-48 rounded-xl" />
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: SIDEBAR SHIMMER */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Search Bar Shimmer */}
            <div className="hidden lg:block">
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>

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

            {/* Popular Brands Chips Shimmer */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-20 rounded-xl" />
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
    </div>
  );
}
