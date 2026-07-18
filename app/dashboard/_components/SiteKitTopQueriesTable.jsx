'use client';

import React from 'react';

export default function SiteKitTopQueriesTable({ data }) {
  const { topQueries } = data;

  return (
    <div className="flex flex-col">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-lg font-medium text-slate-800 dark:text-white">See how your content is doing</h3>
        <p className="text-sm text-slate-500 mt-1">Keep track of your most popular pages and how people found them from Search</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <th className="py-4 px-6 text-xs font-semibold text-slate-800 dark:text-slate-200 w-[60%]">Top search queries for your site</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-800 dark:text-slate-200 text-right">Clicks</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-800 dark:text-slate-200 text-right">Impressions</th>
            </tr>
          </thead>
          <tbody>
            {topQueries.map((item, index) => (
              <tr key={index} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-4 px-6 text-sm">
                  <div className="flex gap-2">
                    <span className="text-slate-500">{index + 1}.</span>
                    <a href="#" className="text-[#008289] dark:text-teal-400 font-medium hover:underline truncate max-w-[350px] lg:max-w-[500px] block">
                      {item.query}
                    </a>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-slate-700 dark:text-slate-300 text-right">{item.clicks}</td>
                <td className="py-4 px-6 text-sm text-slate-700 dark:text-slate-300 text-right">{item.impressions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
