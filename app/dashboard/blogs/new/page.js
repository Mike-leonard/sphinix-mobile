import React from 'react';
import BlogEditor from '@/app/dashboard/blogs/_components/editor/BlogEditor';
import { getCategories } from '@/actions/categories';

export const metadata = {
  title: 'New Blog Post | Dashboard',
  description: 'Create a new blog post',
};

export default async function NewBlogPage() {
  const categories = await getCategories();

  return (
    <div className="p-8">
      <BlogEditor categories={categories} />
    </div>
  );
}
