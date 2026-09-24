'use server';

import { revalidatePath } from 'next/cache';
import { verifySession } from './auth';
import {
  getAllDeviceBrandsQuery,
  getAllDeviceBrandsDetailedQuery,
  getDeviceBrandBySlugQuery,
  createDeviceBrandQuery,
  updateDeviceBrandQuery,
  deleteDeviceBrandQuery
} from '@/queries/device-brands';
import { reassignDeviceBrand } from './devices';

/**
 * -----------------------------------------------------------------------------
 * DEVICE BRANDS ACTION: getDeviceBrandBySlug
 * -----------------------------------------------------------------------------
 * @description Public action: fetches brand record matching slug or name from PostgreSQL.
 * @where Called by: `app/(main)/phones/[brandSlug]/page.js`
 * @security Public read access.
 * @param {string} slug - Brand slug or name.
 * @returns {Promise<object|null>} Brand record or null.
 */
export async function getDeviceBrandBySlug(slug) {
  try {
    return await getDeviceBrandBySlugQuery(slug);
  } catch (error) {
    console.error('Error fetching device brand by slug:', error);
    return null;
  }
}

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
 * DEVICE BRANDS ACTION: getDeviceBrandsDetailed
 * -----------------------------------------------------------------------------
 * @description Admin action: fetches all registered brands with ID, name, slug, H1, intro, and metadata.
 * @where Called by: `app/dashboard/phones/brands/page.js`
 * @security Public read access.
 * @returns {Promise<Array<object>>} Array of brand objects.
 */
export async function getDeviceBrandsDetailed() {
  try {
    return await getAllDeviceBrandsDetailedQuery();
  } catch (error) {
    console.error('Error fetching detailed device brands:', error);
    return [];
  }
}

/**
 * -----------------------------------------------------------------------------
 * DEVICE BRANDS ACTION: createDeviceBrand
 * -----------------------------------------------------------------------------
 * @description Admin action: creates a new device brand entry in PostgreSQL.
 * @why Allows admins to add new smartphone manufacturers (e.g. Nothing, OnePlus) with custom SEO H1 and intro.
 * @where Called by: `app/dashboard/phones/brands/_components/BrandForm.jsx`
 * @security Restricted to authenticated admin sessions (`verifySession()`).
 * @param {string} newBrand - Brand name string.
 * @param {object} [seoData] - Optional SEO fields ({ h1, intro }).
 * @returns {Promise<{ success: boolean, message?: string, error?: string, brand?: object }>}
 */
export async function createDeviceBrand(newBrand, seoData = {}) {
  try {
    const user = await verifySession();
    const role = user?.role?.toLowerCase();
    if (!user || !['admin', 'moderator', 'contentwriter'].includes(role)) {
      return { success: false, error: 'Unauthorized.' };
    }

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

    const created = await createDeviceBrandQuery(trimmedBrand, seoData);

    revalidatePath('/dashboard/phones');
    revalidatePath('/dashboard/phones/brands');
    revalidatePath('/dashboard/phones/new');
    revalidatePath('/dashboard/phones/[id]/edit');
    revalidatePath('/phones');

    return { success: true, message: 'Brand created successfully', brand: created };
  } catch (error) {
    console.error('Error creating brand:', error);
    return { success: false, error: error.message || 'Failed to create brand' };
  }
}

/**
 * -----------------------------------------------------------------------------
 * DEVICE BRANDS ACTION: updateDeviceBrand
 * -----------------------------------------------------------------------------
 * @description Admin action: updates brand name, H1, intro, and reassigns associated devices if renamed.
 * @why Allows admins to edit manufacturer brand names and SEO content.
 * @where Called by: `app/dashboard/phones/brands/_components/BrandList.jsx`
 * @security Restricted to authenticated admin sessions (`verifySession()`). Blocks renaming 'Other'.
 * @param {string} oldBrand - Original brand name.
 * @param {string} newBrand - Replacement brand name.
 * @param {object} [seoData] - Optional SEO fields ({ h1, intro }).
 * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
 */
export async function updateDeviceBrand(oldBrand, newBrand, seoData = {}) {
  try {
    const user = await verifySession();
    const role = user?.role?.toLowerCase();
    if (!user || !['admin', 'moderator'].includes(role)) {
      return { success: false, error: 'Unauthorized. ContentWriters cannot edit brands.' };
    }

    if (oldBrand.toLowerCase() === 'other' && newBrand && newBrand.trim().toLowerCase() !== 'other') {
      return { success: false, error: 'Cannot rename the Other brand' };
    }

    const trimmedBrand = (newBrand && typeof newBrand === 'string' && newBrand.trim()) ? newBrand.trim() : oldBrand;

    // If name is changing, check if target name already exists
    if (trimmedBrand.toLowerCase() !== oldBrand.toLowerCase()) {
      const brands = await getDeviceBrands();
      const exists = brands.some(b => b.toLowerCase() === trimmedBrand.toLowerCase() && b.toLowerCase() !== oldBrand.toLowerCase());
      if (exists) {
        return { success: false, error: 'Brand with this name already exists' };
      }
    }

    await updateDeviceBrandQuery(oldBrand, trimmedBrand, seoData);

    // Reassign devices to new brand name in database if renamed
    if (trimmedBrand !== oldBrand) {
      await reassignDeviceBrand(oldBrand, trimmedBrand);
    }

    revalidatePath('/dashboard/phones');
    revalidatePath('/dashboard/phones/brands');
    revalidatePath('/dashboard/phones/new');
    revalidatePath('/dashboard/phones/[id]/edit');
    revalidatePath('/phones');
    revalidatePath(`/phones/${trimmedBrand.toLowerCase()}`);
    revalidatePath(`/phones/${oldBrand.toLowerCase()}`);

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
    const role = user?.role?.toLowerCase();
    if (!user || !['admin', 'moderator'].includes(role)) {
      return { success: false, error: 'Unauthorized. ContentWriters cannot delete brands.' };
    }

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
