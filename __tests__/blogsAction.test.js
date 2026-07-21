// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getBlogs, createBlog, updateBlog, trashBlog, permanentlyDeleteBlog } from '../actions/blogs';
import { 
  getAllBlogs, 
  createBlogQuery, 
  updateBlogById, 
  deleteBlogById 
} from '@/queries/blogs';

// Mock auth
vi.mock('../actions/auth', () => ({
  verifySession: vi.fn().mockResolvedValue({ id: 1, role: 'admin' })
}));

// Mock queries
vi.mock('@/queries/blogs', () => ({
  getAllBlogs: vi.fn(),
  getBlogById: vi.fn(),
  createBlogQuery: vi.fn(),
  updateBlogById: vi.fn(),
  deleteBlogById: vi.fn(),
  updateBlogCategory: vi.fn()
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
    it('returns blogs from DB', async () => {
      const mockBlogs = [{ id: 1, title: 'Test Blog' }];
      getAllBlogs.mockResolvedValue(mockBlogs);
      
      const result = await getBlogs();
      
      expect(result).toEqual(mockBlogs);
      expect(getAllBlogs).toHaveBeenCalledTimes(1);
    });

    it('returns empty array on error', async () => {
      getAllBlogs.mockRejectedValue(new Error('DB error'));
      
      const result = await getBlogs();
      
      expect(result).toEqual([]);
    });
  });

  describe('createBlog', () => {
    it('creates a new blog successfully', async () => {
      createBlogQuery.mockResolvedValue({ id: 1 });
      
      const newBlogData = {
        title: 'New Blog',
        excerpt: 'Test',
        category: 'Tech'
      };
      
      const result = await createBlog(newBlogData);
      
      expect(result.success).toBe(true);
      expect(createBlogQuery).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'New Blog' })
      );
    });
  });

  describe('updateBlog', () => {
    it('updates an existing blog', async () => {
      updateBlogById.mockResolvedValue({ id: 1 });
      
      const result = await updateBlog(1, { title: 'Updated Title' });
      
      expect(result.success).toBe(true);
      expect(updateBlogById).toHaveBeenCalledWith(1, { title: 'Updated Title' });
    });
  });

  describe('trashBlog', () => {
    it('updates status to trash', async () => {
      updateBlogById.mockResolvedValue({ id: 1 });
      
      const result = await trashBlog(1);
      
      expect(result.success).toBe(true);
      expect(updateBlogById).toHaveBeenCalledWith(1, { status: 'trash' });
    });
  });

  describe('permanentlyDeleteBlog', () => {
    it('deletes from DB', async () => {
      deleteBlogById.mockResolvedValue({ id: 1 });
      
      const result = await permanentlyDeleteBlog(1);
      
      expect(result.success).toBe(true);
      expect(deleteBlogById).toHaveBeenCalledWith(1);
    });
  });
});
