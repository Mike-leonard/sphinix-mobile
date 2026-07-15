// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCategories, createCategory, deleteCategory, updateCategory } from '../actions/categories';
import fs from 'fs/promises';

// Mock auth
vi.mock('../actions/auth', () => ({
  verifySession: vi.fn().mockResolvedValue({ id: 1, role: 'admin' })
}));

// Mock the blogs action module so we can test the reassignCategory call
vi.mock('../actions/blogs.js', () => ({
  reassignCategory: vi.fn().mockResolvedValue({ success: true })
}));

vi.mock('fs/promises', () => ({
  default: {
    readFile: vi.fn(),
    writeFile: vi.fn()
  }
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}));

describe('Categories Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCategories', () => {
    it('returns parsed categories from file', async () => {
      const mockCats = ['Tech', 'News'];
      fs.readFile.mockResolvedValue(JSON.stringify(mockCats));
      
      const result = await getCategories();
      expect(result).toEqual(mockCats);
      expect(fs.readFile).toHaveBeenCalledTimes(1);
    });

    it('returns empty array on error', async () => {
      fs.readFile.mockRejectedValue(new Error('Not found'));
      const result = await getCategories();
      expect(result).toEqual([]);
    });
  });

  describe('createCategory', () => {
    it('creates a new category and sorts', async () => {
      fs.readFile.mockResolvedValue(JSON.stringify(['Zebra', 'Apple']));
      
      const result = await createCategory('Banana');
      expect(result.success).toBe(true);
      
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('categories.json'),
        expect.stringContaining('Apple') // checking it wrote the new array
      );
      // Wait, let's verify sorting
      const writeCallArg = JSON.parse(fs.writeFile.mock.calls[0][1]);
      expect(writeCallArg).toEqual(['Apple', 'Banana', 'Zebra']);
    });

    it('prevents duplicates', async () => {
      fs.readFile.mockResolvedValue(JSON.stringify(['Apple']));
      
      const result = await createCategory('apple'); // case insensitive check
      expect(result.success).toBe(false);
      expect(result.error).toBe('Category already exists');
      expect(fs.writeFile).not.toHaveBeenCalled();
    });
  });

  describe('updateCategory', () => {
    it('updates a category and sorts', async () => {
      fs.readFile.mockResolvedValue(JSON.stringify(['Apple', 'Banana', 'Zebra']));
      
      const result = await updateCategory('Banana', 'Cat');
      expect(result.success).toBe(true);
      
      const writeCallArg = JSON.parse(fs.writeFile.mock.calls[0][1]);
      expect(writeCallArg).toEqual(['Apple', 'Cat', 'Zebra']);
      
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
    it('deletes a category and reassigns', async () => {
      fs.readFile.mockResolvedValue(JSON.stringify(['Apple', 'Banana']));
      
      const result = await deleteCategory('Apple');
      expect(result.success).toBe(true);
      
      const writeCallArg = JSON.parse(fs.writeFile.mock.calls[0][1]);
      expect(writeCallArg).toEqual(['Banana']);
      
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
