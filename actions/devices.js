'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { verifySession } from './auth';
import { generateDeviceSlug } from '@/lib/utils';
import {
  getAllDevicesQuery,
  getDeviceByIdQuery,
  getPublishedDeviceByIdQuery,
  getDevicesByIdsQuery,
  getPublishedDevicesByIdsQuery,
  getPublishedDevicesQuery,
  getPublishedDevicesCountQuery,
  getDeviceBrandCountsQuery,
  getNewArrivalsQuery,
  getTopRatedDevicesQuery,
  createDeviceQuery,
  updateDeviceQuery,
  deleteDeviceQuery,
  trashDeviceQuery,
  restoreDeviceQuery,
  reassignDeviceBrandQuery
} from '@/queries/devices';

/**
 * -----------------------------------------------------------------------------
 * DEVICE ACTION: getDevices
 * -----------------------------------------------------------------------------
 * @description Admin action: fetches devices with backend database sorting and filtering capabilities.
 * @why Powers the admin phone manager list page and supports server-side sorting.
 * @where Called by: `app/dashboard/phones/page.js`, `DevicesManager.jsx`
 * @security Restricted to authenticated admin sessions (`verifySession()`).
 * @param {object} [options] - Optional sorting and filtering options ({ sortField, sortOrder, search, brand, viewMode }).
 * @returns {Promise<Array>} Array of matching device objects.
 */
export async function getDevices(options = {}) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');
    return await getAllDevicesQuery(options);
  } catch (error) {
    console.error('Error fetching devices:', error);
    return [];
  }
}

/**
 * -----------------------------------------------------------------------------
 * DEVICE ACTION: getDeviceById
 * -----------------------------------------------------------------------------
 * @description Admin action: fetches a device by ID/slug regardless of status.
 * @why Pre-populates the admin device editor when editing a phone record.
 * @where Called by: `app/dashboard/phones/edit/[id]/page.js`
 * @security Restricted to authenticated admin sessions (`verifySession()`).
 * @param {string} id - Device ID / slug.
 * @returns {Promise<object|null>} Device object or `null`.
 */
export async function getDeviceById(id) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');
    return await getDeviceByIdQuery(id);
  } catch (error) {
    console.error('Error fetching device by id:', error);
    return null;
  }
}

/**
 * -----------------------------------------------------------------------------
 * DEVICE ACTION: getPublishedDeviceById
 * -----------------------------------------------------------------------------
 * @description Public action: fetches a published device by ID/slug for public view.
 * @why Renders individual smartphone detail pages (`/phones/[brandSlug]/[deviceSlug]`).
 * @where Called by: `app/(main)/phones/[brandSlug]/[deviceSlug]/page.js`
 * @security Public read access (only returns status === "published").
 * @param {string} id - Device ID / slug.
 * @returns {Promise<object|null>} Published device object or `null`.
 */
export async function getPublishedDeviceById(id) {
  try {
    return await getPublishedDeviceByIdQuery(id);
  } catch (error) {
    console.error('Error fetching published device by id:', error);
    return null;
  }
}

/**
 * -----------------------------------------------------------------------------
 * DEVICE ACTION: getDevicesByIds
 * -----------------------------------------------------------------------------
 * @description Admin action: fetches multiple devices by IDs regardless of status.
 * @why Used in administrative bulk management and comparison operations.
 * @where Called by: Admin dashboard workflows.
 * @security Restricted to authenticated admin sessions (`verifySession()`).
 * @param {Array<string>} ids - Array of device IDs.
 * @returns {Promise<Array>} Array of device objects.
 */
export async function getDevicesByIds(ids) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');
    return await getDevicesByIdsQuery(ids);
  } catch (error) {
    console.error('Error fetching devices by ids:', error);
    return [];
  }
}

/**
 * -----------------------------------------------------------------------------
 * DEVICE ACTION: getPublishedDevicesByIds
 * -----------------------------------------------------------------------------
 * @description Public action: fetches published devices matching an array of IDs.
 * @why Pre-populates side-by-side comparison tables on the public comparisons page.
 * @where Called by: `app/(main)/comparisons/page.js`
 * @security Public read access.
 * @param {Array<string>} ids - Array of device IDs.
 * @returns {Promise<Array>} Array of published device objects.
 */
export async function getPublishedDevicesByIds(ids) {
  try {
    return await getPublishedDevicesByIdsQuery(ids);
  } catch (error) {
    console.error('Error fetching published devices by ids:', error);
    return [];
  }
}

