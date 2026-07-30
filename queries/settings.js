import prisma from '@/lib/prisma';

function getPrisma() {
  if (prisma && prisma.siteSettings) {
    return prisma;
  }
  if (typeof globalThis !== 'undefined' && globalThis.prisma && !globalThis.prisma.siteSettings) {
    delete globalThis.prisma;
  }
  return require('@/lib/prisma').default;
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: getSettingsRow
 * -----------------------------------------------------------------------------
 * @description Fetches or initializes the singleton `SiteSettings` row (ID 1) from PostgreSQL.
 * @table `siteSettings`
 * @where Called by: `actions/settings.js` -> `getCachedSettings()`
 * @returns {Promise<object>} Singleton site settings database record.
 */
export async function getSettingsRow() {
  const client = getPrisma();
  return await client.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 }
  });
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: updateSettingsRow
 * -----------------------------------------------------------------------------
 * @description Updates the singleton `SiteSettings` row (ID 1) in PostgreSQL, incrementing version counter.
 * @table `siteSettings`
 * @where Called by: `actions/settings.js` -> `updateSettings()`
 * @param {object} updatePayload - Updated settings categories payload.
 * @returns {Promise<object>} Updated site settings database record.
 */
export async function updateSettingsRow(updatePayload) {
  const client = getPrisma();
  return await client.siteSettings.upsert({
    where: { id: 1 },
    update: {
      ...updatePayload,
      version: { increment: 1 }
    },
    create: {
      id: 1,
      ...updatePayload,
      version: 1
    }
  });
}
