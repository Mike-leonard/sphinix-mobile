import React from 'react';
import BlogCard from '../_cards/BlogCard';
import MOCK_BLOGS from '@/data/blogs.json';

export default function BlogSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Latest News & Tech Articles</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Stay updated with deep technical benchmarks and mobile news</p>
      </div>
      <div className="space-y-4">
        {MOCK_BLOGS.map(blog => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </section>
  );
}