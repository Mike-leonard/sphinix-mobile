'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { verifySession } from './auth';

const getBrandsFilePath = () => path.join(process.cwd(), 'data', 'device-brands.json');

export async function getDeviceBrands() {
  try {
    const filePath = getBrandsFilePath();
    const fileData = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error('Error reading device-brands.json:', error);
    return [];
  }
}

export async function createDeviceBrand(newBrand) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    if (!newBrand || typeof newBrand !== 'string' || newBrand.trim() === '') {
      return { success: false, error: 'Brand name is required' };
    }

    const trimmedBrand = newBrand.trim();
    const brands = await getDeviceBrands();
    
    // Check if brand already exists (case-insensitive)
    const exists = brands.some(b => b.toLowerCase() === trimmedBrand.toLowerCase());
    if (exists) {
      return { success: false, error: 'Brand already exists' };
    }
    
    brands.push(trimmedBrand);
    
    // Sort brands alphabetically, but keep "Other" at the end if we want, or just purely alphabetical.
    brands.sort((a, b) => a.localeCompare(b));
    
    await fs.writeFile(getBrandsFilePath(), JSON.stringify(brands, null, 2));
    
    revalidatePath('/dashboard/devices');
    revalidatePath('/dashboard/devices/brands');
    revalidatePath('/dashboard/devices/new');
    revalidatePath('/dashboard/devices/[id]/edit');
    revalidatePath('/devices');
    
    return { success: true, message: 'Brand created successfully' };
  } catch (error) {
    console.error('Error creating brand:', error);
    return { success: false, error: 'Failed to create brand' };
  }
}

export async function updateDeviceBrand(oldBrand, newBrand) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    if (oldBrand.toLowerCase() === 'other') {
      return { success: false, error: 'Cannot rename the Other brand' };
    }
    
    if (!newBrand || typeof newBrand !== 'string' || newBrand.trim() === '') {
      return { success: false, error: 'New brand name is required' };
    }

    const trimmedBrand = newBrand.trim();
    const brands = await getDeviceBrands();
    
    // Check if new name already exists
    const exists = brands.some(b => b.toLowerCase() === trimmedBrand.toLowerCase() && b.toLowerCase() !== oldBrand.toLowerCase());
    if (exists) {
      return { success: false, error: 'Brand already exists' };
    }

    const filteredBrands = brands.filter(b => b !== oldBrand);
    filteredBrands.push(trimmedBrand);
    filteredBrands.sort((a, b) => a.localeCompare(b));
    
    await fs.writeFile(getBrandsFilePath(), JSON.stringify(filteredBrands, null, 2));
    
    // Reassign devices to new brand
    const { reassignDeviceBrand } = await import('./devices.js');
    await reassignDeviceBrand(oldBrand, trimmedBrand);
    
    revalidatePath('/dashboard/devices');
    revalidatePath('/dashboard/devices/brands');
    revalidatePath('/dashboard/devices/new');
    revalidatePath('/dashboard/devices/[id]/edit');
    revalidatePath('/devices');
    
    return { success: true, message: 'Brand updated successfully' };
  } catch (error) {
    console.error('Error updating brand:', error);
    return { success: false, error: 'Failed to update brand' };
  }
}

export async function deleteDeviceBrand(brandToDelete) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    if (brandToDelete.toLowerCase() === 'other') {
      return { success: false, error: 'Cannot delete the Other brand' };
    }

    const brands = await getDeviceBrands();
    const filteredBrands = brands.filter(b => b !== brandToDelete);
    
    await fs.writeFile(getBrandsFilePath(), JSON.stringify(filteredBrands, null, 2));
    
    // Reassign affected devices to Other
    const { reassignDeviceBrand } = await import('./devices.js');
    await reassignDeviceBrand(brandToDelete, 'Other');

    revalidatePath('/dashboard/devices');
    revalidatePath('/dashboard/devices/brands');
    revalidatePath('/dashboard/devices/new');
    revalidatePath('/dashboard/devices/[id]/edit');
    revalidatePath('/devices');
    
    return { success: true, message: 'Brand deleted successfully' };
  } catch (error) {
    console.error('Error deleting brand:', error);
    return { success: false, error: 'Failed to delete brand' };
  }
}
