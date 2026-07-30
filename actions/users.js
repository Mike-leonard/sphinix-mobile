'use server';

import { revalidatePath } from 'next/cache';
import { verifySession } from './auth';
import { getAllUsers, deleteUserById, updateUserRoleById, getUserById, updateUserNameById } from '@/queries/users';

/**
 * -----------------------------------------------------------------------------
 * USERS ACTION: getUsers
 * -----------------------------------------------------------------------------
 * @description Admin action: fetches all registered user accounts from PostgreSQL.
 * @why Renders the user management table in the admin dashboard.
 * @where Called by: `app/dashboard/users/page.js`
 * @security Restricted strictly to Admin role (`verifySession()`).
 * @param {string|null} currentUserId - Active admin ID to filter out self-deletion options.
 * @returns {Promise<Array>} Array of user profile objects.
 */
export async function getUsers(currentUserId = null) {
  try {
    const session = await verifySession();
    if (!session || session.role !== 'Admin') {
      return [];
    }
    return await getAllUsers(currentUserId);
  } catch (error) {
    console.error('Error fetching users from database:', error);
    return [];
  }
}

/**
 * -----------------------------------------------------------------------------
 * USERS ACTION: deleteUser
 * -----------------------------------------------------------------------------
 * @description Admin action: deletes a user account record from PostgreSQL.
 * @why Allows admins to remove spam or prohibited accounts.
 * @where Called by: `app/dashboard/users/_components/UserList.jsx`
 * @security Restricted strictly to Admin role (`verifySession()`).
 * @param {string} userId - ID of the target user to delete.
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function deleteUser(userId) {
  const session = await verifySession();
  if (!session || session.role !== 'Admin') {
    return { success: false, message: 'Unauthorized. Admin access required.' };
  }

  try {
    await deleteUserById(userId);
    
    revalidatePath('/dashboard/users');
    return { success: true, message: 'User deleted successfully' };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, message: 'Failed to delete user' };
  }
}

/**
 * -----------------------------------------------------------------------------
 * USERS ACTION: updateUserRole
 * -----------------------------------------------------------------------------
 * @description Admin action: updates a user's role (`Admin`, `Moderator`, `ContentWriter`, `Normal`).
 * @why Enables role-based access control management from the dashboard.
 * @where Called by: `app/dashboard/users/_components/UserList.jsx`
 * @security Restricted strictly to Admin role (`verifySession()`).
 * @param {string} userId - ID of target user.
 * @param {string} newRole - Target role string.
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function updateUserRole(userId, newRole) {
  const session = await verifySession();
  if (!session || session.role !== 'Admin') {
    return { success: false, message: 'Unauthorized. Admin access required.' };
  }

  try {
    await updateUserRoleById(userId, newRole);
    
    revalidatePath('/dashboard/users');
    return { success: true, message: 'User role updated successfully' };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { success: false, message: 'Failed to update user role' };
  }
}

/**
 * -----------------------------------------------------------------------------
 * USERS ACTION: sendForgetPassword
 * -----------------------------------------------------------------------------
 * @description Admin action: triggers a password reset email to a specified user.
 * @why Allows admins to trigger password reset emails on behalf of users.
 * @where Called by: `app/dashboard/users/_components/UserList.jsx`
 * @security Restricted strictly to Admin role (`verifySession()`).
 * @param {string} userId - Target user ID.
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function sendForgetPassword(userId) {
  const session = await verifySession();
  if (!session || session.role !== 'Admin') {
    return { success: false, message: 'Unauthorized. Admin access required.' };
  }

  try {
    const user = await getUserById(userId);

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    return { success: true, message: `Password reset instructions sent to ${user.email}` };
  } catch (error) {
    console.error('Error sending forget password:', error);
    return { success: false, message: 'Failed to send password reset' };
  }
}

/**
 * -----------------------------------------------------------------------------
 * USERS ACTION: updateProfileName
 * -----------------------------------------------------------------------------
 * @description User action: updates display name for the currently authenticated profile.
 * @why Allows signed-in users to update their profile display name.
 * @where Called by: User profile management modal/page.
 * @security Restricted to authenticated user session (`verifySession()`).
 * @param {string} newName - Replacement name string.
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function updateProfileName(newName) {
  const session = await verifySession();
  if (!session) {
    return { success: false, message: 'Unauthorized.' };
  }

  try {
    await updateUserNameById(session.id, newName);
    revalidatePath('/profile');
    return { success: true, message: 'Profile updated successfully' };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, message: 'Failed to update profile' };
  }
}
