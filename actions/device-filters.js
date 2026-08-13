'use server';

import { revalidatePath } from 'next/cache';
import { verifySession } from './auth';
import { getDeviceFiltersQuery, saveDeviceFiltersBatchQuery } from '@/queries/device-filters';

/**
 * -----------------------------------------------------------------------------
 * DEVICE FILTERS ACTION: getDeviceFilters
 * -----------------------------------------------------------------------------
 * @description Public action: fetches configured search filter rules (e.g. price range, RAM size, battery capacity filters).
 * @why Renders the sidebar filter options on public phone catalog pages and admin filter settings.
 * @where Called by: `app/(main)/phones/page.js`, `app/dashboard/phones/filters/page.js`
 * @security Public read access.
 * @returns {Promise<Array>} Array of filter group objects with allowed options.
 */
export async function getDeviceFilters() {
  try {
    return await getDeviceFiltersQuery();
  } catch (error) {
    console.error('Error fetching device filters from database:', error);
    return [];
  }
}

/**
 * -----------------------------------------------------------------------------
 * DEVICE FILTERS ACTION: saveDeviceFilters
 * -----------------------------------------------------------------------------
 * @description Admin action: saves updated filter configuration rules into PostgreSQL in a batch operation.
 * @why Allows admins to customize which spec attributes appear as sidebar search filters on the catalog.
 * @where Called by: `app/dashboard/phones/filters/_components/FiltersManager.jsx`
 * @security Restricted to authenticated admin sessions (`verifySession()`).
 * @param {Array<object>} filters - Batch list of filter definitions.
 * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
 */
export async function saveDeviceFilters(filters) {
  try {
    const user = await verifySession();
    if (!user || !['Admin', 'Moderator'].includes(user.role)) {
      return { success: false, error: 'Unauthorized. Admin or Moderator access required.' };
    }

    await saveDeviceFiltersBatchQuery(filters);
    
    revalidatePath('/dashboard/phones');
    revalidatePath('/dashboard/phones/filters');
    revalidatePath('/phones');
    
    return { success: true, message: 'Filters saved successfully to database' };
  } catch (error) {
    console.error('Error saving filters to database:', error);
    return { success: false, error: 'Failed to save filters' };
  }
}
