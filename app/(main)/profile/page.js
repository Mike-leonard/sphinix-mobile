import React from 'react';
import { verifySession } from '@/actions/auth';
import { redirect } from 'next/navigation';
import ProfileForm from './_components/ProfileForm';

export default async function ProfilePage() {
  const session = await verifySession();
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex-1 px-4 py-16 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
        <h1  style={{fontSize: "var(--font-size-h1-dashboard, var(--font-size-h1-default))"}} className="text-2xl font-bold text-slate-900 dark:text-white mb-2">My Profile</h1>
        <p  style={{fontSize: "var(--font-size-p-default, var(--font-size-p-default))"}} className="text-slate-600 dark:text-slate-400 mb-8">
          Manage your account settings and preferences.
        </p>

        <ProfileForm user={session} />
      </div>
    </div>
  );
}
