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

export async function createDeviceAttribute(name, groupIds = ['General'], customSlug = '') {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

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

export async function updateDeviceAttribute(id, newName, newGroupIds, customSlug = '') {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

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

export async function deleteDeviceAttribute(id) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    await deleteDeviceAttributeQuery(id);
    
    revalidatePath('/dashboard/phones/attributes');
    
    return { success: true, message: 'Attribute deleted successfully' };
  } catch (error) {
    console.error('Error deleting attribute:', error);
    return { success: false, error: 'Failed to delete attribute' };
  }
}

export async function addAttributeTerm(attributeId, term) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

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

export async function deleteAttributeTerm(attributeId, term) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

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

export async function reassignAttributeGroup(oldGroup, newGroup) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    await reassignAttributeGroupQuery(oldGroup, newGroup);
    revalidatePath('/dashboard/phones/attributes');
    
    return { success: true };
  } catch (error) {
    console.error('Error reassinging attribute group:', error);
    return { success: false, error: 'Failed to reassign attribute group' };
  }
}

export async function reorderDeviceAttributes(orderedIds) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');
    
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
