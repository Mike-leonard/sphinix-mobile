import React from 'react';
import { Button } from "@/components/ui/button";

export default function TabNavigation({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => (
        <Button variant="none" size="none" style={{fontSize: "var(--font-size-button-sidebar, var(--font-size-button-default))"}} 
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-6 py-3 font-semibold text-sm transition-colors whitespace-nowrap rounded-t-lg ${
            activeTab === tab
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-t border-l border-r border-slate-200 dark:border-slate-800 -mb-[1px]'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white border-b border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
        >
          {tab}
        </Button>
      ))}
    </div>
  );
}
