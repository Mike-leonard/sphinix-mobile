'use server';

import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { verifySession } from './auth';
import {
  getRatingBarsQuery,
  createRatingBarQuery,
  updateRatingBarQuery,
  deleteRatingBarQuery,
  reorderRatingBarsQuery
} from '@/queries/rating-bars';

/**
 * -----------------------------------------------------------------------------
 * RATING BARS ACTION: getRatingBars
 * -----------------------------------------------------------------------------
 * @description Public action: fetches configured expert rating criteria bars (e.g. "Performance", "Display", "Camera", "Battery Life") from PostgreSQL.
 * @why Renders expert rating score bars on public device detail pages and rating input sliders in device editor.
 * @where Called by: `app/(main)/phones/[brandSlug]/[deviceSlug]/_components/tabs/ReviewsTab.jsx`, `app/dashboard/phones/rating-bars/page.js`
 * @security Public read access.
 * @returns {Promise<Array>} Array of rating bar objects.
 */
export async function getRatingBars() {
  try {
    return await getRatingBarsQuery();
  } catch (error) {
    console.error('Error reading rating bars:', error);
    return [];
  }
}

/**
 * -----------------------------------------------------------------------------
 * RATING BARS ACTION: createRatingBar
 * -----------------------------------------------------------------------------
 * @description Admin action: creates a new expert rating criteria bar definition in PostgreSQL.
 * @why Enables admins to add new rating metrics (e.g. "Gaming", "Build Quality").
 * @where Called by: `app/dashboard/phones/rating-bars/_components/RatingBarsManager.jsx`
 * @security Restricted to authenticated admin sessions (`verifySession()`).
 * @param {object} data - { name, slug, description, defaultValue }
 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
 */
export async function createRatingBar(data) {
  try {
    const user = await verifySession();
    const role = user?.role?.toLowerCase();
    if (!user || !['admin', 'moderator'].includes(role)) {
      return { success: false, error: 'Unauthorized. Admin or Moderator access required.' };
    }

    const bars = await getRatingBarsQuery();
    
    // Check if slug already exists
    if (bars.some(b => b.slug === data.slug)) {
      return { success: false, error: 'A rating bar with this slug already exists.' };
    }

    const newBar = await createRatingBarQuery({
      id: crypto.randomUUID(),
      name: data.name,
      slug: data.slug,
      description: data.description || '',
      defaultValue: data.defaultValue || 3,
      order: bars.length
    });
    
    revalidatePath('/dashboard/phones/rating-bars');
    return { success: true, data: newBar };
  } catch (error) {
    console.error('Error creating rating bar:', error);
    return { success: false, error: error.message };
  }
}

/**
 * -----------------------------------------------------------------------------
 * RATING BARS ACTION: updateRatingBar
 * -----------------------------------------------------------------------------
 * @description Admin action: updates an existing rating bar definition (name, slug, description, default score).
 * @why Allows admins to re-label rating criteria or adjust default scores.
 * @where Called by: `app/dashboard/phones/rating-bars/_components/RatingBarsManager.jsx`
 * @security Restricted to authenticated admin sessions (`verifySession()`).
 * @param {string} id - Target rating bar ID.
 * @param {object} data - Updated rating bar fields.
 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
 */
export async function updateRatingBar(id, data) {
  try {
    const user = await verifySession();
    const role = user?.role?.toLowerCase();
    if (!user || !['admin', 'moderator'].includes(role)) {
      return { success: false, error: 'Unauthorized. Admin or Moderator access required.' };
    }

    const bars = await getRatingBarsQuery();
    const existing = bars.find(b => b.id === id);
    
    if (!existing) {
      return { success: false, error: 'Rating bar not found.' };
    }

    // Check slug collision
    if (data.slug && data.slug !== existing.slug && bars.some(b => b.slug === data.slug)) {
      return { success: false, error: 'A rating bar with this slug already exists.' };
    }

    const updatedBar = await updateRatingBarQuery(id, {
      ...existing,
      ...data
    });
    
    revalidatePath('/dashboard/phones/rating-bars');
    return { success: true, data: updatedBar };
  } catch (error) {
    console.error('Error updating rating bar:', error);
    return { success: false, error: error.message };
  }
}

/**
 * -----------------------------------------------------------------------------
 * RATING BARS ACTION: deleteRatingBar
 * -----------------------------------------------------------------------------
 * @description Admin action: deletes a rating criteria bar record from PostgreSQL.
 * @why Removes unwanted rating criteria.
 * @where Called by: `app/dashboard/phones/rating-bars/_components/RatingBarsManager.jsx`
 * @security Restricted to authenticated admin sessions (`verifySession()`).
 * @param {string} id - Target rating bar ID.
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function deleteRatingBar(id) {
  try {
    const user = await verifySession();
    const role = user?.role?.toLowerCase();
    if (!user || !['admin', 'moderator'].includes(role)) {
      return { success: false, error: 'Unauthorized. Admin or Moderator access required.' };
    }

    await deleteRatingBarQuery(id);
    
    revalidatePath('/dashboard/phones/rating-bars');
    return { success: true };
  } catch (error) {
    console.error('Error deleting rating bar:', error);
    return { success: false, error: error.message };
  }
}

/**
 * -----------------------------------------------------------------------------
 * RATING BARS ACTION: reorderRatingBars
 * -----------------------------------------------------------------------------
 * @description Admin action: re-indexes display order for expert rating criteria bars.
 * @why Enables drag-and-drop ordering of rating bars in the admin panel and public reviews.
 * @where Called by: `app/dashboard/phones/rating-bars/_components/RatingBarsManager.jsx`
 * @security Restricted to authenticated admin sessions (`verifySession()`).
 * @param {Array<string>} orderedIds - Array of rating bar IDs in target order.
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function reorderRatingBars(orderedIds) {
  try {
    const user = await verifySession();
    const role = user?.role?.toLowerCase();
    if (!user || !['admin', 'moderator'].includes(role)) {
      return { success: false, error: 'Unauthorized. Admin or Moderator access required.' };
    }

    await reorderRatingBarsQuery(orderedIds);
    
    revalidatePath('/dashboard/phones/rating-bars');
    return { success: true };
  } catch (error) {
    console.error('Error reordering rating bars:', error);
    return { success: false, error: error.message };
  }
}
