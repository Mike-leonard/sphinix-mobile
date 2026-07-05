import React from 'react';
import { cookies } from 'next/headers';

import { getUsers } from '@/actions/users';

export default async function UsersPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  
  let currentUserId = null;
  if (sessionCookie && sessionCookie.value) {
    try {
      const user = JSON.parse(sessionCookie.value);
      currentUserId = user.id;
    } catch (e) {
      console.error("Failed to parse session cookie", e);
    }
  }

  // Fetch users server-side, excluding the current logged-in user
  const initialUsers = await getUsers(currentUserId);

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Users Management</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Manage all registered users, roles, and permissions.
        </p>
        
       
      </div>
    </div>
  );
}
