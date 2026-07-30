import prisma from '@/lib/prisma';

/**
 * Formats DB device record, normalizing specs, pricing, and status.
 */
export function formatDevice(device) {
  if (!device) return null;
  const specsObj = (device.specs && typeof device.specs === 'object') ? device.specs : {};
  const brandVal = device.brandName || device.brand || (device.deviceBrand?.name ?? '');
  return {
    ...device,
    brand: brandVal,
    brandName: brandVal,
    price: device.price !== undefined && device.price !== null ? String(device.price) : '',
    status: (device.status || 'DRAFT').toLowerCase(),
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
 * @description Admin query: fetches all devices regardless of status ordered by creation timestamp.
 * @table `device`
 * @where Called by: `actions/devices.js` -> `getDevices()`, `createDevice()`
 * @returns {Promise<Array>} List of formatted device records.
 */
export async function getAllDevicesQuery() {
  const devices = await prisma.device.findMany({
    orderBy: { createdAt: 'desc' },
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

const ATTR_KEY_MAP = {
  filter_price: ['price'],
  price: ['price'],
  filter_battery: ['battery'],
  battery: ['battery'],
  filter_camera: ['camera'],
  camera: ['camera'],
  filter_display: ['screen', 'display'],
  display: ['screen', 'display'],
  screen: ['screen', 'display'],
  filter_cpu: ['chipset', 'cpu'],
  cpu: ['chipset', 'cpu'],
  chipset: ['chipset', 'cpu'],
  filter_connectivity: ['wlan', 'connectivity'],
  connectivity: ['wlan', 'connectivity'],
  wlan: ['wlan', 'connectivity'],
  filter_ram: ['ram'],
  ram: ['ram'],
  filter_storage: ['storage'],
  storage: ['storage'],
  filter_os: ['os'],
  os: ['os']
};

function getDeviceSpecValue(device, filterKey) {
  const cleanKey = String(filterKey).toLowerCase().replace(/^filter_/, '');
  const possibleKeys = ATTR_KEY_MAP[filterKey] || ATTR_KEY_MAP[cleanKey] || [filterKey, cleanKey];

  for (const k of possibleKeys) {
    if (device[k] !== undefined && device[k] !== null) return device[k];
    if (device.specs && device.specs[k] !== undefined && device.specs[k] !== null) return device.specs[k];
  }
  return null;
}

function evaluateFilterOption(specVal, optStr) {
  if (!specVal || !optStr) return false;

  const valStr = String(specVal).toLowerCase().trim();
  const option = String(optStr).toLowerCase().trim();

  if (valStr.replace(/\s+/g, '').includes(option.replace(/\s+/g, ''))) return true;

  const extractNum = (str) => {
    const match = String(str).match(/[\d.]+/);
    return match ? parseFloat(match[0]) : null;
  };

  const valNum = extractNum(valStr);
  if (valNum === null) return false;

  if (option.includes('under') || option.includes('<')) {
    const limit = extractNum(option);
    return limit !== null && valNum < limit;
  }

  if (option.includes('above') || option.includes('>')) {
    const limit = extractNum(option);
    return limit !== null && valNum > limit;
  }

  if (option.includes('-')) {
    const parts = option.split('-');
    const min = extractNum(parts[0]);
    const max = extractNum(parts[1]);
    if (min !== null && max !== null) {
      return valNum >= min && valNum <= max;
    }
  }

  return false;
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
export async function getPublishedDevicesQuery(optionsOrLimit = 10, queryParam = '', brandParam = 'All', offsetParam = 0) {
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

  const where = { status: 'PUBLISHED' };

  if (brand && brand !== 'All') {
    where.brandName = { equals: brand, mode: 'insensitive' };
  }

  if (query) {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { brandName: { contains: query, mode: 'insensitive' } }
    ];
  }

  const rawMatching = await prisma.device.findMany({
    where,
    orderBy: { createdAt: 'asc' },
    include: { deviceBrand: true }
  });

  const allMatching = rawMatching.map(formatDevice);

  if (filters && Object.keys(filters).length > 0) {
    const filtered = allMatching.filter(device => {
      return Object.entries(filters).every(([filterId, selectedOptions]) => {
        if (!selectedOptions || selectedOptions.length === 0) return true;
        const val = getDeviceSpecValue(device, filterId);
        if (!val) return false;
        return selectedOptions.some(opt => evaluateFilterOption(val, opt));
      });
    });

    return filtered.slice(offset, offset + limit);
  }

  return allMatching.slice(offset, offset + limit);
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: getPublishedDevicesCountQuery
 * -----------------------------------------------------------------------------
 * @description Public query: counts published devices matching search query, brand, and spec filters.
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

  const where = { status: 'PUBLISHED' };

  if (brand && brand !== 'All') {
    where.brandName = { equals: brand, mode: 'insensitive' };
  }

  if (query) {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { brandName: { contains: query, mode: 'insensitive' } }
    ];
  }

  if (filters && Object.keys(filters).length > 0) {
    const rawMatching = await prisma.device.findMany({ where });
    const allMatching = rawMatching.map(formatDevice);
    const filtered = allMatching.filter(device => {
      return Object.entries(filters).every(([filterId, selectedOptions]) => {
        if (!selectedOptions || selectedOptions.length === 0) return true;
        const val = getDeviceSpecValue(device, filterId);
        if (!val) return false;
        return selectedOptions.some(opt => evaluateFilterOption(val, opt));
      });
    });
    return filtered.length;
  }

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
    payload.status = payload.status.toUpperCase();
  }
  if (payload.brand && !payload.brandName) {
    payload.brandName = payload.brand;
    delete payload.brand;
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
    payload.status = payload.status.toUpperCase();
  }
  if (payload.brand && !payload.brandName) {
    payload.brandName = payload.brand;
    delete payload.brand;
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
