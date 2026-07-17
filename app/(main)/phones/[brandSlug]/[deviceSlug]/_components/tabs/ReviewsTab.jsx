'use client';
import React, { useState } from 'react';

import { MessageSquare, Send } from 'lucide-react';

export default function ReviewsTab({ device, ratingBars = [] }) {
  // Initialize state with default values from rating bars
  const [userRatings, setUserRatings] = useState(() => {
    const initial = {};
    ratingBars.forEach(bar => {
      initial[bar.slug] = bar.defaultValue || 5;
    });
    return initial;
  });

  const handleRatingChange = (slug, value) => {
    setUserRatings(prev => ({ ...prev, [slug]: Number(value) }));
  };

  const ratedBars = ratingBars.filter(bar => userRatings[bar.slug] !== undefined);
  const averageRating = ratedBars.length > 0 
    ? Math.round(ratedBars.reduce((acc, bar) => acc + userRatings[bar.slug], 0) / ratedBars.length)
    : 0;

  if (device.allowReviews === false) {
    return (
      <div className="animate-in fade-in duration-300 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm">
        <MessageSquare className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
        <h3 style={{fontSize: "var(--font-size-h3-section, var(--font-size-h3-default))"}} className="text-xl font-bold text-slate-900 dark:text-white mb-2">Reviews Disabled</h3>
        <p style={{fontSize: "var(--font-size-p-form, var(--font-size-p-default))"}} className="text-slate-500 dark:text-slate-400">
          The administrator has disabled public reviews for this device.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        <MessageSquare className="h-6 w-6 text-blue-500" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Community Reviews</h2>
      </div>

      {/* Rate this Product Section */}
      {ratingBars.length > 0 && (
        <div className="mb-12 bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-center">Rate this Product</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-8">
            {ratingBars.map(bar => {
              const value = userRatings[bar.slug];
              return (
                <div key={bar.id} className="flex items-center gap-4">
                  <span className="w-24 text-sm font-medium text-slate-600 dark:text-slate-400">
                    {bar.name}:
                  </span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={value}
                    onChange={(e) => handleRatingChange(bar.slug, e.target.value)}
                    className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
                  />
                  <div className="w-10 h-8 flex items-center justify-center bg-brand-500 text-white font-bold rounded relative">
                    {value}
                    {/* Little arrow on the left to match the screenshot badge style */}
                    <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-brand-500"></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4 border-t border-slate-200 dark:border-slate-800 pt-6">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Average Rating</span>
            <div className="w-12 h-12 rounded-full bg-brand-500 text-white flex items-center justify-center text-xl font-bold">
              {averageRating}
            </div>
            <span className="text-sm text-slate-500 italic">/ 5 based on your selection</span>
          </div>
        </div>
      )}

      {/* Placeholder Comment Input */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">Leave a Review</h3>
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <textarea 
            rows="3"
            placeholder="Write your review here... (Comments system coming soon!)"
            className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 resize-none"
            disabled
          ></textarea>
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500">Log in to post a review</span>
            <button disabled className="bg-blue-600 opacity-50 cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
              <Send className="w-4 h-4" /> Post
            </button>
          </div>
        </div>
      </div>

      <div className="text-center py-12">
        <h3 style={{fontSize: "var(--font-size-h3-section, var(--font-size-h3-default))"}} className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Reviews Yet</h3>
        <p style={{fontSize: "var(--font-size-p-form, var(--font-size-p-default))"}} className="text-slate-500 dark:text-slate-400">
          Be the first to review the {device.name}! Check back later for community feedback.
        </p>
      </div>
    </div>
  );
}
