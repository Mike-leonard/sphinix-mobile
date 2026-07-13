import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CategoryForm({ newCategory, setNewCategory, handleAddCategory, isPending }) {
  return (
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
  );
}
