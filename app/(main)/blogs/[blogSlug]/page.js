import React from 'react';
import { notFound } from 'next/navigation';
import RightSidebar from '@/components/sidebar/RightSidebar';
import BlogBreadcrumb from './_components/BlogBreadcrumb';
import BlogHero from './_components/BlogHero';
import BlogMeta from './_components/BlogMeta';
import BlogContent from './_components/BlogContent';
import RelatedArticles from './_components/RelatedArticles';
import AdBanner from '@/components/ads/AdBanner';
import { getBlogBySlug, getRelatedBlogs } from '@/actions/blogs';

export default async function BlogPostPage({ params }) {
  const resolvedParams = await params;
  const { blogSlug } = resolvedParams;

  const blog = await getBlogBySlug(blogSlug);

  if (!blog) {
    return notFound();
  }

  const relatedBlogs = await getRelatedBlogs(blog, 3);

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
        />
      </div>
    </div>
  );
}