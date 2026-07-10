'use client';

import React, { useState, useTransition } from 'react';
import { Plus, Trash2, Tag, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createCategory, deleteCategory, updateCategory } from '@/actions/categories';

export default function CategoryManager({ initialCategories }) {
  const [categories, setCategories] = useState(initialCategories);
  const [newCategory, setNewCategory] = useState('');
  const [isPending, startTransition] = useTransition();
  const [editingCategory, setEditingCategory] = useState(null);
  const [editValue, setEditValue] = useState('');

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

  const handleDeleteCategory = (categoryToDelete) => {
    if (confirm(`Are you sure you want to delete the category "${categoryToDelete}"? All blogs using this category will be reassigned to "Uncategorized".`)) {
      startTransition(async () => {
        const res = await deleteCategory(categoryToDelete);
        if (res.success) {
          setCategories(categories.filter(c => c !== categoryToDelete));
        } else {
          alert(res.error);
        }
      });
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setEditValue(category);
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
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Tag className="w-5 h-5 text-brand-500" />
          Manage Categories
        </h2>
        <p className="text-sm text-slate-500 mt-1">Add or remove predefined categories for your blog posts.</p>
      </div>

      <div className="p-6">
        <form onSubmit={handleAddCategory} className="flex gap-3 mb-8">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name..."
            className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/50 text-sm"
          />
          <Button type="submit" disabled={isPending || !newCategory.trim()} className="bg-brand-600 hover:bg-brand-700 text-white gap-2 rounded-xl">
            <Plus className="w-4 h-4" /> Add
          </Button>
        </form>

        <div className="space-y-3">
          {categories.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No categories found.</p>
          ) : (
            categories.map((category, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 group">
                {editingCategory === category ? (
                  <div className="flex items-center gap-3 w-full">
                    <input 
                      type="text" 
                      value={editValue} 
                      onChange={e => setEditValue(e.target.value)} 
                      className="flex-1 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-brand-500/50 text-sm"
                      autoFocus
                    />
                    <div className="flex items-center gap-1">
                      <button disabled={isPending} onClick={handleSaveEdit} className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-md transition-colors">
                        <Check className="w-4 h-4" />
                      </button>
                      <button disabled={isPending} onClick={() => setEditingCategory(null)} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-md transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {category} {category.toLowerCase() === 'uncategorized' && <span className="text-xs font-normal text-slate-400 ml-2">(Default Fallback)</span>}
                    </span>
                    {category.toLowerCase() !== 'uncategorized' && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleEditCategory(category)}
                          className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleDeleteCategory(category)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
