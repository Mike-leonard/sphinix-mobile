import React from 'react';
import Link from 'next/link';
import BlogCard from '../_cards/BlogCard';
import InFeedAd from '@/components/ads/InFeedAd';
import MOCK_BLOGS from '@/data/blogs.json';
import { ArrowRight } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export default function BlogSection({ limit = 8 }) {
  const settings = useSettings();
  const freq = settings?.advertisements?.injectionFrequency?.homePageBlogs || 4;
  const displayedBlogs = MOCK_BLOGS.slice(0, limit);

  return (
    <section className="space-y-6">
      <div>
        <h2  style={{fontSize: "var(--font-size-h2-section, var(--font-size-h2-default))"}} className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Latest News & Tech Articles</h2>
        <p  style={{fontSize: "var(--font-size-p-subtitle, var(--font-size-p-default))"}} className="text-xs text-slate-600 dark:text-slate-400">Stay updated with deep technical benchmarks and mobile news</p>
      </div>
      <div className="space-y-4">
        {displayedBlogs.map((blog, index) => (
          <React.Fragment key={blog.id}>
            {index > 0 && index % freq === 0 && (
              <div className="w-full py-2">
                <InFeedAd placement="homePageInFeed" />
              </div>
            )}
            <BlogCard blog={blog} />
          </React.Fragment>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <Link
          href="/blogs" style={{fontSize: "var(--font-size-link-inline, var(--font-size-link-default))"}} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-colors border border-brand-200 dark:border-brand-500/30"
        >
          Read More Blogs
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}