'use server';

import { revalidateTag, revalidatePath, unstable_cache } from 'next/cache';
import { verifySession } from './auth';
import { getSettingsRow, updateSettingsRow } from '@/queries/settings';
import { defaultSettings } from '@/config/default-settings';
import { deepMerge, getEnvKeyAvailability, ENV_VAR_NAMES } from '@/lib/settings-helpers';

/**
 * Next.js Data Cache wrapper for site settings
 */
const getCachedSettings = unstable_cache(
  async () => {
    try {
      const row = await getSettingsRow();
      if (!row) return defaultSettings;

      const mergedSettings = {};
      for (const category of Object.keys(defaultSettings)) {
        mergedSettings[category] = deepMerge(
          defaultSettings[category],
          row[category] || {}
        );
      }

      return {
        ...mergedSettings,
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

/**
 * -----------------------------------------------------------------------------
 * SETTINGS ACTION: getSettings
 * -----------------------------------------------------------------------------
 * @description Public action: fetches deep-merged site settings (SEO, Theme, Typography, Layout, AI, Ads).
 * @why Provides global site configuration to root layouts, contexts, and components.
 * @where Called by: `context/SettingsContext.jsx`, `app/layout.js`, `actions/devices.js`, `actions/ai/blog-actions.js`
 * @security Public read access (sanitizes secret keys).
 * @returns {Promise<object>} Complete site settings object.
 */
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
 * -----------------------------------------------------------------------------
 * SETTINGS ACTION: getResolvedSettings
 * -----------------------------------------------------------------------------
 * @description Admin action: resolves settings with unmasked secrets injected from `.env` (API Keys, SMTP passwords).
 * @why Pre-populates administrative configuration forms in the dashboard where secret keys are edited.
 * @where Called by: `app/dashboard/settings/ai/page.js`, `app/dashboard/settings/security/page.js`
 * @security Restricted strictly to Admin role (`verifySession()`).
 * @returns {Promise<object>} Settings object containing resolved secret strings.
 */
export async function getResolvedSettings() {
  const session = await verifySession();
  if (!session || session.role !== 'Admin') {
    throw new Error('Unauthorized. Admin access required.');
  }

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
    },
    smtp: {
      host: process.env.SMTP_HOST || settings.smtp?.host || "smtp.gmail.com",
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : (settings.smtp?.port || 587),
      user: process.env.SMTP_USER || settings.smtp?.user || "",
      pass: process.env.SMTP_PASS || settings.smtp?.pass || "",
      from: process.env.SMTP_FROM || settings.smtp?.from || "",
      receiverEmail: process.env.CONTACT_RECEIVER_EMAIL || settings.smtp?.receiverEmail || ""
    }
  };
}

/**
 * -----------------------------------------------------------------------------
 * SETTINGS ACTION: updateSettings
 * -----------------------------------------------------------------------------
 * @description Admin action: updates site settings in PostgreSQL and invalidates Next.js data cache (`revalidateTag('site-settings')`).
 * @why Saves updated settings categories and applies design/configuration changes immediately.
 * @where Called by: Category-specific update helpers below.
 * @security Restricted strictly to Admin role (`verifySession()`).
 * @param {object} newSettings - Object containing section payload to update.
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function updateSettings(newSettings) {
  try {
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

/** Modular Section Helper Actions */
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

export async function updateSmtpSettings(smtpData) {
  return await updateSettings({ smtp: smtpData });
}
