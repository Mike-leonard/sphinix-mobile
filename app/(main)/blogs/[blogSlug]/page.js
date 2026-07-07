'use client';
import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import RightSidebar from '@/components/sidebar/RightSidebar';
import MOCK_BLOGS from '@/data/blogs.json';
import MOCK_PRODUCTS from '@/data/products.json';
import { generateBlogSlug } from '@/lib/utils';
import BlogBreadcrumb from './_components/BlogBreadcrumb';
import BlogHero from './_components/BlogHero';
import BlogMeta from './_components/BlogMeta';
import BlogContent from './_components/BlogContent';
import RelatedArticles from './_components/RelatedArticles';
import AdBanner from '@/components/ads/AdBanner';

export default function BlogPostPage({ params }) {
  // Unwrap params using React.use for Next 15+ compatibility
  const resolvedParams = React.use(params);
  const { blogSlug } = resolvedParams;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    const counts = { "All": MOCK_BLOGS.length };
    MOCK_BLOGS.forEach(b => {
      counts[b.category] = (counts[b.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, []);

  const newArrivals = useMemo(() => MOCK_PRODUCTS.filter(p => p.isNew), []);
  const topRated = useMemo(() => MOCK_PRODUCTS.filter(p => p.isTopRated), []);

  const blog = useMemo(() => {
    return MOCK_BLOGS.find(b => generateBlogSlug(b.title) === blogSlug);
  }, [blogSlug]);

  const relatedBlogs = useMemo(() => {
    if (!blog) return [];
    let related = MOCK_BLOGS.filter(b => b.category === blog.category && b.id !== blog.id);
    if (related.length < 3) {
      const others = MOCK_BLOGS.filter(b => b.category !== blog.category && b.id !== blog.id);
      related = [...related, ...others];
    }
    return related.slice(0, 3);
  }, [blog]);

  if (!blog) {
    return notFound();
  }

  return (
    <div className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Main Content Area */}
        <div className="lg:col-span-8 flex flex-col min-h-0">

          {/* Breadcrumb Header */}
          <BlogBreadcrumb title={blog.title} />

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-8 shadow-sm">
            <BlogHero blog={blog} />
            <BlogMeta blog={blog} />
            <BlogContent blog={blog} />
          </div>

          <AdBanner placement="blogDetailsInFeed" />
          {/* Related Articles */}
          <RelatedArticles relatedBlogs={relatedBlogs} />
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
          brands={[]}
        />
      </div>
    </div>
  );
}