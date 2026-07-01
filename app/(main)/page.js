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
const BRANDS = ["All", "Apple", "Samsung", "OnePlus", "Google", "LG", "Nokia", "HTC", "Sony", "Motorola", "Huawei", "Oppo"];
const CATEGORIES = [
  { name: "Devices", count: 95 },
  { name: "Laptops", count: 4 },
  { name: "Digital Cameras", count: 2 },
  { name: "Cameras", count: 0 },
  { name: "DSLR Cameras", count: 0 },
  { name: "Gadgets", count: 0 }
];
export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("Devices");
  const [compareList, setCompareList] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  // Filtered Products logic
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.specs.chipset.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = selectedBrand === "All" || product.brand === selectedBrand;
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesBrand && matchesCategory;
    });
  }, [searchQuery, selectedBrand, selectedCategory]);
  const newArrivals = useMemo(() => MOCK_PRODUCTS.filter(p => p.isNew), []);
  const topRated = useMemo(() => MOCK_PRODUCTS.filter(p => p.isTopRated), []);
  const handleToggleCompare = (product) => {
    if (compareList.some(item => item.id === product.id)) {
      setCompareList(compareList.filter(item => item.id !== product.id));
    } else {
      if (compareList.length >= 3) {
        alert("You can compare up to 3 devices at a time.");
        return;
      }
      setCompareList([...compareList, product]);
    }
  };
  const clearCompare = () => {
    setCompareList([]);
    setIsCompareOpen(false);
  };
  return (
    <div className="text-slate-800 dark:text-slate-100">

      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT COLUMN: Hero slider, Products Grid, Blogs */}
          <div className="lg:col-span-8 space-y-12">

            {/* TOP LEADERBOARD AD */}
            <AdBanner type="horizontal" className="hidden sm:flex" />

            <HeroCarousel />

            {/* LATEST PRODUCTS SECTION */}
            <ProductSection
              filteredProducts={filteredProducts}
              selectedBrand={selectedBrand}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              compareList={compareList}
              handleToggleCompare={handleToggleCompare}
            />

            {/* IN-FEED AD BANNER */}
            <AdBanner type="horizontal" />

            {/* LATEST NEWS / BLOG SECTION */}
            <BlogSection />

          </div>

          {/* RIGHT COLUMN: SIDEBAR */}
          <RightSidebar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            newArrivals={newArrivals}
            topRated={topRated}
            categories={CATEGORIES}
            brands={BRANDS}
          />

        </div>
      </div>

      {/* BOTTOM FULL-WIDTH AD */}
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <AdBanner type="horizontal" />
      </div>

      {/* FLOATING COMPARE DRAPER */}
      <CompareDrawer
        compareList={compareList}
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(!isCompareOpen)}
        onToggleCompare={handleToggleCompare}
        onClear={clearCompare}
      />
    </div>
  );
}
