import prisma from '@/lib/prisma';

/**
 * -----------------------------------------------------------------------------
 * QUERY: verifyUserEmail
 * -----------------------------------------------------------------------------
 * @description Updates a user record's `emailVerified` flag to `true`.
 * @table `user`
 * @param {string} id - User ID.
 * @returns {Promise<object>}
 */
export async function verifyUserEmail(id) {
  return await prisma.user.update({
    where: { id },
    data: { emailVerified: true }
  });
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: getAllUsers
 * -----------------------------------------------------------------------------
 * @description Fetches all user records from PostgreSQL, with optional filtering to exclude active admin ID.
 * @table `user`
 * @where Called by: `actions/users.js` -> `getUsers()`
 * @param {string|null} currentUserId - Active user ID to exclude.
 * @returns {Promise<Array>} List of user objects.
 */
export async function getAllUsers() {
  return await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: getUserById
 * -----------------------------------------------------------------------------
 * @description Fetches single user record by ID from PostgreSQL.
 * @table `user`
 * @where Called by: `actions/users.js` -> `sendForgetPassword()`
 * @param {string} id - User ID.
 * @returns {Promise<object|null>}
 */
export async function getUserById(id) {
  return await prisma.user.findUnique({
    where: { id }
  });
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: createUser
 * -----------------------------------------------------------------------------
 * @description Inserts a new user record into PostgreSQL.
 * @table `user`
 * @param {object} data - User creation payload.
 * @returns {Promise<object>}
 */
export async function createUser(data) {
  return await prisma.user.create({
    data
  });
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: deleteUserById
 * -----------------------------------------------------------------------------
 * @description Deletes a user record from PostgreSQL by ID.
 * @table `user`
 * @where Called by: `actions/users.js` -> `deleteUser()`
 * @param {string} id - User ID.
 * @returns {Promise<object>}
 */
export async function deleteUserById(id) {
  return await prisma.user.delete({
    where: { id }
  });
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: updateUserRoleById
 * -----------------------------------------------------------------------------
 * @description Updates a user's role column (`Admin`, `Moderator`, `ContentWriter`, `Normal`).
 * @table `user`
 * @where Called by: `actions/users.js` -> `updateUserRole()`
 * @param {string} id - User ID.
 * @param {string} role - Target role string.
 * @returns {Promise<object>}
 */
export async function updateUserRoleById(id, role) {
  return await prisma.user.update({
    where: { id },
    data: { role }
  });
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: upsertUserEmailVerified
 * -----------------------------------------------------------------------------
 * @description Upserts a user account record upon email verification.
 * @table `user`
 * @param {object} user - User payload.
 * @returns {Promise<object>}
 */
export async function upsertUserEmailVerified(user) {
  return await prisma.user.upsert({
    where: { id: user.id },
    update: { emailVerified: true },
    create: {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || 'User',
      role: 'Normal',
      emailVerified: true,
    }
  });
}

/**
 * -----------------------------------------------------------------------------
 * QUERY: updateUserNameById
 * -----------------------------------------------------------------------------
 * @description Updates user display name column in PostgreSQL.
 * @table `user`
 * @where Called by: `actions/users.js` -> `updateProfileName()`
 * @param {string} id - User ID.
 * @param {string} name - Display name string.
 * @returns {Promise<object>}
 */
export async function updateUserNameById(id, name) {
  return await prisma.user.update({
    where: { id },
    data: { name }
  });
}
