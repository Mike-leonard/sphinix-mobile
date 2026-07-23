import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getRatingBars, createRatingBar, updateRatingBar, deleteRatingBar, reorderRatingBars } from '../actions/rating-bars';
import * as auth from '../actions/auth';

// Mock queries
vi.mock('@/queries/rating-bars', () => ({
  getRatingBarsQuery: vi.fn(),
  createRatingBarQuery: vi.fn(),
  updateRatingBarQuery: vi.fn(),
  deleteRatingBarQuery: vi.fn(),
  reorderRatingBarsQuery: vi.fn(),
}));

// Mock auth
vi.mock('../actions/auth', () => ({
  verifySession: vi.fn()
}));

// Mock Next.js cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}));

import {
  getRatingBarsQuery,
  createRatingBarQuery,
  updateRatingBarQuery,
  deleteRatingBarQuery,
  reorderRatingBarsQuery
} from '@/queries/rating-bars';

describe('Rating Bars Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getRatingBars', () => {
    it('returns parsed rating bars from file', async () => {
      const mockBars = [{ id: '1', slug: 'camera' }];
      getRatingBarsQuery.mockResolvedValue(mockBars);
      
      const result = await getRatingBars();
      expect(result).toEqual(mockBars);
      expect(getRatingBarsQuery).toHaveBeenCalledTimes(1);
    });

    it('returns empty array on error', async () => {
      getRatingBarsQuery.mockRejectedValue(new Error('Not found'));
      const result = await getRatingBars();
      expect(result).toEqual([]);
    });
  });

  describe('createRatingBar', () => {
    it('creates a new rating bar', async () => {
      auth.verifySession.mockResolvedValue({ id: 1, role: 'admin' });
      getRatingBarsQuery.mockResolvedValue([]);
      createRatingBarQuery.mockResolvedValue({ id: 'mocked-uuid', name: 'Camera', slug: 'camera' });
      
      const result = await createRatingBar({ name: 'Camera', slug: 'camera' });
      expect(result.success).toBe(true);
      expect(result.data.slug).toBe('camera');
      expect(result.data.id).toBe('mocked-uuid');
    });

    it('prevents duplicates', async () => {
      auth.verifySession.mockResolvedValue({ id: 1, role: 'admin' });
      getRatingBarsQuery.mockResolvedValue([{ slug: 'camera' }]);
      
      const result = await createRatingBar({ slug: 'camera' });
      expect(result.success).toBe(false);
      expect(result.error).toBe('A rating bar with this slug already exists.');
    });
  });

  describe('updateRatingBar', () => {
    it('updates a rating bar', async () => {
      auth.verifySession.mockResolvedValue({ id: 1, role: 'admin' });
      getRatingBarsQuery.mockResolvedValue([{ id: '1', slug: 'camera', name: 'Camera' }]);
      updateRatingBarQuery.mockResolvedValue({ id: '1', name: 'Awesome Camera', slug: 'camera' });
      
      const result = await updateRatingBar('1', { name: 'Awesome Camera' });
      expect(result.success).toBe(true);
      expect(updateRatingBarQuery).toHaveBeenCalledWith('1', expect.objectContaining({ name: 'Awesome Camera' }));
    });
  });

  describe('deleteRatingBar', () => {
    it('deletes a rating bar', async () => {
      auth.verifySession.mockResolvedValue({ id: 1, role: 'admin' });
      deleteRatingBarQuery.mockResolvedValue({ id: '1' });
      
      const result = await deleteRatingBar('1');
      expect(result.success).toBe(true);
      expect(deleteRatingBarQuery).toHaveBeenCalledWith('1');
    });
  });

  describe('reorderRatingBars', () => {
    it('reorders rating bars according to provided array of ids', async () => {
      auth.verifySession.mockResolvedValue({ id: 1, role: 'admin' });
      reorderRatingBarsQuery.mockResolvedValue([]);
      
      const result = await reorderRatingBars(['3', '1', '2']);
      expect(result.success).toBe(true);
      expect(reorderRatingBarsQuery).toHaveBeenCalledWith(['3', '1', '2']);
    });
  });
});
