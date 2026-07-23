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

export async function getRatingBars() {
  try {
    return await getRatingBarsQuery();
  } catch (error) {
    console.error('Error reading rating bars:', error);
    return [];
  }
}

export async function createRatingBar(data) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

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

export async function updateRatingBar(id, data) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

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

export async function deleteRatingBar(id) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    await deleteRatingBarQuery(id);
    
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

    await reorderRatingBarsQuery(orderedIds);
    
    revalidatePath('/dashboard/phones/rating-bars');
    return { success: true };
  } catch (error) {
    console.error('Error reordering rating bars:', error);
    return { success: false, error: error.message };
  }
}
