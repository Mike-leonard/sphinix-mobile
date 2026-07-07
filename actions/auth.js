'use server';

import { cookies } from 'next/headers';
import crypto from 'crypto';
import users from '../data/users.json';

const SECRET = process.env.SESSION_SECRET || 'fallback_secret_do_not_use_in_prod';

export async function verifySession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }
  
  try {
    const sessionData = JSON.parse(sessionCookie.value);
    const { signature, ...payload } = sessionData;
    
    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', SECRET)
      .update(JSON.stringify(payload))
      .digest('hex');
      
    if (signature !== expectedSignature) {
      console.warn("Session signature mismatch! Possible cookie tampering.");
      return null;
    }
    
    return payload;
  } catch (error) {
    console.error("Session parse error:", error);
    return null;
  }
}

export async function loginAction(email, password) {
  try {
    // Find user in the mock JSON file
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }

    // For a real app, you would encrypt this object into a secure JWT or session token.
    // Here we use a plain JSON string for simplicity of the mock, but mark it HttpOnly.
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    
    // Sign the payload
    const signature = crypto
      .createHmac('sha256', SECRET)
      .update(JSON.stringify(payload))
      .digest('hex');

    const sessionData = {
      ...payload,
      signature
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
