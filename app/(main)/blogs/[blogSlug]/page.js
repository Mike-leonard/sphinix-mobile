'use client';
import React, { useState, useMemo } from 'react';
import { notFound } from 'next/navigation';
import RightSidebar from '@/components/sidebar/RightSidebar';

import MOCK_PRODUCTS from '@/data/products.json';
import { generateBlogSlug } from '@/lib/utils';
import BlogBreadcrumb from './_components/BlogBreadcrumb';
import BlogHero from './_components/BlogHero';
import BlogMeta from './_components/BlogMeta';
import BlogContent from './_components/BlogContent';
import RelatedArticles from './_components/RelatedArticles';
import AdBanner from '@/components/ads/AdBanner';
import { allBlogs } from '@/actions/blogs';

export default function BlogPostPage({ params }) {
  // Unwrap params using React.use for Next 15+ compatibility
  const resolvedParams = React.use(params);
  const { blogSlug } = resolvedParams;

  const [searchQuery, setSearchQuery] = useState("");

  const [MOCK_BLOGS, setMockBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    allBlogs().then(blogs => {
      setMockBlogs(blogs || []);
      setIsLoading(false);
    });
  }, []);

  const blog = useMemo(() => {
    return MOCK_BLOGS.find(b => generateBlogSlug(b.title) === blogSlug && b.status === 'published');
  }, [blogSlug, MOCK_BLOGS]);

  const relatedBlogs = useMemo(() => {
    if (!blog) return [];
    let related = MOCK_BLOGS.filter(b => b.category === blog.category && b.id !== blog.id && b.status === 'published');
    if (related.length < 3) {
      const others = MOCK_BLOGS.filter(b => b.category !== blog.category && b.id !== blog.id && b.status === 'published');
      related = [...related, ...others];
    }
    return related.slice(0, 3);
  }, [blog]);

  if (isLoading) {
    return (
      <div className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

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
          isBlogsRoute={true}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
}