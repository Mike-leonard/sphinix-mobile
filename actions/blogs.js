'use server';

import { revalidatePath } from 'next/cache';
import { verifySession } from './auth';
import { 
  getAllBlogs, 
  getBlogById as getBlogByIdQuery, 
  createBlogQuery, 
  updateBlogById, 
  deleteBlogById, 
  updateBlogCategory, 
  getPublishedBlogs,
  getPublishedBlogsCount,
  getBlogCategoryCountsQuery
} from '@/queries/blogs';

export async function allBlogs() {
  try {
    const blogs = await getAllBlogs();
    return blogs;
  } catch (error) {
    console.error('Error reading blogs from DB:', error);
    return [];
  }
}

export async function publishedBlogsCount(optionsOrQuery = '', categoryParam = 'All') {
  try {
    const count = await getPublishedBlogsCount(optionsOrQuery, categoryParam);
    return count;
  } catch (error) {
    console.error('Error reading blogs count from DB:', error);
    return 0;
  }
}

export async function publishedBlogs(optionsOrLimit = 10, queryParam = '', categoryParam = 'All', offsetParam = 0) {
  try {
    const blogs = await getPublishedBlogs(optionsOrLimit, queryParam, categoryParam, offsetParam);
    return blogs;
  } catch (error) {
    console.error('Error reading published blogs from DB:', error);
    return [];
  }
}

export async function getBlogCategoryCounts() {
  try {
    const counts = await getBlogCategoryCountsQuery();
    return counts;
  } catch (error) {
    console.error('Error reading category counts from DB:', error);
    return [];
  }
}

export async function getFeaturedBlogs() {
  try {
    const blogs = await getFeaturedBlogsQuery();
    return blogs;
  } catch (error) {
    console.error('Error reading featured blogs from DB:', error);
    return [];
  }
}

export async function getRecentBlogs(limit = 10) {
  try {
    const blogs = await getRecentBlogsQuery(limit);
    return blogs;
  } catch (error) {
    console.error('Error reading recent blogs from DB:', error);
    return [];
  }
}

export async function getBlogsByCategory(category, limit = 10) {
  try {
    const blogs = await getBlogsByCategoryQuery(category, limit);
    return blogs;
  } catch (error) {
    console.error('Error reading blogs by category from DB:', error);
    return [];
  }
}


export async function getBlogsBySearchWithPaginationQuery(query, page, limit) {
  try {
    const result = await getBlogsBySearchWithPaginationQuery(query, page, limit);
    return result;
  } catch (error) {
    console.error('Error reading blogs by search with pagination from DB:', error);
    return { blogs: [], total: 0 };
  }
}



export async function getBlogById(id) {
  try {
    const blog = await getBlogByIdQuery(id);
    return blog;
  } catch (error) {
    console.error('Error finding blog:', error);
    return null;
  }
}

export async function createBlog(formData) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');
    
    const newBlog = {
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
    
    await createBlogQuery(newBlog);
    
    revalidatePath('/dashboard/blogs');
    
    return { success: true, message: 'Blog created successfully' };
  } catch (error) {
    console.error('Error creating blog:', error);
    return { success: false, error: 'Failed to create blog' };
  }
}

export async function updateBlog(id, formData) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    await updateBlogById(id, formData);
    
    revalidatePath('/dashboard/blogs');
    
    return { success: true, message: 'Blog updated successfully' };
  } catch (error) {
    console.error('Error updating blog:', error);
    return { success: false, error: 'Failed to update blog' };
  }
}

export async function trashBlog(id) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    await updateBlogById(id, { status: 'trash' });
    
    revalidatePath('/dashboard/blogs');
    
    return { success: true, message: 'Blog moved to trash' };
  } catch (error) {
    console.error('Error trashing blog:', error);
    return { success: false, error: 'Failed to trash blog' };
  }
}

export async function permanentlyDeleteBlog(id) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    await deleteBlogById(id);
    
    revalidatePath('/dashboard/blogs');
    
    return { success: true, message: 'Blog permanently deleted' };
  } catch (error) {
    console.error('Error deleting blog:', error);
    return { success: false, error: 'Failed to delete blog' };
  }
}

export async function restoreBlog(id) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    await updateBlogById(id, { status: 'draft' });
    
    revalidatePath('/dashboard/blogs');
    
    return { success: true, message: 'Blog restored as draft' };
  } catch (error) {
    console.error('Error restoring blog:', error);
    return { success: false, error: 'Failed to restore blog' };
  }
}

export async function reassignCategory(oldCategory, newCategory) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    await updateBlogCategory(oldCategory, newCategory);
    
    revalidatePath('/dashboard/blogs');
    
    return { success: true };
  } catch (error) {
    console.error('Error reassigning category:', error);
    return { success: false, error: 'Failed to reassign category in blogs' };
  }
}
