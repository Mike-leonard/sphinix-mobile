import React from 'react';
import Link from 'next/link';
import { ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';
import { generateBlogSlug } from '@/lib/utils';

export default function BlogsTable({ 
  paginatedBlogs, 
  handleSort, 
  sortField, 
  sortOrder, 
  activeRowId, 
  setActiveRowId, 
  viewMode, 
  isPending, 
  promptTrash, 
  handleRestore,
  handleToggleStatus,
  handleDuplicate,
  promptPermanentDelete 
}) {
  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
    return sortOrder === 'asc' ? <ChevronUp className="w-3 h-3 text-brand-600 dark:text-brand-400" /> : <ChevronDown className="w-3 h-3 text-brand-600 dark:text-brand-400" />;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return typeof dateStr === 'string' ? dateStr : '—';
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      return { date: formattedDate, time: formattedTime };
    } catch {
      return typeof dateStr === 'string' ? dateStr : '—';
    }
  };

  return (
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
            {paginatedBlogs.map(blog => {
              const dateInfo = formatDate(blog.createdAt || blog.date);
              return (
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
                            <Link href={`/dashboard/blogs/${blog.id}/edit`} className="text-brand-600 hover:text-brand-700 dark:text-brand-400 cursor-pointer">Edit</Link>
                            <span className="text-slate-300 dark:text-slate-700">|</span>
                            {blog.status === 'published' ? (
                              <button disabled={isPending} onClick={(e) => { e.stopPropagation(); handleToggleStatus?.(blog.id, 'draft'); }} className="text-amber-600 hover:text-amber-700 dark:text-amber-400 cursor-pointer disabled:cursor-not-allowed">Draft</button>
                            ) : (
                              <button disabled={isPending} onClick={(e) => { e.stopPropagation(); handleToggleStatus?.(blog.id, 'published'); }} className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 cursor-pointer disabled:cursor-not-allowed">Publish</button>
                            )}
                            <span className="text-slate-300 dark:text-slate-700">|</span>
                            <button disabled={isPending} onClick={(e) => { e.stopPropagation(); handleDuplicate?.(blog.id); }} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer disabled:cursor-not-allowed">Duplicate</button>
                            <span className="text-slate-300 dark:text-slate-700">|</span>
                            <button 
                              disabled={isPending || blog.status === 'published'} 
                              onClick={(e) => { e.stopPropagation(); promptTrash(blog.id); }} 
                              className={`text-red-600 ${blog.status === 'published' ? 'opacity-50 cursor-not-allowed' : 'hover:text-red-700 cursor-pointer'}`} 
                              title={blog.status === 'published' ? 'Cannot delete published blog' : ''}
                            >
                              Trash
                            </button>
                            <span className="text-slate-300 dark:text-slate-700">|</span>
                            <Link href={`/blogs/${blog.slug || generateBlogSlug(blog.title)}`} target="_blank" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer">View</Link>
                          </>
                        ) : (
                          <>
                            <button disabled={isPending} onClick={(e) => { e.stopPropagation(); handleRestore(blog.id); }} className="text-emerald-600 hover:text-emerald-700 cursor-pointer disabled:cursor-not-allowed">Restore</button>
                            <span className="text-slate-300 dark:text-slate-700">|</span>
                            <button disabled={isPending} onClick={(e) => { e.stopPropagation(); promptPermanentDelete(blog.id); }} className="text-red-600 hover:text-red-700 font-bold cursor-pointer disabled:cursor-not-allowed">Delete Permanently</button>
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
                  <td className="px-6 py-4 text-xs">
                    {typeof dateInfo === 'object' ? (
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {dateInfo.date}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {dateInfo.time}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-500 dark:text-slate-400">{dateInfo}</span>
                    )}
                  </td>
                </tr>
              );
            })}
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
  );
}
