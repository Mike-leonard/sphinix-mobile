import prisma from '@/lib/prisma';
import { generateBlogSlug } from '@/lib/utils';

/**
 * Normalizes DB blog record by lowercasing status field.
 */
export function formatBlog(blog) {
  if (!blog) return null;
  const s = (blog.status || 'DRAFT').toLowerCase();
  return {
    ...blog,
    status: s === 'trashed' ? 'trash' : s
  };
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: getAllBlogs
 * -----------------------------------------------------------------------------
 * @description Admin query: fetches all blog posts ordered by creation timestamp descending.
 * @table `blog`
 * @where Called by: `actions/blogs.js` -> `allBlogs()`
 * @returns {Promise<Array>} List of all blog posts.
 */
export async function getAllBlogs() {
  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return blogs.map(formatBlog);
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: getPublishedBlogsCount
 * -----------------------------------------------------------------------------
 * @description Public query: counts published blog posts matching search terms or category filters.
 * @table `blog`
 * @where Called by: `actions/blogs.js` -> `publishedBlogsCount()`
 * @param {string|object} optionsOrQuery - Search term string or options object.
 * @param {string} categoryParam - Category filter name.
 * @returns {Promise<number>} Count of matching published blogs.
 */
export async function getPublishedBlogsCount(optionsOrQuery = '', categoryParam = 'All') {
  let query = '';
  let category = 'All';

  if (typeof optionsOrQuery === 'object' && optionsOrQuery !== null) {
    query = optionsOrQuery.query || '';
    category = optionsOrQuery.category || 'All';
  } else {
    query = optionsOrQuery || '';
    category = categoryParam || 'All';
  }

  const where = { status: 'PUBLISHED' };

  if (category && category !== 'All') {
    where.category = { equals: category, mode: 'insensitive' };
  }

  if (query) {
    where.OR = [
      { title: { contains: query, mode: 'insensitive' } },
      { excerpt: { contains: query, mode: 'insensitive' } }
    ];
  }

  return await prisma.blog.count({ where });
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: getPublishedBlogs
 * -----------------------------------------------------------------------------
 * @description Public query: fetches paginated published blog posts with search/category filters.
 * @table `blog`
 * @where Called by: `actions/blogs.js` -> `publishedBlogs()`
 * @param {number|object} optionsOrLimit - Limit or options object.
 * @param {string} queryParam - Search query term.
 * @param {string} categoryParam - Category filter.
 * @param {number} offsetParam - Pagination offset.
 * @returns {Promise<Array>} Array of published blog records.
 */
export async function getPublishedBlogs(optionsOrLimit = 10, queryParam = '', categoryParam = 'All', offsetParam = 0) {
  let limit = 10;
  let query = '';
  let category = 'All';
  let offset = 0;

  if (typeof optionsOrLimit === 'object' && optionsOrLimit !== null) {
    limit = optionsOrLimit.limit ?? 10;
    query = optionsOrLimit.query || '';
    category = optionsOrLimit.category || 'All';
    offset = optionsOrLimit.offset ?? 0;
  } else {
    limit = optionsOrLimit ?? 10;
    query = queryParam || '';
    category = categoryParam || 'All';
    offset = offsetParam ?? 0;
  }

  const where = { status: 'PUBLISHED' };

  if (category && category !== 'All') {
    where.category = { equals: category, mode: 'insensitive' };
  }

  if (query) {
    where.OR = [
      { title: { contains: query, mode: 'insensitive' } },
      { excerpt: { contains: query, mode: 'insensitive' } }
    ];
  }

  const blogs = await prisma.blog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset
  });
  return blogs.map(formatBlog);
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: getBlogCategoryCountsQuery
 * -----------------------------------------------------------------------------
 * @description Aggregates published blog counts grouped by category name.
 * @table `blog`
 * @where Called by: `actions/blogs.js` -> `blogCategoryCounts()`
 * @returns {Promise<Array<{ category: string, _count: { id: number } }>>}
 */
export async function getBlogCategoryCountsQuery() {
  return await prisma.blog.groupBy({
    by: ['category'],
    where: { status: 'PUBLISHED' },
    _count: { id: true }
  });
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: getFeaturedBlogs
 * -----------------------------------------------------------------------------
 * @description Fetches featured published blogs for showcase sections.
 * @table `blog`
 * @where Called by: Hero or featured blog widgets.
 * @returns {Promise<Array>}
 */
export async function getFeaturedBlogs() {
  const blogs = await prisma.blog.findMany({
    where: {
      status: 'PUBLISHED',
      isFeatured: true
    },
    orderBy: { publishedAt: 'desc' },
    take: 3
  });
  return blogs.map(formatBlog);
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: getRecentBlogs
 * -----------------------------------------------------------------------------
 * @description Fetches recent published blogs ordered by creation timestamp.
 * @table `blog`
 * @where Called by: Recent articles sidebar widgets.
 * @param {number} limit - Maximum number of blogs (default 10).
 * @returns {Promise<Array>}
 */
export async function getRecentBlogs(limit = 10) {
  const blogs = await prisma.blog.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
    take: limit
  });
  return blogs.map(formatBlog);
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: getBlogsBySearch
 * -----------------------------------------------------------------------------
 * @description Searches published blogs matching title, content, or category string.
 * @table `blog`
 * @param {string} query - Search string.
 * @returns {Promise<Array>}
 */
export async function getBlogsBySearch(query) {
  const blogs = await prisma.blog.findMany({
    where: {
      status: 'PUBLISHED',
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } }
      ]
    },
    orderBy: { createdAt: 'desc' }
  });
  return blogs.map(formatBlog);
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: getTrendingBlogs
 * -----------------------------------------------------------------------------
 * @description Fetches published blogs sorted by highest view count.
 * @table `blog`
 * @param {number} limit - Max blogs to return.
 * @returns {Promise<Array>}
 */
export async function getTrendingBlogs(limit = 10) {
  const blogs = await prisma.blog.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { viewCount: 'desc' },
    take: limit
  });
  return blogs.map(formatBlog);
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: getBlogsBySearchWithPagination
 * -----------------------------------------------------------------------------
 * @description Searches published blogs with page number and limit parameters.
 * @table `blog`
 * @param {string} query - Search query string.
 * @param {number} page - Current page index.
 * @param {number} limit - Limit per page.
 * @returns {Promise<{ blogs: Array, total: number }>}
 */
