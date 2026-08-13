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

/**
 * -----------------------------------------------------------------------------
 * DEVICE GROUPS ACTION: getDeviceGroups
 * -----------------------------------------------------------------------------
 * @description Public action: fetches ordered specification group categories (e.g. "General", "Display", "Camera", "Battery").
 * @why Renders tab headers and specification accordion sections on public device pages and comparison tables.
 * @where Called by: `app/(main)/phones/[brandSlug]/[deviceSlug]/_components/DeviceTabs.jsx`, `app/dashboard/phones/groups/page.js`
 * @security Public read access.
 * @returns {Promise<Array<string>>} Array of group name strings.
 */
export async function getDeviceGroups() {
  try {
    return await getDeviceGroupsQuery();
  } catch (error) {
    console.error('Error reading device groups from database:', error);
    return [];
  }
}

/**
 * -----------------------------------------------------------------------------
 * DEVICE GROUPS ACTION: createDeviceGroup
 * -----------------------------------------------------------------------------
 * @description Admin action: creates a new specification group category in PostgreSQL.
 * @why Allows admins to group spec attributes logically under new headings.
 * @where Called by: `app/dashboard/phones/groups/_components/GroupForm.jsx`
 * @security Restricted to authenticated admin sessions (`verifySession()`).
 * @param {string} newGroup - Group name string.
 * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
 */
export async function createDeviceGroup(newGroup) {
  try {
    const user = await verifySession();
    const role = typeof user === 'object' && user?.role ? user.role.toLowerCase() : (user === true ? 'admin' : '');
    if (!user || !['admin', 'moderator', 'contentwriter'].includes(role)) {
      return { success: false, error: 'Unauthorized.' };
    }

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

/**
 * -----------------------------------------------------------------------------
 * DEVICE GROUPS ACTION: updateDeviceGroup
 * -----------------------------------------------------------------------------
 * @description Admin action: renames a specification group category and updates associated attributes in PostgreSQL.
 * @why Allows admins to edit spec section titles while keeping attributes assigned.
 * @where Called by: `app/dashboard/phones/groups/_components/GroupList.jsx`
 * @security Restricted to authenticated admin sessions (`verifySession()`). Blocks renaming 'General'.
 * @param {string} oldGroup - Original group name.
 * @param {string} newGroup - Replacement group name.
 * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
 */
export async function updateDeviceGroup(oldGroup, newGroup) {
  try {
    const user = await verifySession();
    const role = typeof user === 'object' && user?.role ? user.role.toLowerCase() : (user === true ? 'admin' : '');
    if (!user || !['admin', 'moderator'].includes(role)) {
      return { success: false, error: 'Unauthorized. ContentWriters cannot rename groups.' };
    }

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

/**
 * -----------------------------------------------------------------------------
 * DEVICE GROUPS ACTION: deleteDeviceGroup
 * -----------------------------------------------------------------------------
 * @description Admin action: deletes a spec group category and reassigns its attributes to 'General'.
 * @why Removes unwanted spec headings without losing individual attribute definitions.
 * @where Called by: `app/dashboard/phones/groups/_components/GroupList.jsx`
 * @security Restricted to authenticated admin sessions (`verifySession()`). Blocks deleting 'General'.
 * @param {string} groupToDelete - Group name string to delete.
 * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
 */
export async function deleteDeviceGroup(groupToDelete) {
  try {
    const user = await verifySession();
    const role = typeof user === 'object' && user?.role ? user.role.toLowerCase() : (user === true ? 'admin' : '');
    if (!user || !['admin', 'moderator'].includes(role)) {
      return { success: false, error: 'Unauthorized. ContentWriters cannot delete groups.' };
    }

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

/**
 * -----------------------------------------------------------------------------
 * DEVICE GROUPS ACTION: reorderDeviceGroups
 * -----------------------------------------------------------------------------
 * @description Admin action: updates display order index for spec groups in PostgreSQL.
 * @why Enables drag-and-drop reordering of spec section headings on phone detail pages.
 * @where Called by: `app/dashboard/phones/groups/page.js`
 * @security Restricted to authenticated admin sessions (`verifySession()`).
 * @param {Array<string>} newGroupsOrder - Array of group names in target order.
 * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
 */
export async function reorderDeviceGroups(newGroupsOrder) {
  try {
    const user = await verifySession();
    const role = typeof user === 'object' && user?.role ? user.role.toLowerCase() : (user === true ? 'admin' : '');
    if (!user || !['admin', 'moderator'].includes(role)) {
      return { success: false, error: 'Unauthorized. ContentWriters cannot reorder groups.' };
    }

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
