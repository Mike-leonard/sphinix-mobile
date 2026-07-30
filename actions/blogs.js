'use server';

import { revalidatePath } from 'next/cache';
import { verifySession } from './auth';
import { 
  getAllBlogs, 
  getBlogById as getBlogByIdQuery, 
  getPublishedBlogByIdQuery,
  getBlogBySlugQuery,
  getPublishedBlogBySlugQuery,
  getPublishedBlogsByIdsQuery,
  getRelatedBlogsQuery,
  createBlogQuery, 
  updateBlogById, 
  deleteBlogById, 
  updateBlogCategory, 
  getPublishedBlogs,
  getPublishedBlogsCount,
  getBlogCategoryCountsQuery
} from '@/queries/blogs';

/**
 * -----------------------------------------------------------------------------
 * BLOG ACTION: allBlogs
 * -----------------------------------------------------------------------------
 * @description Admin action: fetches all blog posts regardless of publication status (published, draft, trash).
 * @why Powers the admin blog manager list page.
 * @where Called by: `app/dashboard/blogs/page.js`
 * @security Restricted to Admin, Moderator, and ContentWriter roles (`verifySession()`).
 * @returns {Promise<Array>} Array of all blog post objects.
 */
export async function allBlogs() {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');
    const blogs = await getAllBlogs();
    return blogs;
  } catch (error) {
    console.error('Error reading blogs from DB:', error);
    return [];
  }
}

/**
 * -----------------------------------------------------------------------------
 * BLOG ACTION: publishedBlogsCount
 * -----------------------------------------------------------------------------
 * @description Public action: calculates the total count of published blogs matching search or category filters.
 * @why Enables pagination calculations for public blog list pages.
 * @where Called by: `app/(main)/blogs/page.js`
 * @security Public read access.
 * @param {string|object} optionsOrQuery - Search query term or options object.
 * @param {string} categoryParam - Selected category filter name (e.g. "Software", "All").
 * @returns {Promise<number>} Total count of matching published blogs.
 */
export async function publishedBlogsCount(optionsOrQuery = '', categoryParam = 'All') {
  try {
    const count = await getPublishedBlogsCount(optionsOrQuery, categoryParam);
    return count;
  } catch (error) {
    console.error('Error reading blogs count from DB:', error);
    return 0;
  }
}

/**
 * -----------------------------------------------------------------------------
 * BLOG ACTION: publishedBlogs
 * -----------------------------------------------------------------------------
 * @description Public action: fetches paginated published blog posts with optional search and category filters.
 * @why Renders public tech blog listing pages with pagination.
 * @where Called by: `app/(main)/blogs/page.js`, `app/(main)/page.js` (latest news section)
 * @security Public read access.
 * @param {number|object} optionsOrLimit - Page limit or options object.
 * @param {string} queryParam - Search query term.
 * @param {string} categoryParam - Category filter.
 * @param {number} offsetParam - Pagination offset.
 * @returns {Promise<Array>} Array of published blog objects.
 */
export async function publishedBlogs(optionsOrLimit = 10, queryParam = '', categoryParam = 'All', offsetParam = 0) {
  try {
    const blogs = await getPublishedBlogs(optionsOrLimit, queryParam, categoryParam, offsetParam);
    return blogs;
  } catch (error) {
    console.error('Error reading published blogs from DB:', error);
    return [];
  }
}

/**
 * -----------------------------------------------------------------------------
 * BLOG ACTION: blogCategoryCounts
 * -----------------------------------------------------------------------------
 * @description Public action: fetches blog count breakdowns grouped by category.
 * @why Renders category filter tabs and badges in the blog listing sidebar.
 * @where Called by: `app/(main)/blogs/page.js`
 * @security Public read access.
 * @returns {Promise<Array<{ category: string, count: number }>>}
 */
