'use server';

import { revalidatePath } from 'next/cache';
import { verifySession } from './auth';
import {
  getDeviceGroupsQuery,
  createDeviceGroupQuery,
  updateDeviceGroupQuery,
  deleteDeviceGroupQuery,
  reorderDeviceGroupsQuery
} from '@/queries/device-groups';

export async function getDeviceGroups() {
  try {
    return await getDeviceGroupsQuery();
  } catch (error) {
    console.error('Error reading device groups from database:', error);
    return [];
  }
}

export async function createDeviceGroup(newGroup) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    if (!newGroup || typeof newGroup !== 'string' || newGroup.trim() === '') {
      return { success: false, error: 'Group name is required' };
    }

    const trimmedGroup = newGroup.trim();
    const groups = await getDeviceGroups();
    
    // Check if group already exists (case-insensitive)
    const exists = groups.some(g => g.toLowerCase() === trimmedGroup.toLowerCase());
    if (exists) {
      return { success: false, error: 'Group already exists' };
    }
    
    await createDeviceGroupQuery(trimmedGroup);
    
    revalidatePath('/dashboard/phones');
    revalidatePath('/dashboard/phones/groups');
    revalidatePath('/dashboard/phones/attributes');
    
    return { success: true, message: 'Group created successfully' };
  } catch (error) {
    console.error('Error creating group:', error);
    return { success: false, error: 'Failed to create group' };
  }
}

export async function updateDeviceGroup(oldGroup, newGroup) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    if (oldGroup.toLowerCase() === 'general') {
      return { success: false, error: 'Cannot rename the General group' };
    }
    
    if (!newGroup || typeof newGroup !== 'string' || newGroup.trim() === '') {
      return { success: false, error: 'New group name is required' };
    }

    const trimmedGroup = newGroup.trim();
    const groups = await getDeviceGroups();
    
    // Check if new name already exists
    const exists = groups.some(g => g.toLowerCase() === trimmedGroup.toLowerCase() && g.toLowerCase() !== oldGroup.toLowerCase());
    if (exists) {
      return { success: false, error: 'Group already exists' };
    }

    await updateDeviceGroupQuery(oldGroup, trimmedGroup);
    
    // Reassign attributes to new group name
    const { reassignAttributeGroup } = await import('./device-attributes.js');
    await reassignAttributeGroup(oldGroup, trimmedGroup);
    
    revalidatePath('/dashboard/phones');
    revalidatePath('/dashboard/phones/groups');
    revalidatePath('/dashboard/phones/attributes');
    
    return { success: true, message: 'Group updated successfully' };
  } catch (error) {
    console.error('Error updating group:', error);
    return { success: false, error: 'Failed to update group' };
  }
}

export async function deleteDeviceGroup(groupToDelete) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    if (groupToDelete.toLowerCase() === 'general') {
      return { success: false, error: 'Cannot delete the General group' };
    }

    await deleteDeviceGroupQuery(groupToDelete);
    
    // Reassign affected attributes to General
    const { reassignAttributeGroup } = await import('./device-attributes.js');
    await reassignAttributeGroup(groupToDelete, 'General');

    revalidatePath('/dashboard/phones');
    revalidatePath('/dashboard/phones/groups');
    revalidatePath('/dashboard/phones/attributes');
    
    return { success: true, message: 'Group deleted successfully' };
  } catch (error) {
    console.error('Error deleting group:', error);
    return { success: false, error: 'Failed to delete group' };
  }
}

export async function reorderDeviceGroups(newGroupsOrder) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    if (!Array.isArray(newGroupsOrder)) {
      return { success: false, error: 'Invalid groups order' };
    }

    await reorderDeviceGroupsQuery(newGroupsOrder);
    
    revalidatePath('/dashboard/phones');
    revalidatePath('/dashboard/phones/groups');
    revalidatePath('/dashboard/phones/attributes');
    
    return { success: true, message: 'Groups reordered successfully' };
  } catch (error) {
    console.error('Error reordering groups:', error);
    return { success: false, error: 'Failed to reorder groups' };
  }
}
