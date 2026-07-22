"use client";

import React, { useState, useMemo } from 'react';
import { useCompare } from '@/context/CompareContext';
import EmptyState from './_components/EmptyState';
import ComparisonHeader from './_components/ComparisonHeader';
import ComparisonBody from './_components/ComparisonBody';
import ComparisonBreadcrumb from './_components/ComparisonBreadcrumb';
import RightSidebar from '@/components/sidebar/RightSidebar';
import MOCK_PRODUCTS from '@/data/products.json';

export default function ComparisonsPage() {
  const { compareList, handleToggleCompare } = useCompare();

  // State for RightSidebar
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  
  const newArrivals = useMemo(() => MOCK_PRODUCTS.filter(p => p.isNew), []);
  const topRated = useMemo(() => MOCK_PRODUCTS.filter(p => p.isTopRated), []);

  if (compareList.length === 0) {
    return <EmptyState />;
  }

  // Dynamic grid column class based on number of devices
  const gridColsClass = compareList.length === 1 
    ? "grid-cols-2" 
    : compareList.length === 2 
      ? "grid-cols-3" 
      : "grid-cols-4"; 

  const titleText = compareList.map(device => device.name).join(' vs ');

  return (
    <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative flex-1">
      

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-8">
          <ComparisonBreadcrumb title={titleText} />
          
          <div className="flex flex-col gap-6">
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

        {/* Right Sidebar */}
        <RightSidebar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          selectedCategory="All"
          setSelectedCategory={() => {}}
          newArrivals={newArrivals}
          topRated={topRated}
          brands={[]}
        />
      </div>
    </div>
  );
}
