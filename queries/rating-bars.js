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

/**
 * -----------------------------------------------------------------------------
 * QUERY: getRatingBarsQuery
 * -----------------------------------------------------------------------------
 * @description Fetches all expert rating criteria bars ordered by display index from PostgreSQL.
 * @table `ratingBar`
 * @where Called by: `actions/rating-bars.js` -> `getRatingBars()`
 * @returns {Promise<Array>} Array of rating bar records.
 */
export async function getRatingBarsQuery() {
  const db = getPrisma();
  return await db.ratingBar.findMany({
    orderBy: { order: 'asc' }
  });
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: createRatingBarQuery
 * -----------------------------------------------------------------------------
 * @description Inserts a new rating criteria bar definition into PostgreSQL.
 * @table `ratingBar`
 * @where Called by: `actions/rating-bars.js` -> `createRatingBar()`
 * @param {object} data - { id, name, slug, description, defaultValue, order }
 * @returns {Promise<object>} Created rating bar record.
 */
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

/**
 * -----------------------------------------------------------------------------
 * QUERY: updateRatingBarQuery
 * -----------------------------------------------------------------------------
 * @description Updates an existing rating criteria bar record by ID in PostgreSQL.
 * @table `ratingBar`
 * @where Called by: `actions/rating-bars.js` -> `updateRatingBar()`
 * @param {string} id - Target rating bar ID.
 * @param {object} data - Updated rating bar fields.
 * @returns {Promise<object>} Updated rating bar record.
 */
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

/**
 * -----------------------------------------------------------------------------
 * QUERY: deleteRatingBarQuery
 * -----------------------------------------------------------------------------
 * @description Deletes a rating criteria bar record by ID from PostgreSQL.
 * @table `ratingBar`
 * @where Called by: `actions/rating-bars.js` -> `deleteRatingBar()`
 * @param {string} id - Target rating bar ID.
 * @returns {Promise<object>} Deleted Prisma record.
 */
export async function deleteRatingBarQuery(id) {
  const db = getPrisma();
  return await db.ratingBar.delete({
    where: { id }
  });
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: reorderRatingBarsQuery
 * -----------------------------------------------------------------------------
 * @description Updates order indexes for rating criteria bars in a single database transaction.
 * @table `ratingBar`
 * @where Called by: `actions/rating-bars.js` -> `reorderRatingBars()`
 * @param {Array<string>} orderedIds - Array of rating bar IDs in target display order.
 * @returns {Promise<Array>} Transaction results.
 */
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
