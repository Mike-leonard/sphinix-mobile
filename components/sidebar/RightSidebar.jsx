import React from 'react';
import { Search } from '../Search';
import NewArrivals from './NewArrivals';
import TopRated from './TopRated';
import BrandList from './BrandList';
import Categories from './Categories';
import AdBanner from '../ads/AdBanner';
import TrendingBlogsSidebar from './TrendingBlogsSidebar';

export default function RightSidebar({
  searchQuery,
  selectedBrand,
  selectedCategory,
  advancedFiltersComponent,
  isBlogsRoute = false,
  isDevicesRoute = false,
  isHomeRoute = false,
}) {
  return (
    <div className="lg:col-span-4 space-y-8">
      {/* SEARCH AND FILTERS */}
      <div className="hidden lg:flex lg:flex-col lg:gap-8">
        <Search
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
        />
        {advancedFiltersComponent && (
          <div className="w-full">
            {advancedFiltersComponent}
          </div>
        )}
      </div>

      

      {/* NEW ARRIVALS (Hide on devices route and blogs route) */}
      {!(isDevicesRoute || isBlogsRoute) && (
        <NewArrivals />
      )}

      {/* TRENDING BLOGS (Async Server Component) */}
      <TrendingBlogsSidebar limit={4} />

      {/* TOP RATED (Everywhere) */}
      <TopRated />
      
      {/* BLOG CATEGORIES (Rendered specifically when on blogs route) */}
      {isBlogsRoute && (
        <Categories selectedCategory={selectedCategory} />
      )}


      {/* BRANDS LIST CHIPS - Hide on blogs route */}
      {!isBlogsRoute && (
        <BrandList
          selectedBrand={selectedBrand}
        />
      )}

      {/* SIDEBAR AD BANNER (Sticky) */}
      <div className="sticky top-24">
        <AdBanner
          type="vertical"
          placement={isBlogsRoute ? "blogsPageSidebar" : "phonesPageSidebar"}
        />
      </div>
    </div>
  );
}
