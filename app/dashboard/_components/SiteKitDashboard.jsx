'use client';

import React, { useState } from 'react';
import SiteKitSearchTrafficChart from './SiteKitSearchTrafficChart';
import SiteKitVisitorsChart from './SiteKitVisitorsChart';
import SiteKitTopQueriesTable from './SiteKitTopQueriesTable';
import SiteKitTopContentTable from './SiteKitTopContentTable';
import { LineChart, Users, MousePointerClick, FileText } from 'lucide-react';

export default function SiteKitDashboard({ data }) {
  const [activeTab, setActiveTab] = useState('search_traffic');

  const tabs = [
    { id: 'search_traffic', label: 'Search Traffic', icon: MousePointerClick },
    { id: 'visitors', label: 'All Visitors', icon: Users },
    { id: 'content', label: 'Top Content', icon: FileText },
    { id: 'queries', label: 'Top Queries', icon: SearchIcon }, // Wait, Search is not imported, let's just use SearchIcon from lucide-react. I'll import Search as SearchIcon
  ];

  return (
    <div className="flex flex-col mb-8">
      {/* Custom Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                isActive 
                  ? 'border-[#1a73e8] text-[#1a73e8] dark:border-blue-400 dark:text-blue-400' 
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/50'
              } rounded-t-lg`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#1a73e8] dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'search_traffic' && <SiteKitSearchTrafficChart data={data} />}
        {activeTab === 'visitors' && <SiteKitVisitorsChart data={data} />}
        {activeTab === 'content' && <SiteKitTopContentTable data={data} />}
        {activeTab === 'queries' && <SiteKitTopQueriesTable data={data} />}
      </div>
    </div>
  );
}

// Inline import for Search to avoid conflicting with lucide's Search
import { Search as SearchIcon } from 'lucide-react';
