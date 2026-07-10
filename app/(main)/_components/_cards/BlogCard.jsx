import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { generateBlogSlug } from '@/lib/utils';

export default function BlogCard({ blog }) {
  const slug = generateBlogSlug(blog.title);
  const href = `/blogs/${slug}`;

  return (
    <Link href={href} style={{fontSize: "var(--font-size-link-inline, var(--font-size-link-default))"}} className="block group">
      <Card className="rounded-2xl border-slate-200 dark:border-slate-800 group-hover:border-brand-500/20 group-hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-900 overflow-hidden border-0">
      <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-start w-full">
        {/* Blog image banner */}
        <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950 flex-shrink-0 relative">
          {blog.image ? (
            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          ) : (
            <>
              <div className={`absolute inset-0 bg-gradient-to-br ${blog.color || 'from-slate-800 to-slate-900'} opacity-40 group-hover:scale-110 transition-transform duration-500`}></div>
              <div className="absolute inset-0 flex items-center justify-center font-black text-2xl text-white/20 select-none">SPHINIX</div>
            </>
          )}
          <span className="absolute bottom-3 left-3 bg-white dark:bg-slate-950 text-brand-700 dark:text-brand-400 text-[10px] font-bold px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 uppercase tracking-widest shadow-md">
            {blog.category}
          </span>
        </div>

        {/* Blog details */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>{blog.date}</span>
            <span>•</span>
            <span>{blog.readTime}</span>
            <span>•</span>
            <span>By {blog.author}</span>
          </div>
          <h3  style={{fontSize: "var(--font-size-h3-card, var(--font-size-h3-default))"}} className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-400 transition-colors leading-snug">
            {blog.title}
          </h3>
          <p  style={{fontSize: "var(--font-size-p-card, var(--font-size-p-default))"}} className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">
            {blog.excerpt}
          </p>
          <span className="inline-flex items-center text-xs font-bold text-brand-400 group-hover:text-brand-300 group-hover:underline gap-1 pt-1">
            Read Full Article &rarr;
          </span>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
}
