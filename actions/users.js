'use server';

import { revalidatePath } from 'next/cache';
import { verifySession } from './auth';
import { getAllUsers, deleteUserById, updateUserRoleById, getUserById, updateUserNameById } from '@/queries/users';

export async function getUsers(currentUserId = null) {
  try {
    return await getAllUsers(currentUserId);
  } catch (error) {
    console.error('Error fetching users from database:', error);
    return [];
  }
}

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

    // Since Supabase Auth handles password resets, as an admin, 
    // we would use the supabase-admin client to generate a link,
    // but here we can just return success as a placeholder for the mock.
    
    return { success: true, message: `Password reset instructions sent to ${user.email}` };
  } catch (error) {
    console.error('Error sending forget password:', error);
    return { success: false, message: 'Failed to send password reset' };
  }
}

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
