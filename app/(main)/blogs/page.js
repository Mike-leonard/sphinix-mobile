'use client';
import React, { useState, useMemo } from 'react';
import Pagination from '@/components/Pagination';
import RightSidebar from '@/components/sidebar/RightSidebar';
import MOCK_BLOGS from '@/data/blogs.json';
import MOCK_PRODUCTS from '@/data/products.json';
import BlogPageHeader from './_components/BlogPageHeader';
import BlogList from './_components/BlogList';
import { useSettings } from '@/context/SettingsContext';

export default function BlogsPage() {
  const settings = useSettings();
  const ITEMS_PER_PAGE = settings?.appearance?.blogs?.blogLimit || 12;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Since we only have a few categories in the mock, we can hardcode or dynamically generate them.
  const categories = useMemo(() => {
    const publishedBlogs = MOCK_BLOGS.filter(blog => blog.status === 'published');
    const counts = { "All": publishedBlogs.length };
    publishedBlogs.forEach(blog => {
      counts[blog.category] = (counts[blog.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, []);

  const newArrivals = useMemo(() => MOCK_PRODUCTS.filter(p => p.isNew), []);
  const topRated = useMemo(() => MOCK_PRODUCTS.filter(p => p.isTopRated), []);

  const filteredBlogs = useMemo(() => {
    return MOCK_BLOGS.filter(blog => {
      const isPublished = blog.status === 'published';
      const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || blog.category === selectedCategory;
      return isPublished && matchesSearch && matchesCategory;
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
          <BlogPageHeader totalCount={filteredBlogs.length} />

          {/* Blogs Grid */}
          <BlogList 
            currentBlogs={currentBlogs} 
            setSearchQuery={setSearchQuery} 
            setSelectedCategory={setSelectedCategory} 
          />

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
          setSelectedBrand={() => { }}
          newArrivals={newArrivals}
          topRated={topRated}
          categories={categories}
          brands={[]} // No brands for blogs
        />
      </div>
    </div>
  );
}
