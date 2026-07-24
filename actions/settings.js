'use server';

import { revalidateTag, revalidatePath, unstable_cache } from 'next/cache';
import { verifySession } from './auth';
import { getSettingsRow, updateSettingsRow } from '@/queries/settings';

const defaultSettings = {
  seo: {
    advanced: {
      generateSitemap: true,
      robotsTxt: "User-agent: *\nAllow: /\nSitemap: https://sphinix-mobile.com/sitemap.xml",
      globalStructuredData: "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"WebSite\",\n  \"name\": \"Sphinix Mobile\",\n  \"url\": \"https://sphinix-mobile.com\"\n}"
    },
    home: {
      title: "Sphinix Mobile | In-Depth Smartphone Reviews & Tech Blog",
      description: "Read expert, unbiased smartphone reviews, detailed mobile specifications, comparison guides, and the latest mobile technology blog posts on Sphinix Mobile.",
      keywords: "smartphone reviews, mobile specifications, phone comparisons, tech blog, latest phones, Sphinix Mobile",
      structuredData: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      favicon: ""
    },
    phones: { title: "", description: "", keywords: "", structuredData: "", ogTitle: "", ogDescription: "", ogImage: "" },
    blogs: { title: "", description: "", keywords: "", structuredData: "", ogTitle: "", ogDescription: "", ogImage: "" },
    comparisons: { title: "", description: "", keywords: "", structuredData: "", ogTitle: "", ogDescription: "", ogImage: "" }
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
    theme: "system",
    primaryColor: "#8b5cf6",
    home: {
      deviceLimit: 8,
      blogLimit: 3,
      deviceCardSpecLimit: 3
    },
    phones: {
      deviceLimit: 12,
      deviceCardSpecLimit: 3
    },
    blogs: {
      blogLimit: 9
    }
  },
  analytics: {
    googleAnalyticsId: "",
    googleSearchConsoleId: "",
    enableVisitorStats: true
  },
  advertisements: {
    enableAds: false,
    network: "google_adsense",
    googleAdsense: {
      publisherId: ""
    },
    journeyMv: {
      siteId: ""
    },
    monumetric: {
      propertyId: ""
    },
    custom: {
      htmlCode: ""
    },
    placements: {
      homePageBanner: true,
      homePageInFeed: true,
      phonesPageSidebar: true,
      blogsPageSidebar: true,
      blogDetailsInFeed: true,
      deviceDetailsBanner: true,
      comparisonsBanner: true
    },
    injectionFrequency: {
      homePagePhones: 6,
      homePageBlogs: 4,
      phonesPageGrid: 6,
      blogsPageGrid: 4,
      comparisons: 3
    }
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
    allowedFormats: "jpg, png, webp, mp4",
    imageQuality: 80,
    imageCompression: true,
    webpConversion: true,
    thumbnailSize: "300x300",
    cdnEnabled: false,
    cdnUrl: "",
    cdnDomains: ["res.cloudinary.com", "images.unsplash.com"]
  },
  security: {
    twoFactorAuth: false,
    maxLoginAttempts: 5,
    ipWhitelist: [],
    ipBlacklist: [],
    rateLimit: {
      enabled: false,
      maxRequests: 100,
      timeWindowMinutes: 15
    }
  },
  ai: {
    enableAiFeatures: true,
    provider: "gemini",
    model: "gemini-3.5-flash",
    apiKey: "",
    temperature: 0.7,
    systemPrompt: "You are an expert tech blog writer for Sphinix Mobile, a premium smartphone and technology review site. Write with an analytical, engaging, and authoritative tone. Focus on detailed specifications, real-world performance, and objective comparisons. Structure your articles with an engaging introduction, detailed H2 sub-sections (e.g., Design & Build, Performance, Camera), and a strong conclusive summary."
  },
  recaptcha: {
    enabled: false,
    siteKey: "",
    secretKey: ""
  },
  backups: {
    automaticBackups: false,
    schedule: "daily",
    lastBackup: null
  }
};

function deepMerge(target, source) {
  if (!source) return target;
  const output = { ...target };
  for (const key of Object.keys(target)) {
    if (source[key] !== undefined) {
      if (Array.isArray(target[key])) {
        output[key] = Array.isArray(source[key]) ? source[key] : target[key];
      } else if (typeof target[key] === 'object' && target[key] !== null) {
        output[key] = deepMerge(target[key], source[key]);
      } else {
        output[key] = source[key];
      }
    }
  }
  return output;
}

// Step 3: Aggressive Caching with Next.js Data Cache
const getCachedSettings = unstable_cache(
  async () => {
    try {
      // Step 4: Use Singleton helper
      const row = await getSettingsRow();
      if (!row) return defaultSettings;

      // Step 2: Keep defaults in code -> DB -> deepMerge -> final settings
      const mergedSettings = {};
      for (const category of Object.keys(defaultSettings)) {
        mergedSettings[category] = deepMerge(
          defaultSettings[category],
          row[category] || {}
        );
      }

      return {
        ...mergedSettings,
        // Step 7: Versioning
        version: row.version || 1,
        updatedAt: row.updatedAt
      };
    } catch (error) {
      console.error("Error reading site settings from database:", error);
      return defaultSettings;
    }
  },
  ['site-settings'],
  { tags: ['site-settings'] }
);

