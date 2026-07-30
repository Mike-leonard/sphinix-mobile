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

/**
 * -----------------------------------------------------------------------------
 * QUERY: getDeviceGroupsQuery
 * -----------------------------------------------------------------------------
 * @description Fetches all smartphone spec group headings ordered by display index.
 * @table `deviceGroup`
 * @where Called by: `actions/device-groups.js` -> `getDeviceGroups()`
 * @returns {Promise<Array<string>>} Array of group name strings.
 */
export async function getDeviceGroupsQuery() {
  const client = getPrisma();
  if (!client || !client.deviceGroup) return [];
  const groups = await client.deviceGroup.findMany({
    orderBy: { order: 'asc' }
  });
  return groups.map(g => g.name);
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: createDeviceGroupQuery
 * -----------------------------------------------------------------------------
 * @description Inserts a new spec group category into PostgreSQL.
 * @table `deviceGroup`
 * @where Called by: `actions/device-groups.js` -> `createDeviceGroup()`
 * @param {string} name - Group name string.
 * @returns {Promise<object>} Created group record.
 */
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

/**
 * -----------------------------------------------------------------------------
 * QUERY: updateDeviceGroupQuery
 * -----------------------------------------------------------------------------
 * @description Renames an existing spec group record in PostgreSQL.
 * @table `deviceGroup`
 * @where Called by: `actions/device-groups.js` -> `updateDeviceGroup()`
 * @param {string} oldGroup - Original group name.
 * @param {string} newGroup - Replacement group name.
 * @returns {Promise<object>} Updated group record.
 */
export async function updateDeviceGroupQuery(oldGroup, newGroup) {
  const client = getPrisma();
  return await client.deviceGroup.update({
    where: { name: oldGroup },
    data: { name: newGroup }
  });
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: deleteDeviceGroupQuery
 * -----------------------------------------------------------------------------
 * @description Deletes a spec group category from PostgreSQL by name.
 * @table `deviceGroup`
 * @where Called by: `actions/device-groups.js` -> `deleteDeviceGroup()`
 * @param {string} name - Group name string to delete.
 * @returns {Promise<object>} Deleted group record.
 */
export async function deleteDeviceGroupQuery(name) {
  const client = getPrisma();
  return await client.deviceGroup.delete({
    where: { name }
  });
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: reorderDeviceGroupsQuery
 * -----------------------------------------------------------------------------
 * @description Updates order indexes for spec group headings in PostgreSQL.
 * @table `deviceGroup`
 * @where Called by: `actions/device-groups.js` -> `reorderDeviceGroups()`
 * @param {Array<string>} newGroupsOrder - Array of group names in target order.
 * @returns {Promise<Array>} Array of updated group records.
 */
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
