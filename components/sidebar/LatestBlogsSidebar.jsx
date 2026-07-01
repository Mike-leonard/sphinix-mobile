import React from 'react';
import Link from 'next/link';

export default function LatestBlogsSidebar({ blogs }) {
  // Take top 3 or 4 blogs to display
  const latestBlogs = blogs.slice(0, 4);

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
      <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center justify-between">
        <span>Latest Articles</span>
      </h3>
      <div className="flex flex-col gap-4">
        {latestBlogs.map(blog => (
          <Link href="/blogs" key={blog.id} className="group flex gap-3 items-center">
            <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-950 flex-shrink-0 relative overflow-hidden flex items-center justify-center">
              <div className={`absolute inset-0 bg-gradient-to-br ${blog.gradientColor} opacity-20`} />
              <span className="text-xs text-slate-400 font-bold">Img</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-brand-500 transition-colors">
                {blog.title}
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                {blog.readTime} • {blog.date}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
