import prisma from '@/lib/prisma';
import { normalizeDeviceFilterValues } from '@/lib/devices/normalizeDeviceFilterValues';
import { buildPublishedDeviceWhere } from '@/lib/devices/buildPublishedDeviceWhere';

/**
 * Formats DB device record, normalizing specs, pricing, and status.
 */
export function formatDevice(device) {
  if (!device) return null;
  const specsObj = (device.specs && typeof device.specs === 'object') ? device.specs : {};
  const brandVal = device.brandName || device.brand || (device.deviceBrand?.name ?? '');
  let rawStatus = (device.status || 'DRAFT').toLowerCase();
  if (rawStatus === 'trashed') rawStatus = 'trash';
  return {
    ...device,
    brand: brandVal,
    brandName: brandVal,
    price: device.price !== undefined && device.price !== null ? String(device.price) : '',
    status: rawStatus,
    description: device.description ?? specsObj.description ?? '',
    expertRatings: device.expertRatings ?? specsObj.expertRatings ?? {},
    images: device.images ?? specsObj.images ?? ['', '', '', ''],
    affiliates: device.affiliates ?? specsObj.affiliates ?? {
      amazon: { url: '', price: '' },
      bestbuy: { url: '', price: '' },
      walmart: { url: '', price: '' },
      ebay: { url: '', price: '' }
    },
    allowReviews: device.allowReviews ?? specsObj.allowReviews ?? true,
    seo: device.seo ?? specsObj.seo ?? { metaTitle: '', metaDescription: '', keywords: '' },
    specs: specsObj
  };
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: getAllDevicesQuery
 * -----------------------------------------------------------------------------
 * @description Admin query: fetches devices with backend sorting and filtering capabilities in PostgreSQL.
 * @table `device`
 * @where Called by: `actions/devices.js` -> `getDevices()`, `createDevice()`
 * @param {object} [options] - Optional sorting and filtering parameters ({ sortField, sortOrder, search, brand, viewMode }).
 * @returns {Promise<Array>} List of formatted device records.
 */
export async function getAllDevicesQuery(options = {}) {
  const {
    sortField = 'createdAt',
    sortOrder = 'desc',
    search = '',
    brand = 'All',
    viewMode = 'all'
  } = typeof options === 'object' && options !== null ? options : {};

  const where = {};

  if (viewMode === 'active') {
    where.status = { not: 'TRASHED' };
  } else if (viewMode === 'trash') {
    where.status = 'TRASHED';
  }

  if (brand && brand !== 'All') {
    where.brandName = { equals: brand, mode: 'insensitive' };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { brandName: { contains: search, mode: 'insensitive' } }
    ];
  }

  let orderBy = { createdAt: 'desc' };
  const validOrder = sortOrder === 'desc' ? 'desc' : 'asc';

  if (sortField === 'name') {
    orderBy = { name: validOrder };
  } else if (sortField === 'brand') {
    orderBy = { brandName: validOrder };
  } else if (sortField === 'price') {
    orderBy = { price: validOrder };
  } else if (sortField === 'status') {
    orderBy = { status: validOrder };
  } else if (sortField === 'createdAt') {
    orderBy = { createdAt: validOrder };
  }

  const devices = await prisma.device.findMany({
    where,
    orderBy,
    include: { deviceBrand: true }
  });
  return devices.map(formatDevice);
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: getDeviceByIdQuery
 * -----------------------------------------------------------------------------
 * @description Admin query: fetches single device by ID/slug.
 * @table `device`
 * @where Called by: `actions/devices.js` -> `getDeviceById()`, `updateDevice()`
 * @param {string} id - Device ID / slug.
 * @returns {Promise<object|null>}
 */
export async function getDeviceByIdQuery(id) {
  const device = await prisma.device.findUnique({
    where: { id },
    include: { deviceBrand: true }
  });
  return formatDevice(device);
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: getPublishedDeviceByIdQuery
 * -----------------------------------------------------------------------------
 * @description Public query: fetches single published device by ID/slug.
 * @table `device`
 * @where Called by: `actions/devices.js` -> `getPublishedDeviceById()`
 * @param {string} id - Device ID / slug.
 * @returns {Promise<object|null>}
 */
export async function getPublishedDeviceByIdQuery(id) {
  const device = await prisma.device.findFirst({
    where: {
      id,
      status: 'PUBLISHED'
    },
    include: { deviceBrand: true }
  });
  return formatDevice(device);
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: getDevicesByIdsQuery
 * -----------------------------------------------------------------------------
 * @description Admin query: fetches multiple devices by array of IDs.
 * @table `device`
 * @where Called by: `actions/devices.js` -> `getDevicesByIds()`
 * @param {Array<string>} ids - Array of IDs.
 * @returns {Promise<Array>}
 */
export async function getDevicesByIdsQuery(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return [];
  const devices = await prisma.device.findMany({
    where: {
      id: { in: ids }
    },
    include: { deviceBrand: true }
  });
  return devices.map(formatDevice);
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: getPublishedDevicesByIdsQuery
 * -----------------------------------------------------------------------------
 * @description Public query: fetches published devices matching array of IDs (e.g. for comparison tables).
 * @table `device`
 * @where Called by: `actions/devices.js` -> `getPublishedDevicesByIds()`
 * @param {Array<string>} ids - Array of IDs.
 * @returns {Promise<Array>}
 */
export async function getPublishedDevicesByIdsQuery(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return [];
  const devices = await prisma.device.findMany({
    where: {
      id: { in: ids },
      status: 'PUBLISHED'
    },
    include: { deviceBrand: true }
  });
  return devices.map(formatDevice);
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: getPublishedDevicesQuery
 * -----------------------------------------------------------------------------
 * @description Public query: fetches paginated published devices with brand, query, and spec filter evaluation.
 * @table `device`
 * @where Called by: `actions/devices.js` -> `publishedDevices()`
 * @param {number|object} optionsOrLimit - Limit or options object.
 * @param {string} queryParam - Search query string.
 * @param {string} brandParam - Brand name filter.
 * @param {number} offsetParam - Pagination offset.
 * @returns {Promise<Array>} Array of published devices.
 */
export async function getPublishedDevicesQuery(
  optionsOrLimit = 10,
  queryParam = '',
  brandParam = 'All',
  offsetParam = 0
) {
  let limit = 10;
  let query = '';
  let brand = 'All';
  let offset = 0;
  let filters = null;

  if (typeof optionsOrLimit === 'object' && optionsOrLimit !== null) {
    limit = optionsOrLimit.limit ?? 10;
    query = optionsOrLimit.query || '';
    brand = optionsOrLimit.brand || 'All';
    offset = optionsOrLimit.offset ?? 0;
    filters = optionsOrLimit.filters || null;
  } else {
    limit = optionsOrLimit ?? 10;
    query = queryParam || '';
    brand = brandParam || 'All';
    offset = offsetParam ?? 0;
  }

  const where = buildPublishedDeviceWhere({ query, brand, filters });

  const devices = await prisma.device.findMany({
    where,
    orderBy: [
      { createdAt: 'asc' },
      { id: 'asc' }
    ],
    skip: offset,
    take: limit,
    include: {
      deviceBrand: true
    }
  });

  return devices.map(formatDevice);
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: getPublishedDevicesCountQuery
 * -----------------------------------------------------------------------------
 * @description Public query: counts published devices matching search query, brand, and spec filters at database level.
 * @table `device`
 * @where Called by: `actions/devices.js` -> `publishedDevicesCount()`
 * @param {string|object} optionsOrQuery - Search query term or options object.
 * @param {string} brandParam - Brand name filter.
 * @returns {Promise<number>} Count of published devices.
 */
export async function getPublishedDevicesCountQuery(optionsOrQuery = '', brandParam = 'All') {
  let query = '';
  let brand = 'All';
  let filters = null;

  if (typeof optionsOrQuery === 'object' && optionsOrQuery !== null) {
    query = optionsOrQuery.query || '';
    brand = optionsOrQuery.brand || 'All';
    filters = optionsOrQuery.filters || null;
  } else {
    query = optionsOrQuery || '';
    brand = brandParam || 'All';
  }

  const where = buildPublishedDeviceWhere({ query, brand, filters });

  return await prisma.device.count({ where });
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: getDeviceBrandCountsQuery
 * -----------------------------------------------------------------------------
 * @description Aggregates published device counts grouped by brand name.
 * @table `device`
 * @where Called by: `actions/devices.js` -> `getDeviceBrandCounts()`
 * @returns {Promise<object>} Object mapping brand names to count numbers.
 */
export async function getDeviceBrandCountsQuery() {
  const publishedDevices = await prisma.device.findMany({
    where: { status: 'PUBLISHED' }
  });

  const counts = { "All": publishedDevices.length };
  publishedDevices.forEach(device => {
    const b = device.brandName || device.brand;
    if (b) {
      counts[b] = (counts[b] || 0) + 1;
    }
  });

  return counts;
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: getNewArrivalsQuery
 * -----------------------------------------------------------------------------
 * @description Fetches recently added devices marked `isNew: true`.
 * @table `device`
 * @where Called by: `actions/devices.js` -> `getNewArrivals()`
 * @param {number} limit - Limit (default 6).
 * @returns {Promise<Array>}
 */
export async function getNewArrivalsQuery(limit = 6) {
  const devices = await prisma.device.findMany({
    where: { status: 'PUBLISHED', isNew: true },
    orderBy: { createdAt: 'desc' },
    take: limit
  });
  return devices.map(formatDevice);
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: getTopRatedDevicesQuery
 * -----------------------------------------------------------------------------
 * @description Fetches top-rated devices marked `isTopRated: true` ordered by rating score descending.
 * @table `device`
 * @where Called by: `actions/devices.js` -> `getTopRatedDevices()`
 * @param {number} limit - Limit (default 3).
 * @returns {Promise<Array>}
 */
export async function getTopRatedDevicesQuery(limit = 3) {
  const devices = await prisma.device.findMany({
    where: { status: 'PUBLISHED', isTopRated: true },
    orderBy: { rating: 'desc' },
    take: limit
  });
  return devices.map(formatDevice);
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: createDeviceQuery
 * -----------------------------------------------------------------------------
 * @description Inserts a new smartphone device record into PostgreSQL.
 * @table `device`
 * @where Called by: `actions/devices.js` -> `createDevice()`
 * @param {object} data - Device payload.
 * @returns {Promise<object>} Created device record.
 */
export async function createDeviceQuery(data) {
  const payload = { ...data };
  if (payload.status) {
    const s = payload.status.toUpperCase();
    payload.status = (s === 'TRASH' || s === 'TRASHED') ? 'TRASHED' : s;
  }
  if (payload.brand && !payload.brandName) {
    payload.brandName = payload.brand;
    delete payload.brand;
  }
  if (payload.specs) {
    const normalized = normalizeDeviceFilterValues(payload.specs);
    Object.assign(payload, normalized);
  }
  const created = await prisma.device.create({ data: payload });
  return formatDevice(created);
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: updateDeviceQuery
 * -----------------------------------------------------------------------------
 * @description Updates an existing device record by ID in PostgreSQL.
 * @table `device`
 * @where Called by: `actions/devices.js` -> `updateDevice()`
 * @param {string} id - Device ID / slug.
 * @param {object} data - Updated device fields.
 * @returns {Promise<object>} Updated device record.
 */
export async function updateDeviceQuery(id, data) {
  const payload = { ...data };
  if (payload.status) {
    const s = payload.status.toUpperCase();
    payload.status = (s === 'TRASH' || s === 'TRASHED') ? 'TRASHED' : s;
  }
  if (payload.brand && !payload.brandName) {
    payload.brandName = payload.brand;
    delete payload.brand;
  }
  if (payload.specs) {
    const normalized = normalizeDeviceFilterValues(payload.specs);
    Object.assign(payload, normalized);
  }
  const updated = await prisma.device.update({
    where: { id },
    data: payload
  });
  return formatDevice(updated);
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: deleteDeviceQuery
 * -----------------------------------------------------------------------------
 * @description Permanently deletes a device record from PostgreSQL by ID.
 * @table `device`
 * @where Called by: `actions/devices.js` -> `deleteDevice()`
 * @param {string} id - Device ID / slug.
 * @returns {Promise<object>} Deleted Prisma record.
 */
export async function deleteDeviceQuery(id) {
  return await prisma.device.delete({
    where: { id }
  });
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: trashDeviceQuery
 * -----------------------------------------------------------------------------
 * @description Soft-deletes a device record by setting status to `'TRASHED'`.
 * @table `device`
 * @where Called by: `actions/devices.js` -> `trashDevice()`
 * @param {string} id - Device ID / slug.
 * @returns {Promise<object>}
 */
export async function trashDeviceQuery(id) {
  const updated = await prisma.device.update({
    where: { id },
    data: { status: 'TRASHED' }
  });
  return formatDevice(updated);
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: restoreDeviceQuery
 * -----------------------------------------------------------------------------
 * @description Restores a trashed device record by setting status to `'DRAFT'`.
 * @table `device`
 * @where Called by: `actions/devices.js` -> `restoreDevice()`
 * @param {string} id - Device ID / slug.
 * @returns {Promise<object>}
 */
export async function restoreDeviceQuery(id) {
  const updated = await prisma.device.update({
    where: { id },
    data: { status: 'DRAFT' }
  });
  return formatDevice(updated);
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: reassignDeviceBrandQuery
 * -----------------------------------------------------------------------------
 * @description Reassigns brand column values across devices from old brand to new brand.
 * @table `device`
 * @where Called by: `actions/devices.js` -> `reassignDeviceBrand()`
 * @param {string} oldBrand - Original brand name.
 * @param {string} newBrand - Replacement brand name.
 * @returns {Promise<object>} Prisma updateMany result object `{ count: number }`.
 */
export async function reassignDeviceBrandQuery(oldBrand, newBrand) {
  return await prisma.device.updateMany({
    where: { brandName: oldBrand },
    data: { brandName: newBrand }
  });
}
