'use server';

import { revalidatePath } from 'next/cache';
import { verifySession } from './auth';
import {
  getAllAffiliateCountriesQuery,
  getEnabledAffiliateCountriesQuery,
  createAffiliateCountryQuery,
  updateAffiliateCountryQuery,
  deleteAffiliateCountryQuery
} from '@/queries/affiliate-countries';

/**
 * -----------------------------------------------------------------------------
 * AFFILIATE ACTION: getAffiliateCountries
 * -----------------------------------------------------------------------------
 * @description Fetches all target affiliate country records (both enabled & disabled) from PostgreSQL.
 * @why Used by admin management page to list and edit target market rules and retailer tags.
 * @where Called by: `app/dashboard/phones/affiliate-country/page.js`
 * @security Restricted to Admin, Moderator, and ContentWriter roles (`verifySession()`).
 * @returns {Promise<Array>} Array of affiliate country objects.
 */
export async function getAffiliateCountries() {
  const session = await verifySession();
  if (!session || !['Admin', 'Moderator', 'ContentWriter'].includes(session.role)) {
    return [];
  }
  try {
    return await getAllAffiliateCountriesQuery();
  } catch (error) {
    console.error('Error fetching affiliate countries:', error);
    return [];
  }
}

/**
 * -----------------------------------------------------------------------------
 * AFFILIATE ACTION: getPublishedAffiliateCountries
 * -----------------------------------------------------------------------------
 * @description Fetches active/enabled affiliate countries for store link resolution.
 * @why Enables device editor and public phone pages to list active target markets and store tags.
 * @where Called by: `app/dashboard/phones/_components/editor/DeviceAffiliateInputs.jsx`, `app/(main)/phones/[brandSlug]/[deviceSlug]/_components/quick-info/AffiliateLinks.jsx`
 * @security Public read access (only returns enabled countries).
 * @returns {Promise<Array>} Array of enabled affiliate country objects.
 */
export async function getPublishedAffiliateCountries() {
  try {
    return await getEnabledAffiliateCountriesQuery();
  } catch (error) {
    console.error('Error fetching published affiliate countries:', error);
    return [];
  }
}

/**
 * -----------------------------------------------------------------------------
 * AFFILIATE ACTION: createAffiliateCountry
 * -----------------------------------------------------------------------------
 * @description Creates a new target affiliate country market record in PostgreSQL.
 * @why Allows admins to add new country markets (e.g. United Kingdom, India) with custom store templates.
 * @where Called by: `app/dashboard/phones/affiliate-country/_components/AffiliateCountryForm.jsx`
 * @security Restricted strictly to Admin role (`verifySession()`).
 * @param {object} data - { name, code, flag, currencySymbol, currencyCode, isDefault, enabled, stores }
 * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
 */
export async function createAffiliateCountry(data) {
  const session = await verifySession();
  if (!session || session.role !== 'Admin') {
    return { success: false, error: 'Unauthorized. Admin access required.' };
  }

  try {
    await createAffiliateCountryQuery(data);
    revalidatePath('/dashboard/phones/affiliate-country');
    return { success: true, message: 'Affiliate country created successfully!' };
  } catch (error) {
    console.error('Error creating affiliate country:', error);
    return { success: false, error: error.message || 'Failed to create affiliate country.' };
  }
}

/**
 * -----------------------------------------------------------------------------
 * AFFILIATE ACTION: updateAffiliateCountry
 * -----------------------------------------------------------------------------
 * @description Updates an existing affiliate country record (currency, enabled status, store tags, or default state).
 * @why Allows admins to reconfigure active affiliate markets or toggle country availability.
 * @where Called by: `app/dashboard/phones/affiliate-country/_components/AffiliateCountryList.jsx`
 * @security Restricted strictly to Admin role (`verifySession()`).
 * @param {string} id - Record ID of the affiliate country.
 * @param {object} data - Updated fields.
 * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
 */
export async function updateAffiliateCountry(id, data) {
  const session = await verifySession();
  if (!session || session.role !== 'Admin') {
    return { success: false, error: 'Unauthorized. Admin access required.' };
  }

  try {
    await updateAffiliateCountryQuery(id, data);
    revalidatePath('/dashboard/phones/affiliate-country');
    return { success: true, message: 'Affiliate country updated successfully!' };
  } catch (error) {
    console.error('Error updating affiliate country:', error);
    return { success: false, error: error.message || 'Failed to update affiliate country.' };
  }
}

/**
 * -----------------------------------------------------------------------------
 * AFFILIATE ACTION: deleteAffiliateCountry
 * -----------------------------------------------------------------------------
 * @description Permanently deletes an affiliate country record from PostgreSQL.
 * @why Allows admins to remove deprecated or obsolete target country markets.
 * @where Called by: `app/dashboard/phones/affiliate-country/_components/AffiliateCountryList.jsx`
 * @security Restricted strictly to Admin role (`verifySession()`).
 * @param {string} id - Record ID of the affiliate country.
 * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
 */
export async function deleteAffiliateCountry(id) {
  const session = await verifySession();
  if (!session || session.role !== 'Admin') {
    return { success: false, error: 'Unauthorized. Admin access required.' };
  }

  try {
    await deleteAffiliateCountryQuery(id);
    revalidatePath('/dashboard/phones/affiliate-country');
    return { success: true, message: 'Affiliate country deleted successfully!' };
  } catch (error) {
    console.error('Error deleting affiliate country:', error);
    return { success: false, error: error.message || 'Failed to delete affiliate country.' };
  }
}
