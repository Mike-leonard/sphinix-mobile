'use client';

import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';

export default function PublishTrendsChart({ devices = [], blogs = [], totalPhones = 0, totalBlogs = 0 }) {
  const [timeframe, setTimeframe] = useState('last6'); // 'last6', 'last12', 'thisYear', 'byYear'

  const chartData = useMemo(() => {
    const now = new Date();
    const publishedDevices = (devices || []).filter(d => (d.status || '').toLowerCase() === 'published');
    const publishedBlogs = (blogs || []).filter(b => (b.status || '').toLowerCase() === 'published');

    if (timeframe === 'byYear') {
      // Group by year
      const yearMap = {};
      const allItems = [...publishedDevices, ...publishedBlogs];
      
      let minYear = now.getFullYear();
      let maxYear = now.getFullYear();
      
      allItems.forEach(item => {
        if (item.createdAt) {
          const y = new Date(item.createdAt).getFullYear();
          if (!isNaN(y)) {
            minYear = Math.min(minYear, y);
            maxYear = Math.max(maxYear, y);
          }
        }
      });

      for (let y = minYear; y <= maxYear; y++) {
        yearMap[y] = { name: `${y}`, Phones: 0, Blogs: 0 };
      }

      publishedDevices.forEach(d => {
        if (d.createdAt) {
          const y = new Date(d.createdAt).getFullYear();
          if (yearMap[y]) yearMap[y].Phones += 1;
        }
      });

      publishedBlogs.forEach(b => {
        if (b.createdAt) {
          const y = new Date(b.createdAt).getFullYear();
          if (yearMap[y]) yearMap[y].Blogs += 1;
        }
      });

      return Object.values(yearMap);
    }

    // Monthly views: 'last6', 'last12', 'thisYear'
    let numMonths = 6;
    if (timeframe === 'last12') numMonths = 12;

    const months = [];
    if (timeframe === 'thisYear') {
      const year = now.getFullYear();
      for (let m = 0; m < 12; m++) {
        const d = new Date(year, m, 1);
        months.push({
          key: `${year}-${String(m + 1).padStart(2, '0')}`,
          label: d.toLocaleString('en-US', { month: 'short' }),
          year: year,
          month: m
        });
      }
    } else {
      // Trailing numMonths ending with the current month
      for (let i = numMonths - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
          key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
          label: d.toLocaleString('en-US', { month: 'short' }) + (numMonths > 6 ? ` '${String(d.getFullYear()).slice(-2)}` : ''),
          year: d.getFullYear(),
          month: d.getMonth()
        });
      }
    }

    // Aggregate publication counts per month
    return months.map(m => {
      const pCount = publishedDevices.filter(d => {
        if (!d.createdAt) return false;
        const dt = new Date(d.createdAt);
        return dt.getFullYear() === m.year && dt.getMonth() === m.month;
      }).length;

      const bCount = publishedBlogs.filter(b => {
        if (!b.createdAt) return false;
        const dt = new Date(b.createdAt);
        return dt.getFullYear() === m.year && dt.getMonth() === m.month;
      }).length;

      return {
        name: m.label,
        Phones: pCount,
        Blogs: bCount
      };
    });
  }, [devices, blogs, timeframe]);

  // Calculate trend comparison (current vs previous period)
  const currentItem = chartData[chartData.length - 1] || { Phones: 0, Blogs: 0 };
  const previousItem = chartData[chartData.length - 2] || { Phones: 0, Blogs: 0 };
  const currentTotal = currentItem.Phones + currentItem.Blogs;
  const previousTotal = previousItem.Phones + previousItem.Blogs;
  const trendPercent = previousTotal === 0 ? (currentTotal > 0 ? 100 : 0) : Math.round(((currentTotal - previousTotal) / previousTotal) * 100);
  const isUp = trendPercent >= 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col h-[390px] w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            Publishing Trends
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">Dynamic published items by timeframe</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Timeframe Filter Dropdown */}
          <div className="relative flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="bg-transparent text-slate-800 dark:text-white font-medium outline-none cursor-pointer pr-1"
            >
              <option value="last6" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Last 6 Months</option>
              <option value="last12" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Last 12 Months</option>
              <option value="thisYear" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">This Year ({new Date().getFullYear()})</option>
              <option value="byYear" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">By Year</option>
            </select>
          </div>

          {/* MoM Trend Badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
            isUp 
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
              : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
          }`}>
            {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{isUp ? '+' : ''}{trendPercent}%</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} allowDecimals={false} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              cursor={{fill: 'transparent'}}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
            <Bar dataKey="Phones" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={14} />
            <Bar dataKey="Blogs" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={14} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
