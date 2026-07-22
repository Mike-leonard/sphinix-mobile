import prisma from '@/lib/prisma';

const DEFAULT_BRANDS = [
  "Apple", "Asus", "Google", "Honor", "Huawei", "LG", "Motorola",
  "Nothing", "OnePlus", "Oppo", "Other", "Realme", "Samsung",
  "Sony", "Vivo", "Xiaomi", "ZTE"
];

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

export async function deleteDeviceBrandQuery(name) {
  return await prisma.deviceBrand.delete({
    where: { name }
  });
}
