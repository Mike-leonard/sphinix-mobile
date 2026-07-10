import React from 'react';
import { getBlogs } from '@/actions/blogs';
import BlogsManager from '@/app/dashboard/blogs/_components/BlogsManager';

export default async function BlogsPage() {
  const initialBlogs = await getBlogs();

  return (
    <div className="p-8">
      <div className="max-w-[1400px] mx-auto">
        <h1 style={{fontSize: "var(--font-size-h1-dashboard, var(--font-size-h1-default))"}} className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Blogs Management</h1>
        <p style={{fontSize: "var(--font-size-p-default, var(--font-size-p-default))"}} className="text-slate-600 dark:text-slate-400 mb-8">
          Write, edit, and publish blog posts.
        </p>
        
        <BlogsManager initialBlogs={initialBlogs} />
      </div>
    </div>
  );
}
