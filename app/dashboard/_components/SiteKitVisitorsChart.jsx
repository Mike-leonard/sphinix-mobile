'use client';

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as LineTooltip, ResponsiveContainer, PieChart, Pie, Cell, Tooltip as PieTooltip } from 'recharts';
import { TrendingDown } from 'lucide-react';

export default function SiteKitVisitorsChart({ data }) {
  const [dimension, setDimension] = useState('channels'); // 'channels' | 'locations' | 'devices'

  const activeUsers = data?.activeUsers ?? 0;
  const visitorsChartData = Array.isArray(data?.visitorsChartData) ? data.visitorsChartData : [];
  
  const channelsData = Array.isArray(data?.channelsData) ? data.channelsData : [
    { name: 'Organic Search', value: 65, color: '#1a73e8' },
    { name: 'Direct', value: 20, color: '#188038' },
    { name: 'Referral', value: 10, color: '#f9ab00' },
    { name: 'Social', value: 5, color: '#e37400' }
  ];

  const locationsData = Array.isArray(data?.locationsData) ? data.locationsData : [
    { name: 'United States', value: 45, color: '#1a73e8' },
    { name: 'India', value: 22, color: '#188038' },
    { name: 'United Kingdom', value: 15, color: '#f9ab00' },
    { name: 'Germany', value: 10, color: '#ea4335' },
    { name: 'Others', value: 8, color: '#a855f7' }
  ];

  const devicesData = Array.isArray(data?.devicesData) ? data.devicesData : [
    { name: 'Mobile', value: 68, color: '#1a73e8' },
    { name: 'Desktop', value: 27, color: '#188038' },
    { name: 'Tablet', value: 5, color: '#f9ab00' }
  ];

  let currentPieData = channelsData;
  let currentLabel = 'Channels';
  if (dimension === 'locations') {
    currentPieData = locationsData;
    currentLabel = 'Locations';
  } else if (dimension === 'devices') {
    currentPieData = devicesData;
    currentLabel = 'Devices';
  }

  return (
    <div className="flex flex-col">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium text-slate-800 dark:text-white">All Visitors</h3>
          <div className="text-5xl font-normal text-slate-800 dark:text-white mt-4 mb-2">{activeUsers}</div>
          <div className="flex items-center gap-1 text-sm text-rose-600 font-medium">
            <TrendingDown className="w-4 h-4" /> 31.8% <span className="text-slate-500 font-normal ml-1">compared to the previous 28 days</span>
          </div>
        </div>
        
        {/* Interactive Dimension Tabs */}
        <div className="flex items-center gap-6 text-sm">
          <button 
            type="button"
            onClick={() => setDimension('channels')}
            className={`pb-1 font-medium transition-colors cursor-pointer ${
              dimension === 'channels'
                ? 'text-[#1a73e8] border-b-2 border-[#1a73e8] dark:text-blue-400 dark:border-blue-400'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Channels
          </button>

          <button 
            type="button"
            onClick={() => setDimension('locations')}
            className={`pb-1 font-medium transition-colors cursor-pointer ${
              dimension === 'locations'
                ? 'text-[#1a73e8] border-b-2 border-[#1a73e8] dark:text-blue-400 dark:border-blue-400'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Locations
          </button>

          <button 
            type="button"
            onClick={() => setDimension('devices')}
            className={`pb-1 font-medium transition-colors cursor-pointer ${
              dimension === 'devices'
                ? 'text-[#1a73e8] border-b-2 border-[#1a73e8] dark:text-blue-400 dark:border-blue-400'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Devices
          </button>
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
                data={currentPieData}
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {currentPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || '#1a73e8'} />
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
             <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{currentLabel}</span>
          </div>
          
          {/* Custom Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-4 w-full px-4">
            {currentPieData.map((entry, index) => (
              <div key={index} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color || '#1a73e8' }}></div>
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
