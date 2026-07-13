'use client';

import React, { useState, useMemo, useTransition } from 'react';
import { trashBlog, permanentlyDeleteBlog, restoreBlog } from '@/actions/blogs';

import BlogsToolbar from './BlogsToolbar';
import BlogsTable from './BlogsTable';
import BlogsPagination from './BlogsPagination';
import BlogsConfirmModal from './BlogsConfirmModal';

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

  const totalPages = Math.ceil(filteredAndSortedBlogs.length / itemsPerPage);
  const paginatedBlogs = filteredAndSortedBlogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <BlogsToolbar 
        search={search}
        setSearch={setSearch}
        setCurrentPage={setCurrentPage}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <BlogsTable 
        paginatedBlogs={paginatedBlogs}
        handleSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
        activeRowId={activeRowId}
        setActiveRowId={setActiveRowId}
        viewMode={viewMode}
        isPending={isPending}
        promptTrash={promptTrash}
        handleRestore={handleRestore}
        promptPermanentDelete={promptPermanentDelete}
      />

      <BlogsPagination 
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <BlogsConfirmModal 
        modalConfig={modalConfig}
        setModalConfig={setModalConfig}
        handleConfirm={handleConfirm}
        isPending={isPending}
      />
    </div>
  );
}
