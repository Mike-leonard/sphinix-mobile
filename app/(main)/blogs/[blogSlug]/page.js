import React from 'react';
import { notFound } from 'next/navigation';
import RightSidebar from '@/components/sidebar/RightSidebar';
import BlogBreadcrumb from './_components/BlogBreadcrumb';
import BlogHero from './_components/BlogHero';
import BlogMeta from './_components/BlogMeta';
import BlogContent from './_components/BlogContent';
import RelatedArticles from './_components/RelatedArticles';
import AdBanner from '@/components/ads/AdBanner';
import { getPublishedBlogBySlug, getRelatedBlogs } from '@/actions/blogs';

/**
 * Generates dynamic SEO metadata for individual blog post pages.
 */
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { blogSlug } = resolvedParams;

  const blog = await getPublishedBlogBySlug(blogSlug);
  if (!blog) {
    return {
      title: 'Article Not Found | Sphinix Mobile',
      description: 'The requested blog article could not be found.',
    };
  }

  const seo = blog.seo || {};
  const metaTitle = seo.metaTitle || `${blog.title} | Sphinix Mobile Blog`;
  const metaDescription = seo.metaDescription || blog.excerpt || `Read ${blog.title} by ${blog.author} on Sphinix Mobile.`;
  const keywordsList = seo.keywords
    ? (typeof seo.keywords === 'string' ? seo.keywords.split(',').map(k => k.trim()) : seo.keywords)
    : [blog.category, 'mobile news', 'smartphone reviews', blog.author].filter(Boolean);

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: keywordsList,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: 'article',
      publishedTime: blog.createdAt,
      authors: [blog.author],
      images: blog.image ? [{ url: blog.image, alt: blog.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: blog.image ? [blog.image] : [],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const resolvedParams = await params;
  const { blogSlug } = resolvedParams;

  const blog = await getPublishedBlogBySlug(blogSlug);

  if (!blog) {
    return notFound();
  }

  const relatedBlogs = await getRelatedBlogs(blog, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': blog.title,
    'description': blog.excerpt || blog.seo?.metaDescription || '',
    'image': blog.image ? [blog.image] : [],
    'datePublished': blog.createdAt,
    'author': {
      '@type': 'Person',
      'name': blog.author || 'Sphinix Editorial Team'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
    </>
  );
}