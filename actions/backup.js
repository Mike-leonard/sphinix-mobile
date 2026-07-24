'use server';

import fs from 'fs';
import path from 'path';

export async function createBackup() {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const backupsDir = path.join(dataDir, 'backups');
    const settingsFile = path.join(dataDir, 'settings.json');

    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }

    if (!fs.existsSync(settingsFile)) {
      return { success: false, error: 'Settings file not found.' };
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `backup-${timestamp}.json`;
    const backupPath = path.join(backupsDir, backupFileName);

    fs.copyFileSync(settingsFile, backupPath);

    return { success: true, fileName: backupFileName, message: 'Backup created successfully!' };
  } catch (error) {
    console.error('Failed to create backup:', error);
    return { success: false, error: 'Failed to create backup.' };
  }
}

export async function restoreBackup(formData) {
  try {
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

    const settingsFile = path.join(process.cwd(), 'data', 'settings.json');
    fs.writeFileSync(settingsFile, JSON.stringify(parsedData, null, 2));

    return { success: true, message: 'Backup restored successfully!' };
  } catch (error) {
    console.error('Failed to restore backup:', error);
    return { success: false, error: 'Failed to restore backup.' };
  }
}
