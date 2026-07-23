import prisma from '@/lib/prisma';

export async function getAllDevicesQuery() {
  return await prisma.device.findMany({
    orderBy: { createdAt: 'desc' },
    include: { deviceBrand: true }
  });
}

export async function getDeviceByIdQuery(id) {
  return await prisma.device.findUnique({
    where: { id },
    include: { deviceBrand: true }
  });
}

export async function getDevicesByIdsQuery(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return [];
  return await prisma.device.findMany({
    where: {
      id: { in: ids }
    },
    include: { deviceBrand: true }
  });
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

  // 1. Direct or partial string inclusion
  if (valStr.replace(/\s+/g, '').includes(option.replace(/\s+/g, ''))) return true;

  const extractNum = (str) => {
    const match = String(str).match(/[\d.]+/);
    return match ? parseFloat(match[0]) : null;
  };

  const valNum = extractNum(valStr);
  if (valNum === null) return false;

  // 2. "Under X" or "< X"
  if (option.includes('under') || option.includes('<')) {
    const limit = extractNum(option);
    return limit !== null && valNum < limit;
  }

  // 3. "Above X" or "> X"
  if (option.includes('above') || option.includes('>')) {
    const limit = extractNum(option);
    return limit !== null && valNum > limit;
  }

  // 4. "Min - Max" Range (e.g. "$801 - $1000", "6001 - 10000 mAh", "8 GB - 12 GB")
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

  const where = { status: 'published' };

  if (brand && brand !== 'All') {
    where.brand = { equals: brand, mode: 'insensitive' };
  }

  if (query) {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { brand: { contains: query, mode: 'insensitive' } }
    ];
  }

  const allMatching = await prisma.device.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { deviceBrand: true }
  });

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

  const where = { status: 'published' };

  if (brand && brand !== 'All') {
    where.brand = { equals: brand, mode: 'insensitive' };
  }

  if (query) {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { brand: { contains: query, mode: 'insensitive' } }
    ];
  }

  if (filters && Object.keys(filters).length > 0) {
    const allMatching = await prisma.device.findMany({ where });
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

export async function getDeviceBrandCountsQuery() {
  const publishedDevices = await prisma.device.findMany({
    where: { status: 'published' }
  });

  const counts = { "All": publishedDevices.length };
  publishedDevices.forEach(device => {
    if (device.brand) {
      counts[device.brand] = (counts[device.brand] || 0) + 1;
    }
  });

  return counts;
}

export async function getNewArrivalsQuery(limit = 6) {
  return await prisma.device.findMany({
    where: { status: 'published', isNew: true },
    orderBy: { createdAt: 'desc' },
    take: limit
  });
}

export async function getTopRatedDevicesQuery(limit = 3) {
  return await prisma.device.findMany({
    where: { status: 'published', isTopRated: true },
    orderBy: { rating: 'desc' },
    take: limit
  });
}

export async function createDeviceQuery(data) {
  return await prisma.device.create({ data });
}

export async function updateDeviceQuery(id, data) {
  return await prisma.device.update({
    where: { id },
    data
  });
}

export async function deleteDeviceQuery(id) {
  return await prisma.device.delete({
    where: { id }
  });
}

export async function trashDeviceQuery(id) {
  return await prisma.device.update({
    where: { id },
    data: { status: 'trashed' }
  });
}

export async function restoreDeviceQuery(id) {
  return await prisma.device.update({
    where: { id },
    data: { status: 'draft' }
  });
}

export async function reassignDeviceBrandQuery(oldBrand, newBrand) {
  return await prisma.device.updateMany({
    where: { brand: oldBrand },
    data: { brand: newBrand }
  });
}
