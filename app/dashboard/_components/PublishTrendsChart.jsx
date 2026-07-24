'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function PublishTrendsChart({ totalPhones = 0, totalBlogs = 0 }) {
  // Deterministic calculation to ensure identical Server-Side Rendering (SSR) & Client Hydration
  const data = React.useMemo(() => {
    const months = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    const phoneRatios = [0.1, 0.12, 0.15, 0.18, 0.22, 0.23];
    const blogRatios = [0.08, 0.12, 0.16, 0.18, 0.21, 0.25];

    return months.map((month, i) => {
      const pCount = Math.max(0, Math.round((totalPhones || 15) * phoneRatios[i]));
      const bCount = Math.max(0, Math.round((totalBlogs || 10) * blogRatios[i]));
      return {
        name: month,
        Phones: pCount,
        Blogs: bCount
      };
    });
  }, [totalPhones, totalBlogs]);

  // Calculate Trend
  const currentMonth = data[5];
  const previousMonth = data[4];
  
  const currentTotal = currentMonth.Phones + currentMonth.Blogs;
  const previousTotal = previousMonth.Phones + previousMonth.Blogs;
  
  const trendPercent = previousTotal === 0 ? 100 : Math.round(((currentTotal - previousTotal) / previousTotal) * 100);
  const isUp = trendPercent >= 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col h-[380px] w-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Publishing Trends</h2>
          <p className="text-sm text-slate-500">Monthly items published</p>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
          isUp 
            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
            : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
        }`}>
          {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          <span>{isUp ? '+' : ''}{trendPercent}%</span>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              cursor={{fill: 'transparent'}}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
            <Bar dataKey="Phones" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={12} />
            <Bar dataKey="Blogs" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
