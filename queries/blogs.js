import prisma from '@/lib/prisma';
import { generateBlogSlug } from '@/lib/utils';

export function formatBlog(blog) {
  if (!blog) return null;
  return {
    ...blog,
    status: (blog.status || 'DRAFT').toLowerCase()
  };
}

export async function getAllBlogs() {
  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return blogs.map(formatBlog);
}

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

export async function getBlogCategoryCountsQuery() {
  return await prisma.blog.groupBy({
    by: ['category'],
    where: { status: 'PUBLISHED' },
    _count: { id: true }
  });
}

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

export async function getRecentBlogs(limit = 10) {
  const blogs = await prisma.blog.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
    take: limit
  });
  return blogs.map(formatBlog);
}

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

export async function getTrendingBlogs(limit = 10) {
  const blogs = await prisma.blog.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { viewCount: 'desc' },
    take: limit
  });
  return blogs.map(formatBlog);
}

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

export async function getBlogById(id) {
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return null;
  const blog = await prisma.blog.findUnique({
    where: { id: parsedId }
  });
  return formatBlog(blog);
}

export async function getPublishedBlogByIdQuery(id) {
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return null;
  const blog = await prisma.blog.findFirst({
    where: { id: parsedId, status: 'PUBLISHED' }
  });
  return formatBlog(blog);
}

export async function getBlogBySlugQuery(slug) {
  const blogs = await prisma.blog.findMany();
  const found = blogs.find(b => generateBlogSlug(b.title) === slug || String(b.id) === String(slug)) || null;
  return formatBlog(found);
}

export async function getPublishedBlogBySlugQuery(slug) {
  const publishedBlogs = await prisma.blog.findMany({
    where: { status: 'PUBLISHED' }
  });
  const found = publishedBlogs.find(b => generateBlogSlug(b.title) === slug || String(b.id) === String(slug)) || null;
  return formatBlog(found);
}

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

export async function createBlogQuery(data) {
  const payload = { ...data };
  if (payload.status) {
    payload.status = payload.status.toUpperCase();
  }
  const created = await prisma.blog.create({
    data: payload
  });
  return formatBlog(created);
}

export async function updateBlogById(id, data) {
  const payload = { ...data };
  if (payload.status) {
    payload.status = payload.status.toUpperCase();
  }
  const updated = await prisma.blog.update({
    where: { id: parseInt(id) },
    data: payload
  });
  return formatBlog(updated);
}

export async function deleteBlogById(id) {
  return await prisma.blog.delete({
    where: { id: parseInt(id) }
  });
}

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
