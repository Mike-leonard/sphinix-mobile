import React from 'react';
import DashboardSidebar from '@/app/dashboard/DashboardSidebar';
import { redirect } from 'next/navigation';
import { verifySession } from '@/actions/auth';

export default async function DashboardLayout({ children }) {
  const user = await verifySession();

  if (!user || user.role !== 'Admin') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900 overflow-hidden w-full">
      <DashboardSidebar user={user} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