/**
 * -----------------------------------------------------------------------------
 * DEVICE ACTION: publishedDevices
 * -----------------------------------------------------------------------------
 * @description Public action: fetches paginated published devices with optional search query, brand, and spec filters.
 * @why Powers public catalog listing pages with multi-attribute filtering.
 * @where Called by: `app/(main)/phones/page.js`
 * @security Public read access.
 * @param {number|object} optionsOrLimit - Limit or options object.
 * @param {string} queryParam - Search query term.
 * @param {string} brandParam - Brand name filter.
 * @param {number} offsetParam - Pagination offset.
 * @returns {Promise<Array>} Array of matching published devices.
 */
export async function publishedDevices(optionsOrLimit = 10, queryParam = '', brandParam = 'All', offsetParam = 0) {
  try {
    return await getPublishedDevicesQuery(optionsOrLimit, queryParam, brandParam, offsetParam);
  } catch (error) {
    console.error('Error fetching published devices:', error);
    return [];
  }
}

/**
 * -----------------------------------------------------------------------------
 * DEVICE ACTION: publishedDevicesCount
 * -----------------------------------------------------------------------------
 * @description Public action: calculates total count of published devices matching search and filters.
 * @why Enables pagination calculation for public catalog listing pages.
 * @where Called by: `app/(main)/phones/page.js`
 * @security Public read access.
 * @param {string|object} optionsOrQuery - Search query term or options object.
 * @param {string} brandParam - Brand name filter.
 * @returns {Promise<number>} Total count of published devices.
 */
export async function publishedDevicesCount(optionsOrQuery = '', brandParam = 'All') {
  try {
    return await getPublishedDevicesCountQuery(optionsOrQuery, brandParam);
  } catch (error) {
    console.error('Error fetching published devices count:', error);
    return 0;
  }
}

/**
 * -----------------------------------------------------------------------------
 * DEVICE ACTION: getDeviceBrandCounts
 * -----------------------------------------------------------------------------
 * @description Public action: fetches device counts grouped by manufacturer brand name.
 * @why Displays count badges next to brand names in filter sidebars and footer links.
 * @where Called by: `components/sidebar/RightSidebar.jsx`
 * @security Public read access.
 * @returns {Promise<object>} Object mapping brand names to count numbers (e.g. `{ "Apple": 12, "Samsung": 15 }`).
 */
export async function getDeviceBrandCounts() {
  try {
    return await getDeviceBrandCountsQuery();
  } catch (error) {
    console.error('Error fetching device brand counts:', error);
    return { "All": 0 };
  }
}

/**
 * -----------------------------------------------------------------------------
 * DEVICE ACTION: getNewArrivals
 * -----------------------------------------------------------------------------
 * @description Public action: fetches recently released devices marked `isNew: true`.
 * @why Renders the "New Arrivals" showcase carousel on the home page.
 * @where Called by: `app/(main)/page.js`
 * @security Public read access.
 * @param {number} limit - Maximum devices to return (default 6).
 * @returns {Promise<Array>} Array of new arrival device objects.
 */
export async function getNewArrivals(limit = 6) {
  try {
    return await getNewArrivalsQuery(limit);
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return [];
  }
}

/**
 * -----------------------------------------------------------------------------
 * DEVICE ACTION: getTopRatedDevices
 * -----------------------------------------------------------------------------
 * @description Public action: fetches devices marked `isTopRated: true` ordered by rating score.
 * @why Renders the "Top Rated Smartphones" section on the home page.
 * @where Called by: `app/(main)/page.js`
 * @security Public read access.
 * @param {number} limit - Maximum devices to return (default 3).
 * @returns {Promise<Array>} Array of top rated device objects.
 */
export async function getTopRatedDevices(limit = 3) {
  try {
    return await getTopRatedDevicesQuery(limit);
  } catch (error) {
    console.error('Error fetching top rated devices:', error);
    return [];
  }
}

/**
 * -----------------------------------------------------------------------------
 * DEVICE ACTION: createDevice
 * -----------------------------------------------------------------------------
 * @description Admin action: creates a new smartphone/device record in PostgreSQL.
 * @why Saves new devices created manually or generated by AI in the dashboard.
 * @where Called by: `app/dashboard/phones/new/page.js`, `app/dashboard/phones/_components/editor/DeviceEditor.jsx`
 * @security Restricted to authenticated admin sessions (`verifySession()`).
 * @param {object} formData - { name, brand, price, rating, imageColor, isNew, isTopRated, status, specs, affiliates, description, images, imageAlts, seo }
 * @returns {Promise<{ success: boolean, message?: string, id?: string, error?: string }>}
 */
