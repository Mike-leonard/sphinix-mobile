import React from 'react';
import { Search } from './Search';
import NewArrivals from './NewArrivals';
import TopRated from './TopRated';
import Categories from './Categories';
import BrandList from './BrandList';
import AdBanner from './AdBanner';

export default function RightSidebar({
  searchQuery,
  setSearchQuery,
  selectedBrand,
  setSelectedBrand,
  selectedCategory,
  setSelectedCategory,
  newArrivals,
  topRated,
  categories,
  brands,
  advancedFiltersComponent,
}) {
  return (
    <div className="lg:col-span-4 space-y-8">
      {/* SEARCH AND FILTERS */}
      <div className="hidden lg:flex lg:flex-col lg:gap-8">
        <Search
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        {advancedFiltersComponent && (
          <div className="w-full">
            {advancedFiltersComponent}
          </div>
        )}
      </div>

      {/* NEW ARRIVALS */}
      <NewArrivals
        newArrivals={newArrivals}
        setSelectedBrand={setSelectedBrand}
        setSearchQuery={setSearchQuery}
      />

      {/* TOP RATED */}
      <TopRated
        topRated={topRated}
        setSelectedBrand={setSelectedBrand}
        setSearchQuery={setSearchQuery}
      />

      {/* CATEGORIES */}
      <Categories
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* BRANDS LIST CHIPS */}
      <BrandList
        brands={brands}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
      />

      {/* SIDEBAR AD BANNER (Sticky) */}
      <div className="sticky top-24">
        <AdBanner type="vertical" />
      </div>
    </div>
  );
}
