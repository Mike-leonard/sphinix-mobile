'use client';
import React, { useState, useMemo } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import ProductCard from '@/app/(main)/_components/_cards/ProductCard';
import DeviceListCard from '@/app/(main)/devices/_components/DeviceListCard';
import AdvancedFilters from '@/components/AdvancedFilters';
import Pagination from '@/components/Pagination';
import RightSidebar from '@/components/RightSidebar';
import CompareDrawer from '@/components/CompareDrawer';
import InFeedAd from '@/components/InFeedAd';
import MOCK_PRODUCTS from '@/data/products.json';
import SortingControl from './_components/SortingControl';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";

const BRANDS = ["All", "Apple", "Samsung", "OnePlus", "Google", "LG", "Nokia", "HTC", "Sony", "Motorola", "Huawei", "Oppo"];
const CATEGORIES = [
  { name: "Devices", count: 95 },
  { name: "Laptops", count: 4 },
  { name: "Digital Cameras", count: 2 },
  { name: "Cameras", count: 0 },
  { name: "DSLR Cameras", count: 0 },
  { name: "Gadgets", count: 0 }
];

const ITEMS_PER_PAGE = 12;

export default function DevicesPage() {
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
  const [compareList, setCompareList] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Derived Sidebar Data
  const newArrivals = useMemo(() => MOCK_PRODUCTS.filter(p => p.isNew), []);
  const topRated = useMemo(() => MOCK_PRODUCTS.filter(p => p.isTopRated), []);

  // Filter Products
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => {
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

      return matchesSearch && matchesBrand && matchesCategory && matchesAdvanced;
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
          />

          {/* Mobile Advanced Filters Sheet */}
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetContent onOpenAutoFocus={(e) => e.preventDefault()} side="bottom" className="max-h-[85vh] flex flex-col rounded-t-2xl p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-xl">
              <SheetHeader className="text-left mb-2 pr-8 shrink-0">
                <SheetTitle className="font-extrabold text-xl text-slate-900 dark:text-white">Advanced Filters</SheetTitle>
                <SheetDescription>Select options to refine your results.</SheetDescription>
              </SheetHeader>
              <div className="flex-1 min-h-0 overflow-y-auto pb-4 pr-2">
                <AdvancedFilters
                  isOpen={true}
                  selectedFilters={advancedFilters}
                  onToggleFilter={handleToggleAdvancedFilter}
                  className="!bg-transparent !border-0 !p-0 !mb-0"
                />
              </div>
            </SheetContent>
          </Sheet>

          {/* Products Grid/List */}
          {currentProducts.length > 0 ? (
            <div className={viewMode === 'grid'
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-6"
            }>
              {currentProducts.map((product, index) => (
                <React.Fragment key={product.id}>
                  {index === 6 && (
                    <div className="col-span-full w-full py-2">
                      <InFeedAd />
                    </div>
                  )}
                  {viewMode === 'grid' ? (
                    <ProductCard
                      product={product}
                      isComparing={compareList.some(item => item.id === product.id)}
                      onToggleCompare={() => handleToggleCompare(product)}
                    />
                  ) : (
                    <DeviceListCard
                      product={product}
                      isComparing={compareList.some(item => item.id === product.id)}
                      onToggleCompare={() => handleToggleCompare(product)}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-slate-500 dark:text-slate-400">
              <p className="text-xl font-bold mb-2">No devices found</p>
              <p>Try adjusting your filters or search query.</p>
            </div>
          )}

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

      {/* Compare Drawer Overlay */}
      <CompareDrawer
        compareList={compareList}
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(!isCompareOpen)}
        onToggleCompare={handleToggleCompare}
        onClear={() => { setCompareList([]); setIsCompareOpen(false); }}
      />
    </div>
  );
}