export async function blogCategoryCounts() {
  try {
    const counts = await getBlogCategoryCountsQuery();
    return counts;
  } catch (error) {
    console.error('Error reading category counts from DB:', error);
    return [];
  }
}

/**
 * -----------------------------------------------------------------------------
 * BLOG ACTION: getBlogBySlug
 * -----------------------------------------------------------------------------
 * @description Admin action: fetches a blog post by its URL slug regardless of status.
 * @why Used in admin editor preview and editing workflows.
 * @where Called by: `app/dashboard/blogs/edit/[id]/page.js`
 * @security Restricted to authenticated session (`verifySession()`).
 * @param {string} slug - Unique blog URL slug.
 * @returns {Promise<object|null>} Blog object or `null`.
 */
export async function getBlogBySlug(slug) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');
    return await getBlogBySlugQuery(slug);
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    return null;
  }
}

/**
 * -----------------------------------------------------------------------------
 * BLOG ACTION: getPublishedBlogBySlug
 * -----------------------------------------------------------------------------
 * @description Public action: fetches a single published blog article by slug for public reading.
 * @why Renders the individual blog article detail page (`/blogs/[slug]`).
 * @where Called by: `app/(main)/blogs/[slug]/page.js`
 * @security Public read access (only returns status === "published").
 * @param {string} slug - Unique blog URL slug.
 * @returns {Promise<object|null>} Published blog object or `null`.
 */
export async function getPublishedBlogBySlug(slug) {
  try {
    return await getPublishedBlogBySlugQuery(slug);
  } catch (error) {
    console.error('Error fetching published blog by slug:', error);
    return null;
  }
}

/**
 * -----------------------------------------------------------------------------
 * BLOG ACTION: getPublishedBlogById
 * -----------------------------------------------------------------------------
 * @description Public action: fetches a published blog by ID for direct linking.
 * @why Renders public blog preview routes or direct ID links.
 * @where Called by: Public blog component helpers.
 * @security Public read access.
 * @param {string} id - Blog record ID.
 * @returns {Promise<object|null>}
 */
export async function getPublishedBlogById(id) {
  try {
    return await getPublishedBlogByIdQuery(id);
  } catch (error) {
    console.error('Error fetching published blog by ID:', error);
    return null;
  }
}

/**
 * -----------------------------------------------------------------------------
 * BLOG ACTION: getPublishedBlogsByIds
 * -----------------------------------------------------------------------------
 * @description Public action: fetches multiple published blogs matching an array of IDs.
 * @why Used for fetching curated blog lists or featured recommendations.
 * @where Called by: Home page and widget sections.
 * @security Public read access.
 * @param {Array<string>} ids - Array of blog IDs.
 * @returns {Promise<Array>} Array of matching published blogs.
 */
export async function getPublishedBlogsByIds(ids) {
  try {
    return await getPublishedBlogsByIdsQuery(ids);
  } catch (error) {
    console.error('Error fetching published blogs by IDs:', error);
    return [];
  }
}

/**
 * -----------------------------------------------------------------------------
 * BLOG ACTION: getRelatedBlogs
 * -----------------------------------------------------------------------------
 * @description Public action: fetches related blog articles matching the category of a current post.
 * @why Renders "Related Articles" widgets at the bottom of blog post pages.
 * @where Called by: `app/(main)/blogs/[slug]/_components/RelatedBlogs.jsx`
 * @security Public read access.
 * @param {object} currentBlog - The active blog object.
 * @param {number} limit - Maximum number of related blogs to return (default 3).
 * @returns {Promise<Array>} Array of related blog objects.
 */
export async function getRelatedBlogs(currentBlog, limit = 3) {
  try {
    return await getRelatedBlogsQuery(currentBlog, limit);
  } catch (error) {
    console.error('Error fetching related blogs:', error);
    return [];
  }
}

