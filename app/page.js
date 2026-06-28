'use client';

import React, { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import HeroCarousel from '@/components/HeroCarousel';
import ProductCard from '@/components/ProductCard';
import BlogCard from '@/components/BlogCard';
import Sidebar from '@/components/Sidebar';
import CompareDrawer from '@/components/CompareDrawer';

import MOCK_PRODUCTS from '@/data/products.json';
import MOCK_BLOGS from '@/data/blogs.json';

const BRANDS = ["All", "Apple", "Samsung", "OnePlus", "Google", "LG", "Nokia", "HTC", "Sony", "Motorola", "Huawei", "Oppo"];

const CATEGORIES = [
  { name: "Mobiles", count: 95 },
  { name: "Laptops", count: 4 },
  { name: "Digital Cameras", count: 2 },
  { name: "Cameras", count: 0 },
  { name: "DSLR Cameras", count: 0 },
  { name: "Gadgets", count: 0 }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("Mobiles");
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar 
        compareCount={compareList.length} 
        onOpenCompare={() => setIsCompareOpen(true)} 
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Hero slider, Products Grid, Blogs */}
          <div className="lg:col-span-8 space-y-12">
            <HeroCarousel />

            {/* LATEST PRODUCTS SECTION */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">Latest Products</h2>
                  <p className="text-xs text-slate-400">Showing {filteredProducts.length} devices based on filters</p>
                </div>
                {selectedBrand !== "All" && (
                  <button 
                    onClick={() => { setSelectedBrand("All"); setSearchQuery(""); }} 
                    className="text-xs text-brand-400 hover:underline flex items-center gap-1"
                  >
                    Clear Filter ({selectedBrand})
                  </button>
                )}
              </div>

              {filteredProducts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center text-slate-400">
                  <svg className="w-12 h-12 mx-auto mb-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="font-semibold text-lg text-slate-300">No products found</p>
                  <p className="text-sm mt-1">Try resetting the search terms or selecting a different brand.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filteredProducts.map(product => {
                    const isComparing = compareList.some(item => item.id === product.id);
                    return (
                      <ProductCard 
                        key={product.id}
                        product={product}
                        isComparing={isComparing}
                        onToggleCompare={() => handleToggleCompare(product)}
                      />
                    );
                  })}
                </div>
              )}

              {/* View More button */}
              <div className="text-center pt-2">
                <button className="inline-flex items-center justify-center px-6 py-3 font-semibold text-slate-300 bg-slate-900 border border-slate-850 hover:bg-slate-850 hover:text-white rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all gap-2 text-sm">
                  View More Products 
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </section>

            {/* LATEST NEWS / BLOG SECTION */}
            <section className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">Latest News & Tech Articles</h2>
                <p className="text-xs text-slate-400">Stay updated with deep technical benchmarks and mobile news</p>
              </div>

              <div className="space-y-4">
                {MOCK_BLOGS.map(blog => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: SIDEBAR */}
          <Sidebar 
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
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 py-10 mt-20 text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white tracking-widest text-sm">SPHINIX <span className="text-brand-500">MOBILE</span></span>
            <span>|</span>
            <p className="text-xs">&copy; 2026 Sphinix Mobile. All rights reserved.</p>
          </div>
          <div className="flex gap-6 text-xs font-semibold">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>

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
