import React from 'react';

export default function ReviewsPage() {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <h1  style={{fontSize: "var(--font-size-h1-dashboard, var(--font-size-h1-default))"}} className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Reviews Management</h1>
        <p  style={{fontSize: "var(--font-size-p-default, var(--font-size-p-default))"}} className="text-slate-600 dark:text-slate-400 mb-8">
          Moderate and manage device reviews from users.
        </p>
        
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <p  style={{fontSize: "var(--font-size-p-form, var(--font-size-p-default))"}} className="text-sm text-slate-500">Reviews list will be displayed here...</p>
        </div>
      </div>
    </div>
  );
}
