import React from 'react';
import { Bookmark, MessageSquare, Star } from 'lucide-react';

export default function ActivitiesPage() {
  return (
    <div className="flex-1 px-4 py-16 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
      <h1 style={{ fontSize: "var(--font-size-h1-dashboard, var(--font-size-h1-default))" }} className="text-2xl font-bold text-slate-900 dark:text-white mb-2">My Activities</h1>
      <p style={{ fontSize: "var(--font-size-p-default, var(--font-size-p-default))" }} className="text-slate-600 dark:text-slate-400 mb-8">
        Keep track of your bookmarks, comments, and reviews.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
            <Bookmark className="w-6 h-6" />
          </div>
          <h2 style={{ fontSize: "var(--font-size-h2-settings, var(--font-size-h2-default))" }} className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Bookmarks</h2>
          <p style={{ fontSize: "var(--font-size-p-form, var(--font-size-p-default))" }} className="text-slate-500 text-sm mb-4">Saved devices and blogs</p>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">12</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h2 style={{ fontSize: "var(--font-size-h2-settings, var(--font-size-h2-default))" }} className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Comments</h2>
          <p style={{ fontSize: "var(--font-size-p-form, var(--font-size-p-default))" }} className="text-slate-500 text-sm mb-4">Thoughts on our blogs</p>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">5</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-4">
            <Star className="w-6 h-6" />
          </div>
          <h2 style={{ fontSize: "var(--font-size-h2-settings, var(--font-size-h2-default))" }} className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Reviews</h2>
          <p style={{ fontSize: "var(--font-size-p-form, var(--font-size-p-default))" }} className="text-slate-500 text-sm mb-4">Your device ratings</p>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">3</div>
        </div>
      </div>

      <div className="mt-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm text-center">
        <p style={{ fontSize: "var(--font-size-p-form, var(--font-size-p-default))" }} className="text-slate-500">Recent activity will appear here once you interact with devices or blogs.</p>
      </div>
    </div>
  );
}
