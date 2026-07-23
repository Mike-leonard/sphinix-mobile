'use server';

import { revalidatePath } from 'next/cache';
import { verifySession } from './auth';
import { getDeviceFiltersQuery, saveDeviceFiltersBatchQuery } from '@/queries/device-filters';

export async function getDeviceFilters() {
  try {
    return await getDeviceFiltersQuery();
  } catch (error) {
    console.error('Error fetching device filters from database:', error);
    return [];
  }
}

export async function saveDeviceFilters(filters) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

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
