'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import ProductCard from '@/app/(main)/_components/_cards/ProductCard';
import DeviceListCard from '@/app/(main)/phones/_components/DeviceListCard';
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
import { getDeviceFilters } from '@/actions/device-filters';

const BRANDS = ["All", "Apple", "Samsung", "OnePlus", "Google", "LG", "Nokia", "HTC", "Sony", "Motorola", "Huawei", "Oppo"];

export default function DevicesPage() {
  const settings = useSettings();
  const ITEMS_PER_PAGE = settings?.appearance?.devices?.deviceLimit || 12;

  // Global Sidebar States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");

  // Page Specific States
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [advancedFilters, setAdvancedFilters] = useState({});
  const [sortOption, setSortOption] = useState("Date (default)");
  const [filtersData, setFiltersData] = useState([]);

  useEffect(() => {
    async function fetchFilters() {
      const data = await getDeviceFilters();
      setFiltersData(data);
    }
    fetchFilters();
  }, []);

  // Compare State
  const { compareList, isCompareOpen, setIsCompareOpen, handleToggleCompare, clearCompare } = useCompare();

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

  // Filter Products
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => {
      const matchesStatus = product.status === 'published';
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.specs.chipset.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = selectedBrand === "All" || product.brand === selectedBrand;

      let matchesAdvanced = true;
      if (Object.keys(advancedFilters).length > 0) {
        // Evaluate dynamic filters
        for (const filterId of Object.keys(advancedFilters)) {
          const selectedOptions = advancedFilters[filterId];
          if (!selectedOptions || selectedOptions.length === 0) continue;
          
          const filterDef = filtersData.find(f => f.id === filterId);
          if (!filterDef || !filterDef.attributeSlug) continue;
          
          const productSpecVal = product.specs[filterDef.attributeSlug];
          if (!productSpecVal) {
            matchesAdvanced = false;
            break;
          }

          // Helper to extract first number from a string (e.g. "5000 mAh" -> 5000)
          const extractNum = (str) => {
            const match = String(str).match(/[\d.]+/);
            return match ? parseFloat(match[0]) : null;
          };

          const productNum = extractNum(productSpecVal);

          // Advanced check
          const hasMatch = selectedOptions.some(opt => {
             const optStr = opt.toLowerCase();
             const valStr = String(productSpecVal).toLowerCase();
             
             // 1. Direct Substring Check (normalizes spaces e.g. "12 GB" vs "12GB")
             if (valStr.replace(/\s/g, '').includes(optStr.replace(/\s/g, ''))) return true;

             // 2. Range Check (if we successfully extracted a number from the product's spec)
             if (productNum !== null) {
                if (optStr.includes('under') || optStr.includes('<')) {
                  const limit = extractNum(optStr);
                  if (limit && productNum < limit) return true;
                }
                if (optStr.includes('above') || optStr.includes('>')) {
                  const limit = extractNum(optStr);
                  if (limit && productNum > limit) return true;
                }
                if (optStr.includes('-')) {
                  const parts = optStr.split('-');
                  const min = extractNum(parts[0]);
                  const max = extractNum(parts[1]);
                  if (min !== null && max !== null && productNum >= min && productNum <= max) return true;
                }
             }
             
             return false;
          });

          if (!hasMatch) {
            matchesAdvanced = false;
            break;
          }
        }
      }

      return matchesStatus && matchesSearch && matchesBrand && matchesAdvanced;
    });
  }, [searchQuery, selectedBrand, advancedFilters, filtersData]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleToggleAdvancedFilter = (filterId, option) => {
    setAdvancedFilters(prev => {
      const categoryFilters = prev[filterId] || [];
      if (categoryFilters.includes(option)) {
        return { ...prev, [filterId]: categoryFilters.filter(o => o !== option) };
      } else {
        return { ...prev, [filterId]: [...categoryFilters, option] };
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
            filters={filtersData}
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
          newArrivals={newArrivals}
          topRated={topRated}
          brands={dynamicBrands}
          advancedFiltersComponent={
            <AdvancedFilters
              filters={filtersData}
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
