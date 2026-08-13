import React from 'react';
import { redirect } from 'next/navigation';
import UsersTable from '@/app/dashboard/users/_components/UsersTable';
import { getUsers } from '@/actions/users';
import { verifySession } from '@/actions/auth';

export default async function UsersPage() {
  const session = await verifySession();
  if (!session || session.role !== 'Admin') {
    redirect('/dashboard');
  }

  const currentUserId = session?.id || null;

  // Fetch all registered users
  const initialUsers = await getUsers();

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1  style={{fontSize: "var(--font-size-h1-dashboard, var(--font-size-h1-default))"}} className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Users Management</h1>
        <p  style={{fontSize: "var(--font-size-p-default, var(--font-size-p-default))"}} className="text-slate-600 dark:text-slate-400 mb-8">
          Manage all registered users, roles, and permissions.
        </p>
        
        <UsersTable initialUsers={initialUsers} currentUserId={currentUserId} />
      </div>
    </div>
  );
}
