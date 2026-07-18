'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as LineTooltip, ResponsiveContainer, PieChart, Pie, Cell, Tooltip as PieTooltip, Legend } from 'recharts';
import { TrendingDown } from 'lucide-react';

export default function SiteKitVisitorsChart({ data }) {
  const { activeUsers, visitorsChartData, channelsData } = data;

  return (
    <div className="flex flex-col">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-slate-800 dark:text-white">All Visitors</h3>
          <div className="text-5xl font-normal text-slate-800 dark:text-white mt-4 mb-2">{activeUsers}</div>
          <div className="flex items-center gap-1 text-sm text-rose-600 font-medium">
            <TrendingDown className="w-4 h-4" /> 31.8% <span className="text-slate-500 font-normal ml-1">compared to the previous 28 days</span>
          </div>
        </div>
        
        {/* Mock Tabs */}
        <div className="hidden lg:flex items-center gap-6 text-sm">
          <div className="text-[#1a73e8] font-medium border-b-2 border-[#1a73e8] pb-1">Channels</div>
          <div className="text-slate-500 pb-1 cursor-pointer hover:text-slate-700">Locations</div>
          <div className="text-slate-500 pb-1 cursor-pointer hover:text-slate-700">Devices</div>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row p-6">
        {/* Line Chart (Left) */}
        <div className="flex-1 lg:border-r border-slate-100 dark:border-slate-800 lg:pr-6 mb-8 lg:mb-0 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={visitorsChartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
              <XAxis dataKey="date" hide={true} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <LineTooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line type="monotone" dataKey="visitors" stroke="#1e8e3e" strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart (Right) */}
        <div className="flex-1 lg:pl-6 flex flex-col items-center justify-center h-[300px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={channelsData}
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {channelsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <PieTooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => `${value}%`}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
             <span className="text-xs text-slate-500">By</span>
             <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Channels</span>
          </div>
          
          {/* Custom Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-4 w-full px-4">
            {channelsData.map((entry, index) => (
              <div key={index} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
