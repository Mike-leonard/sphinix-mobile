'use client';

import React, { useState } from 'react';
import SidebarLogo from './_components/SidebarLogo';
import SidebarNav from './_components/SidebarNav';
import SidebarFooter from './_components/SidebarFooter';

export default function DashboardSidebar({ user }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 min-h-screen shrink-0 flex flex-col transition-all duration-300 z-40 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <SidebarLogo 
        isCollapsed={isCollapsed} 
        onToggle={() => setIsCollapsed(!isCollapsed)} 
      />
      <SidebarNav isCollapsed={isCollapsed} />
      <SidebarFooter isCollapsed={isCollapsed} user={user} />
    </div>
  );
}
