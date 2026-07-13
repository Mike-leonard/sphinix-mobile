'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { verifySession } from './auth';

const getCategoriesFilePath = () => path.join(process.cwd(), 'data', 'categories.json');

export async function getCategories() {
  try {
    const filePath = getCategoriesFilePath();
    const fileData = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error('Error reading categories.json:', error);
    return [];
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
    const categories = await getCategories();
    
    // Check if category already exists (case-insensitive)
    const exists = categories.some(cat => cat.toLowerCase() === trimmedCategory.toLowerCase());
    if (exists) {
      return { success: false, error: 'Category already exists' };
    }
    
    categories.push(trimmedCategory);
    
    // Sort categories alphabetically
    categories.sort((a, b) => a.localeCompare(b));
    
    await fs.writeFile(getCategoriesFilePath(), JSON.stringify(categories, null, 2));
    
    // Revalidate paths that use categories
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
    const categories = await getCategories();
    
    // Check if new name already exists
    const exists = categories.some(cat => cat.toLowerCase() === trimmedCategory.toLowerCase() && cat.toLowerCase() !== oldCategory.toLowerCase());
    if (exists) {
      return { success: false, error: 'Category already exists' };
    }

    const filteredCategories = categories.filter(cat => cat !== oldCategory);
    filteredCategories.push(trimmedCategory);
    filteredCategories.sort((a, b) => a.localeCompare(b));
    
    await fs.writeFile(getCategoriesFilePath(), JSON.stringify(filteredCategories, null, 2));
    
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

    const categories = await getCategories();
    const filteredCategories = categories.filter(cat => cat !== categoryToDelete);
    
    await fs.writeFile(getCategoriesFilePath(), JSON.stringify(filteredCategories, null, 2));
    
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
