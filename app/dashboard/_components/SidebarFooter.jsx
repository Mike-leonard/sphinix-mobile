'use client';

import React from 'react';
import { ThemeToggle } from '@/lib/ThemeToggle';
import UserProfileDropdown from '@/components/navbar/UserProfileDropdown';

export default function SidebarFooter({ isCollapsed, user }) {
  return (
    <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-4">
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-2'}`}>
        {!isCollapsed && <span className="text-sm font-medium text-slate-500">Appearance</span>}
        <ThemeToggle />
      </div>

      {user && (
        <UserProfileDropdown
          user={user}
          dropdownClasses={`bottom-full mb-2 ${isCollapsed ? 'left-0 ml-2' : 'left-0'}`}
          buttonClasses={`flex items-center gap-3 h-12 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors w-full ${isCollapsed ? 'justify-center px-0' : 'px-3'}`}
          showUserDetails={!isCollapsed}
        />
      )}
    </div>
  );
}
