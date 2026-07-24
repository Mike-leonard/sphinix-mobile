// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createBackup, restoreBackup } from '../actions/backup';
import { getSettings, updateSettings } from '../actions/settings';

// Mock auth
vi.mock('../actions/auth', () => ({
  verifySession: vi.fn().mockResolvedValue({ id: 1, role: 'Admin' })
}));

// Mock settings actions
vi.mock('../actions/settings', () => ({
  getSettings: vi.fn().mockResolvedValue({ appearance: { theme: 'dark' } }),
  updateSettings: vi.fn().mockResolvedValue({ success: true })
}));

describe('Backup Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createBackup', () => {
    it('creates a backup successfully from database settings', async () => {
      const result = await createBackup();
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('Backup created successfully!');
      expect(getSettings).toHaveBeenCalledTimes(1);
    });
  });

  describe('restoreBackup', () => {
    it('restores a backup successfully to database when data is valid JSON', async () => {
      const validJsonString = JSON.stringify({ appearance: { theme: 'dark' } });
      
      // Mock FormData
      const mockFormData = new FormData();
      mockFormData.append('file', new Blob([validJsonString], { type: 'application/json' }));
      
      const result = await restoreBackup(mockFormData);
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('Backup restored successfully!');
      expect(updateSettings).toHaveBeenCalledWith({ appearance: { theme: 'dark' } });
    });

    it('returns an error for invalid JSON string', async () => {
      const mockFormData = new FormData();
      mockFormData.append('file', new Blob(["invalid { json"], { type: 'application/json' }));
      
      const result = await restoreBackup(mockFormData);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid JSON file.');
      expect(updateSettings).not.toHaveBeenCalled();
    });

    it('returns an error if no file is provided', async () => {
      const mockFormData = new FormData();
      
      const result = await restoreBackup(mockFormData);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('No file uploaded.');
    });
  });
});
