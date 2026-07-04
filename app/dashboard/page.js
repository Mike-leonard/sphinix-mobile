import React from 'react';

export default function DashboardPage() {
  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Welcome to the privileged dashboard. Only Admins, Moderators, and Content Writers can see this page.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Users</h2>
            <p className="text-3xl font-bold text-brand-500">1,245</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Blogs</h2>
            <p className="text-3xl font-bold text-brand-500">86</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Reviews</h2>
            <p className="text-3xl font-bold text-brand-500">432</p>
          </div>
        </div>
      </div>
    </div>
  );
}
