import React from 'react';
import DashboardSidebar from '@/app/dashboard/DashboardSidebar';
import { cookies } from 'next/headers';

export default async function DashboardLayout({ children }) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');

  let user = null;
  if (sessionCookie && sessionCookie.value) {
    try {
      user = JSON.parse(sessionCookie.value);
    } catch (e) {
      console.error("Failed to parse session cookie", e);
    }
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
