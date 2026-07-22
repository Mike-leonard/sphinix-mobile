'use server';

import { revalidatePath } from 'next/cache';
import { verifySession } from './auth';
import { 
  getAllBlogs, 
  getBlogById as getBlogByIdQuery, 
  getBlogBySlugQuery,
  getRelatedBlogsQuery,
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

export async function blogCategoryCounts() {
  try {
    const counts = await getBlogCategoryCountsQuery();
    return counts;
  } catch (error) {
    console.error('Error reading category counts from DB:', error);
    return [];
  }
}

export async function getBlogBySlug(slug) {
  try {
    return await getBlogBySlugQuery(slug);
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    return null;
  }
}

export async function getRelatedBlogs(currentBlog, limit = 3) {
  try {
    return await getRelatedBlogsQuery(currentBlog, limit);
  } catch (error) {
    console.error('Error fetching related blogs:', error);
    return [];
  }
}

export async function getBlogById(id) {
  try {
    const blog = await getBlogByIdQuery(id);
    return blog;
  } catch (error) {
    console.error('Error reading blog by ID from DB:', error);
    return null;
  }
}

export async function createBlog(formData) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    const date = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const data = {
      title: formData.title,
      excerpt: formData.excerpt,
      date,
      readTime: formData.readTime || '5 min read',
      author: formData.author || 'Editorial Team',
      category: formData.category || 'Tech',
      color: formData.color || 'from-indigo-600 to-purple-600',
      image: formData.image || '',
      content: formData.content || '',
      status: formData.status || 'draft',
      seo: formData.seo || {
        metaTitle: "",
        metaDescription: "",
        keywords: "",
        canonicalUrl: "",
        ogTitle: "",
        ogDescription: "",
        ogImage: "",
        noIndex: false
      }
    };

    await createBlogQuery(data);

    revalidatePath('/dashboard/blogs');
    revalidatePath('/blogs');

    return { success: true, message: 'Blog post created successfully' };
  } catch (error) {
    console.error('Error creating blog:', error);
    return { success: false, error: error.message || 'Failed to create blog post' };
  }
}

export async function updateBlog(id, formData) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    const data = {};
    if (formData.title !== undefined) data.title = formData.title;
    if (formData.excerpt !== undefined) data.excerpt = formData.excerpt;
    if (formData.readTime !== undefined) data.readTime = formData.readTime;
    if (formData.author !== undefined) data.author = formData.author;
    if (formData.category !== undefined) data.category = formData.category;
    if (formData.color !== undefined) data.color = formData.color;
    if (formData.image !== undefined) data.image = formData.image;
    if (formData.content !== undefined) data.content = formData.content;
    if (formData.status !== undefined) data.status = formData.status;
    if (formData.seo !== undefined) data.seo = formData.seo;

    await updateBlogById(id, data);

    revalidatePath('/dashboard/blogs');
    revalidatePath(`/blogs/${id}`);
    revalidatePath('/blogs');

    return { success: true, message: 'Blog post updated successfully' };
  } catch (error) {
    console.error('Error updating blog:', error);
    return { success: false, error: error.message || 'Failed to update blog post' };
  }
}

export async function trashBlog(id) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    await updateBlogById(id, { status: 'trash' });

    revalidatePath('/dashboard/blogs');
    revalidatePath('/blogs');

    return { success: true, message: 'Blog moved to trash' };
  } catch (error) {
    console.error('Error trashing blog:', error);
    return { success: false, error: error.message || 'Failed to trash blog' };
  }
}

export async function restoreBlog(id) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    await updateBlogById(id, { status: 'draft' });

    revalidatePath('/dashboard/blogs');
    revalidatePath('/blogs');

    return { success: true, message: 'Blog restored as draft' };
  } catch (error) {
    console.error('Error restoring blog:', error);
    return { success: false, error: error.message || 'Failed to restore blog' };
  }
}

export async function deleteBlog(id) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    await deleteBlogById(id);

    revalidatePath('/dashboard/blogs');
    revalidatePath('/blogs');

    return { success: true, message: 'Blog post deleted successfully' };
  } catch (error) {
    console.error('Error deleting blog:', error);
    return { success: false, error: error.message || 'Failed to delete blog post' };
  }
}

export const permanentlyDeleteBlog = deleteBlog;

export async function updateBlogCategoryAction(oldCategory, newCategory) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    await updateBlogCategory(oldCategory, newCategory);

    revalidatePath('/dashboard/blogs');
    revalidatePath('/blogs');

    return { success: true };
  } catch (error) {
    console.error('Error updating blog category:', error);
    return { success: false, error: error.message || 'Failed to update blog category' };
  }
}
