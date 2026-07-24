import prisma from '@/lib/prisma';

function getPrisma() {
  if (prisma && prisma.siteSettings) {
    return prisma;
  }
  if (typeof globalThis !== 'undefined' && globalThis.prisma && !globalThis.prisma.siteSettings) {
    delete globalThis.prisma;
  }
  return require('@/lib/prisma').default;
}

export async function getSettingsRow() {
  const client = getPrisma();
  return await client.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 }
  });
}

export async function updateSettingsRow(updatePayload) {
  const client = getPrisma();
  return await client.siteSettings.upsert({
    where: { id: 1 },
    update: {
      ...updatePayload,
      version: { increment: 1 }
    },
    create: {
      id: 1,
      ...updatePayload,
      version: 1
    }
  });
}