export async function getSettings() {
  const settings = await getCachedSettings();

  const envKeysAvailable = {
    gemini: !!process.env.GEMINI_API_KEY,
    openai: !!process.env.CHAT_GPT_API_KEY,
    anthropic: !!process.env.CLAUDE_API_KEY,
    openrouter: !!process.env.OPEN_ROUTER_API_KEY,
    kilo: !!process.env.KILO_CODE_API_KEY,
    ollama: !!process.env.OLLAMA_API_KEY,
  };

  const envNames = {
    gemini: 'GEMINI_API_KEY',
    openai: 'CHAT_GPT_API_KEY',
    anthropic: 'CLAUDE_API_KEY',
    openrouter: 'OPEN_ROUTER_API_KEY',
    kilo: 'KILO_CODE_API_KEY',
    ollama: 'OLLAMA_API_KEY'
  };

  const activeProvider = settings.ai?.provider || 'gemini';
  const isEnvConfigured = envKeysAvailable[activeProvider] || false;
  const envVarName = envNames[activeProvider] || null;

  return {
    ...settings,
    ai: {
      ...settings.ai,
      envKeysAvailable,
      isEnvConfigured,
      envVarName
    }
  };
}

/**
 * Resolves settings with secrets injected from .env and .env.local
 */
export async function getResolvedSettings() {
  const settings = await getSettings();

  // Resolve Provider API Key
  let resolvedApiKey = settings.ai?.apiKey || "";
  const provider = settings.ai?.provider || "gemini";
  if (provider === 'gemini') resolvedApiKey = process.env.GEMINI_API_KEY || resolvedApiKey;
  else if (provider === 'openai') resolvedApiKey = process.env.CHAT_GPT_API_KEY || resolvedApiKey;
  else if (provider === 'anthropic') resolvedApiKey = process.env.CLAUDE_API_KEY || resolvedApiKey;
  else if (provider === 'openrouter') resolvedApiKey = process.env.OPEN_ROUTER_API_KEY || resolvedApiKey;
  else if (provider === 'kilo') resolvedApiKey = process.env.KILO_CODE_API_KEY || resolvedApiKey;
  else if (provider === 'ollama') resolvedApiKey = process.env.OLLAMA_API_KEY || resolvedApiKey;

  return {
    ...settings,
    ai: {
      ...settings.ai,
      apiKey: resolvedApiKey
    },
    recaptcha: {
      ...settings.recaptcha,
      siteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || settings.recaptcha?.siteKey || "",
      secretKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_SECRECT || settings.recaptcha?.secretKey || ""
    }
  };
}

export async function updateSettings(newSettings) {
  try {
    // Step 5: Validation before saving - Auth verification
    const session = await verifySession();
    if (!session || session.role !== 'Admin') {
      return { success: false, error: 'Unauthorized. Admin access required.' };
    }

    if (!newSettings || typeof newSettings !== 'object') {
      return { success: false, error: 'Invalid settings payload.' };
    }

    const currentSettings = await getSettings();
    const updatePayload = {};

    for (const key of Object.keys(newSettings)) {
      if (key in defaultSettings) {
        if (typeof newSettings[key] === 'object' && newSettings[key] !== null && !Array.isArray(newSettings[key])) {
          updatePayload[key] = deepMerge(currentSettings[key] || defaultSettings[key], newSettings[key]);
        } else {
          updatePayload[key] = newSettings[key];
        }
      }
    }

    await updateSettingsRow(updatePayload);

    // Step 3: Cache Invalidation
    try {
      revalidateTag('site-settings');
      revalidatePath('/', 'layout');
    } catch (e) {
      // Ignore cache revalidation errors during non-request contexts
    }

    return { success: true };
  } catch (error) {
    console.error("Error saving site settings to database:", error);
    return { success: false, error: "Failed to save settings." };
  }
}

// Step 6: Think in modular server actions
export async function updateSeoSettings(seoData) {
  return await updateSettings({ seo: seoData });
}

export async function updateAppearanceSettings(appearanceData) {
  return await updateSettings({ appearance: appearanceData });
}

export async function updateAnalyticsSettings(analyticsData) {
  return await updateSettings({ analytics: analyticsData });
}

export async function updateAdvertisementSettings(advertisementData) {
  return await updateSettings({ advertisements: advertisementData });
}

export async function updateAiSettings(aiData) {
  return await updateSettings({ ai: aiData });
}

export async function updateSecuritySettings(securityData) {
  return await updateSettings({ security: securityData });
}

export async function updateMediaSettings(mediaData) {
  return await updateSettings({ media: mediaData });
}
