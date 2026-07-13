'use client';

import React, { useState, useMemo, useTransition } from 'react';
import { Search, Plus, Edit2, Trash2, SlidersHorizontal, ChevronLeft, ChevronRight, X, Image as ImageIcon, Tags, ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createBlog, updateBlog, trashBlog, permanentlyDeleteBlog, restoreBlog } from '@/actions/blogs';

import Link from 'next/link';
import { generateBlogSlug } from '@/lib/utils';

export default function BlogsManager({ initialBlogs }) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [viewMode, setViewMode] = useState('active');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [activeRowId, setActiveRowId] = useState(null);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: '',
    blogId: null,
    title: '',
    message: ''
  });

  const categories = useMemo(() => {
    const cats = new Set(blogs.filter(b => b.status !== 'trash').map(b => b.category));
    return ['All', ...Array.from(cats)].filter(Boolean);
  }, [blogs]);

  const [isPending, startTransition] = useTransition();

  const promptTrash = (id) => {
    setModalConfig({
      isOpen: true,
      type: 'trash',
      blogId: id,
      title: 'Move to Trash',
      message: 'Are you sure you want to move this blog to the trash?'
    });
  };

  const promptPermanentDelete = (id) => {
    setModalConfig({
      isOpen: true,
      type: 'delete',
      blogId: id,
      title: 'Permanently Delete',
      message: 'Are you sure you want to permanently delete this blog? This action cannot be undone.'
    });
  };

  const handleConfirm = async () => {
    const { type, blogId } = modalConfig;
    if (!blogId) return;

    startTransition(async () => {
      if (type === 'trash') {
        const res = await trashBlog(blogId);
        if (res.success) {
          setBlogs(blogs.map(b => b.id === blogId ? { ...b, status: 'trash' } : b));
          setModalConfig({ ...modalConfig, isOpen: false });
        }
      } else if (type === 'delete') {
        const res = await permanentlyDeleteBlog(blogId);
        if (res.success) {
          setBlogs(blogs.filter(b => b.id !== blogId));
          setModalConfig({ ...modalConfig, isOpen: false });
        }
      }
    });
  };

  const handleRestore = async (id) => {
    startTransition(async () => {
      const res = await restoreBlog(id);
      if (res.success) {
        setBlogs(blogs.map(b => b.id === id ? { ...b, status: 'draft' } : b));
      }
    });
  };

  const filteredAndSortedBlogs = useMemo(() => {
    let result = [...blogs];
    
    if (viewMode === 'active') {
      result = result.filter(b => b.status !== 'trash');
    } else {
      result = result.filter(b => b.status === 'trash');
    }
    
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(b => 
        b.title.toLowerCase().includes(q) || 
        b.category.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter(b => b.category === selectedCategory);
    }
    
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'date') {
        comparison = new Date(a.date) - new Date(b.date);
      } else if (sortField === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortField === 'category') {
        comparison = (a.category || '').localeCompare(b.category || '');
      } else if (sortField === 'status') {
        comparison = (a.status || 'draft').localeCompare(b.status || 'draft');
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [blogs, search, selectedCategory, sortField, sortOrder, viewMode]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
    return sortOrder === 'asc' ? <ChevronUp className="w-3 h-3 text-brand-600 dark:text-brand-400" /> : <ChevronDown className="w-3 h-3 text-brand-600 dark:text-brand-400" />;
  };

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
            <select 
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="pl-4 pr-8 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none cursor-pointer appearance-none"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <Button 
            variant={viewMode === 'trash' ? 'default' : 'outline'} 
            onClick={() => { setViewMode(viewMode === 'active' ? 'trash' : 'active'); setCurrentPage(1); }} 
            className={`cursor-pointer gap-2 rounded-xl ${viewMode === 'trash' ? 'bg-red-600 hover:bg-red-700 text-white border-transparent' : 'text-slate-600 dark:text-slate-300'}`}
          >
            <Trash2 className="w-4 h-4" /> {viewMode === 'trash' ? 'Exit Trash' : 'Trash'}
          </Button>
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

      {/* Table View */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors select-none" onClick={() => handleSort('title')}>
                  <div className="flex items-center gap-2">Title <SortIcon field="title" /></div>
                </th>
                <th className="px-6 py-4 font-medium cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors select-none" onClick={() => handleSort('category')}>
                  <div className="flex items-center gap-2">Category <SortIcon field="category" /></div>
                </th>
                <th className="px-6 py-4 font-medium cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors select-none" onClick={() => handleSort('status')}>
                  <div className="flex items-center gap-2">Status <SortIcon field="status" /></div>
                </th>
                <th className="px-6 py-4 font-medium cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors select-none" onClick={() => handleSort('date')}>
                  <div className="flex items-center gap-2">Created Date <SortIcon field="date" /></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {paginatedBlogs.map(blog => (
                <tr key={blog.id} onClick={() => setActiveRowId(activeRowId === blog.id ? null : blog.id)} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative cursor-pointer">
                  <td className="px-6 py-4 min-w-[300px]">
                    <div className="flex flex-col">
                      <Link 
                        href={`/dashboard/blogs/${blog.id}/edit`} 
                        className={`font-bold text-base mb-1 truncate max-w-md ${
                          blog.status === 'draft' 
                            ? 'text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300' 
                            : 'text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400'
                        }`}
                      >
                        {blog.title}
                      </Link>
                      {/* Actions on Hover / Click */}
                      <div className={`flex items-center gap-3 transition-opacity text-sm font-medium h-5 mt-1 ${activeRowId === blog.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        {viewMode === 'active' ? (
                          <>
                            <Link href={`/dashboard/blogs/${blog.id}/edit`} className="text-brand-600 hover:text-brand-700 dark:text-brand-400">Edit</Link>
                            <span className="text-slate-300 dark:text-slate-700">|</span>
                            <button disabled={isPending || blog.status === 'published'} onClick={() => promptTrash(blog.id)} className={`text-red-600 ${blog.status === 'published' ? 'opacity-50 cursor-not-allowed' : 'hover:text-red-700'}`} title={blog.status === 'published' ? 'Cannot delete published blog' : ''}>Trash</button>
                            <span className="text-slate-300 dark:text-slate-700">|</span>
                            <Link href={`/blogs/${blog.slug || generateBlogSlug(blog.title)}`} className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">View</Link>
                          </>
                        ) : (
                          <>
                            <button disabled={isPending} onClick={() => handleRestore(blog.id)} className="text-emerald-600 hover:text-emerald-700">Restore</button>
                            <span className="text-slate-300 dark:text-slate-700">|</span>
                            <button disabled={isPending} onClick={() => promptPermanentDelete(blog.id)} className="text-red-600 hover:text-red-700 font-bold">Delete Permanently</button>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase text-slate-600 bg-slate-100 dark:text-slate-300 dark:bg-slate-800 rounded-full">
                      {blog.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase rounded-full ${
                      blog.status === 'trash' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      blog.status === 'draft' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 
                      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    }`}>
                      {blog.status || 'draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                    {blog.date}
                  </td>
                </tr>
              ))}
              {paginatedBlogs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    No blogs found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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

      {/* Confirmation Modal */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{modalConfig.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              {modalConfig.message}
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setModalConfig({ ...modalConfig, isOpen: false })} disabled={isPending}>
                Cancel
              </Button>
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white" 
                onClick={handleConfirm}
                disabled={isPending}
              >
                {isPending ? 'Processing...' : 'Confirm'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
