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
  const attributes = await client.deviceAttribute.findMany({
    include: { deviceGroup: true },
    orderBy: { order: 'asc' }
  });

  return attributes.map(attr => ({
    ...attr,
    groupIds: attr.group ? [attr.group] : (attr.deviceGroup ? [attr.deviceGroup.name] : [])
  }));
}

export async function createDeviceAttributeQuery(data) {
  const client = getPrisma();
  const count = await client.deviceAttribute.count();
  const groupName = (data.groupIds && data.groupIds[0]) || data.group || 'General';

  let groupId = data.groupId;
  if (!groupId && groupName) {
    const found = await client.deviceGroup.findUnique({ where: { name: groupName } });
    if (found) groupId = found.id;
  }

  const created = await client.deviceAttribute.create({
    data: {
      id: data.id,
      name: data.name,
      slug: data.slug,
      terms: data.terms || [],
      group: groupName,
      groupId: groupId || null,
      placeholder: data.placeholder || null,
      order: count
    },
    include: { deviceGroup: true }
  });

  return {
    ...created,
    groupIds: created.group ? [created.group] : []
  };
}

export async function updateDeviceAttributeQuery(id, data) {
  const client = getPrisma();
  const groupName = (data.groupIds && data.groupIds[0]) || data.group;
  let groupId = data.groupId;

  if (!groupId && groupName) {
    const found = await client.deviceGroup.findUnique({ where: { name: groupName } });
    if (found) groupId = found.id;
  }

  const updatePayload = {
    ...(data.name && { name: data.name }),
    ...(data.slug && { slug: data.slug }),
    ...(data.terms && { terms: data.terms }),
    ...(groupName && { group: groupName }),
    ...(groupId !== undefined && { groupId }),
    ...(data.placeholder !== undefined && { placeholder: data.placeholder }),
    ...(data.order !== undefined && { order: data.order })
  };

  const updated = await client.deviceAttribute.update({
    where: { id },
    data: updatePayload,
    include: { deviceGroup: true }
  });

  return {
    ...updated,
    groupIds: updated.group ? [updated.group] : []
  };
}

export async function deleteDeviceAttributeQuery(id) {
  const client = getPrisma();
  return await client.deviceAttribute.delete({
    where: { id }
  });
}

export async function reassignAttributeGroupQuery(oldGroup, newGroup = 'General') {
  const client = getPrisma();
  let targetGroup = await client.deviceGroup.findUnique({ where: { name: newGroup } });

  const attributes = await client.deviceAttribute.findMany({
    where: { group: oldGroup }
  });

  const results = [];
  for (const attr of attributes) {
    const updated = await client.deviceAttribute.update({
      where: { id: attr.id },
      data: {
        group: newGroup,
        groupId: targetGroup ? targetGroup.id : null
      },
      include: { deviceGroup: true }
    });
    results.push({
      ...updated,
      groupIds: [newGroup]
    });
  }
  return results;
}
