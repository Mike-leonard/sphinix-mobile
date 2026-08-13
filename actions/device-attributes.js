'use server';

import { revalidatePath } from 'next/cache';
import { verifySession } from './auth';
import {
  getDeviceAttributesQuery,
  createDeviceAttributeQuery,
  updateDeviceAttributeQuery,
  deleteDeviceAttributeQuery,
  reassignAttributeGroupQuery
} from '@/queries/device-attributes';

/**
 * -----------------------------------------------------------------------------
 * DEVICE ATTRIBUTES ACTION: getDeviceAttributes
 * -----------------------------------------------------------------------------
 * @description Public action: fetches all registered spec attributes and group assignments from PostgreSQL.
 * @why Pre-populates dynamic specification forms in the device editor and comparison tables.
 * @where Called by: `app/dashboard/phones/_components/editor/DeviceSpecsInputs.jsx`, `actions/ai/device-actions.js`
 * @security Public read access.
 * @returns {Promise<Array>} Array of attribute objects ({ id, name, slug, terms, groupIds, order }).
 */
export async function getDeviceAttributes() {
  try {
    return await getDeviceAttributesQuery();
  } catch (error) {
    console.error('Error reading device attributes from database:', error);
    return [];
  }
}

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

/**
 * -----------------------------------------------------------------------------
 * DEVICE ATTRIBUTES ACTION: createDeviceAttribute
 * -----------------------------------------------------------------------------
 * @description Admin action: registers a new specification attribute (e.g. "Refresh Rate", "Battery Capacity").
 * @why Enables admins to expand smartphone spec schemas dynamically without altering database columns.
 * @where Called by: `app/dashboard/phones/attributes/page.js`
 * @security Restricted to authenticated admin sessions (`verifySession()`).
 * @param {string} name - Attribute label.
 * @param {Array<string>} groupIds - List of associated spec group IDs.
 * @param {string} customSlug - Optional custom slug.
 * @returns {Promise<{ success: boolean, message?: string, attribute?: object, error?: string }>}
 */
