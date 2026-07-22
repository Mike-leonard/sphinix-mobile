import React from 'react';
import Link from 'next/link';
import BlogCard from '@/app/(main)/_components/_cards/BlogCard';
import InFeedAd from '@/components/ads/InFeedAd';
import { getSettings } from '@/actions/settings';

export default async function BlogList({ currentBlogs = [] }) {
  const settings = await getSettings();
  const freq = settings?.advertisements?.injectionFrequency?.blogsPageGrid || 4;

  return (
    <div className="grid grid-cols-1 gap-6">
      {currentBlogs.length > 0 ? (
        currentBlogs.map((blog, index) => (
          <React.Fragment key={blog.id}>
            {index > 0 && index % freq === 0 && (
              <div className="w-full py-2">
                <InFeedAd placement="homePageInFeed" />
              </div>
            )}
            <BlogCard blog={blog} />
          </React.Fragment>
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p style={{ fontSize: "var(--font-size-p-form, var(--font-size-p-default))" }} className="text-slate-500 font-medium">No blogs found matching your criteria.</p>
          <Link
            href="/blogs"
            style={{ fontSize: "var(--font-size-button-default, var(--font-size-button-default))" }} 
            className="mt-4 text-brand-500 hover:underline font-bold inline-block"
          >
            Clear Filters
          </Link>
        </div>
      )}
    </div>
  );
}
