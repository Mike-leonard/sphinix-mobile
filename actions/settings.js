'use server';

import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

const settingsFilePath = path.join(process.cwd(), 'data', 'settings.json');

const defaultSettings = {
  seo: {
    home: { 
      title: "Sphinix Mobile | In-Depth Smartphone Reviews & Tech Blog", 
      description: "Read expert, unbiased smartphone reviews, detailed mobile specifications, comparison guides, and the latest mobile technology blog posts on Sphinix Mobile.",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      favicon: ""
    },
    devices: { title: "", description: "", ogTitle: "", ogDescription: "", ogImage: "" },
    blogs: { title: "", description: "", ogTitle: "", ogDescription: "", ogImage: "" },
    comparisons: { title: "", description: "", ogTitle: "", ogDescription: "", ogImage: "" }
  },
  typography: {
    h1Size: {
      "Global Default": "2.25rem",
      "Hero Section": "3rem",
      "Dashboard Headers": "1.875rem",
      "Auth Pages": "1.5rem",
      "Device Details": "1.875rem",
      "Blogs Header": "1.875rem",
      "Comparisons Header": "1.125rem"
    },
    h2Size: {
      "Global Default": "1.875rem",
      "Section Headers": "1.875rem",
      "Card Titles": "1.25rem",
      "Settings & Forms": "1.5rem",
      "Modal & Drawer Titles": "1.5rem"
    },
    h3Size: {
      "Global Default": "1.5rem",
      "Section Headers": "1.5rem",
      "Card Titles": "1.125rem",
      "Settings & Forms": "1.25rem",
      "Modal & Drawer Titles": "1.25rem"
    },
    pSize: {
      "Global Default": "1rem",
      "Section Subtitles": "0.875rem",
      "Card Descriptions": "0.875rem",
      "Form Text": "0.875rem",
      "Footer Text": "0.875rem"
    },
    navSize: "0.875rem",
    buttonSize: {
      "Global Default": "0.875rem",
      "Primary Actions": "1rem",
      "Secondary Actions": "0.875rem",
      "Sidebar & Nav Items": "0.875rem"
    }
  },
  appearance: {
    primaryColor: "#8b5cf6"
  },
  analytics: {
    googleAnalyticsId: ""
  },
  advertisements: {
    adsensePublisherId: "",
    enableAds: false
  },
  comments: {
    enableComments: true,
    requireApproval: false
  },
  localization: {
    language: "en",
    timezone: "UTC"
  },
  maintenance: {
    maintenanceMode: false,
    maintenanceMessage: "We are currently undergoing scheduled maintenance. Please check back soon."
  },
  socialMedia: {
    facebook: "",
    twitter: "",
    instagram: "",
    youtube: ""
  },
  media: {
    maxUploadSizeMB: 5,
    allowedFormats: "jpg, png, webp, mp4"
  },
  security: {
    twoFactorAuth: false,
    maxLoginAttempts: 5
  }
};

export async function getSettings() {
  try {
    if (!fs.existsSync(settingsFilePath)) {
      fs.writeFileSync(settingsFilePath, JSON.stringify(defaultSettings, null, 2));
      return defaultSettings;
    }
    const data = fs.readFileSync(settingsFilePath, 'utf8');
    
    // Deep merge with default settings to ensure new keys exist
    const parsedData = JSON.parse(data);
    const mergedSettings = {
      ...defaultSettings,
      ...parsedData,
    };
    
    // specifically handle nested objects to prevent missing keys on old data
    for (const key of Object.keys(defaultSettings)) {
      if (typeof defaultSettings[key] === 'object') {
        mergedSettings[key] = {
          ...defaultSettings[key],
          ...(parsedData[key] || {})
        };
      }
    }

    return mergedSettings;
  } catch (error) {
    console.error("Error reading settings.json:", error);
    return defaultSettings;
  }
}

export async function updateSettings(newSettings) {
  try {
    // Deep merge to not lose anything during partial updates
    const currentSettings = await getSettings();
    const mergedSettings = { ...currentSettings };
    
    for (const key of Object.keys(newSettings)) {
      if (typeof newSettings[key] === 'object' && newSettings[key] !== null) {
         mergedSettings[key] = { ...mergedSettings[key], ...newSettings[key] };
      } else {
         mergedSettings[key] = newSettings[key];
      }
    }

    fs.writeFileSync(settingsFilePath, JSON.stringify(mergedSettings, null, 2));
    
    // Revalidate the entire site so layout.js picks up the new settings
    revalidatePath('/', 'layout');
    
    return { success: true };
  } catch (error) {
    console.error("Error saving settings.json:", error);
    return { success: false, error: "Failed to save settings." };
  }
}
