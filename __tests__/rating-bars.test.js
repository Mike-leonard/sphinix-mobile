// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getRatingBars, createRatingBar, updateRatingBar, deleteRatingBar, reorderRatingBars } from '../actions/rating-bars';
import fs from 'fs/promises';

// Mock auth
vi.mock('../actions/auth', () => ({
  verifySession: vi.fn().mockResolvedValue({ id: 1, role: 'admin' })
}));

vi.mock('fs/promises', () => ({
  default: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
    access: vi.fn(),
    mkdir: vi.fn()
  }
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}));

// Mock crypto
vi.mock('crypto', () => ({
  default: {
    randomUUID: () => 'mocked-uuid'
  }
}));

describe('Rating Bars Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getRatingBars', () => {
    it('returns parsed rating bars from file', async () => {
      const mockBars = [{ id: '1', slug: 'camera' }];
      fs.readFile.mockResolvedValue(JSON.stringify(mockBars));
      
      const result = await getRatingBars();
      expect(result).toEqual(mockBars);
      expect(fs.readFile).toHaveBeenCalledTimes(1);
    });

    it('returns empty array on error', async () => {
      fs.readFile.mockRejectedValue(new Error('Not found'));
      const result = await getRatingBars();
      expect(result).toEqual([]);
    });
  });

  describe('createRatingBar', () => {
    it('creates a new rating bar', async () => {
      fs.readFile.mockResolvedValue(JSON.stringify([]));
      
      const result = await createRatingBar({ name: 'Camera', slug: 'camera' });
      expect(result.success).toBe(true);
      expect(result.data.slug).toBe('camera');
      expect(result.data.id).toBe('mocked-uuid');
      
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('rating-bars.json'),
        expect.stringContaining('camera')
      );
    });

    it('prevents duplicates', async () => {
      fs.readFile.mockResolvedValue(JSON.stringify([{ slug: 'camera' }]));
      
      const result = await createRatingBar({ slug: 'camera' });
      expect(result.success).toBe(false);
      expect(result.error).toBe('A rating bar with this slug already exists.');
      expect(fs.writeFile).not.toHaveBeenCalled();
    });
  });

  describe('updateRatingBar', () => {
    it('updates a rating bar', async () => {
      fs.readFile.mockResolvedValue(JSON.stringify([{ id: '1', slug: 'camera', name: 'Camera' }]));
      
      const result = await updateRatingBar('1', { name: 'Awesome Camera' });
      expect(result.success).toBe(true);
      
      const writeCallArg = JSON.parse(fs.writeFile.mock.calls[0][1]);
      expect(writeCallArg[0].name).toBe('Awesome Camera');
    });
  });

  describe('deleteRatingBar', () => {
    it('deletes a rating bar', async () => {
      fs.readFile.mockResolvedValue(JSON.stringify([{ id: '1' }, { id: '2' }]));
      
      const result = await deleteRatingBar('1');
      expect(result.success).toBe(true);
      
      const writeCallArg = JSON.parse(fs.writeFile.mock.calls[0][1]);
      expect(writeCallArg.length).toBe(1);
      expect(writeCallArg[0].id).toBe('2');
    });
  });

  describe('reorderRatingBars', () => {
    it('reorders rating bars according to provided array of ids', async () => {
      fs.readFile.mockResolvedValue(JSON.stringify([
        { id: '1', name: 'Bar 1' },
        { id: '2', name: 'Bar 2' },
        { id: '3', name: 'Bar 3' }
      ]));
      
      const result = await reorderRatingBars(['3', '1', '2']);
      expect(result.success).toBe(true);
      
      const writeCallArg = JSON.parse(fs.writeFile.mock.calls[0][1]);
      expect(writeCallArg[0].id).toBe('3');
      expect(writeCallArg[1].id).toBe('1');
      expect(writeCallArg[2].id).toBe('2');
    });
  });
});
