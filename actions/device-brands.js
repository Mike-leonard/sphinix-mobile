'use server';

import { revalidatePath } from 'next/cache';
import { verifySession } from './auth';
import {
  getAllDeviceBrandsQuery,
  createDeviceBrandQuery,
  updateDeviceBrandQuery,
  deleteDeviceBrandQuery
} from '@/queries/device-brands';
import { reassignDeviceBrand } from './devices';

/**
 * -----------------------------------------------------------------------------
 * DEVICE BRANDS ACTION: getDeviceBrands
 * -----------------------------------------------------------------------------
 * @description Public action: fetches all registered smartphone brand names (e.g. "Apple", "Samsung", "Google") from PostgreSQL.
 * @why Pre-populates brand selectors in device creation forms and public catalog brand filter dropdowns.
 * @where Called by: `app/dashboard/phones/_components/editor/DeviceBasicInfo.jsx`, `app/(main)/phones/page.js`
 * @security Public read access.
 * @returns {Promise<Array<string>>} Array of brand name strings.
 */
export async function getDeviceBrands() {
  try {
    return await getAllDeviceBrandsQuery();
  } catch (error) {
    console.error('Error fetching device brands:', error);
    return [];
  }
}

/**
 * -----------------------------------------------------------------------------
 * DEVICE BRANDS ACTION: createDeviceBrand
 * -----------------------------------------------------------------------------
 * @description Admin action: creates a new device brand entry in PostgreSQL.
 * @why Allows admins to add new smartphone manufacturers (e.g. Nothing, OnePlus).
 * @where Called by: `app/dashboard/phones/brands/_components/BrandForm.jsx`
 * @security Restricted to authenticated admin sessions (`verifySession()`).
 * @param {string} newBrand - Brand name string.
 * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
 */
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

    await createDeviceBrandQuery(trimmedBrand);

    revalidatePath('/dashboard/phones');
    revalidatePath('/dashboard/phones/brands');
    revalidatePath('/dashboard/phones/new');
    revalidatePath('/dashboard/phones/[id]/edit');
    revalidatePath('/phones');

    return { success: true, message: 'Brand created successfully' };
  } catch (error) {
    console.error('Error creating brand:', error);
    return { success: false, error: error.message || 'Failed to create brand' };
  }
}

/**
 * -----------------------------------------------------------------------------
 * DEVICE BRANDS ACTION: updateDeviceBrand
 * -----------------------------------------------------------------------------
 * @description Admin action: renames a device brand and updates associated devices in PostgreSQL.
 * @why Allows admins to edit manufacturer brand names while keeping device catalog references linked.
 * @where Called by: `app/dashboard/phones/brands/_components/BrandList.jsx`
 * @security Restricted to authenticated admin sessions (`verifySession()`). Blocks renaming 'Other'.
 * @param {string} oldBrand - Original brand name.
 * @param {string} newBrand - Replacement brand name.
 * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
 */
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

    await updateDeviceBrandQuery(oldBrand, trimmedBrand);

    // Reassign devices to new brand name in database
    await reassignDeviceBrand(oldBrand, trimmedBrand);

    revalidatePath('/dashboard/phones');
    revalidatePath('/dashboard/phones/brands');
    revalidatePath('/dashboard/phones/new');
    revalidatePath('/dashboard/phones/[id]/edit');
    revalidatePath('/phones');

    return { success: true, message: 'Brand updated successfully' };
  } catch (error) {
    console.error('Error updating brand:', error);
    return { success: false, error: error.message || 'Failed to update brand' };
  }
}

/**
 * -----------------------------------------------------------------------------
 * DEVICE BRANDS ACTION: deleteDeviceBrand
 * -----------------------------------------------------------------------------
 * @description Admin action: deletes a brand entry and reassigns its devices to 'Other'.
 * @why Removes brand categories without deleting existing devices.
 * @where Called by: `app/dashboard/phones/brands/_components/BrandList.jsx`
 * @security Restricted to authenticated admin sessions (`verifySession()`). Blocks deleting 'Other'.
 * @param {string} brandToDelete - Brand name string to delete.
 * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
 */
export async function deleteDeviceBrand(brandToDelete) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    if (brandToDelete.toLowerCase() === 'other') {
      return { success: false, error: 'Cannot delete the Other brand' };
    }

    await deleteDeviceBrandQuery(brandToDelete);

    // Reassign affected devices to Other in database
    await reassignDeviceBrand(brandToDelete, 'Other');

    revalidatePath('/dashboard/phones');
    revalidatePath('/dashboard/phones/brands');
    revalidatePath('/dashboard/phones/new');
    revalidatePath('/dashboard/phones/[id]/edit');
    revalidatePath('/phones');

    return { success: true, message: 'Brand deleted successfully' };
  } catch (error) {
    console.error('Error deleting brand:', error);
    return { success: false, error: error.message || 'Failed to delete brand' };
  }
}
