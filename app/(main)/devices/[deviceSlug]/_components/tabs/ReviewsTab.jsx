import React from 'react';

export default function ReviewsTab({ device }) {
  return (
    <div className="animate-in fade-in duration-300 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm">
      <h3  style={{fontSize: "var(--font-size-h3-section, var(--font-size-h3-default))"}} className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Reviews Yet</h3>
      <p  style={{fontSize: "var(--font-size-p-form, var(--font-size-p-default))"}} className="text-slate-500 dark:text-slate-400">
        Be the first to review the {device.name}! Check back later for community feedback.
      </p>
    </div>
  );
}
