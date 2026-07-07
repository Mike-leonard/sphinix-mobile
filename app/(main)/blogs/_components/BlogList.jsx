import React from 'react';
import BlogCard from '@/app/(main)/_components/_cards/BlogCard';
import InFeedAd from '@/components/ads/InFeedAd';
import { Button } from "@/components/ui/button";
import { useSettings } from '@/context/SettingsContext';

export default function BlogList({ currentBlogs, setSearchQuery, setSelectedCategory }) {
  const settings = useSettings();
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
          <p  style={{fontSize: "var(--font-size-p-form, var(--font-size-p-default))"}} className="text-slate-500 font-medium">No blogs found matching your criteria.</p>
          <Button variant="none" size="none" style={{fontSize: "var(--font-size-button-default, var(--font-size-button-default))"}} 
            onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
            className="mt-4 text-brand-500 hover:underline font-bold"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
