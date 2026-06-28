import React from 'react';
import { Search } from './Search';
import NewArrivals from './NewArrivals';
import TopRated from './TopRated';
import Categories from './Categories';
import BrandList from './BrandList';

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
}) {
  return (
    <div className="lg:col-span-4 space-y-8">
      {/* SEARCH AND FILTERS */}
      <Search
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

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
    </div>
  );
}
