'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function SiteKitSearchTrafficChart({ data }) {
  const { impressions, clicks, uniqueVisitors, searchTrafficChartData } = data;

  return (
    <div className="flex flex-col">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-lg font-medium text-slate-800 dark:text-white">Search traffic over the last 28 days</h3>
      </div>
      
      <div className="flex flex-col lg:flex-row border-b border-slate-100 dark:border-slate-800">
        {/* Metric 1 */}
        <div className="flex-1 p-6 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 text-center relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500"></div>
          <div className="text-sm text-slate-500 mb-2">Total Impressions</div>
          <div className="text-4xl font-light text-slate-800 dark:text-white mb-2">{impressions}</div>
          <div className="flex items-center justify-center gap-1 text-sm text-emerald-600 font-medium">
            <TrendingUp className="w-4 h-4" /> 13.5%
          </div>
        </div>

        {/* Metric 2 */}
        <div className="flex-1 p-6 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
          <div className="text-sm text-slate-500 mb-2">Total Clicks</div>
          <div className="text-4xl font-light text-slate-800 dark:text-white mb-2">{clicks}</div>
          <div className="flex items-center justify-center gap-1 text-sm text-rose-600 font-medium">
            <TrendingDown className="w-4 h-4" /> 16.7%
          </div>
        </div>

        {/* Metric 3 */}
        <div className="flex-1 p-6 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
          <div className="text-sm text-slate-500 mb-2">Unique Visitors from Search</div>
          <div className="text-4xl font-light text-slate-800 dark:text-white mb-2">{uniqueVisitors}</div>
          <div className="flex items-center justify-center gap-1 text-sm text-rose-600 font-medium">
            <TrendingDown className="w-4 h-4" /> 25%
          </div>
        </div>

        {/* Action Box */}
        <div className="flex-1 p-6 bg-slate-50 dark:bg-slate-800/30">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-lg shadow-sm">
            <div className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">Key Events completed</div>
            <div className="h-16 flex items-end gap-1 mb-3">
              <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-[20%] rounded-sm"></div>
              <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-[30%] rounded-sm"></div>
              <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-[25%] rounded-sm"></div>
              <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-[50%] rounded-sm"></div>
              <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-[80%] rounded-sm"></div>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-4 mb-4">Set up key events to track how well your site fulfills your business objectives</p>
          <Button size="sm" className="bg-[#1e8e3e] hover:bg-[#177231] text-white w-full rounded-full">Set up key events</Button>
        </div>
      </div>

      <div className="p-6 h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={searchTrafficChartData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
            <XAxis dataKey="date" axisLine={{ stroke: '#cbd5e1' }} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} minTickGap={30} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend iconType="plainline" wrapperStyle={{ fontSize: '13px', paddingBottom: '20px' }} verticalAlign="top" align="left" />
            <Line type="monotone" name="Impressions" dataKey="current" stroke="#5c6bc0" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
            <Line type="monotone" name="Previous period" dataKey="previous" stroke="#8c9eff" strokeWidth={2} strokeDasharray="5 5" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
        Source: <a href="#" className="text-[#1a73e8] hover:underline flex items-center gap-1 inline-flex">Search Console <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a>
      </div>
    </div>
  );
}
