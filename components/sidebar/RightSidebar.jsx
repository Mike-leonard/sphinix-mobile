import React from 'react';
import { usePathname } from 'next/navigation';
import { Search } from '../Search';
import NewArrivals from './NewArrivals';
import TopRated from './TopRated';
import BrandList from './BrandList';
import AdBanner from '../ads/AdBanner';
import { getBlogs } from '@/actions/blogs';
import TrendingBlogsSidebar from './TrendingBlogsSidebar';

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
  const pathname = usePathname();

  const [MOCK_BLOGS, setMockBlogs] = React.useState([]);
  
  React.useEffect(() => {
    getBlogs().then(blogs => setMockBlogs(blogs || []));
  }, []);

  // Define visibility rules based on routes
  const isDevicesRoute = pathname === '/phones';
  const isBlogsRoute = pathname === '/blogs';
  const isHomeRoute = pathname === '/';

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

      {/* NEW ARRIVALS (Hide on devices route to reduce clutter) */}
      {!isDevicesRoute && (
        <NewArrivals
          newArrivals={newArrivals}
          setSelectedBrand={setSelectedBrand}
          setSearchQuery={setSearchQuery}
        />
      )}

      {/* LATEST BLOGS */}
      {/* Show on Devices and Home, or specifically if we want to cross-pollinate on Devices */}
      {(isDevicesRoute || isHomeRoute || isBlogsRoute) && (
        <TrendingBlogsSidebar blogs={MOCK_BLOGS.filter(b => b.status === 'published')} />
      )}

      {/* TOP RATED (Devices) */}
      {/* Good cross-pollination for Blogs page, and standard on other pages */}
      <TopRated
        topRated={topRated}
        setSelectedBrand={setSelectedBrand}
        setSearchQuery={setSearchQuery}
      />

      {/* BRANDS LIST CHIPS - Reduce on Blogs to save space, useful on Devices/Home */}
      {!isBlogsRoute && (
        <BrandList
          brands={brands}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
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