export async function createDeviceAttribute(name, groupIds = ['General'], customSlug = '') {
  try {
    const user = await verifySession();
    const role = user?.role?.toLowerCase();
    if (!user || !['admin', 'moderator', 'contentwriter'].includes(role)) {
      return { success: false, error: 'Unauthorized.' };
    }

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return { success: false, error: 'Attribute name is required' };
    }

    const trimmedName = name.trim();
    const attributes = await getDeviceAttributes();
    
    // Check if attribute already exists (case-insensitive)
    const exists = attributes.some(a => a.name.toLowerCase() === trimmedName.toLowerCase());
    if (exists) {
      return { success: false, error: 'Attribute already exists' };
    }
    
    const newId = `attr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const newAttribute = await createDeviceAttributeQuery({
      id: newId,
      name: trimmedName,
      slug: customSlug.trim() || generateSlug(trimmedName),
      terms: [],
      groupIds: Array.isArray(groupIds) && groupIds.length > 0 ? groupIds : ['General']
    });
    
    revalidatePath('/dashboard/phones/attributes');
    
    return { success: true, message: 'Attribute created successfully', attribute: newAttribute };
  } catch (error) {
    console.error('Error creating attribute:', error);
    return { success: false, error: 'Failed to create attribute' };
  }
}

/**
 * -----------------------------------------------------------------------------
 * DEVICE ATTRIBUTES ACTION: updateDeviceAttribute
 * -----------------------------------------------------------------------------
 * @description Admin action: updates an existing attribute's name, group assignment, or slug.
 * @why Allows admins to rename or re-group device specification fields.
 * @where Called by: `app/dashboard/phones/attributes/page.js`
 * @security Restricted to authenticated session (`verifySession()`).
 * @param {string} id - Target attribute ID.
 * @param {string} newName - New attribute label.
 * @param {Array<string>} newGroupIds - Updated group IDs.
 * @param {string} customSlug - Optional custom slug.
 * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
 */
export async function updateDeviceAttribute(id, newName, newGroupIds, customSlug = '') {
  try {
    const user = await verifySession();
    const role = user?.role?.toLowerCase();
    if (!user || !['admin', 'moderator'].includes(role)) {
      return { success: false, error: 'Unauthorized. ContentWriters cannot edit attributes.' };
    }

    if (!newName || typeof newName !== 'string' || newName.trim() === '') {
      return { success: false, error: 'New attribute name is required' };
    }

    const trimmedName = newName.trim();
    const attributes = await getDeviceAttributes();
    
    const target = attributes.find(a => a.id === id);
    if (!target) {
      return { success: false, error: 'Attribute not found' };
    }

    // Check if new name already exists elsewhere
    const exists = attributes.some(a => a.id !== id && a.name.toLowerCase() === trimmedName.toLowerCase());
    if (exists) {
      return { success: false, error: 'Another attribute with this name already exists' };
    }

    await updateDeviceAttributeQuery(id, {
      name: trimmedName,
      slug: customSlug.trim() || generateSlug(trimmedName),
      ...(newGroupIds && Array.isArray(newGroupIds) && newGroupIds.length > 0 && { groupIds: newGroupIds })
    });

    revalidatePath('/dashboard/phones/attributes');
    revalidatePath('/dashboard/phones/groups');
    
    return { success: true, message: 'Attribute updated successfully' };
  } catch (error) {
    console.error('Error updating attribute:', error);
    return { success: false, error: 'Failed to update attribute' };
  }
}

/**
 * -----------------------------------------------------------------------------
 * DEVICE ATTRIBUTES ACTION: deleteDeviceAttribute
 * -----------------------------------------------------------------------------
 * @description Admin action: deletes a specification attribute record from PostgreSQL.
 * @why Removes unused or obsolete spec fields.
 * @where Called by: `app/dashboard/phones/attributes/page.js`
 * @security Restricted to authenticated session (`verifySession()`).
 * @param {string} id - Target attribute ID.
 * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
 */
export async function deleteDeviceAttribute(id) {
  try {
    const user = await verifySession();
    const role = user?.role?.toLowerCase();
    if (!user || !['admin', 'moderator'].includes(role)) {
      return { success: false, error: 'Unauthorized. ContentWriters cannot delete attributes.' };
    }

    await deleteDeviceAttributeQuery(id);
    
    revalidatePath('/dashboard/phones/attributes');
    
    return { success: true, message: 'Attribute deleted successfully' };
  } catch (error) {
    console.error('Error deleting attribute:', error);
    return { success: false, error: 'Failed to delete attribute' };
  }
}

/**
 * -----------------------------------------------------------------------------
 * DEVICE ATTRIBUTES ACTION: addAttributeTerm
 * -----------------------------------------------------------------------------
 * @description Admin action: adds a pre-set term option value to an attribute's allowed terms list.
 * @why Provides pre-fill suggestions for values in device editors (e.g. "AMOLED", "LCD" for Screen type).
 * @where Called by: `app/dashboard/phones/attributes/page.js`
 * @security Restricted to authenticated session (`verifySession()`).
 * @param {string} attributeId - Target attribute ID.
 * @param {string} term - Value term string to append.
 * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
 */
export async function addAttributeTerm(attributeId, term) {
  try {
    const user = await verifySession();
    const role = user?.role?.toLowerCase();
    if (!user || !['admin', 'moderator', 'contentwriter'].includes(role)) {
      return { success: false, error: 'Unauthorized.' };
    }

    if (!term || typeof term !== 'string' || term.trim() === '') {
      return { success: false, error: 'Term is required' };
    }

    const trimmedTerm = term.trim();
    const attributes = await getDeviceAttributes();
    
    const target = attributes.find(a => a.id === attributeId);
    if (!target) {
      return { success: false, error: 'Attribute not found' };
    }

    const terms = target.terms || [];
    const exists = terms.some(t => t.toLowerCase() === trimmedTerm.toLowerCase());
    if (exists) {
      return { success: false, error: 'Term already exists' };
    }

    const updatedTerms = [...terms, trimmedTerm];
    await updateDeviceAttributeQuery(attributeId, { terms: updatedTerms });
    
    revalidatePath('/dashboard/phones/attributes');
    
    return { success: true, message: 'Term added successfully' };
  } catch (error) {
    console.error('Error adding term:', error);
    return { success: false, error: 'Failed to add term' };
  }
}

/**
 * -----------------------------------------------------------------------------
 * DEVICE ATTRIBUTES ACTION: deleteAttributeTerm
 * -----------------------------------------------------------------------------
 * @description Admin action: removes a pre-set term value from an attribute's terms list.
 * @why Cleans up obsolete term options.
 * @where Called by: `app/dashboard/phones/attributes/page.js`
 * @security Restricted to authenticated session (`verifySession()`).
 * @param {string} attributeId - Target attribute ID.
 * @param {string} term - Term string to remove.
 * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
 */
export async function deleteAttributeTerm(attributeId, term) {
  try {
    const user = await verifySession();
    const role = user?.role?.toLowerCase();
    if (!user || !['admin', 'moderator'].includes(role)) {
      return { success: false, error: 'Unauthorized. ContentWriters cannot delete terms.' };
    }

    const attributes = await getDeviceAttributes();
    
    const target = attributes.find(a => a.id === attributeId);
    if (!target) {
      return { success: false, error: 'Attribute not found' };
    }

    const terms = target.terms || [];
    const updatedTerms = terms.filter(t => t !== term);
    
    await updateDeviceAttributeQuery(attributeId, { terms: updatedTerms });
    revalidatePath('/dashboard/phones/attributes');
    
    return { success: true, message: 'Term deleted successfully' };
  } catch (error) {
    console.error('Error deleting term:', error);
    return { success: false, error: 'Failed to delete term' };
  }
}

/**
 * -----------------------------------------------------------------------------
 * DEVICE ATTRIBUTES ACTION: reassignAttributeGroup
 * -----------------------------------------------------------------------------
 * @description Admin action: reassigns all attributes from an old group name to a new group name.
 * @why Maintains spec relation integrity when an admin renames a spec group.
 * @where Called by: `app/dashboard/phones/groups/page.js`
 * @security Restricted to authenticated session (`verifySession()`).
 * @param {string} oldGroup - Original group name.
 * @param {string} newGroup - Replacement group name.
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function reassignAttributeGroup(oldGroup, newGroup) {
  try {
    const user = await verifySession();
    const role = user?.role?.toLowerCase();
    if (!user || !['admin', 'moderator'].includes(role)) {
      return { success: false, error: 'Unauthorized. ContentWriters cannot reassign attribute groups.' };
    }

    await reassignAttributeGroupQuery(oldGroup, newGroup);
    revalidatePath('/dashboard/phones/attributes');
    
    return { success: true };
  } catch (error) {
    console.error('Error reassinging attribute group:', error);
    return { success: false, error: 'Failed to reassign attribute group' };
  }
}

/**
 * -----------------------------------------------------------------------------
 * DEVICE ATTRIBUTES ACTION: reorderDeviceAttributes
 * -----------------------------------------------------------------------------
 * @description Admin action: updates display order index for spec attributes.
 * @why Enables drag-and-drop reordering of specification fields in the admin dashboard.
 * @where Called by: `app/dashboard/phones/attributes/page.js`
 * @security Restricted to authenticated session (`verifySession()`).
 * @param {Array<string>} orderedIds - Array of attribute IDs in target display order.
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function reorderDeviceAttributes(orderedIds) {
  try {
    const user = await verifySession();
    const role = user?.role?.toLowerCase();
    if (!user || !['admin', 'moderator'].includes(role)) {
      return { success: false, error: 'Unauthorized. ContentWriters cannot reorder attributes.' };
    }
    
    if (!Array.isArray(orderedIds)) {
      throw new Error('orderedIds must be an array');
    }

    for (let i = 0; i < orderedIds.length; i++) {
      await updateDeviceAttributeQuery(orderedIds[i], { order: i });
    }
    
    revalidatePath('/dashboard/phones/attributes');
    return { success: true };
  } catch (error) {
    console.error('Error reordering device attributes:', error);
    return { success: false, error: error.message };
  }
}
