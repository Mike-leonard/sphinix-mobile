'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { verifySession } from './auth';

const getAttributesFilePath = () => path.join(process.cwd(), 'data', 'device-attributes.json');

export async function getDeviceAttributes() {
  try {
    const filePath = getAttributesFilePath();
    const fileData = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error('Error reading device-attributes.json:', error);
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
    const newAttribute = {
      id: newId,
      name: trimmedName,
      slug: customSlug.trim() || generateSlug(trimmedName),
      terms: [],
      groupIds: Array.isArray(groupIds) && groupIds.length > 0 ? groupIds : ['General']
    };

    attributes.push(newAttribute);
    
    // Sort attributes alphabetically
    attributes.sort((a, b) => a.name.localeCompare(b.name));
    
    await fs.writeFile(getAttributesFilePath(), JSON.stringify(attributes, null, 2));
    
    revalidatePath('/dashboard/devices/attributes');
    
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
    
    const index = attributes.findIndex(a => a.id === id);
    if (index === -1) {
      return { success: false, error: 'Attribute not found' };
    }

    // Check if new name already exists elsewhere
    const exists = attributes.some(a => a.id !== id && a.name.toLowerCase() === trimmedName.toLowerCase());
    if (exists) {
      return { success: false, error: 'Another attribute with this name already exists' };
    }

    attributes[index].name = trimmedName;
    attributes[index].slug = customSlug.trim() || generateSlug(trimmedName);
    if (newGroupIds && Array.isArray(newGroupIds) && newGroupIds.length > 0) {
      attributes[index].groupIds = newGroupIds;
    }
    
    attributes.sort((a, b) => a.name.localeCompare(b.name));
    
    await fs.writeFile(getAttributesFilePath(), JSON.stringify(attributes, null, 2));
    revalidatePath('/dashboard/devices/attributes');
    revalidatePath('/dashboard/devices/groups');
    
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

    const attributes = await getDeviceAttributes();
    const filteredAttributes = attributes.filter(a => a.id !== id);
    
    await fs.writeFile(getAttributesFilePath(), JSON.stringify(filteredAttributes, null, 2));
    
    revalidatePath('/dashboard/devices/attributes');
    
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
    
    const index = attributes.findIndex(a => a.id === attributeId);
    if (index === -1) {
      return { success: false, error: 'Attribute not found' };
    }

    if (!attributes[index].terms) {
      attributes[index].terms = [];
    }

    const exists = attributes[index].terms.some(t => t.toLowerCase() === trimmedTerm.toLowerCase());
    if (exists) {
       return { success: false, error: 'Term already exists' };
    }

    attributes[index].terms.push(trimmedTerm);
    
    await fs.writeFile(getAttributesFilePath(), JSON.stringify(attributes, null, 2));
    revalidatePath('/dashboard/devices/attributes');
    
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
    
    const index = attributes.findIndex(a => a.id === attributeId);
    if (index === -1) {
      return { success: false, error: 'Attribute not found' };
    }

    if (!attributes[index].terms) {
      return { success: false, error: 'No terms found' };
    }

    attributes[index].terms = attributes[index].terms.filter(t => t !== term);
    
    await fs.writeFile(getAttributesFilePath(), JSON.stringify(attributes, null, 2));
    revalidatePath('/dashboard/devices/attributes');
    
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

    const attributes = await getDeviceAttributes();
    let updated = false;
    
    for (const attr of attributes) {
      if (attr.groupIds) {
        const idx = attr.groupIds.findIndex(g => g.toLowerCase() === oldGroup.toLowerCase());
        if (idx !== -1) {
          attr.groupIds = attr.groupIds.filter((g, i) => i !== idx);
          if (!attr.groupIds.some(g => g.toLowerCase() === newGroup.toLowerCase())) {
            attr.groupIds.push(newGroup);
          }
          if (attr.groupIds.length === 0) {
            attr.groupIds = ['General'];
          }
          updated = true;
        }
      } else if (attr.groupId && attr.groupId.toLowerCase() === oldGroup.toLowerCase()) {
        // Fallback for old data just in case
        attr.groupIds = [newGroup];
        delete attr.groupId;
        updated = true;
      }
    }
    
    if (updated) {
      await fs.writeFile(getAttributesFilePath(), JSON.stringify(attributes, null, 2));
      revalidatePath('/dashboard/devices/attributes');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error reassinging attribute group:', error);
    return { success: false, error: 'Failed to reassign attribute group' };
  }
}
