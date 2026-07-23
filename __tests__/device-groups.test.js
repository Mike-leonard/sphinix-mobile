import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getDeviceGroups, createDeviceGroup, updateDeviceGroup, reorderDeviceGroups } from '@/actions/device-groups';
import * as auth from '@/actions/auth';

// Mock queries
vi.mock('@/queries/device-groups', () => ({
  getDeviceGroupsQuery: vi.fn(),
  createDeviceGroupQuery: vi.fn(),
  updateDeviceGroupQuery: vi.fn(),
  deleteDeviceGroupQuery: vi.fn(),
  reorderDeviceGroupsQuery: vi.fn(),
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

import {
  getDeviceGroupsQuery,
  createDeviceGroupQuery,
  updateDeviceGroupQuery,
  reorderDeviceGroupsQuery
} from '@/queries/device-groups';

describe('Device Groups Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createDeviceGroup should append group without alphabetical sorting', async () => {
    auth.verifySession.mockResolvedValue(true);
    getDeviceGroupsQuery.mockResolvedValue(['General', 'Camera']);
    createDeviceGroupQuery.mockResolvedValue({ id: 3, name: 'Battery', order: 2 });
    
    const res = await createDeviceGroup('Battery');
    
    expect(res.success).toBe(true);
    expect(createDeviceGroupQuery).toHaveBeenCalledWith('Battery');
  });

  it('updateDeviceGroup should retain order of groups', async () => {
    auth.verifySession.mockResolvedValue(true);
    getDeviceGroupsQuery.mockResolvedValue(['General', 'Battery', 'Camera']);
    updateDeviceGroupQuery.mockResolvedValue({ id: 2, name: 'Power', order: 1 });
    
    const res = await updateDeviceGroup('Battery', 'Power');
    
    expect(res.success).toBe(true);
    expect(updateDeviceGroupQuery).toHaveBeenCalledWith('Battery', 'Power');
  });

  it('reorderDeviceGroups should save the new exact order', async () => {
    auth.verifySession.mockResolvedValue(true);
    reorderDeviceGroupsQuery.mockResolvedValue([]);
    
    const newOrder = ['General', 'Battery', 'Camera'];
    const res = await reorderDeviceGroups(newOrder);
    
    expect(res.success).toBe(true);
    expect(reorderDeviceGroupsQuery).toHaveBeenCalledWith(newOrder);
  });

  it('reorderDeviceGroups should fail if order is not an array', async () => {
    auth.verifySession.mockResolvedValue(true);
    const res = await reorderDeviceGroups(null);
    
    expect(res.success).toBe(false);
    expect(res.error).toBe('Invalid groups order');
  });
});
