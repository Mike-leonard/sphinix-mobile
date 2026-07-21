import prisma from '@/lib/prisma';

export async function verifyUserEmail(id) {
  return await prisma.user.update({
    where: { id },
    data: { emailVerified: true }
  });
}

export async function getAllUsers(currentUserId = null) {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });
  
  if (currentUserId) {
    return users.filter(u => u.id !== currentUserId);
  }
  return users;
}

export async function getUserById(id) {
  return await prisma.user.findUnique({
    where: { id }
  });
}

export async function createUser(data) {
  return await prisma.user.create({
    data
  });
}

export async function deleteUserById(id) {
  return await prisma.user.delete({
    where: { id }
  });
}

export async function updateUserRoleById(id, role) {
  return await prisma.user.update({
    where: { id },
    data: { role }
  });
}
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
}export async function updateUserNameById(id, name) {
  return await prisma.user.update({
    where: { id },
    data: { name }
  });
}
