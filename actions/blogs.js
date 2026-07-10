'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

const getBlogsFilePath = () => path.join(process.cwd(), 'data', 'blogs.json');

export async function getBlogs() {
  try {
    const filePath = getBlogsFilePath();
    const fileData = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error('Error reading blogs.json:', error);
    return [];
  }
}

export async function getBlogById(id) {
  try {
    const blogs = await getBlogs();
    return blogs.find(b => b.id === parseInt(id)) || null;
  } catch (error) {
    console.error('Error finding blog:', error);
    return null;
  }
}

export async function createBlog(formData) {
  try {
    const blogs = await getBlogs();
    
    // Generate new ID
    const newId = blogs.length > 0 ? Math.max(...blogs.map(b => b.id)) + 1 : 1;
    
    const newBlog = {
      id: newId,
      title: formData.title,
      excerpt: formData.excerpt,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      readTime: formData.readTime || '5 min read',
      author: formData.author || 'Admin',
      category: formData.category,
      color: formData.color || 'from-brand-600 to-purple-800',
      image: formData.image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
      content: formData.content || '',
      status: formData.status || 'draft',
      seo: formData.seo || { metaTitle: '', metaDescription: '', keywords: '' }
    };
    
    blogs.unshift(newBlog);
    
    await fs.writeFile(getBlogsFilePath(), JSON.stringify(blogs, null, 2));
    revalidatePath('/dashboard/blogs');
    
    return { success: true, message: 'Blog created successfully' };
  } catch (error) {
    console.error('Error creating blog:', error);
    return { success: false, error: 'Failed to create blog' };
  }
}

export async function updateBlog(id, formData) {
  try {
    const blogs = await getBlogs();
    const index = blogs.findIndex(b => b.id === id);
    
    if (index === -1) {
      return { success: false, error: 'Blog not found' };
    }
    
    blogs[index] = {
      ...blogs[index],
      ...formData
    };
    
    await fs.writeFile(getBlogsFilePath(), JSON.stringify(blogs, null, 2));
    revalidatePath('/dashboard/blogs');
    
    return { success: true, message: 'Blog updated successfully' };
  } catch (error) {
    console.error('Error updating blog:', error);
    return { success: false, error: 'Failed to update blog' };
  }
}

export async function deleteBlog(id) {
  try {
    const blogs = await getBlogs();
    const filteredBlogs = blogs.filter(b => b.id !== parseInt(id));
    
    await fs.writeFile(getBlogsFilePath(), JSON.stringify(filteredBlogs, null, 2));
    revalidatePath('/dashboard/blogs');
    
    return { success: true, message: 'Blog deleted successfully' };
  } catch (error) {
    console.error('Error deleting blog:', error);
    return { success: false, error: 'Failed to delete blog' };
  }
}

export async function reassignCategory(oldCategory, newCategory) {
  try {
    const blogs = await getBlogs();
    let updated = false;

    const updatedBlogs = blogs.map(blog => {
      if (blog.category.toLowerCase() === oldCategory.toLowerCase()) {
        updated = true;
        return { ...blog, category: newCategory };
      }
      return blog;
    });

    if (updated) {
      await fs.writeFile(getBlogsFilePath(), JSON.stringify(updatedBlogs, null, 2));
      revalidatePath('/dashboard/blogs');
    }

    return { success: true };
  } catch (error) {
    console.error('Error reassigning category:', error);
    return { success: false, error: 'Failed to reassign category in blogs' };
  }
}
