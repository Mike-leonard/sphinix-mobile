'use client';

import React, { useState, useMemo, useTransition } from 'react';
import { Search, Plus, Edit2, Trash2, SlidersHorizontal, ChevronLeft, ChevronRight, X, Image as ImageIcon, Tags } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createBlog, updateBlog, deleteBlog } from '@/actions/blogs';

import Link from 'next/link';

export default function BlogsManager({ initialBlogs }) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'title', 'category'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [isPending, startTransition] = useTransition();

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      startTransition(async () => {
        const res = await deleteBlog(id);
        if (res.success) {
          setBlogs(blogs.filter(b => b.id !== id));
        }
      });
    }
  };

  const filteredAndSortedBlogs = useMemo(() => {
    let result = [...blogs];
    
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(b => 
        b.title.toLowerCase().includes(q) || 
        b.category.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q)
      );
    }
    
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'category':
        result.sort((a, b) => a.category.localeCompare(b.category));
        break;
    }
    
    return result;
  }, [blogs, search, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedBlogs.length / itemsPerPage);
  const paginatedBlogs = filteredAndSortedBlogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search blogs..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-brand-500/50 outline-none text-sm"
          />
        </div>
        
        <div className="flex w-full sm:w-auto items-center gap-3">
          <div className="relative">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select 
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
              className="pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none cursor-pointer appearance-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Alphabetical (A-Z)</option>
              <option value="category">By Category</option>
            </select>
          </div>
          <Link href="/dashboard/blogs/categories">
            <Button variant="outline" className="cursor-pointer gap-2 rounded-xl text-slate-600 dark:text-slate-300">
              <Tags className="w-4 h-4" /> Manage Categories
            </Button>
          </Link>
          <Link href="/dashboard/blogs/new">
            <Button className="cursor-pointer bg-brand-600 hover:bg-brand-700 text-white gap-2 rounded-xl">
              <Plus className="w-4 h-4" /> New Blog
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedBlogs.map(blog => (
          <div key={blog.id} className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-md transition-all">
            {/* Image/Cover */}
            <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
              {blog.image ? (
                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${blog.color} opacity-80`} />
              )}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase text-white bg-black/40 backdrop-blur-md rounded-full w-fit">
                  {blog.category}
                </span>
                <span className={`px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase text-white rounded-full w-fit ${blog.status === 'draft' ? 'bg-amber-500/80' : 'bg-emerald-500/80'} backdrop-blur-md`}>
                  {blog.status || 'draft'}
                </span>
              </div>
              
              {/* Actions Overlay */}
              <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link href={`/dashboard/blogs/${blog.id}/edit`} className="p-1.5 bg-white/90 dark:bg-slate-900/90 hover:bg-white text-brand-600 rounded-lg backdrop-blur-md transition-colors shadow-sm inline-block">
                  <Edit2 className="w-4 h-4" />
                </Link>
                <button disabled={isPending} onClick={() => handleDelete(blog.id)} className="p-1.5 bg-white/90 dark:bg-slate-900/90 hover:bg-red-50 text-red-600 rounded-lg backdrop-blur-md transition-colors shadow-sm">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {blog.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 flex-1">
                {blog.excerpt}
              </p>
              
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800">
                <span>{blog.date}</span>
                <span>{blog.readTime}</span>
              </div>
            </div>
          </div>
        ))}
        {paginatedBlogs.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No blogs found matching your criteria.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-6">
          <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-slate-600 dark:text-slate-400 px-4 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

    </div>
  );
}
