'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { verifySession } from './auth';
import { generateDeviceSlug } from '@/lib/utils';

const getDevicesFilePath = () => path.join(process.cwd(), 'data', 'products.json');

export async function getDevices() {
  try {
    const filePath = getDevicesFilePath();
    const fileData = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error('Error reading products.json:', error);
    return [];
  }
}

export async function getDeviceById(id) {
  try {
    const devices = await getDevices();
    return devices.find(d => d.id === id) || null;
  } catch (error) {
    console.error('Error finding device:', error);
    return null;
  }
}

export async function createDevice(formData) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');
    
    const devices = await getDevices();
    
    // Generate new ID (slug)
    let newId = generateDeviceSlug(formData.name);
    // Ensure ID is unique
    let counter = 1;
    let uniqueId = newId;
    while (devices.some(d => d.id === uniqueId)) {
      uniqueId = `${newId}-${counter}`;
      counter++;
    }
    
    const newDevice = {
      id: uniqueId,
      name: formData.name,
      brand: formData.brand,
      category: formData.category || 'Devices',
      price: formData.price,
      rating: formData.rating || 0,
      imageColor: formData.imageColor || 'from-slate-600 to-zinc-800',
      isNew: formData.isNew || false,
      isTopRated: formData.isTopRated || false,
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
    
    devices.unshift(newDevice);
    
    await fs.writeFile(getDevicesFilePath(), JSON.stringify(devices, null, 2));
    revalidatePath('/dashboard/phones');
    
    return { success: true, message: 'Device created successfully' };
  } catch (error) {
    console.error('Error creating device:', error);
    return { success: false, error: 'Failed to create device' };
  }
}

export async function updateDevice(id, formData) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    const devices = await getDevices();
    const index = devices.findIndex(d => d.id === id);
    
    if (index === -1) {
      return { success: false, error: 'Device not found' };
    }
    
    devices[index] = {
      ...devices[index],
      ...formData
    };
    
    await fs.writeFile(getDevicesFilePath(), JSON.stringify(devices, null, 2));
    revalidatePath('/dashboard/phones');
    revalidatePath(`/phones/${id}`);
    
    return { success: true, message: 'Device updated successfully' };
  } catch (error) {
    console.error('Error updating device:', error);
    return { success: false, error: 'Failed to update device' };
  }
}

export async function deleteDevice(id) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    const devices = await getDevices();
    const filteredDevices = devices.filter(d => d.id !== id);
    
    if (filteredDevices.length === devices.length) {
      return { success: false, error: 'Device not found' };
    }

    await fs.writeFile(getDevicesFilePath(), JSON.stringify(filteredDevices, null, 2));
    revalidatePath('/dashboard/phones');
    revalidatePath('/phones');
    
    return { success: true, message: 'Device permanently deleted' };
  } catch (error) {
    console.error('Error deleting device:', error);
    return { success: false, error: 'Failed to delete device' };
  }
}

export async function trashDevice(id) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    const devices = await getDevices();
    const index = devices.findIndex(d => d.id === id);
    if (index === -1) return { success: false, error: 'Device not found' };
    
    devices[index].status = 'trash';
    await fs.writeFile(getDevicesFilePath(), JSON.stringify(devices, null, 2));
    revalidatePath('/dashboard/phones');
    
    return { success: true, message: 'Device moved to trash' };
  } catch (error) {
    console.error('Error trashing device:', error);
    return { success: false, error: 'Failed to trash device' };
  }
}

export async function restoreDevice(id) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    const devices = await getDevices();
    const index = devices.findIndex(d => d.id === id);
    if (index === -1) return { success: false, error: 'Device not found' };
    
    devices[index].status = 'draft';
    await fs.writeFile(getDevicesFilePath(), JSON.stringify(devices, null, 2));
    revalidatePath('/dashboard/phones');
    
    return { success: true, message: 'Device restored as draft' };
  } catch (error) {
    console.error('Error restoring device:', error);
    return { success: false, error: 'Failed to restore device' };
  }
}

export async function reassignDeviceBrand(oldBrand, newBrand) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    const devices = await getDevices();
    let updated = false;
    
    for (const device of devices) {
      if (device.brand && device.brand.toLowerCase() === oldBrand.toLowerCase()) {
        device.brand = newBrand;
        updated = true;
      }
    }
    
    if (updated) {
      await fs.writeFile(getDevicesFilePath(), JSON.stringify(devices, null, 2));
      revalidatePath('/dashboard/phones');
      revalidatePath('/phones');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error reassinging device brand:', error);
    return { success: false, error: 'Failed to reassign device brand' };
  }
}

