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

export async function getPublishedDevicesQuery(optionsOrLimit = 10, queryParam = '', brandParam = 'All', offsetParam = 0) {
  let limit = 10;
  let query = '';
  let brand = 'All';
  let offset = 0;

  if (typeof optionsOrLimit === 'object' && optionsOrLimit !== null) {
    limit = optionsOrLimit.limit ?? 10;
    query = optionsOrLimit.query || '';
    brand = optionsOrLimit.brand || 'All';
    offset = optionsOrLimit.offset ?? 0;
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

  return await prisma.device.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
    include: { deviceBrand: true }
  });
}

export async function getPublishedDevicesCountQuery(optionsOrQuery = '', brandParam = 'All') {
  let query = '';
  let brand = 'All';

  if (typeof optionsOrQuery === 'object' && optionsOrQuery !== null) {
    query = optionsOrQuery.query || '';
    brand = optionsOrQuery.brand || 'All';
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

  return await prisma.device.count({ where });
}

export async function getDeviceBrandCountsQuery() {
  const brandGroups = await prisma.device.groupBy({
    by: ['brand'],
    where: { status: 'published' },
    _count: { id: true }
  });

  const totalCount = await prisma.device.count({
    where: { status: 'published' }
  });

  const brandCounts = { "All": totalCount };
  brandGroups.forEach(group => {
    if (group.brand) {
      brandCounts[group.brand] = group._count.id;
    }
  });

  return brandCounts;
}

export async function getNewArrivalsQuery(limit = 6) {
  return await prisma.device.findMany({
    where: {
      status: 'published',
      isNew: true
    },
    orderBy: { createdAt: 'desc' },
    take: limit
  });
}

export async function getTopRatedDevicesQuery(limit = 3) {
  return await prisma.device.findMany({
    where: {
      status: 'published',
      isTopRated: true
    },
    orderBy: { rating: 'desc' },
    take: limit
  });
}

export async function createDeviceQuery(deviceData) {
  return await prisma.device.create({
    data: deviceData,
    include: { deviceBrand: true }
  });
}

export async function updateDeviceQuery(id, updateData) {
  return await prisma.device.update({
    where: { id },
    data: updateData,
    include: { deviceBrand: true }
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
    data: { status: 'trash' }
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
    where: { brand: { equals: oldBrand, mode: 'insensitive' } },
    data: { brand: newBrand }
  });
}
