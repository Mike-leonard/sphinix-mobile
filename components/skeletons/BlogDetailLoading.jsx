import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPostLoading() {
  return (
    <div className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* MAIN CONTENT AREA */}
        <div className="lg:col-span-8 flex flex-col min-h-0 space-y-6">
          
          {/* Breadcrumb Shimmer */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <Skeleton className="h-4 w-16" />
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <Skeleton className="h-4 w-48" />
          </div>

          {/* Main Article Container Shimmer */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm p-6 sm:p-8 space-y-6">
            
            {/* Blog Hero Shimmer */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-10 w-4/5" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="w-full h-80 rounded-2xl" />
            </div>

            {/* Blog Meta Shimmer */}
            <div className="flex items-center justify-between py-4 border-y border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            {/* Blog Content Shimmer Paragraphs */}
            <div className="space-y-4 pt-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-48 w-full rounded-2xl my-4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

          </div>

          {/* Article In-Feed Ad Banner Shimmer */}
          <Skeleton className="h-24 w-full rounded-2xl" />

          {/* Related Articles Shimmer (3 Cards) */}
          <div className="space-y-4 pt-4">
            <Skeleton className="h-7 w-40" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900">
                  <Skeleton className="w-full h-32 rounded-xl" />
                  <Skeleton className="h-4 w-20 rounded-full" />
                  <Skeleton className="h-5 w-full" />
                </div>
              ))}
            </div>
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
