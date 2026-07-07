import React from 'react';
import BlogCard from '@/app/(main)/_components/_cards/BlogCard';

export default function RelatedArticles({ relatedBlogs }) {
  if (!relatedBlogs || relatedBlogs.length === 0) return null;

  return (
    <div className="mt-4 mb-8">
      <h3  style={{fontSize: "var(--font-size-h3-section, var(--font-size-h3-default))"}} className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-6 bg-brand-500 rounded-full inline-block"></span>
        Related Articles
      </h3>
      <div className="flex flex-col gap-4">
        {relatedBlogs.map(rb => (
          <BlogCard key={rb.id} blog={rb} />
        ))}
      </div>
    </div>
  );
}
