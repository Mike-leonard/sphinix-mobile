// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getBlogs, createBlog, updateBlog, deleteBlog } from '../actions/blogs';
import fs from 'fs/promises';
import { join } from 'path';

// Mock fs/promises
vi.mock('fs/promises', () => ({
  default: {
    readFile: vi.fn(),
    writeFile: vi.fn()
  }
}));

// Mock revalidatePath
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}));

describe('Blogs Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getBlogs', () => {
    it('returns parsed blogs from file', async () => {
      const mockBlogs = [{ id: 1, title: 'Test Blog' }];
      fs.readFile.mockResolvedValue(JSON.stringify(mockBlogs));
      
      const result = await getBlogs();
      
      expect(result).toEqual(mockBlogs);
      expect(fs.readFile).toHaveBeenCalledTimes(1);
    });

    it('returns empty array on read error', async () => {
      fs.readFile.mockRejectedValue(new Error('File not found'));
      
      const result = await getBlogs();
      
      expect(result).toEqual([]);
    });
  });

  describe('createBlog', () => {
    it('creates a new blog successfully', async () => {
      fs.readFile.mockResolvedValue(JSON.stringify([{ id: 1, title: 'Old Blog' }]));
      
      const newBlogData = {
        title: 'New Blog',
        excerpt: 'Test',
        category: 'Tech'
      };
      
      const result = await createBlog(newBlogData);
      
      expect(result.success).toBe(true);
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('blogs.json'),
        expect.stringContaining('"title": "New Blog"')
      );
      // New ID should be 2
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('blogs.json'),
        expect.stringContaining('"id": 2')
      );
    });
  });

  describe('updateBlog', () => {
    it('updates an existing blog', async () => {
      fs.readFile.mockResolvedValue(JSON.stringify([
        { id: 1, title: 'Old Title', category: 'Tech' }
      ]));
      
      const result = await updateBlog(1, { title: 'Updated Title' });
      
      expect(result.success).toBe(true);
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('blogs.json'),
        expect.stringContaining('"title": "Updated Title"')
      );
    });

    it('returns error if blog not found', async () => {
      fs.readFile.mockResolvedValue(JSON.stringify([]));
      
      const result = await updateBlog(99, { title: 'Updated Title' });
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Blog not found');
      expect(fs.writeFile).not.toHaveBeenCalled();
    });
  });

  describe('deleteBlog', () => {
    it('deletes an existing blog', async () => {
      fs.readFile.mockResolvedValue(JSON.stringify([
        { id: 1, title: 'Keep' },
        { id: 2, title: 'Delete Me' }
      ]));
      
      const result = await deleteBlog(2);
      
      expect(result.success).toBe(true);
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('blogs.json'),
        expect.not.stringContaining('Delete Me')
      );
    });
  });
});
