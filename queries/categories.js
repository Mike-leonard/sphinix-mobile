import prisma from '@/lib/prisma';

export function slugifyCategory(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: getAllCategoriesQuery
 * -----------------------------------------------------------------------------
 * @description Fetches all blog categories ordered by name ascending from PostgreSQL.
 * @table `blogCategory`
 * @where Called by: `actions/categories.js` -> `getCategories()`
 * @returns {Promise<Array>} List of blog category records.
 */
export async function getAllCategoriesQuery() {
  return await prisma.blogCategory.findMany({
    orderBy: { name: 'asc' }
  });
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: getCategoryByNameQuery
 * -----------------------------------------------------------------------------
 * @description Case-insensitive lookup for a blog category record by name.
 * @table `blogCategory`
 * @where Called by: `actions/categories.js` -> `createCategory()`, `updateCategory()`, `deleteCategory()`
 * @param {string} name - Category name to find.
 * @returns {Promise<object|null>} Category record or null.
 */
export async function getCategoryByNameQuery(name) {
  return await prisma.blogCategory.findFirst({
    where: { name: { equals: name, mode: 'insensitive' } }
  });
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: createCategoryQuery
 * -----------------------------------------------------------------------------
 * @description Inserts a new blog category record into PostgreSQL with auto-generated slug.
 * @table `blogCategory`
 * @where Called by: `actions/categories.js` -> `createCategory()`
 * @param {string} name - Category name.
 * @returns {Promise<object>} Created category record.
 */
export async function createCategoryQuery(name) {
  const slug = slugifyCategory(name);
  return await prisma.blogCategory.create({
    data: {
      name,
      slug
    }
  });
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: updateCategoryQuery
 * -----------------------------------------------------------------------------
 * @description Updates an existing category's name and slug in PostgreSQL.
 * @table `blogCategory`
 * @where Called by: `actions/categories.js` -> `updateCategory()`
 * @param {string} oldCategory - Target category name.
 * @param {string} newCategory - New category name.
 * @returns {Promise<object>} Updated category record.
 */
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

/**
 * -----------------------------------------------------------------------------
 * QUERY: deleteCategoryQuery
 * -----------------------------------------------------------------------------
 * @description Deletes a category record from PostgreSQL by name.
 * @table `blogCategory`
 * @where Called by: `actions/categories.js` -> `deleteCategory()`
 * @param {string} categoryName - Category name to delete.
 * @returns {Promise<object>} Deleted category record.
 */
export async function deleteCategoryQuery(categoryName) {
  const existing = await getCategoryByNameQuery(categoryName);
  if (!existing) {
    throw new Error('Category not found');
  }

  return await prisma.blogCategory.delete({
    where: { id: existing.id }
  });
}
