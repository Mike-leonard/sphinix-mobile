'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { verifySession } from './auth';

const getGroupsFilePath = () => path.join(process.cwd(), 'data', 'device-groups.json');

export async function getDeviceGroups() {
  try {
    const filePath = getGroupsFilePath();
    const fileData = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error('Error reading device-groups.json:', error);
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
    
    groups.push(trimmedGroup);
    groups.sort((a, b) => a.localeCompare(b));
    
    await fs.writeFile(getGroupsFilePath(), JSON.stringify(groups, null, 2));
    
    revalidatePath('/dashboard/devices');
    revalidatePath('/dashboard/devices/groups');
    revalidatePath('/dashboard/devices/attributes');
    
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

    const filteredGroups = groups.filter(g => g !== oldGroup);
    filteredGroups.push(trimmedGroup);
    filteredGroups.sort((a, b) => a.localeCompare(b));
    
    await fs.writeFile(getGroupsFilePath(), JSON.stringify(filteredGroups, null, 2));
    
    // Reassign attributes to new group
    const { reassignAttributeGroup } = await import('./device-attributes.js');
    await reassignAttributeGroup(oldGroup, trimmedGroup);
    
    revalidatePath('/dashboard/devices');
    revalidatePath('/dashboard/devices/groups');
    revalidatePath('/dashboard/devices/attributes');
    
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

    const groups = await getDeviceGroups();
    const filteredGroups = groups.filter(g => g !== groupToDelete);
    
    await fs.writeFile(getGroupsFilePath(), JSON.stringify(filteredGroups, null, 2));
    
    // Reassign affected attributes to General
    const { reassignAttributeGroup } = await import('./device-attributes.js');
    await reassignAttributeGroup(groupToDelete, 'General');

    revalidatePath('/dashboard/devices');
    revalidatePath('/dashboard/devices/groups');
    revalidatePath('/dashboard/devices/attributes');
    
    return { success: true, message: 'Group deleted successfully' };
  } catch (error) {
    console.error('Error deleting group:', error);
    return { success: false, error: 'Failed to delete group' };
  }
}
