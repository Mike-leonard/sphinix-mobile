import prisma from '@/lib/prisma';

export async function getAllBlogs() {
  return await prisma.blog.findMany({
    orderBy: { createdAt: 'desc' }
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