export async function createDevice(formData) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    const devices = await getAllDevicesQuery();

    // Generate new ID (slug)
    let newId = generateDeviceSlug(formData.name);
    let counter = 1;
    let uniqueId = newId;

    while (devices.some(d => d.id === uniqueId)) {
      uniqueId = `${newId}-${counter}`;
      counter++;
    }

    const specsPayload = {
      ...(formData.specs || {}),
      affiliates: formData.affiliates || {
        amazon: { url: '', price: '' },
        bestbuy: { url: '', price: '' },
        walmart: { url: '', price: '' },
        ebay: { url: '', price: '' }
      },
      description: formData.description || '',
      expertRatings: formData.expertRatings || {},
      images: formData.images || ['', '', '', ''],
      imageAlts: formData.imageAlts || ['', '', '', ''],
      allowReviews: formData.allowReviews ?? true,
      seo: formData.seo || { metaTitle: '', metaDescription: '', keywords: '' }
    };

    const deviceData = {
      id: uniqueId,
      name: formData.name,
      brand: formData.brand,
      price: formData.price,
      rating: parseFloat(formData.rating) || 0,
      imageColor: formData.imageColor || 'from-slate-600 to-zinc-800',
      isNew: Boolean(formData.isNew),
      isTopRated: Boolean(formData.isTopRated),
      status: formData.status || 'draft',
      specs: specsPayload
    };

    await createDeviceQuery(deviceData);

    revalidatePath('/dashboard/phones');
    revalidatePath('/phones');

    return { success: true, message: 'Device created successfully', id: uniqueId };
  } catch (error) {
    console.error('Error creating device:', error);
    return { success: false, error: error.message || 'Failed to create device' };
  }
}

/**
 * -----------------------------------------------------------------------------
 * DEVICE ACTION: updateDevice
 * -----------------------------------------------------------------------------
 * @description Admin action: updates an existing device record in PostgreSQL.
 * @why Saves edits to specs, affiliate links, gallery images, ratings, or status.
 * @where Called by: `app/dashboard/phones/edit/[id]/page.js`, `app/dashboard/phones/_components/editor/DeviceEditor.jsx`
 * @security Restricted to authenticated admin sessions (`verifySession()`).
 * @param {string} id - Device ID / slug.
 * @param {object} formData - Updated device fields.
 * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
 */
export async function updateDevice(id, formData) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    const existing = await getDeviceByIdQuery(id);
    if (!existing) throw new Error('Device not found');

    const existingSpecs = (existing.specs && typeof existing.specs === 'object') ? existing.specs : {};

    let targetId = id;
    if (formData.name && formData.name.trim() !== '' && formData.name !== existing.name) {
      const candidateSlug = generateDeviceSlug(formData.name);
      if (candidateSlug !== id) {
        const allDevices = await getAllDevicesQuery();
        let uniqueSlug = candidateSlug;
        let counter = 1;
        while (allDevices.some(d => d.id === uniqueSlug && d.id !== id)) {
          uniqueSlug = `${candidateSlug}-${counter}`;
          counter++;
        }
        targetId = uniqueSlug;
      }
    }

    const updateData = {};
    if (formData.name !== undefined) updateData.name = formData.name;
    if (formData.brand !== undefined) updateData.brand = formData.brand;
    if (formData.price !== undefined) updateData.price = formData.price;
    if (formData.rating !== undefined) updateData.rating = parseFloat(formData.rating);
    if (formData.imageColor !== undefined) updateData.imageColor = formData.imageColor;
    if (formData.isNew !== undefined) updateData.isNew = Boolean(formData.isNew);
    if (formData.isTopRated !== undefined) updateData.isTopRated = Boolean(formData.isTopRated);
    if (formData.status !== undefined) updateData.status = formData.status;

    const updatedSpecs = {
      ...existingSpecs,
      ...(formData.specs || {}),
      ...(formData.affiliates !== undefined ? { affiliates: formData.affiliates } : {}),
      ...(formData.description !== undefined ? { description: formData.description } : {}),
      ...(formData.expertRatings !== undefined ? { expertRatings: formData.expertRatings } : {}),
      ...(formData.images !== undefined ? { images: formData.images } : {}),
      ...(formData.imageAlts !== undefined ? { imageAlts: formData.imageAlts } : {}),
      ...(formData.allowReviews !== undefined ? { allowReviews: formData.allowReviews } : {}),
      ...(formData.seo !== undefined ? { seo: formData.seo } : {})
    };

    updateData.specs = updatedSpecs;

    if (targetId !== id) {
      const fullDeviceData = {
        id: targetId,
        name: updateData.name || existing.name,
        brand: updateData.brand || existing.brand,
        price: updateData.price !== undefined ? updateData.price : existing.price,
        rating: updateData.rating !== undefined ? updateData.rating : existing.rating,
        imageColor: updateData.imageColor || existing.imageColor,
        isNew: updateData.isNew !== undefined ? updateData.isNew : existing.isNew,
        isTopRated: updateData.isTopRated !== undefined ? updateData.isTopRated : existing.isTopRated,
        status: updateData.status || existing.status,
        specs: updatedSpecs
      };
      await createDeviceQuery(fullDeviceData);
      await deleteDeviceQuery(id);
    } else {
      await updateDeviceQuery(id, updateData);
    }

    revalidatePath('/dashboard/phones');
    revalidatePath(`/phones/${id}`);
    revalidatePath(`/phones/${targetId}`);
    revalidatePath('/phones');

    return { success: true, message: 'Device updated successfully', newId: targetId };
  } catch (error) {
    console.error('Error updating device:', error);
    return { success: false, error: error.message || 'Failed to update device' };
  }
}

