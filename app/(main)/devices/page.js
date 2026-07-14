'use client';
import React, { useState, useMemo } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import ProductCard from '@/app/(main)/_components/_cards/ProductCard';
import DeviceListCard from '@/app/(main)/devices/_components/DeviceListCard';
import AdvancedFilters from '@/components/AdvancedFilters';
import Pagination from '@/components/Pagination';
import RightSidebar from '@/components/sidebar/RightSidebar';
import CompareDrawer from '@/components/CompareDrawer';
import MOCK_PRODUCTS from '@/data/products.json';
import SortingControl from './_components/SortingControl';
import { useCompare } from '@/context/CompareContext';
import MobileFiltersSheet from './_components/MobileFiltersSheet';
import DeviceGrid from './_components/DeviceGrid';
import { useSettings } from '@/context/SettingsContext';

const BRANDS = ["All", "Apple", "Samsung", "OnePlus", "Google", "LG", "Nokia", "HTC", "Sony", "Motorola", "Huawei", "Oppo"];
const CATEGORIES = [
  { name: "Devices", count: 95 },
  { name: "Laptops", count: 4 },
  { name: "Digital Cameras", count: 2 },
  { name: "Cameras", count: 0 },
  { name: "DSLR Cameras", count: 0 },
  { name: "Gadgets", count: 0 }
];

export default function DevicesPage() {
  const settings = useSettings();
  const ITEMS_PER_PAGE = settings?.appearance?.devices?.deviceLimit || 12;

  // Global Sidebar States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("Devices");

  // Page Specific States
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [advancedFilters, setAdvancedFilters] = useState({});
  const [sortOption, setSortOption] = useState("Date (default)");

  // Compare State
  const { compareList, isCompareOpen, setIsCompareOpen, handleToggleCompare, clearCompare } = useCompare();

  // Derived Sidebar Data
  const newArrivals = useMemo(() => MOCK_PRODUCTS.filter(p => p.isNew && p.status === 'published'), []);
  const topRated = useMemo(() => MOCK_PRODUCTS.filter(p => p.isTopRated && p.status === 'published'), []);

  // Filter Products
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => {
      const matchesStatus = product.status === 'published';
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.specs.chipset.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = selectedBrand === "All" || product.brand === selectedBrand;
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;

      // Advanced Filters logic (Simulated for UI demonstration)
      let matchesAdvanced = true;
      if (Object.keys(advancedFilters).length > 0) {
        // Example checking RAM (Since our mock data isn't perfectly mapped to all granular filters, 
        // this is simplified to ensure the UI works without filtering out everything initially)
        if (advancedFilters['RAM'] && advancedFilters['RAM'].length > 0) {
          matchesAdvanced = advancedFilters['RAM'].some(ram => product.specs.ram.includes(ram.split(' ')[0]));
        }
      }

      return matchesStatus && matchesSearch && matchesBrand && matchesCategory && matchesAdvanced;
    });
  }, [searchQuery, selectedBrand, selectedCategory, advancedFilters]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleToggleAdvancedFilter = (category, option) => {
    setAdvancedFilters(prev => {
      const categoryFilters = prev[category] || [];
      if (categoryFilters.includes(option)) {
        return { ...prev, [category]: categoryFilters.filter(o => o !== option) };
      } else {
        return { ...prev, [category]: [...categoryFilters, option] };
      }
    });
    setCurrentPage(1); // Reset to page 1 on filter
  };

  return (
    <div className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Main Content Area */}
        <div className="lg:col-span-8">

          {/* Controls Bar */}
          <SortingControl
            viewMode={viewMode}
            setViewMode={setViewMode}
            sortOption={sortOption}
            setSortOption={setSortOption}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            BRANDS={BRANDS}
            setShowFilters={setShowFilters}
            showFilters={showFilters}
            setCurrentPage={setCurrentPage}
          />

          {/* Mobile Advanced Filters Sheet */}
          <MobileFiltersSheet 
            showFilters={showFilters} 
            setShowFilters={setShowFilters} 
            advancedFilters={advancedFilters} 
            handleToggleAdvancedFilter={handleToggleAdvancedFilter} 
          />

          {/* Products Grid/List */}
          <DeviceGrid 
            currentProducts={currentProducts} 
            viewMode={viewMode} 
            compareList={compareList} 
            handleToggleCompare={handleToggleCompare} 
          />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

        </div>

        {/* Right Sidebar */}
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
          advancedFiltersComponent={
            <AdvancedFilters
              isOpen={true}
              selectedFilters={advancedFilters}
              onToggleFilter={handleToggleAdvancedFilter}
              className="!mb-0"
            />
          }
        />

      </div>

      {/* FLOATING COMPARE DRAWER */}
      <CompareDrawer />
    </div>
  );
}
