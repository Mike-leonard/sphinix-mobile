// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCategories, createCategory, deleteCategory, updateCategory } from '../actions/categories';
import * as categoriesQueries from '../queries/categories';

// Mock auth
vi.mock('../actions/auth', () => ({
  verifySession: vi.fn().mockResolvedValue({ id: 1, role: 'admin' })
}));

// Mock the blogs action module so we can test the reassignCategory call
vi.mock('../actions/blogs.js', () => ({
  reassignCategory: vi.fn().mockResolvedValue({ success: true })
}));

vi.mock('../queries/categories', () => ({
  getAllCategoriesQuery: vi.fn(),
  getCategoryByNameQuery: vi.fn(),
  createCategoryQuery: vi.fn(),
  updateCategoryQuery: vi.fn(),
  deleteCategoryQuery: vi.fn()
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}));

describe('Categories Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCategories', () => {
    it('returns parsed categories from database query', async () => {
      const mockCats = [{ id: 1, name: 'Tech' }, { id: 2, name: 'News' }];
      vi.mocked(categoriesQueries.getAllCategoriesQuery).mockResolvedValue(mockCats);
      
      const result = await getCategories();
      expect(result).toEqual(['Tech', 'News']);
      expect(categoriesQueries.getAllCategoriesQuery).toHaveBeenCalledTimes(1);
    });

    it('returns empty array on error', async () => {
      vi.mocked(categoriesQueries.getAllCategoriesQuery).mockRejectedValue(new Error('DB error'));
      const result = await getCategories();
      expect(result).toEqual([]);
    });
  });

  describe('createCategory', () => {
    it('creates a new category in database', async () => {
      vi.mocked(categoriesQueries.getCategoryByNameQuery).mockResolvedValue(null);
      vi.mocked(categoriesQueries.createCategoryQuery).mockResolvedValue({ id: 1, name: 'Banana', slug: 'banana' });
      
      const result = await createCategory('Banana');
      expect(result.success).toBe(true);
      expect(categoriesQueries.createCategoryQuery).toHaveBeenCalledWith('Banana');
    });

    it('prevents duplicates', async () => {
      vi.mocked(categoriesQueries.getCategoryByNameQuery).mockResolvedValue({ id: 1, name: 'Apple', slug: 'apple' });
      
      const result = await createCategory('apple'); // case insensitive check
      expect(result.success).toBe(false);
      expect(result.error).toBe('Category already exists');
      expect(categoriesQueries.createCategoryQuery).not.toHaveBeenCalled();
    });
  });

  describe('updateCategory', () => {
    it('updates a category in database', async () => {
      vi.mocked(categoriesQueries.getCategoryByNameQuery).mockResolvedValue(null);
      vi.mocked(categoriesQueries.updateCategoryQuery).mockResolvedValue({ id: 1, name: 'Cat', slug: 'cat' });
      
      const result = await updateCategory('Banana', 'Cat');
      expect(result.success).toBe(true);
      expect(categoriesQueries.updateCategoryQuery).toHaveBeenCalledWith('Banana', 'Cat');
      
      // Verify reassignCategory was called
      const { reassignCategory } = await import('../actions/blogs.js');
      expect(reassignCategory).toHaveBeenCalledWith('Banana', 'Cat');
    });

    it('prevents updating Uncategorized', async () => {
      const result = await updateCategory('Uncategorized', 'NewName');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Cannot rename the Uncategorized category');
    });
  });

  describe('deleteCategory', () => {
    it('deletes a category in database and reassigns', async () => {
      vi.mocked(categoriesQueries.deleteCategoryQuery).mockResolvedValue({ id: 1, name: 'Apple', slug: 'apple' });
      
      const result = await deleteCategory('Apple');
      expect(result.success).toBe(true);
      expect(categoriesQueries.deleteCategoryQuery).toHaveBeenCalledWith('Apple');
      
      // Verify reassignCategory was called
      const { reassignCategory } = await import('../actions/blogs.js');
      expect(reassignCategory).toHaveBeenCalledWith('Apple', 'Uncategorized');
    });
    
    it('prevents deleting Uncategorized', async () => {
      const result = await deleteCategory('Uncategorized');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Cannot delete the Uncategorized category');
    });
  });
});
