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

export async function getDeviceFiltersQuery() {
  const client = getPrisma();
  if (!client || !client.deviceFilter) return [];
  return await client.deviceFilter.findMany({
    orderBy: { order: 'asc' }
  });
}

export async function getDeviceFilterByIdQuery(id) {
  const client = getPrisma();
  if (!client || !client.deviceFilter) return null;
  return await client.deviceFilter.findUnique({
    where: { id }
  });
}

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

export async function deleteDeviceFilterQuery(id) {
  const client = getPrisma();
  return await client.deviceFilter.delete({
    where: { id }
  });
}
