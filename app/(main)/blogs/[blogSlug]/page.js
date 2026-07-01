'use client';
import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import RightSidebar from '@/components/sidebar/RightSidebar';
import MOCK_BLOGS from '@/data/blogs.json';
import MOCK_PRODUCTS from '@/data/products.json';
import { generateBlogSlug } from '@/lib/utils';
import InFeedAd from '@/components/ads/InFeedAd';
import BlogCard from '@/app/(main)/_components/_cards/BlogCard';

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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white dark:bg-[#1a2035] p-3 rounded-lg border border-slate-200 dark:border-slate-800 mb-6 gap-4 min-h-[64px]">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 flex-wrap">
              <Link href="/" className="hover:text-brand-500 transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3 flex-shrink-0" />
              <Link href="/blogs" className="hover:text-brand-500 transition-colors">Blogs</Link>
              <ChevronRight className="w-3 h-3 flex-shrink-0" />
              <span className="text-slate-900 dark:text-white line-clamp-1 break-all sm:break-normal">{blog.title}</span>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 whitespace-nowrap flex-shrink-0">
              Reading Mode
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-8 shadow-sm">

            {/* Hero Image */}
            <div className={`w-full h-64 sm:h-80 relative bg-gradient-to-br ${blog.color}`}>
              <div className="absolute inset-0 flex items-center justify-center font-black text-6xl text-white/10 select-none">SPHINIX</div>
              <div className="absolute bottom-6 left-6 right-6">
                <span className="bg-white/90 dark:bg-slate-900/90 text-brand-400 text-[10px] font-bold px-3 py-1 rounded border border-slate-200 dark:border-slate-800 uppercase tracking-widest inline-block mb-4 shadow-sm">
                  {blog.category}
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight drop-shadow-md">
                  {blog.title}
                </h1>
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 p-6 border-b border-slate-100 dark:border-slate-800 text-sm text-slate-500 font-medium bg-slate-50 dark:bg-[#0b1120]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-500 flex items-center justify-center font-bold text-xs border border-brand-200 dark:border-brand-500/20">
                  {blog.author.charAt(0)}
                </div>
                <span className="text-slate-900 dark:text-slate-300">{blog.author}</span>
              </div>
              <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
              <span>{blog.date}</span>
              <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
              <span>{blog.readTime}</span>
            </div>

            {/* Article Content */}
            <div className="p-6 sm:p-8 space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed">
              <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                {blog.excerpt}
              </p>

              {/* Mock paragraph content */}
              <p>
                As mobile technology continues to evolve at a breakneck pace, understanding the nuances of {blog.category.toLowerCase()} becomes increasingly critical. This article delves into the foundational shifts we are observing in the industry and how they impact everyday user experiences.
              </p>

              <div className="my-8">
                <InFeedAd />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Deep Dive Analysis</h2>

              <p>
                Looking closely at the architectural decisions made by major manufacturers, it is clear that the focus has shifted from pure theoretical performance to sustained efficiency and thermal management. The integration of neural processing units (NPUs) directly into the die signifies a permanent move toward localized AI workloads.
              </p>

              <p>
                However, this rapid innovation isn't without its challenges. Developers are forced to constantly adapt their applications to leverage these new hardware capabilities, creating a fragmented ecosystem where only the most optimized software truly shines.
              </p>

              <div className="bg-brand-50 dark:bg-brand-500/10 border-l-4 border-brand-500 p-6 rounded-r-xl my-8">
                <p className="italic text-brand-800 dark:text-brand-200 font-medium">
                  "The true measure of a device's capability in 2026 isn't benchmark scores, but how seamlessly it manages background intelligence without the user ever noticing."
                </p>
              </div>

              <p>
                In conclusion, whether you are an enthusiast tracking every micro-architecture update or a standard consumer looking for longevity, the current landscape offers unparalleled choice. The convergence of hardware and AI represents a paradigm shift that will dictate device design for the next decade.
              </p>
            </div>

            <div className="p-6 sm:p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#0b1120]">
              <Link href="/blogs" className="inline-flex items-center gap-2 text-sm font-bold text-brand-500 hover:text-brand-400 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to all articles
              </Link>
            </div>
          </div>

          {/* Related Articles */}
          {relatedBlogs.length > 0 && (
            <div className="mt-4 mb-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-brand-500 rounded-full inline-block"></span>
                Related Articles
              </h3>
              <div className="flex flex-col gap-4">
                {relatedBlogs.map(rb => (
                  <BlogCard key={rb.id} blog={rb} />
                ))}
              </div>
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
          brands={[]}
        />
      </div>
    </div>
  );
}