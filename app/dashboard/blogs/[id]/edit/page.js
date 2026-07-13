import React from 'react';
import BlogEditor from '@/app/dashboard/blogs/_components/editor/BlogEditor';
import { getBlogById } from '@/actions/blogs';
import { getCategories } from '@/actions/categories';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  return {
    title: `Edit Blog ${resolvedParams.id} | Dashboard`,
  };
}

export default async function EditBlogPage({ params }) {
  const resolvedParams = await params;
  const blogId = resolvedParams.id;
  
  const [blog, categories] = await Promise.all([
    getBlogById(blogId),
    getCategories()
  ]);

  if (!blog) {
    notFound();
  }

  return (
    <div className="p-8">
      <BlogEditor initialData={blog} categories={categories} />
    </div>
  );
}
