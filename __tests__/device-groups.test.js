import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs/promises';
import { getDeviceGroups, createDeviceGroup, updateDeviceGroup, reorderDeviceGroups } from '@/actions/device-groups';
import * as auth from '@/actions/auth';
import * as attributes from '@/actions/device-attributes';

// Mock fs
vi.mock('fs/promises', () => ({
  default: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
  }
}));

// Mock Next.js cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

// Mock auth
vi.mock('@/actions/auth', () => ({
  verifySession: vi.fn(),
}));

// Mock device-attributes
vi.mock('@/actions/device-attributes', () => ({
  reassignAttributeGroup: vi.fn(),
}));

describe('Device Groups Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createDeviceGroup should append group without alphabetical sorting', async () => {
    auth.verifySession.mockResolvedValue(true);
    const mockGroups = ['General', 'Camera'];
    fs.readFile.mockResolvedValue(JSON.stringify(mockGroups));
    
    const res = await createDeviceGroup('Battery');
    
    expect(res.success).toBe(true);
    // Should have written ['General', 'Camera', 'Battery'] in that exact order
    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.any(String),
      JSON.stringify(['General', 'Camera', 'Battery'], null, 2)
    );
  });

  it('updateDeviceGroup should retain order of groups', async () => {
    auth.verifySession.mockResolvedValue(true);
    const mockGroups = ['General', 'Battery', 'Camera'];
    fs.readFile.mockResolvedValue(JSON.stringify(mockGroups));
    
    const res = await updateDeviceGroup('Battery', 'Power');
    
    expect(res.success).toBe(true);
    // The order should be exactly: General, Power, Camera
    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.any(String),
      JSON.stringify(['General', 'Power', 'Camera'], null, 2)
    );
  });

  it('reorderDeviceGroups should save the new exact order', async () => {
    auth.verifySession.mockResolvedValue(true);
    const mockGroups = ['General', 'Camera', 'Battery'];
    fs.readFile.mockResolvedValue(JSON.stringify(mockGroups));
    
    const newOrder = ['General', 'Battery', 'Camera'];
    const res = await reorderDeviceGroups(newOrder);
    
    expect(res.success).toBe(true);
    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.any(String),
      JSON.stringify(newOrder, null, 2)
    );
  });

  it('reorderDeviceGroups should fail if groups differ', async () => {
    auth.verifySession.mockResolvedValue(true);
    const mockGroups = ['General', 'Camera', 'Battery'];
    fs.readFile.mockResolvedValue(JSON.stringify(mockGroups));
    
    const newOrder = ['General', 'MissingGroup', 'Battery']; // 'Camera' is missing
    const res = await reorderDeviceGroups(newOrder);
    
    expect(res.success).toBe(false);
    expect(res.error).toBe('New order does not match existing groups');
    expect(fs.writeFile).not.toHaveBeenCalled();
  });
});
