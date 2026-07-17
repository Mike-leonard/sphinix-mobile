'use server';

import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { verifySession } from './auth';

const DATA_DIR = path.join(process.cwd(), 'data');
const RATING_BARS_FILE = path.join(DATA_DIR, 'rating-bars.json');

// Ensure the data directory and file exist
async function ensureDataFile() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }

  try {
    await fs.access(RATING_BARS_FILE);
  } catch {
    await fs.writeFile(RATING_BARS_FILE, JSON.stringify([]));
  }
}

export async function getRatingBars() {
  try {
    await ensureDataFile();
    const data = await fs.readFile(RATING_BARS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading rating bars:', error);
    return [];
  }
}

export async function createRatingBar(data) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    await ensureDataFile();
    const bars = await getRatingBars();
    
    // Check if slug already exists
    if (bars.some(b => b.slug === data.slug)) {
      return { success: false, error: 'A rating bar with this slug already exists.' };
    }

    const newBar = {
      id: crypto.randomUUID(),
      name: data.name,
      slug: data.slug,
      description: data.description || '',
      defaultValue: data.defaultValue || 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    bars.push(newBar);
    await fs.writeFile(RATING_BARS_FILE, JSON.stringify(bars, null, 2));
    
    revalidatePath('/dashboard/phones/rating-bars');
    return { success: true, data: newBar };
  } catch (error) {
    console.error('Error creating rating bar:', error);
    return { success: false, error: error.message };
  }
}

export async function updateRatingBar(id, data) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    const bars = await getRatingBars();
    const index = bars.findIndex(b => b.id === id);
    
    if (index === -1) {
      return { success: false, error: 'Rating bar not found.' };
    }

    // Check slug collision
    if (data.slug && data.slug !== bars[index].slug && bars.some(b => b.slug === data.slug)) {
      return { success: false, error: 'A rating bar with this slug already exists.' };
    }

    bars[index] = {
      ...bars[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    await fs.writeFile(RATING_BARS_FILE, JSON.stringify(bars, null, 2));
    
    revalidatePath('/dashboard/phones/rating-bars');
    return { success: true, data: bars[index] };
  } catch (error) {
    console.error('Error updating rating bar:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteRatingBar(id) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    const bars = await getRatingBars();
    const newBars = bars.filter(b => b.id !== id);

    await fs.writeFile(RATING_BARS_FILE, JSON.stringify(newBars, null, 2));
    
    revalidatePath('/dashboard/phones/rating-bars');
    return { success: true };
  } catch (error) {
    console.error('Error deleting rating bar:', error);
    return { success: false, error: error.message };
  }
}

export async function reorderRatingBars(orderedIds) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    const bars = await getRatingBars();
    
    // Sort bars based on the orderedIds array
    bars.sort((a, b) => {
      const indexA = orderedIds.indexOf(a.id);
      const indexB = orderedIds.indexOf(b.id);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    await fs.writeFile(RATING_BARS_FILE, JSON.stringify(bars, null, 2));
    
    revalidatePath('/dashboard/phones/rating-bars');
    return { success: true };
  } catch (error) {
    console.error('Error reordering rating bars:', error);
    return { success: false, error: error.message };
  }
}
