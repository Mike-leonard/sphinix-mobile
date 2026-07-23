import prisma from '@/lib/prisma';

function getPrisma() {
  if (prisma && prisma.deviceAttribute) {
    return prisma;
  }
  if (typeof globalThis !== 'undefined' && globalThis.prisma && !globalThis.prisma.deviceAttribute) {
    delete globalThis.prisma;
  }
  return require('@/lib/prisma').default;
}

export async function getDeviceAttributesQuery() {
  const client = getPrisma();
  if (!client || !client.deviceAttribute) return [];
  return await client.deviceAttribute.findMany({
    orderBy: { order: 'asc' }
  });
}

export async function createDeviceAttributeQuery(data) {
  const client = getPrisma();
  const count = await client.deviceAttribute.count();
  return await client.deviceAttribute.create({
    data: {
      id: data.id,
      name: data.name,
      slug: data.slug,
      terms: data.terms || [],
      groupIds: data.groupIds || ['General'],
      placeholder: data.placeholder || null,
      order: count
    }
  });
}

export async function updateDeviceAttributeQuery(id, data) {
  const client = getPrisma();
  return await client.deviceAttribute.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.slug && { slug: data.slug }),
      ...(data.terms && { terms: data.terms }),
      ...(data.groupIds && { groupIds: data.groupIds }),
      ...(data.placeholder !== undefined && { placeholder: data.placeholder }),
      ...(data.order !== undefined && { order: data.order })
    }
  });
}

export async function deleteDeviceAttributeQuery(id) {
  const client = getPrisma();
  return await client.deviceAttribute.delete({
    where: { id }
  });
}

export async function reassignAttributeGroupQuery(oldGroup, newGroup = 'General') {
  const client = getPrisma();
  const attributes = await client.deviceAttribute.findMany({
    where: { groupIds: { has: oldGroup } }
  });

  const results = [];
  for (const attr of attributes) {
    let updatedGroups = attr.groupIds.filter(g => g !== oldGroup);
    if (updatedGroups.length === 0 || !updatedGroups.includes(newGroup)) {
      if (!updatedGroups.includes(newGroup)) {
        updatedGroups.push(newGroup);
      }
    }
    const updated = await client.deviceAttribute.update({
      where: { id: attr.id },
      data: { groupIds: updatedGroups }
    });
    results.push(updated);
  }
  return results;
}