/**
 * -----------------------------------------------------------------------------
 * DEVICE ACTION: deleteDevice
 * -----------------------------------------------------------------------------
 * @description Admin action: permanently deletes a device record from PostgreSQL.
 * @why Removes a device permanently from the system.
 * @where Called by: `app/dashboard/phones/_components/manager/DevicesManager.jsx`
 * @security Restricted to authenticated admin sessions (`verifySession()`).
 * @param {string} id - Target device ID / slug.
 * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
 */
export async function deleteDevice(id) {
  try {
    const user = await verifySession();
    const role = user?.role?.toLowerCase();
    if (!user || !['admin', 'moderator'].includes(role)) {
      return { success: false, error: 'Unauthorized. ContentWriters cannot delete items permanently.' };
    }

    await deleteDeviceQuery(id);

    revalidatePath('/dashboard/phones');
    revalidatePath('/phones');

    return { success: true, message: 'Device permanently deleted' };
  } catch (error) {
    console.error('Error deleting device:', error);
    return { success: false, error: error.message || 'Failed to delete device' };
  }
}

/**
 * -----------------------------------------------------------------------------
 * DEVICE ACTION: trashDevice
 * -----------------------------------------------------------------------------
 * @description Admin action: soft-deletes a device record by setting status to `'trash'`.
 * @why Moves a device to trash allowing easy recovery.
 * @where Called by: `app/dashboard/phones/_components/manager/DevicesManager.jsx`
 * @security Restricted to authenticated admin sessions (`verifySession()`).
 * @param {string} id - Target device ID / slug.
 * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
 */
export async function trashDevice(id) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    const device = await getDeviceByIdQuery(id);
    if (device && device.status === 'published') {
      return { success: false, error: 'Cannot delete a published phone. Please set it to draft status first.' };
    }

    await trashDeviceQuery(id);

    revalidatePath('/dashboard/phones');
    revalidatePath('/phones');

    return { success: true, message: 'Device moved to trash' };
  } catch (error) {
    console.error('Error trashing device:', error);
    return { success: false, error: error.message || 'Failed to trash device' };
  }
}

/**
 * -----------------------------------------------------------------------------
 * DEVICE ACTION: restoreDevice
 * -----------------------------------------------------------------------------
 * @description Admin action: restores a trashed device record by setting status to `'draft'`.
 * @why Recovers a trashed device back into the catalog drafts.
 * @where Called by: `app/dashboard/phones/_components/manager/DevicesManager.jsx`
 * @security Restricted to authenticated admin sessions (`verifySession()`).
 * @param {string} id - Target device ID / slug.
 * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
 */
