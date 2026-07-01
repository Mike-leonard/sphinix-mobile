import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function BlogCard({ blog }) {
  return (
    <Card className="group rounded-2xl border-slate-200 dark:border-slate-800 hover:border-brand-500/20 hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-900 overflow-hidden border-0">
      <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-start w-full">
        {/* Blog image banner */}
        <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950 flex-shrink-0 relative">
          <div className={`absolute inset-0 bg-gradient-to-br ${blog.color} opacity-40 group-hover:scale-110 transition-transform duration-500`}></div>
          <div className="absolute inset-0 flex items-center justify-center font-black text-2xl text-white/20 select-none">SPHINIX</div>
          <span className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-900/90 text-brand-400 text-[9px] font-bold px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 uppercase tracking-widest">
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
          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-400 transition-colors leading-snug">
            {blog.title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">
            {blog.excerpt}
          </p>
          <a href="#" className="inline-flex items-center text-xs font-bold text-brand-400 group-hover:text-brand-300 hover:underline gap-1 pt-1">
            Read Full Article &rarr;
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
