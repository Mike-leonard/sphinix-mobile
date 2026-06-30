'use client';
import React, { useState, useMemo } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import ProductCard from '@/app/_components/_cards/ProductCard';
import DeviceListCard from '@/components/DeviceListCard';
import AdvancedFilters from '@/components/AdvancedFilters';
import Pagination from '@/components/Pagination';
import RightSidebar from '@/components/RightSidebar';
import CompareDrawer from '@/components/CompareDrawer';
import MOCK_PRODUCTS from '@/data/products.json';

const BRANDS = ["All", "Apple", "Samsung", "OnePlus", "Google", "LG", "Nokia", "HTC", "Sony", "Motorola", "Huawei", "Oppo"];
const CATEGORIES = [
  { name: "Mobiles", count: 95 },
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
  const [selectedCategory, setSelectedCategory] = useState("Mobiles");
  
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
      
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">All Products</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-8">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white dark:bg-[#1a2035] p-3 rounded-lg border border-slate-200 dark:border-slate-800 mb-6 gap-4">
            
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Display:</span>
              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-md p-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-sm transition-colors ${viewMode === 'grid' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-sm transition-colors ${viewMode === 'list' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm rounded-md px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 w-full sm:w-auto"
              >
                <option>Date (default)</option>
                <option>Price (Low to High)</option>
                <option>Price (High to Low)</option>
                <option>Rating</option>
              </select>

              <select 
                value={selectedBrand}
                onChange={(e) => { setSelectedBrand(e.target.value); setCurrentPage(1); }}
                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm rounded-md px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 w-full sm:w-auto"
              >
                {BRANDS.map(b => <option key={b} value={b}>{b === 'All' ? 'Brands' : b}</option>)}
              </select>
            </div>

            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="text-sm font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              Filters
              <span className={`transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`}>▾</span>
            </button>
          </div>

          {/* Advanced Filters */}
          <AdvancedFilters 
            isOpen={showFilters} 
            selectedFilters={advancedFilters}
            onToggleFilter={handleToggleAdvancedFilter}
          />

          {/* Products Grid/List */}
          {currentProducts.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-6"
            }>
              {currentProducts.map(product => (
                viewMode === 'grid' ? (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    isComparing={compareList.some(item => item.id === product.id)}
                    onToggleCompare={() => handleToggleCompare(product)}
                  />
                ) : (
                  <DeviceListCard
                    key={product.id} 
                    product={product} 
                    isComparing={compareList.some(item => item.id === product.id)}
                    onToggleCompare={() => handleToggleCompare(product)}
                  />
                )
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
        />
        
      </div>

      {/* Compare Drawer Overlay */}
      {compareList.length > 0 && (
        <CompareDrawer
          isOpen={isCompareOpen}
          onClose={() => setIsCompareOpen(false)}
          onOpen={() => setIsCompareOpen(true)}
          compareList={compareList}
          onRemove={(id) => setCompareList(compareList.filter(item => item.id !== id))}
          onClear={() => { setCompareList([]); setIsCompareOpen(false); }}
        />
      )}
    </div>
  );
}
