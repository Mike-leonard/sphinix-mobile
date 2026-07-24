'use server';

import { revalidateTag, revalidatePath, unstable_cache } from 'next/cache';
import { verifySession } from './auth';
import { getSettingsRow, updateSettingsRow } from '@/queries/settings';
import { defaultSettings } from '@/config/default-settings';
import { deepMerge, getEnvKeyAvailability, ENV_VAR_NAMES } from '@/lib/settings-helpers';

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

  const envKeysAvailable = getEnvKeyAvailability();
  const activeProvider = settings.ai?.provider || 'gemini';
  const isEnvConfigured = envKeysAvailable[activeProvider] || false;
  const envVarName = ENV_VAR_NAMES[activeProvider] || null;

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
