'use client';

import React, { useState, useTransition } from 'react';
import { Tag } from 'lucide-react';
import { createCategory, deleteCategory, updateCategory } from '@/actions/categories';

import CategoryForm from './CategoryForm';
import CategoryList from './CategoryList';
import DeleteCategoryModal from './DeleteCategoryModal';

export default function CategoryManager({ initialCategories }) {
  const [categories, setCategories] = useState(initialCategories);
  const [newCategory, setNewCategory] = useState('');
  const [isPending, startTransition] = useTransition();
  const [editingCategory, setEditingCategory] = useState(null);
  const [editValue, setEditValue] = useState('');
  
  // Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState('');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    startTransition(async () => {
      const res = await createCategory(newCategory);
      if (res.success) {
        setCategories([...categories, newCategory.trim()].sort((a, b) => a.localeCompare(b)));
        setNewCategory('');
      } else {
        alert(res.error);
      }
    });
  };

  const confirmDeleteCategory = () => {
    if (!categoryToDelete) return;
    
    startTransition(async () => {
      const res = await deleteCategory(categoryToDelete);
      if (res.success) {
        setCategories(categories.filter(c => c !== categoryToDelete));
        setIsDeleteModalOpen(false);
        setCategoryToDelete('');
      } else {
        alert(res.error);
      }
    });
  };

  const openDeleteModal = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editValue.trim() || editValue.trim() === editingCategory) {
      setEditingCategory(null);
      return;
    }

    startTransition(async () => {
      const res = await updateCategory(editingCategory, editValue.trim());
      if (res.success) {
        const newCats = categories.filter(c => c !== editingCategory);
        newCats.push(editValue.trim());
        setCategories(newCats.sort((a, b) => a.localeCompare(b)));
        setEditingCategory(null);
      } else {
        alert(res.error);
      }
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden relative">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Tag className="w-5 h-5 text-brand-500" />
          Manage Categories
        </h2>
        <p className="text-sm text-slate-500 mt-1">Add or remove predefined categories for your blog posts.</p>
      </div>

      <div className="p-6">
        <CategoryForm 
          newCategory={newCategory} 
          setNewCategory={setNewCategory} 
          handleAddCategory={handleAddCategory} 
          isPending={isPending} 
        />

        <CategoryList 
          categories={categories}
          isPending={isPending}
          editingCategory={editingCategory}
          editValue={editValue}
          setEditingCategory={setEditingCategory}
          setEditValue={setEditValue}
          handleSaveEdit={handleSaveEdit}
          openDeleteModal={openDeleteModal}
        />
      </div>

      <DeleteCategoryModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteCategory}
        categoryName={categoryToDelete}
        isPending={isPending}
      />
    </div>
  );
}
