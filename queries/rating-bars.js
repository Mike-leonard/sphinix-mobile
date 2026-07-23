import prisma from '@/lib/prisma';

function getPrisma() {
  if (prisma && prisma.ratingBar) {
    return prisma;
  }
  try {
    const { PrismaClient } = require('@prisma/client');
    return new PrismaClient();
  } catch (err) {
    console.error("PrismaClient dynamic load error:", err);
    return prisma;
  }
}

export async function getRatingBarsQuery() {
  const db = getPrisma();
  return await db.ratingBar.findMany({
    orderBy: { order: 'asc' }
  });
}

export async function createRatingBarQuery(data) {
  const db = getPrisma();
  return await db.ratingBar.create({
    data: {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description || '',
      defaultValue: data.defaultValue ?? 3,
      order: data.order ?? 0
    }
  });
}

export async function updateRatingBarQuery(id, data) {
  const db = getPrisma();
  return await db.ratingBar.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      defaultValue: data.defaultValue,
      order: data.order
    }
  });
}

export async function deleteRatingBarQuery(id) {
  const db = getPrisma();
  return await db.ratingBar.delete({
    where: { id }
  });
}

export async function reorderRatingBarsQuery(orderedIds) {
  const db = getPrisma();
  const updates = orderedIds.map((id, index) =>
    db.ratingBar.update({
      where: { id },
      data: { order: index }
    })
  );
  return await db.$transaction(updates);
}
