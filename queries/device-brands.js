import prisma from '@/lib/prisma';

const DEFAULT_BRANDS = [
  "Apple", "Asus", "Google", "Honor", "Huawei", "LG", "Motorola",
  "Nothing", "OnePlus", "Oppo", "Other", "Realme", "Samsung",
  "Sony", "Vivo", "Xiaomi", "ZTE"
];

/**
 * -----------------------------------------------------------------------------
 * QUERY: getAllDeviceBrandsQuery
 * -----------------------------------------------------------------------------
 * @description Fetches all smartphone brand names ordered by name ascending, auto-seeding defaults if table is empty.
 * @table `deviceBrand`
 * @where Called by: `actions/device-brands.js` -> `getDeviceBrands()`
 * @returns {Promise<Array<string>>} List of brand name strings.
 */
export async function getAllDeviceBrandsQuery() {
  let brands = await prisma.deviceBrand.findMany({
    orderBy: { name: 'asc' }
  });

  // Auto-seed default brands if table is empty
  if (brands.length === 0) {
    const dataToInsert = DEFAULT_BRANDS.map(name => ({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    }));
    await prisma.deviceBrand.createMany({
      data: dataToInsert,
      skipDuplicates: true
    });
    brands = await prisma.deviceBrand.findMany({
      orderBy: { name: 'asc' }
    });
  }

  return brands.map(b => b.name);
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: createDeviceBrandQuery
 * -----------------------------------------------------------------------------
 * @description Inserts a new smartphone manufacturer brand into PostgreSQL with auto-slug.
 * @table `deviceBrand`
 * @where Called by: `actions/device-brands.js` -> `createDeviceBrand()`
 * @param {string} name - Brand name string.
 * @returns {Promise<object>} Created brand record.
 */
export async function createDeviceBrandQuery(name) {
  const trimmed = name.trim();
  const slug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return await prisma.deviceBrand.create({
    data: {
      name: trimmed,
      slug
    }
  });
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: updateDeviceBrandQuery
 * -----------------------------------------------------------------------------
 * @description Renames an existing brand and updates its slug in PostgreSQL.
 * @table `deviceBrand`
 * @where Called by: `actions/device-brands.js` -> `updateDeviceBrand()`
 * @param {string} oldBrand - Original brand name.
 * @param {string} newBrand - Replacement brand name.
 * @returns {Promise<object>} Updated brand record.
 */
export async function updateDeviceBrandQuery(oldBrand, newBrand) {
  const trimmed = newBrand.trim();
  const slug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return await prisma.deviceBrand.update({
    where: { name: oldBrand },
    data: {
      name: trimmed,
      slug
    }
  });
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: deleteDeviceBrandQuery
 * -----------------------------------------------------------------------------
 * @description Deletes a brand record by name from PostgreSQL.
 * @table `deviceBrand`
 * @where Called by: `actions/device-brands.js` -> `deleteDeviceBrand()`
 * @param {string} name - Brand name string to delete.
 * @returns {Promise<object>} Deleted brand record.
 */
export async function deleteDeviceBrandQuery(name) {
  return await prisma.deviceBrand.delete({
    where: { name }
  });
}
