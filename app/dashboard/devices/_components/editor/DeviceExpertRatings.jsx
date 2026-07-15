'use client';

import React from 'react';
import { Star } from 'lucide-react';

export default function DeviceExpertRatings({ expertRatings, ratingBars, onChange }) {
  if (!ratingBars || ratingBars.length === 0) return null;

  const handleRatingChange = (slug, value) => {
    onChange({
      ...expertRatings,
      [slug]: Number(value)
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-2">
        <Star className="h-5 w-5 text-amber-500" />
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Expert Ratings</h2>
          <p className="text-sm text-slate-500">Provide your expert score for this device out of 5.</p>
        </div>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
        {ratingBars.map((bar) => {
          const value = expertRatings[bar.slug] !== undefined ? expertRatings[bar.slug] : bar.defaultValue;
          
          return (
            <div key={bar.id} className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {bar.name}
                </label>
                <span className="text-sm font-bold text-brand-600 bg-brand-50 dark:bg-brand-500/10 dark:text-brand-400 px-2 py-0.5 rounded">
                  {value} / 5
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={value}
                onChange={(e) => handleRatingChange(bar.slug, e.target.value)}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
