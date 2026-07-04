import React from 'react';

export default function ProfilePage() {
  return (
    <div className="flex-1 px-4 py-16 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">My Profile</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Manage your account settings and preferences.
        </p>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Full Name</label>
              <div className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-sm text-slate-500">
                Mock User Name
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Email Address</label>
              <div className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-sm text-slate-500">
                user@example.com
              </div>
            </div>
          </div>
          
          <button type="button" className="bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-md px-4 py-2 transition-colors">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
