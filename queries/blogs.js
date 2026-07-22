import prisma from '@/lib/prisma';

export async function getAllBlogs() {
  return await prisma.blog.findMany({
    orderBy: { createdAt: 'desc' }
  });
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

  const where = { status: 'published' };

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

  const where = { status: 'published' };

  if (category && category !== 'All') {
    where.category = { equals: category, mode: 'insensitive' };
  }

  if (query) {
    where.OR = [
      { title: { contains: query, mode: 'insensitive' } },
      { excerpt: { contains: query, mode: 'insensitive' } }
    ];
  }

  return await prisma.blog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset
  });
}

export async function getBlogCategoryCountsQuery() {
  return await prisma.blog.groupBy({
    by: ['category'],
    where: { status: 'published' },
    _count: { id: true }
  });
}

export async function getFeaturedBlogs() {
  return await prisma.blog.findMany({
    where: {
      status: 'published',
      isFeatured: true
    },
    orderBy: { publishedAt: 'desc' },
    take: 3
  });
}

export async function getRecentBlogs(limit = 10) {
  return await prisma.blog.findMany({
    where: { status: 'published' },
    orderBy: { createdAt: 'desc' },
    take: limit
  });
}

export async function getBlogsBySearch(query) {
  return await prisma.blog.findMany({
    where: {
      status: 'published',
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } }
      ]
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getTrendingBlogs(limit = 10) {
  return await prisma.blog.findMany({
    where: { status: 'published' },
    orderBy: { viewCount: 'desc' },
    take: limit
  });
}

export async function getBlogsBySearchWithPagination(
  query,
  page = 1,
  limit = 10
) {
  const skip = (page - 1) * limit;
  const where = {
    status: 'published',
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

  return { blogs, total };
}


export async function getBlogsByCategory(category, limit = 10) {
  return await prisma.blog.findMany({
    where: {
      status: 'published',
      category: {
        equals: category,
        mode: 'insensitive'
      }
    },
    orderBy: { createdAt: 'desc' },
    take: limit
  });
}



export async function getBlogById(id) {
  return await prisma.blog.findUnique({
    where: { id: parseInt(id) }
  });
}

export async function createBlogQuery(data) {
  return await prisma.blog.create({
    data
  });
}

export async function updateBlogById(id, data) {
  return await prisma.blog.update({
    where: { id: parseInt(id) },
    data
  });
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
