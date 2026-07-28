import prisma from '@/lib/prisma';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

function getPrisma() {
  if (prisma && prisma.affiliateCountry) {
    return prisma;
  }
  if (typeof globalThis !== 'undefined' && globalThis.prisma && globalThis.prisma.affiliateCountry) {
    return globalThis.prisma;
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const client = new PrismaClient({ adapter });
  if (typeof globalThis !== 'undefined') {
    globalThis.prisma = client;
  }
  return client;
}

const DEFAULT_AFFILIATE_COUNTRIES = [
  {
    name: 'United States',
    code: 'US',
    flag: '🇺🇸',
    currencySymbol: '$',
    currencyCode: 'USD',
    isDefault: true,
    enabled: true,
    order: 1,
    stores: [
      { id: 'amazon', name: 'Amazon' },
      { id: 'bestbuy', name: 'Best Buy' },
      { id: 'walmart', name: 'Walmart' },
      { id: 'ebay', name: 'eBay' }
    ]
  },
  {
    name: 'Italy',
    code: 'IT',
    flag: '🇮🇹',
    currencySymbol: '€',
    currencyCode: 'EUR',
    isDefault: false,
    enabled: true,
    order: 2,
    stores: [
      { id: 'amazon_it', name: 'Amazon Italy' },
      { id: 'mediaworld', name: 'MediaWorld' },
      { id: 'unieuro', name: 'Unieuro' }
    ]
  },
  {
    name: 'Spain',
    code: 'ES',
    flag: '🇪🇸',
    currencySymbol: '€',
    currencyCode: 'EUR',
    isDefault: false,
    enabled: true,
    order: 3,
    stores: [
      { id: 'amazon_es', name: 'Amazon Spain' },
      { id: 'pccomponentes', name: 'PC Componentes' },
      { id: 'mediamarkt_es', name: 'MediaMarkt' }
    ]
  },
  {
    name: 'Bangladesh',
    code: 'BD',
    flag: '🇧🇩',
    currencySymbol: '৳',
    currencyCode: 'BDT',
    isDefault: false,
    enabled: true,
    order: 4,
    stores: [
      { id: 'daraz', name: 'Daraz' },
      { id: 'startech', name: 'Star Tech' },
      { id: 'ryans', name: 'Ryans Computers' }
    ]
  },
  {
    name: 'France',
    code: 'FR',
    flag: '🇫🇷',
    currencySymbol: '€',
    currencyCode: 'EUR',
    isDefault: false,
    enabled: true,
    order: 5,
    stores: [
      { id: 'amazon_fr', name: 'Amazon France' },
      { id: 'fnac', name: 'Fnac' },
      { id: 'darty', name: 'Darty' }
    ]
  },
  {
    name: 'Canada',
    code: 'CA',
    flag: '🇨🇦',
    currencySymbol: 'CA$',
    currencyCode: 'CAD',
    isDefault: false,
    enabled: true,
    order: 6,
    stores: [
      { id: 'amazon_ca', name: 'Amazon Canada' },
      { id: 'bestbuy_ca', name: 'Best Buy CA' }
    ]
  },
  {
    name: 'Germany',
    code: 'DE',
    flag: '🇩🇪',
    currencySymbol: '€',
    currencyCode: 'EUR',
    isDefault: false,
    enabled: true,
    order: 7,
    stores: [
      { id: 'amazon_de', name: 'Amazon Germany' },
      { id: 'cyberport', name: 'Cyberport' },
      { id: 'mediamarkt_de', name: 'MediaMarkt DE' }
    ]
  }
];

export async function seedDefaultAffiliateCountriesIfNeeded() {
  try {
    const client = getPrisma();
    const count = await client.affiliateCountry.count();
    if (count === 0) {
      for (const country of DEFAULT_AFFILIATE_COUNTRIES) {
        await client.affiliateCountry.create({
          data: country
        });
      }
    }
  } catch (error) {
    console.error('Error seeding default affiliate countries:', error);
  }
}

export async function getAllAffiliateCountriesQuery() {
  await seedDefaultAffiliateCountriesIfNeeded();
  const client = getPrisma();
  return await client.affiliateCountry.findMany({
    orderBy: { order: 'asc' }
  });
}

export async function getEnabledAffiliateCountriesQuery() {
  await seedDefaultAffiliateCountriesIfNeeded();
  const client = getPrisma();
  return await client.affiliateCountry.findMany({
    where: { enabled: true },
    orderBy: { order: 'asc' }
  });
}

export async function createAffiliateCountryQuery(data) {
  const client = getPrisma();
  const code = (data.code || '').trim().toUpperCase();
  if (data.isDefault) {
    await client.affiliateCountry.updateMany({
      where: { isDefault: true },
      data: { isDefault: false }
    });
  }

  return await client.affiliateCountry.create({
    data: {
      name: data.name,
      code,
      flag: data.flag || '🌐',
      currencySymbol: data.currencySymbol || '$',
      currencyCode: data.currencyCode ? data.currencyCode.toUpperCase() : 'USD',
      isDefault: !!data.isDefault,
      enabled: data.enabled !== undefined ? data.enabled : true,
      order: data.order || 0,
      stores: data.stores || []
    }
  });
}

export async function updateAffiliateCountryQuery(id, data) {
  const client = getPrisma();
  if (data.isDefault) {
    await client.affiliateCountry.updateMany({
      where: { id: { not: id } },
      data: { isDefault: false }
    });
  }

  const updateData = { ...data };
  if (updateData.code) updateData.code = updateData.code.trim().toUpperCase();
  if (updateData.currencyCode) updateData.currencyCode = updateData.currencyCode.trim().toUpperCase();

  return await client.affiliateCountry.update({
    where: { id },
    data: updateData
  });
}

export async function deleteAffiliateCountryQuery(id) {
  const client = getPrisma();
  return await client.affiliateCountry.delete({
    where: { id }
  });
}
