// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createBackup, restoreBackup } from '../actions/backup';
import fs from 'fs';
import { join } from 'path';

// Mock fs module
vi.mock('fs', () => {
  return {
    default: {
      readFileSync: vi.fn(),
      writeFileSync: vi.fn(),
      existsSync: vi.fn(),
      mkdirSync: vi.fn(),
      copyFileSync: vi.fn()
    }
  };
});

describe('Backup Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createBackup', () => {
    it('creates a backup successfully', async () => {
      fs.existsSync.mockReturnValue(true);
      
      const result = await createBackup();
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('Backup created successfully!');
      expect(fs.copyFileSync).toHaveBeenCalledTimes(1);
    });

    it('returns an error if settings file does not exist', async () => {
      fs.existsSync.mockReturnValue(false); // First call for dir, second for file
      
      const result = await createBackup();
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Settings file not found.');
      expect(fs.copyFileSync).not.toHaveBeenCalled();
    });
  });

  describe('restoreBackup', () => {
    it('restores a backup successfully when data is valid JSON', async () => {
      const validJsonString = JSON.stringify({ new: 'setting' });
      
      // Mock FormData
      const mockFormData = new FormData();
      mockFormData.append('file', new Blob([validJsonString], { type: 'application/json' }));
      
      const result = await restoreBackup(mockFormData);
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('Backup restored successfully!');
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('settings.json'), 
        expect.stringContaining('"new": "setting"')
      );
    });

    it('returns an error for invalid JSON string', async () => {
      const mockFormData = new FormData();
      mockFormData.append('file', new Blob(["invalid { json"], { type: 'application/json' }));
      
      const result = await restoreBackup(mockFormData);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid JSON file.');
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });

    it('returns an error if no file is provided', async () => {
      const mockFormData = new FormData();
      
      const result = await restoreBackup(mockFormData);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('No file uploaded.');
    });
  });
});
