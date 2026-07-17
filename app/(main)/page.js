'use client';
import React, { useState, useMemo } from 'react';
import HeroCarousel from '@/app/(main)/_components/HeroCarousel';
import CompareDrawer from '@/components/CompareDrawer';
import MOCK_PRODUCTS from '@/data/products.json';
import MOCK_BLOGS from '@/data/blogs.json';
import RightSidebar from '@/components/sidebar/RightSidebar';
import AdBanner from '@/components/ads/AdBanner';
import ProductSection from './_components/_sections/ProductSection';
import BlogSection from './_components/_sections/BlogSection';
import { useCompare } from '@/context/CompareContext';
import { useSettings } from '@/context/SettingsContext';
const BRANDS = ["All", "Apple", "Samsung", "OnePlus", "Google", "LG", "Nokia", "HTC", "Sony", "Motorola", "Huawei", "Oppo"];
export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");

  const { compareList, isCompareOpen, setIsCompareOpen, handleToggleCompare, clearCompare } = useCompare();
  const settings = useSettings();
  const homeLimits = settings?.appearance?.home || { deviceLimit: 8, blogLimit: 3 };

  // Filtered Products logic
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => {
      const matchesStatus = product.status === 'published';
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.specs.chipset.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = selectedBrand === "All" || product.brand === selectedBrand;
      return matchesStatus && matchesSearch && matchesBrand;
    }).slice(0, homeLimits.deviceLimit);
  }, [searchQuery, selectedBrand, homeLimits.deviceLimit]);

  // Derived Sidebar Data
  const newArrivals = useMemo(() => MOCK_PRODUCTS.filter(p => p.isNew && p.status === 'published'), []);
  const topRated = useMemo(() => MOCK_PRODUCTS.filter(p => p.isTopRated && p.status === 'published'), []);

  // Compute dynamic brands with counts
  const dynamicBrands = useMemo(() => {
    const published = MOCK_PRODUCTS.filter(p => p.status === 'published');
    const counts = { "All": published.length };
    
    published.forEach(p => {
      if (p.brand) {
        counts[p.brand] = (counts[p.brand] || 0) + 1;
      }
    });

    return BRANDS.map(name => ({
      name,
      count: counts[name] || 0
    })).filter(brand => brand.count > 0 || brand.name === "All");
  }, []);

  return (
    <div className="text-slate-800 dark:text-slate-100">

      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT COLUMN: Hero slider, Products Grid, Blogs */}
          <div className="lg:col-span-8 space-y-12">

            {/* TOP LEADERBOARD AD */}
            <AdBanner type="horizontal" placement="homePageBanner" className="hidden sm:flex" />

            <HeroCarousel />

            {/* LATEST PRODUCTS SECTION */}
            <ProductSection
              filteredProducts={filteredProducts}
              selectedBrand={selectedBrand}
              setSearchQuery={setSearchQuery}
              compareList={compareList}
              handleToggleCompare={handleToggleCompare}
              isHomePage={true}
            />

            {/* IN-FEED AD BANNER */}
            <AdBanner type="horizontal" placement="homePageBanner" />

            {/* LATEST NEWS / BLOG SECTION */}
            <BlogSection limit={homeLimits.blogLimit} />

          </div>

          {/* RIGHT COLUMN: SIDEBAR */}
          <RightSidebar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            newArrivals={newArrivals}
            topRated={topRated}
            brands={dynamicBrands}
          />

        </div>
      </div>

      {/* BOTTOM FULL-WIDTH AD */}
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <AdBanner type="horizontal" placement="homePageBanner" />
      </div>

      {/* Compare Drawer Overlay */}
      <CompareDrawer />
    </div>
  );
}