/**
 * -----------------------------------------------------------------------------
 * BLOG ACTION: getBlogById
 * -----------------------------------------------------------------------------
 * @description Admin action: fetches a single blog post by ID regardless of status.
 * @why Pre-populates the admin blog editor form when editing a post.
 * @where Called by: `app/dashboard/blogs/edit/[id]/page.js`
 * @security Restricted to authenticated session (`verifySession()`).
 * @param {string} id - Blog record ID.
 * @returns {Promise<object|null>} Blog post object or `null`.
 */
export async function getBlogById(id) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');
    const blog = await getBlogByIdQuery(id);
    return blog;
  } catch (error) {
    console.error('Error reading blog by ID from DB:', error);
    return null;
  }
}

/**
 * -----------------------------------------------------------------------------
 * BLOG ACTION: createBlog
 * -----------------------------------------------------------------------------
 * @description Admin action: creates a new blog post in PostgreSQL.
 * @why Saves new blog posts written manually or generated by AI in the dashboard.
 * @where Called by: `app/dashboard/blogs/create/page.js`, `app/dashboard/blogs/_components/editor/BlogEditor.jsx`
 * @security Restricted to Admin, Moderator, and ContentWriter roles (`verifySession()`).
 * @param {object} formData - { title, excerpt, readTime, author, category, color, image, content, status, seo }
 * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
 */
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

/**
 * -----------------------------------------------------------------------------
 * BLOG ACTION: updateBlog
 * -----------------------------------------------------------------------------
 * @description Admin action: updates an existing blog post record in PostgreSQL.
 * @why Saves changes made to title, excerpt, category, content, or publication status.
 * @where Called by: `app/dashboard/blogs/edit/[id]/page.js`, `app/dashboard/blogs/_components/editor/BlogEditor.jsx`
 * @security Restricted to authenticated session (`verifySession()`).
 * @param {string} id - Target blog post ID.
 * @param {object} formData - Updated fields payload.
 * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
 */
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

/**
 * -----------------------------------------------------------------------------
 * BLOG ACTION: trashBlog
 * -----------------------------------------------------------------------------
 * @description Soft-deletes a blog post by setting its status to `'trash'`.
 * @why Moves blog post to the trash bin allowing for easy recovery.
 * @where Called by: `app/dashboard/blogs/_components/manager/BlogsManager.jsx`
 * @security Restricted to authenticated session (`verifySession()`).
 * @param {string} id - Target blog post ID.
 * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
 */
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

/**
 * -----------------------------------------------------------------------------
 * BLOG ACTION: restoreBlog
 * -----------------------------------------------------------------------------
 * @description Restores a trashed blog post by setting its status back to `'draft'`.
 * @why Recovers a trashed blog post back to draft status in the dashboard.
 * @where Called by: `app/dashboard/blogs/_components/manager/BlogsManager.jsx`
 * @security Restricted to authenticated session (`verifySession()`).
 * @param {string} id - Target blog post ID.
 * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
 */
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

/**
 * -----------------------------------------------------------------------------
 * BLOG ACTION: deleteBlog
 * -----------------------------------------------------------------------------
 * @description Permanently deletes a blog post from PostgreSQL.
 * @why Completely removes a blog post record from the database.
 * @where Called by: `app/dashboard/blogs/_components/manager/BlogsManager.jsx`
 * @security Restricted to authenticated session (`verifySession()`).
 * @param {string} id - Target blog post ID.
 * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
 */
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

/**
 * -----------------------------------------------------------------------------
 * BLOG ACTION: updateBlogCategoryAction
 * -----------------------------------------------------------------------------
 * @description Reassigns all blog posts under an old category name to a new category name.
 * @why Maintains relational consistency when an admin renames or merges blog categories.
 * @where Called by: `app/dashboard/blogs/categories/_components/CategoryForm.jsx`
 * @security Restricted to authenticated session (`verifySession()`).
 * @param {string} oldCategory - Original category name.
 * @param {string} newCategory - Replacement category name.
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
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

export const reassignCategory = updateBlogCategoryAction;
