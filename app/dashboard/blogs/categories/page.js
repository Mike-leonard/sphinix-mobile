import React from 'react';
import CategoryManager from '@/app/dashboard/blogs/categories/_components/CategoryManager';
import { getCategories } from '@/actions/categories';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Manage Categories | Dashboard',
  description: 'Manage blog categories',
};

export default async function CategoriesPage() {
  const initialCategories = await getCategories();

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard/blogs" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-6 w-fit">
          <ArrowLeft className="w-4 h-4" />
          Back to Blogs
        </Link>
        
        <h1 style={{fontSize: "var(--font-size-h1-dashboard, var(--font-size-h1-default))"}} className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Blog Categories</h1>
        <p style={{fontSize: "var(--font-size-p-default, var(--font-size-p-default))"}} className="text-slate-600 dark:text-slate-400 mb-8">
          Manage the predefined categories available when writing blog posts.
        </p>

        <CategoryManager initialCategories={initialCategories} />
      </div>
    </div>
  );
}
