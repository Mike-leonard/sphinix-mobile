'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { verifySession } from './auth';

const getFiltersFilePath = () => path.join(process.cwd(), 'data', 'device-filters.json');

export async function getDeviceFilters() {
  try {
    const filePath = getFiltersFilePath();
    const fileData = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    console.error('Error reading device-filters.json:', error);
    return [];
  }
}

export async function saveDeviceFilters(filters) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    await fs.writeFile(getFiltersFilePath(), JSON.stringify(filters, null, 2));
    
    revalidatePath('/dashboard/phones');
    revalidatePath('/dashboard/phones/filters');
    revalidatePath('/phones');
    
    return { success: true, message: 'Filters saved successfully' };
  } catch (error) {
    console.error('Error saving filters:', error);
    return { success: false, error: 'Failed to save filters' };
  }
}
