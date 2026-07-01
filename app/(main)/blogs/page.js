'use client';
import React, { useState, useMemo } from 'react';
import BlogCard from '@/app/(main)/_components/_cards/BlogCard';
import Pagination from '@/components/Pagination';
import RightSidebar from '@/components/RightSidebar';
import InFeedAd from '@/components/InFeedAd';
import MOCK_BLOGS from '@/data/blogs.json';
import MOCK_PRODUCTS from '@/data/products.json';

const ITEMS_PER_PAGE = 12;

export default function BlogsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Since we only have a few categories in the mock, we can hardcode or dynamically generate them.
  const categories = useMemo(() => {
    const counts = { "All": MOCK_BLOGS.length };
    MOCK_BLOGS.forEach(blog => {
      counts[blog.category] = (counts[blog.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, []);

  const newArrivals = useMemo(() => MOCK_PRODUCTS.filter(p => p.isNew), []);
  const topRated = useMemo(() => MOCK_PRODUCTS.filter(p => p.isTopRated), []);

  const filteredBlogs = useMemo(() => {
    return MOCK_BLOGS.filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || blog.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE);
  
  // Ensure we don't have an empty page if we filter
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentBlogs = filteredBlogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
     

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-8 flex flex-col min-h-0">
           {/* Page Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white dark:bg-[#1a2035] p-3 rounded-lg border border-slate-200 dark:border-slate-800 mb-6 gap-4 min-h-[64px]">
            <div>
              <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight">Blogs & News</h1>
              <p className="text-xs text-slate-500 mt-0.5">Stay updated with the latest mobile trends.</p>
            </div>
            <div className="text-sm font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700">
               {filteredBlogs.length} Articles
            </div>
          </div>
          {/* Blogs Grid */}
          <div className="grid grid-cols-1 gap-6">
            {currentBlogs.length > 0 ? (
              currentBlogs.map((blog, index) => (
                <React.Fragment key={blog.id}>
                  {index === 4 && (
                    <div className="w-full py-2">
                      <InFeedAd />
                    </div>
                  )}
                  <BlogCard blog={blog} />
                </React.Fragment>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <p className="text-slate-500 font-medium">No blogs found matching your criteria.</p>
                <button 
                  onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                  className="mt-4 text-brand-500 hover:underline font-bold"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <RightSidebar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedBrand={null}
          setSelectedBrand={() => {}}
          newArrivals={newArrivals}
          topRated={topRated}
          categories={categories}
          brands={[]} // No brands for blogs
        />
      </div>
    </div>
  );
}
