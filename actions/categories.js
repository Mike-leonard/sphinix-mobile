'use server';

import { revalidatePath } from 'next/cache';
import { verifySession } from './auth';
import {
  getAllCategoriesQuery,
  getCategoryByNameQuery,
  createCategoryQuery,
  updateCategoryQuery,
  deleteCategoryQuery
} from '@/queries/categories';

export async function getCategories() {
  try {
    const categories = await getAllCategoriesQuery();
    return categories.map(cat => cat.name);
  } catch (error) {
    console.error('Error reading categories from database:', error);
    return [];
  }
}

export async function getCategoryListWithCounts() {
  try {
    const { blogCategoryCounts } = await import('./blogs.js');
    const [allCatNames, groupCounts] = await Promise.all([
      getCategories(),
      blogCategoryCounts()
    ]);

    let totalAllCount = 0;
    const countMap = {};
    (groupCounts || []).forEach(g => {
      if (g.category) {
        countMap[g.category.toLowerCase()] = g._count.id;
        totalAllCount += g._count.id;
      }
    });

    const categoryList = [
      { name: "All", count: totalAllCount }
    ];

    allCatNames.forEach(name => {
      if (name.toLowerCase() === 'all') return;
      const count = countMap[name.toLowerCase()] || 0;
      categoryList.push({ name, count });
    });

    return categoryList;
  } catch (error) {
    console.error("Error building category list with counts:", error);
    return [{ name: "All", count: 0 }];
  }
}

export async function createCategory(newCategory) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    if (!newCategory || typeof newCategory !== 'string' || newCategory.trim() === '') {
      return { success: false, error: 'Category name is required' };
    }

    const trimmedCategory = newCategory.trim();
    const existing = await getCategoryByNameQuery(trimmedCategory);

    if (existing) {
      return { success: false, error: 'Category already exists' };
    }

    await createCategoryQuery(trimmedCategory);

    revalidatePath('/dashboard/blogs');
    revalidatePath('/dashboard/blogs/categories');
    revalidatePath('/dashboard/blogs/new');

    return { success: true, message: 'Category created successfully' };
  } catch (error) {
    console.error('Error creating category:', error);
    return { success: false, error: 'Failed to create category' };
  }
}

export async function updateCategory(oldCategory, newCategory) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    if (oldCategory.toLowerCase() === 'uncategorized') {
      return { success: false, error: 'Cannot rename the Uncategorized category' };
    }

    if (!newCategory || typeof newCategory !== 'string' || newCategory.trim() === '') {
      return { success: false, error: 'New category name is required' };
    }

    const trimmedCategory = newCategory.trim();

    if (oldCategory.toLowerCase() !== trimmedCategory.toLowerCase()) {
      const existing = await getCategoryByNameQuery(trimmedCategory);
      if (existing) {
        return { success: false, error: 'Category already exists' };
      }
    }

    await updateCategoryQuery(oldCategory, trimmedCategory);

    // Reassign blogs to new category
    const { reassignCategory } = await import('./blogs.js');
    await reassignCategory(oldCategory, trimmedCategory);

    revalidatePath('/dashboard/blogs');
    revalidatePath('/dashboard/blogs/categories');
    revalidatePath('/dashboard/blogs/new');

    return { success: true, message: 'Category updated successfully' };
  } catch (error) {
    console.error('Error updating category:', error);
    return { success: false, error: 'Failed to update category' };
  }
}

export async function deleteCategory(categoryToDelete) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    if (categoryToDelete.toLowerCase() === 'uncategorized') {
      return { success: false, error: 'Cannot delete the Uncategorized category' };
    }

    await deleteCategoryQuery(categoryToDelete);

    // Reassign affected blogs to Uncategorized
    const { reassignCategory } = await import('./blogs.js');
    await reassignCategory(categoryToDelete, 'Uncategorized');

    revalidatePath('/dashboard/blogs');
    revalidatePath('/dashboard/blogs/categories');
    revalidatePath('/dashboard/blogs/new');

    return { success: true, message: 'Category deleted successfully' };
  } catch (error) {
    console.error('Error deleting category:', error);
    return { success: false, error: 'Failed to delete category' };
  }
}
