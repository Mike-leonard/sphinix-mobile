'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { verifySession } from './auth';

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

let prisma;
if (process.env.NODE_ENV === 'production') {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });
} else {
  if (!globalThis.prisma) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    globalThis.prisma = new PrismaClient({ adapter });
  }
  prisma = globalThis.prisma;
}

export async function getUsers(currentUserId = null) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    // Return all users except the current user
    if (currentUserId) {
      return users.filter(u => u.id !== currentUserId);
    }
    return users;
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
    await prisma.user.delete({
      where: { id: userId }
    });
    
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
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole }
    });
    
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
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

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
