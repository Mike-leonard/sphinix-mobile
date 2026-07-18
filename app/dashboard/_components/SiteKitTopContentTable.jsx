'use client';

import React from 'react';

export default function SiteKitTopContentTable({ data }) {
  const { topContent } = data;

  return (
    <div className="flex flex-col">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-lg font-medium text-slate-800 dark:text-white">Top content over the last 28 days</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <th className="py-4 px-6 text-xs font-semibold text-slate-800 dark:text-slate-200 w-[50%]">Title</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-800 dark:text-slate-200 text-right">Pageviews</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-800 dark:text-slate-200 text-right">Sessions</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-800 dark:text-slate-200 text-right">Engagement Rate</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-800 dark:text-slate-200 text-right">Session Duration</th>
            </tr>
          </thead>
          <tbody>
            {topContent.map((item, index) => (
              <tr key={index} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-4 px-6 text-sm">
                  <div className="flex gap-2">
                    <span className="text-slate-500">{index + 1}.</span>
                    <div>
                      <a href={item.path} className="text-[#008289] dark:text-teal-400 font-medium hover:underline block truncate max-w-[300px] lg:max-w-[400px]">
                        {item.title}
                      </a>
                      <div className="text-xs text-[#008289]/70 dark:text-teal-400/70 truncate max-w-[300px] lg:max-w-[400px]">{item.path}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-slate-700 dark:text-slate-300 text-right">{item.pageviews}</td>
                <td className="py-4 px-6 text-sm text-slate-700 dark:text-slate-300 text-right">{item.sessions}</td>
                <td className="py-4 px-6 text-sm text-slate-700 dark:text-slate-300 text-right">{item.engagementRate}</td>
                <td className="py-4 px-6 text-sm text-slate-700 dark:text-slate-300 text-right">{item.sessionDuration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
