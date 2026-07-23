import prisma from '@/lib/prisma';

function getPrisma() {
  if (prisma && prisma.deviceGroup) {
    return prisma;
  }
  if (typeof globalThis !== 'undefined' && globalThis.prisma && !globalThis.prisma.deviceGroup) {
    delete globalThis.prisma;
  }
  return require('@/lib/prisma').default;
}

export async function getDeviceGroupsQuery() {
  const client = getPrisma();
  if (!client || !client.deviceGroup) return [];
  const groups = await client.deviceGroup.findMany({
    orderBy: { order: 'asc' }
  });
  return groups.map(g => g.name);
}

export async function createDeviceGroupQuery(name) {
  const client = getPrisma();
  const count = await client.deviceGroup.count();
  return await client.deviceGroup.create({
    data: {
      name,
      order: count
    }
  });
}

export async function updateDeviceGroupQuery(oldGroup, newGroup) {
  const client = getPrisma();
  return await client.deviceGroup.update({
    where: { name: oldGroup },
    data: { name: newGroup }
  });
}

export async function deleteDeviceGroupQuery(name) {
  const client = getPrisma();
  return await client.deviceGroup.delete({
    where: { name }
  });
}

export async function reorderDeviceGroupsQuery(newGroupsOrder) {
  const client = getPrisma();
  const results = [];
  for (let i = 0; i < newGroupsOrder.length; i++) {
    const groupName = newGroupsOrder[i];
    const updated = await client.deviceGroup.update({
      where: { name: groupName },
      data: { order: i }
    });
    results.push(updated);
  }
  return results;
}
