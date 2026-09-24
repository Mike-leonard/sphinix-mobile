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
 * QUERY: getAllDeviceBrandsDetailedQuery
 * -----------------------------------------------------------------------------
 * @description Fetches all smartphone brand records including SEO h1, intro, and metadata.
 * @table `deviceBrand`
 * @where Called by: `actions/device-brands.js` -> `getDeviceBrandsDetailed()`
 * @returns {Promise<Array<object>>} List of brand objects.
 */
export async function getAllDeviceBrandsDetailedQuery() {
  const brands = await prisma.deviceBrand.findMany({
    orderBy: { name: 'asc' }
  });
  return brands.map(b => ({
    id: b.id,
    name: b.name,
    slug: b.slug,
    h1: b.h1 || '',
    intro: b.intro || '',
    createdAt: b.createdAt,
    updatedAt: b.updatedAt
  }));
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: getDeviceBrandBySlugQuery
 * -----------------------------------------------------------------------------
 * @description Fetches single device brand record by slug or name (case-insensitive).
 * @table `deviceBrand`
 * @where Called by: `actions/device-brands.js` -> `getDeviceBrandBySlug()`
 * @param {string} slug - Brand slug or name.
 * @returns {Promise<object|null>} Device brand record or null.
 */
export async function getDeviceBrandBySlugQuery(slug) {
  if (!slug) return null;
  const clean = String(slug).trim().toLowerCase();
  return await prisma.deviceBrand.findFirst({
    where: {
      OR: [
        { slug: { equals: clean, mode: 'insensitive' } },
        { name: { equals: clean, mode: 'insensitive' } }
      ]
    }
  });
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: createDeviceBrandQuery
 * -----------------------------------------------------------------------------
 * @description Inserts a new smartphone manufacturer brand into PostgreSQL with auto-slug and SEO fields.
 * @table `deviceBrand`
 * @where Called by: `actions/device-brands.js` -> `createDeviceBrand()`
 * @param {string} name - Brand name string.
 * @param {object} [seoData] - Optional SEO fields ({ h1, intro }).
 * @returns {Promise<object>} Created brand record.
 */
export async function createDeviceBrandQuery(name, seoData = {}) {
  const trimmed = name.trim();
  const slug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return await prisma.deviceBrand.create({
    data: {
      name: trimmed,
      slug,
      h1: seoData.h1?.trim() || null,
      intro: seoData.intro?.trim() || null
    }
  });
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: updateDeviceBrandQuery
 * -----------------------------------------------------------------------------
 * @description Renames an existing brand, updates its slug and SEO fields in PostgreSQL.
 * @table `deviceBrand`
 * @where Called by: `actions/device-brands.js` -> `updateDeviceBrand()`
 * @param {string} oldBrand - Original brand name.
 * @param {string} newBrand - Replacement brand name.
 * @param {object} [seoData] - Optional SEO fields ({ h1, intro }).
 * @returns {Promise<object>} Updated brand record.
 */
export async function updateDeviceBrandQuery(oldBrand, newBrand, seoData = {}) {
  const trimmed = newBrand ? newBrand.trim() : oldBrand;
  const slug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const data = {
    name: trimmed,
    slug
  };
  if (seoData.h1 !== undefined) {
    data.h1 = seoData.h1?.trim() || null;
  }
  if (seoData.intro !== undefined) {
    data.intro = seoData.intro?.trim() || null;
  }

  return await prisma.deviceBrand.update({
    where: { name: oldBrand },
    data
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