export async function restoreDevice(id) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    await restoreDeviceQuery(id);

    revalidatePath('/dashboard/phones');
    revalidatePath('/phones');

    return { success: true, message: 'Device restored as draft' };
  } catch (error) {
    console.error('Error restoring device:', error);
    return { success: false, error: error.message || 'Failed to restore device' };
  }
}

/**
 * -----------------------------------------------------------------------------
 * DEVICE ACTION: reassignDeviceBrand
 * -----------------------------------------------------------------------------
 * @description Admin action: updates all devices under an old brand name to a new brand name.
 * @why Maintains relational consistency when a brand is renamed or merged.
 * @where Called by: `actions/device-brands.js`
 * @security Restricted to authenticated admin sessions (`verifySession()`).
 * @param {string} oldBrand - Original brand name.
 * @param {string} newBrand - Replacement brand name.
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function reassignDeviceBrand(oldBrand, newBrand) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    await reassignDeviceBrandQuery(oldBrand, newBrand);

    revalidatePath('/dashboard/phones');
    revalidatePath('/phones');

    return { success: true };
  } catch (error) {
    console.error('Error reassigning device brand:', error);
    return { success: false, error: error.message || 'Failed to reassign device brand' };
  }
}

/**
 * -----------------------------------------------------------------------------
 * DEVICE ACTION: setDeviceViewMode
 * -----------------------------------------------------------------------------
 * @description Saves user preference for catalog view mode ('grid' or 'list') in HTTP cookies.
 * @why Remembers layout preference across page reloads without changing URL parameters.
 * @where Called by: `app/(main)/phones/_components/SortingControl.jsx`
 * @security Sets HTTP-only path cookie.
 * @param {string} mode - 'grid' or 'list'.
 * @returns {Promise<{ success: boolean }>}
 */
export async function setDeviceViewMode(mode) {
  try {
    const cookieStore = await cookies();
    cookieStore.set('deviceViewMode', mode, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    revalidatePath('/phones');
    return { success: true };
  } catch (error) {
    console.error('Error setting device view mode:', error);
    return { success: false };
  }
}

/**
 * -----------------------------------------------------------------------------
 * DEVICE ACTION: getDeviceViewMode
 * -----------------------------------------------------------------------------
 * @description Reads user catalog view mode preference ('grid' or 'list') from HTTP cookies on server render.
 * @why Determines whether to render grid or list view on the server pass during page load.
 * @where Called by: `app/(main)/phones/page.js`
 * @security Reads HTTP cookie.
 * @returns {Promise<string>} 'grid' or 'list'.
 */
export async function getDeviceViewMode() {
  try {
    const cookieStore = await cookies();
    const mode = cookieStore.get('deviceViewMode')?.value;
    return mode === 'list' ? 'list' : 'grid';
  } catch (error) {
    console.error('Error getting device view mode:', error);
    return 'grid';
  }
}

/**
 * -----------------------------------------------------------------------------
 * DEVICE ACTION: duplicateDevice
 * -----------------------------------------------------------------------------
 * @description Admin action: creates a duplicate copy of an existing device in DRAFT status.
 * @param {string} id - Target device ID / slug to duplicate.
 * @returns {Promise<{ success: boolean, data?: object, message?: string, error?: string }>}
 */
export async function duplicateDevice(id) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    const original = await getDeviceByIdQuery(id);
    if (!original) throw new Error('Original device not found');

    const newName = `${original.name} (Copy)`;
    const allDevices = await getAllDevicesQuery();

    let newId = generateDeviceSlug(newName);
    let counter = 1;
    let uniqueId = newId;

    while (allDevices.some(d => d.id === uniqueId)) {
      uniqueId = `${newId}-${counter}`;
      counter++;
    }

    const duplicatedData = {
      id: uniqueId,
      name: newName,
      brand: original.brand,
      price: original.price || '$0',
      rating: parseFloat(original.rating) || 0,
      imageColor: original.imageColor || 'from-slate-600 to-zinc-800',
      isNew: Boolean(original.isNew),
      isTopRated: Boolean(original.isTopRated),
      status: 'draft',
      specs: original.specs ? JSON.parse(JSON.stringify(original.specs)) : {}
    };

    const created = await createDeviceQuery(duplicatedData);

    revalidatePath('/dashboard/phones');
    revalidatePath('/phones');

    return { success: true, data: created, message: 'Device duplicated successfully' };
  } catch (error) {
    console.error('Error duplicating device:', error);
    return { success: false, error: error.message || 'Failed to duplicate device' };
  }
}
