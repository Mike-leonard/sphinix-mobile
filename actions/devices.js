'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { verifySession } from './auth';
import { generateDeviceSlug } from '@/lib/utils';
import {
  getAllDevicesQuery,
  getDeviceByIdQuery,
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

export async function getDevices() {
  try {
    return await getAllDevicesQuery();
  } catch (error) {
    console.error('Error fetching devices:', error);
    return [];
  }
}

export async function getDeviceById(id) {
  try {
    return await getDeviceByIdQuery(id);
  } catch (error) {
    console.error('Error fetching device by id:', error);
    return null;
  }
}

export async function publishedDevices(optionsOrLimit = 10, queryParam = '', brandParam = 'All', offsetParam = 0) {
  try {
    return await getPublishedDevicesQuery(optionsOrLimit, queryParam, brandParam, offsetParam);
  } catch (error) {
    console.error('Error fetching published devices:', error);
    return [];
  }
}

export async function publishedDevicesCount(optionsOrQuery = '', brandParam = 'All') {
  try {
    return await getPublishedDevicesCountQuery(optionsOrQuery, brandParam);
  } catch (error) {
    console.error('Error fetching published devices count:', error);
    return 0;
  }
}

export async function getDeviceBrandCounts() {
  try {
    return await getDeviceBrandCountsQuery();
  } catch (error) {
    console.error('Error fetching device brand counts:', error);
    return { "All": 0 };
  }
}

export async function getNewArrivals(limit = 6) {
  try {
    return await getNewArrivalsQuery(limit);
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return [];
  }
}

export async function getTopRatedDevices(limit = 3) {
  try {
    return await getTopRatedDevicesQuery(limit);
  } catch (error) {
    console.error('Error fetching top rated devices:', error);
    return [];
  }
}

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
      specs: formData.specs || {
        screen: "",
        chipset: "",
        camera: "",
        battery: "",
        ram: "",
        storage: "",
        generalSpecs: [],
        designSpecs: [],
        networkSpecs: [],
        dataSpecs: [],
        messagingSpecs: [],
        batterySpecs: [],
        softwareSpecs: [],
        hardwareSpecs: [],
        displaySpecs: [],
        mediaSpecs: [],
        cameraSpecs: []
      }
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

export async function updateDevice(id, formData) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    const updateData = {};
    if (formData.name !== undefined) updateData.name = formData.name;
    if (formData.brand !== undefined) updateData.brand = formData.brand;
    if (formData.price !== undefined) updateData.price = formData.price;
    if (formData.rating !== undefined) updateData.rating = parseFloat(formData.rating);
    if (formData.imageColor !== undefined) updateData.imageColor = formData.imageColor;
    if (formData.isNew !== undefined) updateData.isNew = Boolean(formData.isNew);
    if (formData.isTopRated !== undefined) updateData.isTopRated = Boolean(formData.isTopRated);
    if (formData.status !== undefined) updateData.status = formData.status;
    if (formData.specs !== undefined) updateData.specs = formData.specs;

    await updateDeviceQuery(id, updateData);

    revalidatePath('/dashboard/phones');
    revalidatePath(`/phones/${id}`);
    revalidatePath('/phones');

    return { success: true, message: 'Device updated successfully' };
  } catch (error) {
    console.error('Error updating device:', error);
    return { success: false, error: error.message || 'Failed to update device' };
  }
}

export async function deleteDevice(id) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    await deleteDeviceQuery(id);

    revalidatePath('/dashboard/phones');
    revalidatePath('/phones');

    return { success: true, message: 'Device permanently deleted' };
  } catch (error) {
    console.error('Error deleting device:', error);
    return { success: false, error: error.message || 'Failed to delete device' };
  }
}

export async function trashDevice(id) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    await trashDeviceQuery(id);

    revalidatePath('/dashboard/phones');
    revalidatePath('/phones');

    return { success: true, message: 'Device moved to trash' };
  } catch (error) {
    console.error('Error trashing device:', error);
    return { success: false, error: error.message || 'Failed to trash device' };
  }
}

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

