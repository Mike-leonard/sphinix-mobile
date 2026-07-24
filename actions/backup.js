'use server';

import { verifySession } from './auth';
import { getSettings, updateSettings } from './settings';

/**
 * Creates a backup object from PostgreSQL siteSettings (using config/default-settings.js as fallback)
 */
export async function createBackup() {
  try {
    const session = await verifySession();
    if (!session || session.role !== 'Admin') {
      return { success: false, error: 'Unauthorized. Admin access required.' };
    }

    const settings = await getSettings();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `backup-${timestamp}.json`;

    return {
      success: true,
      fileName: backupFileName,
      data: settings,
      message: 'Backup created successfully!'
    };
  } catch (error) {
    console.error('Failed to create backup:', error);
    return { success: false, error: 'Failed to create backup.' };
  }
}

/**
 * Restores siteSettings into PostgreSQL database
 */
export async function restoreBackup(formData) {
  try {
    const session = await verifySession();
    if (!session || session.role !== 'Admin') {
      return { success: false, error: 'Unauthorized. Admin access required.' };
    }

    const file = formData.get('file');
    if (!file) {
      return { success: false, error: 'No file uploaded.' };
    }

    const data = await file.text();
    
    // Validate JSON structure
    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch (e) {
      return { success: false, error: 'Invalid JSON file.' };
    }

    if (!parsedData || typeof parsedData !== 'object') {
      return { success: false, error: 'Invalid settings format.' };
    }

    // Clean payload for updateSettings
    const { id, createdAt, updatedAt, version, ...updatePayload } = parsedData;

    const res = await updateSettings(updatePayload);
    if (!res.success) {
      return { success: false, error: res.error || 'Failed to restore settings.' };
    }

    return { success: true, message: 'Backup restored successfully!' };
  } catch (error) {
    console.error('Failed to restore backup:', error);
    return { success: false, error: 'Failed to restore backup.' };
  }
}
