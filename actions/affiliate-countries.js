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

export async function getPublishedAffiliateCountries() {
  try {
    return await getEnabledAffiliateCountriesQuery();
  } catch (error) {
    console.error('Error fetching published affiliate countries:', error);
    return [];
  }
}

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
