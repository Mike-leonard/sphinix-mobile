import prisma from '@/lib/prisma';

export async function getAllDevicesQuery() {
  return await prisma.device.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function getDeviceByIdQuery(id) {
  return await prisma.device.findUnique({
    where: { id }
  });
}

export async function getPublishedDevicesQuery(optionsOrLimit = 10, queryParam = '', brandParam = 'All', offsetParam = 0) {
  let limit = 10;
  let query = '';
  let brand = 'All';
  let category = 'All';
  let offset = 0;

  if (typeof optionsOrLimit === 'object' && optionsOrLimit !== null) {
    limit = optionsOrLimit.limit ?? 10;
    query = optionsOrLimit.query || '';
    brand = optionsOrLimit.brand || 'All';
    category = optionsOrLimit.category || 'All';
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

  if (category && category !== 'All') {
    where.category = { equals: category, mode: 'insensitive' };
  }

  if (query) {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { brand: { contains: query, mode: 'insensitive' } },
      { category: { contains: query, mode: 'insensitive' } }
    ];
  }

  return await prisma.device.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset
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
      { brand: { contains: query, mode: 'insensitive' } },
      { category: { contains: query, mode: 'insensitive' } }
    ];
  }

  return await prisma.device.count({ where });
}

export async function createDeviceQuery(deviceData) {
  return await prisma.device.create({
    data: deviceData
  });
}

export async function updateDeviceQuery(id, updateData) {
  return await prisma.device.update({
    where: { id },
    data: updateData
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
