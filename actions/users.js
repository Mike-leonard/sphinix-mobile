'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

const dataFilePath = path.join(process.cwd(), 'data', 'users.json');

async function readUsers() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
}

async function writeUsers(users) {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(users, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing users file:', error);
    throw new Error('Failed to save user data');
  }
}

export async function getUsers(currentUserId = null) {
  const users = await readUsers();
  
  // Return all users except the current user
  if (currentUserId) {
    return users.filter(u => u.id !== currentUserId);
  }
  return users;
}

export async function deleteUser(userId) {
  const users = await readUsers();
  const updatedUsers = users.filter(u => u.id !== userId);
  
  if (users.length === updatedUsers.length) {
    return { success: false, message: 'User not found' };
  }
  
  await writeUsers(updatedUsers);
  revalidatePath('/dashboard/users');
  return { success: true, message: 'User deleted successfully' };
}

export async function updateUserRole(userId, newRole) {
  const users = await readUsers();
  let found = false;
  
  const updatedUsers = users.map(user => {
    if (user.id === userId) {
      found = true;
      return {
        ...user,
        role: newRole,
        modifiedAt: new Date().toISOString()
      };
    }
    return user;
  });
  
  if (!found) {
    return { success: false, message: 'User not found' };
  }
  
  await writeUsers(updatedUsers);
  revalidatePath('/dashboard/users');
  return { success: true, message: 'User role updated successfully' };
}

export async function sendForgetPassword(userId) {
  // In a real app, you would generate a token and send an email here.
  // We simulate a short delay to mimic an API call.
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const users = await readUsers();
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return { success: false, message: 'User not found' };
  }
  
  return { success: true, message: `Password reset link sent to ${user.email}` };
}
