"use client";

import React from 'react';
import { useCompare } from '@/context/CompareContext';
import EmptyState from './_components/EmptyState';
import ComparisonHeader from './_components/ComparisonHeader';
import ComparisonBody from './_components/ComparisonBody';

export default function ComparisonsPage() {
  const { compareList, handleToggleCompare } = useCompare();

  if (compareList.length === 0) {
    return <EmptyState />;
  }

  // Dynamic grid column class based on number of devices
  const gridColsClass = compareList.length === 1 
    ? "grid-cols-2" 
    : compareList.length === 2 
      ? "grid-cols-3" 
      : "grid-cols-4"; 

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative flex-1">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
          <span className="w-2 h-8 bg-brand-500 rounded-full inline-block"></span>
          Compare Devices
        </h1>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col relative">
        <ComparisonHeader 
          compareList={compareList} 
          gridColsClass={gridColsClass} 
          handleToggleCompare={handleToggleCompare} 
        />
        <ComparisonBody 
          compareList={compareList} 
          gridColsClass={gridColsClass} 
        />
      </div>
    </div>
  );
}
