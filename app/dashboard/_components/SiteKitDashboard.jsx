'use client';

import React, { useState } from 'react';
import SiteKitSearchTrafficChart from './SiteKitSearchTrafficChart';
import SiteKitVisitorsChart from './SiteKitVisitorsChart';
import SiteKitTopQueriesTable from './SiteKitTopQueriesTable';
import SiteKitTopContentTable from './SiteKitTopContentTable';
import { Users, MousePointerClick, FileText, Search as SearchIcon, Eye, BarChart3 } from 'lucide-react';

export default function SiteKitDashboard({ data }) {
  const [activeTab, setActiveTab] = useState('visitors');

  const activeUsers = data?.activeUsers ?? 503;
  const pageViews = data?.pageViews ?? 1842;
  const impressions = data?.impressions ?? 1420;
  const clicks = data?.clicks ?? 86;

  const tabs = [
    { id: 'visitors', label: 'Google Analytics (All Visitors)', icon: Users },
    { id: 'search_traffic', label: 'Search Console Traffic', icon: MousePointerClick },
    { id: 'content', label: 'Top Smartphone & Blog Pages', icon: FileText },
    { id: 'queries', label: 'Top Search Queries', icon: SearchIcon },
  ];

  return (
    <div className="flex flex-col mb-8 space-y-6">
      
      {/* Top Google Analytics & Search Console Overview Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">GA4 Active Users</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">{activeUsers.toLocaleString()}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">GA4 Page Views</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">{pageViews.toLocaleString()}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Search Impressions</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">{impressions.toLocaleString()}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <MousePointerClick className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Search Clicks</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">{clicks.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Custom Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                isActive 
                  ? 'border-[#1a73e8] text-[#1a73e8] dark:border-blue-400 dark:text-blue-400 font-bold' 
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
        {activeTab === 'visitors' && <SiteKitVisitorsChart data={data} />}
        {activeTab === 'search_traffic' && <SiteKitSearchTrafficChart data={data} />}
        {activeTab === 'content' && <SiteKitTopContentTable data={data} />}
        {activeTab === 'queries' && <SiteKitTopQueriesTable data={data} />}
      </div>
    </div>
  );
}
