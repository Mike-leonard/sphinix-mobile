'use server';

import { cookies } from 'next/headers';
import users from '../data/users.json';

export async function loginAction(email, password) {
  try {
    // Find user in the mock JSON file
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }

    // For a real app, you would encrypt this object into a secure JWT or session token.
    // Here we use a plain JSON string for simplicity of the mock, but mark it HttpOnly.
    const sessionData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const cookieStore = await cookies();
    cookieStore.set('session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return { success: true, role: user.role };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'An error occurred during login' };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  return { success: true };
}
