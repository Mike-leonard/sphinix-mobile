import prisma from '@/lib/prisma';

function getPrisma() {
  if (prisma && prisma.deviceFilter) {
    return prisma;
  }
  // Clear hot-reloaded global cache if schema changed while dev server was active
  if (typeof globalThis !== 'undefined' && globalThis.prisma && !globalThis.prisma.deviceFilter) {
    delete globalThis.prisma;
  }
  const freshPrisma = require('@/lib/prisma').default;
  return freshPrisma;
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: getDeviceFiltersQuery
 * -----------------------------------------------------------------------------
 * @description Fetches all catalog search filter definitions from PostgreSQL ordered by display index.
 * @table `deviceFilter`
 * @where Called by: `actions/device-filters.js` -> `getDeviceFilters()`
 * @returns {Promise<Array>} Array of filter group records.
 */
export async function getDeviceFiltersQuery() {
  const client = getPrisma();
  if (!client || !client.deviceFilter) return [];
  return await client.deviceFilter.findMany({
    orderBy: { order: 'asc' }
  });
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: getDeviceFilterByIdQuery
 * -----------------------------------------------------------------------------
 * @description Fetches a single device filter rule by ID.
 * @table `deviceFilter`
 * @param {string} id - Filter ID.
 * @returns {Promise<object|null>}
 */
export async function getDeviceFilterByIdQuery(id) {
  const client = getPrisma();
  if (!client || !client.deviceFilter) return null;
  return await client.deviceFilter.findUnique({
    where: { id }
  });
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: upsertDeviceFilterQuery
 * -----------------------------------------------------------------------------
 * @description Creates or updates a single search filter rule in PostgreSQL.
 * @table `deviceFilter`
 * @param {string} id - Filter ID.
 * @param {object} data - { title, attributeSlug, options, order }
 * @returns {Promise<object>}
 */
export async function upsertDeviceFilterQuery(id, data) {
  const client = getPrisma();
  return await client.deviceFilter.upsert({
    where: { id },
    update: {
      title: data.title,
      attributeSlug: data.attributeSlug,
      options: data.options || [],
      order: data.order ?? 0
    },
    create: {
      id,
      title: data.title,
      attributeSlug: data.attributeSlug,
      options: data.options || [],
      order: data.order ?? 0
    }
  });
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: saveDeviceFiltersBatchQuery
 * -----------------------------------------------------------------------------
 * @description Batch upserts multiple catalog filter rules and updates their ordering indexes in PostgreSQL.
 * @table `deviceFilter`
 * @where Called by: `actions/device-filters.js` -> `saveDeviceFilters()`
 * @param {Array<object>} filters - Batch list of filter definitions.
 * @returns {Promise<Array>} Array of upserted filter records.
 */
export async function saveDeviceFiltersBatchQuery(filters) {
  if (!Array.isArray(filters)) return [];

  const client = getPrisma();
  const results = [];
  for (let i = 0; i < filters.length; i++) {
    const f = filters[i];
    const filterId = f.id || `filter_${f.attributeSlug || i}`;
    const result = await client.deviceFilter.upsert({
      where: { id: filterId },
      update: {
        title: f.title,
        attributeSlug: f.attributeSlug,
        options: f.options || [],
        order: i
      },
      create: {
        id: filterId,
        title: f.title,
        attributeSlug: f.attributeSlug,
        options: f.options || [],
        order: i
      }
    });
    results.push(result);
  }
  return results;
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: deleteDeviceFilterQuery
 * -----------------------------------------------------------------------------
 * @description Deletes a search filter definition from PostgreSQL by ID.
 * @table `deviceFilter`
 * @param {string} id - Filter ID.
 * @returns {Promise<object>}
 */
export async function deleteDeviceFilterQuery(id) {
  const client = getPrisma();
  return await client.deviceFilter.delete({
    where: { id }
  });
}
