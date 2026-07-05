import React from 'react';

export default function BlogsPage() {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Blogs Management</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Write, edit, and publish blog posts.
        </p>
        
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <p className="text-sm text-slate-500">Blog posts list will be displayed here...</p>
        </div>
      </div>
    </div>
  );
}
