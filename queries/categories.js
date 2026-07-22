import prisma from '@/lib/prisma';

export function slugifyCategory(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function getAllCategoriesQuery() {
  return await prisma.blogCategory.findMany({
    orderBy: { name: 'asc' }
  });
}

export async function getCategoryByNameQuery(name) {
  return await prisma.blogCategory.findFirst({
    where: { name: { equals: name, mode: 'insensitive' } }
  });
}

export async function createCategoryQuery(name) {
  const slug = slugifyCategory(name);
  return await prisma.blogCategory.create({
    data: {
      name,
      slug
    }
  });
}

export async function updateCategoryQuery(oldCategory, newCategory) {
  const existing = await getCategoryByNameQuery(oldCategory);
  if (!existing) {
    throw new Error('Category not found');
  }

  const slug = slugifyCategory(newCategory);
  return await prisma.blogCategory.update({
    where: { id: existing.id },
    data: {
      name: newCategory,
      slug
    }
  });
}

export async function deleteCategoryQuery(categoryName) {
  const existing = await getCategoryByNameQuery(categoryName);
  if (!existing) {
    throw new Error('Category not found');
  }

  return await prisma.blogCategory.delete({
    where: { id: existing.id }
  });
}