export async function getBlogsBySearchWithPagination(
  query,
  page = 1,
  limit = 10
) {
  const skip = (page - 1) * limit;
  const where = {
    status: 'PUBLISHED',
    OR: [
      { title: { contains: query, mode: 'insensitive' } },
      { content: { contains: query, mode: 'insensitive' } },
      { category: { contains: query, mode: 'insensitive' } }
    ]
  };

  const [blogs, total] = await Promise.all([
    prisma.blog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.blog.count({ where })
  ]);

  return { blogs: blogs.map(formatBlog), total };
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: getBlogsByCategory
 * -----------------------------------------------------------------------------
 * @description Fetches published blogs under a specific category name.
 * @table `blog`
 * @param {string} category - Category name.
 * @param {number} limit - Max limit.
 * @returns {Promise<Array>}
 */
export async function getBlogsByCategory(category, limit = 10) {
  const blogs = await prisma.blog.findMany({
    where: {
      status: 'PUBLISHED',
      category: {
        equals: category,
        mode: 'insensitive'
      }
    },
    orderBy: { createdAt: 'desc' },
    take: limit
  });
  return blogs.map(formatBlog);
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: getBlogById
 * -----------------------------------------------------------------------------
 * @description Admin query: fetches single blog record by ID regardless of status.
 * @table `blog`
 * @where Called by: `actions/blogs.js` -> `getBlogById()`
 * @param {string|number} id - Record ID.
 * @returns {Promise<object|null>}
 */
export async function getBlogById(id) {
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return null;
  const blog = await prisma.blog.findUnique({
    where: { id: parsedId }
  });
  return formatBlog(blog);
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: getPublishedBlogByIdQuery
 * -----------------------------------------------------------------------------
 * @description Public query: fetches a single published blog by ID.
 * @table `blog`
 * @where Called by: `actions/blogs.js` -> `getPublishedBlogById()`
 * @param {string|number} id - Record ID.
 * @returns {Promise<object|null>}
 */
export async function getPublishedBlogByIdQuery(id) {
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return null;
  const blog = await prisma.blog.findFirst({
    where: { id: parsedId, status: 'PUBLISHED' }
  });
  return formatBlog(blog);
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: getBlogBySlugQuery
 * -----------------------------------------------------------------------------
 * @description Admin query: finds a blog matching a generated URL slug or numeric ID.
 * @table `blog`
 * @where Called by: `actions/blogs.js` -> `getBlogBySlug()`
 * @param {string} slug - Unique blog URL slug or ID string.
 * @returns {Promise<object|null>}
 */
export async function getBlogBySlugQuery(slug) {
  const blogs = await prisma.blog.findMany();
  const found = blogs.find(b => generateBlogSlug(b.title) === slug || String(b.id) === String(slug)) || null;
  return formatBlog(found);
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: getPublishedBlogBySlugQuery
 * -----------------------------------------------------------------------------
 * @description Public query: finds a published blog matching a generated URL slug or numeric ID.
 * @table `blog`
 * @where Called by: `actions/blogs.js` -> `getPublishedBlogBySlug()`
 * @param {string} slug - Unique blog URL slug or ID string.
 * @returns {Promise<object|null>}
 */
export async function getPublishedBlogBySlugQuery(slug) {
  const publishedBlogs = await prisma.blog.findMany({
    where: { status: 'PUBLISHED' }
  });
  const found = publishedBlogs.find(b => generateBlogSlug(b.title) === slug || String(b.id) === String(slug)) || null;
  return formatBlog(found);
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: getPublishedBlogsByIdsQuery
 * -----------------------------------------------------------------------------
 * @description Public query: fetches published blogs matching an array of IDs.
 * @table `blog`
 * @where Called by: `actions/blogs.js` -> `getPublishedBlogsByIds()`
 * @param {Array<string|number>} ids - Array of blog IDs.
 * @returns {Promise<Array>}
 */
export async function getPublishedBlogsByIdsQuery(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return [];
  const parsedIds = ids.map(id => parseInt(id)).filter(id => !isNaN(id));
  if (parsedIds.length === 0) return [];
  const blogs = await prisma.blog.findMany({
    where: {
      id: { in: parsedIds },
      status: 'PUBLISHED'
    }
  });
  return blogs.map(formatBlog);
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: getRelatedBlogsQuery
 * -----------------------------------------------------------------------------
 * @description Fetches related published blogs under the same category, filling remaining slots with recent posts.
 * @table `blog`
 * @where Called by: `actions/blogs.js` -> `getRelatedBlogs()`
 * @param {object} currentBlog - Active blog object.
 * @param {number} limit - Target count (default 3).
 * @returns {Promise<Array>}
 */
export async function getRelatedBlogsQuery(currentBlog, limit = 3) {
  if (!currentBlog) return [];
  let related = await prisma.blog.findMany({
    where: {
      status: 'PUBLISHED',
      category: currentBlog.category,
      NOT: { id: currentBlog.id }
    },
    orderBy: { createdAt: 'desc' },
    take: limit
  });

  if (related.length < limit) {
    const remainingLimit = limit - related.length;
    const relatedIds = related.map(b => b.id);
    const others = await prisma.blog.findMany({
      where: {
        status: 'PUBLISHED',
        NOT: { id: { in: [currentBlog.id, ...relatedIds] } }
      },
      orderBy: { createdAt: 'desc' },
      take: remainingLimit
    });
    related = [...related, ...others];
  }
  return related.map(formatBlog);
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: createBlogQuery
 * -----------------------------------------------------------------------------
 * @description Inserts a new blog post record into PostgreSQL.
 * @table `blog`
 * @where Called by: `actions/blogs.js` -> `createBlog()`
 * @param {object} data - Blog post fields payload.
 * @returns {Promise<object>} Created blog record.
 */
export async function createBlogQuery(data) {
  const payload = { ...data };
  if (payload.status) {
    const s = payload.status.toUpperCase();
    payload.status = (s === 'TRASH' || s === 'TRASHED') ? 'TRASHED' : s;
  }
  const created = await prisma.blog.create({
    data: payload
  });
  return formatBlog(created);
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: updateBlogById
 * -----------------------------------------------------------------------------
 * @description Updates an existing blog record by ID in PostgreSQL.
 * @table `blog`
 * @where Called by: `actions/blogs.js` -> `updateBlog()`, `trashBlog()`, `restoreBlog()`
 * @param {string|number} id - Target blog ID.
 * @param {object} data - Updated fields payload.
 * @returns {Promise<object>} Updated blog record.
 */
export async function updateBlogById(id, data) {
  const payload = { ...data };
  if (payload.status) {
    const s = payload.status.toUpperCase();
    payload.status = (s === 'TRASH' || s === 'TRASHED') ? 'TRASHED' : s;
  }
  const updated = await prisma.blog.update({
    where: { id: parseInt(id) },
    data: payload
  });
  return formatBlog(updated);
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: deleteBlogById
 * -----------------------------------------------------------------------------
 * @description Permanently deletes a blog post from PostgreSQL by ID.
 * @table `blog`
 * @where Called by: `actions/blogs.js` -> `deleteBlog()`
 * @param {string|number} id - Target blog ID.
 * @returns {Promise<object>} Deleted Prisma record.
 */
export async function deleteBlogById(id) {
  return await prisma.blog.delete({
    where: { id: parseInt(id) }
  });
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: updateBlogCategory
 * -----------------------------------------------------------------------------
 * @description Reassigns category column values across blog posts from old category to new category.
 * @table `blog`
 * @where Called by: `actions/blogs.js` -> `updateBlogCategoryAction()`
 * @param {string} oldCategory - Old category name.
 * @param {string} newCategory - New category name.
 * @returns {Promise<object>} Prisma updateMany result object `{ count: number }`.
 */
export async function updateBlogCategory(oldCategory, newCategory) {
  return await prisma.blog.updateMany({
    where: {
      category: {
        equals: oldCategory,
        mode: 'insensitive'
      }
    },
    data: { category: newCategory }
  });
}
