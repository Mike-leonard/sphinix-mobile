'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Activity, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react';
import { logoutAction } from '@/actions/auth';
import { Button } from "@/components/ui/button";

export default function UserProfileDropdown({ 
  user, 
  dropdownClasses = "right-0 mt-2 slide-in-from-top-2", 
  buttonClasses = "flex items-center gap-2 h-10 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors",
  showUserDetails = true
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logoutAction();
    setIsOpen(false);
    router.push('/login');
    router.refresh();
  };

  if (!user) return null;

  const isPrivileged = user?.role === 'Admin' || user?.role === 'Moderator' || user?.role === 'ContentWriter';

  return (
    <div className="relative" ref={profileRef}>
      <Button variant="none" size="none" style={{fontSize: "var(--font-size-button-default, var(--font-size-button-default))"}} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle profile menu"
        className={buttonClasses}
      >
        <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm uppercase shrink-0">
          {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
        </div>
        
        {showUserDetails && (
          <>
            <div className="flex flex-col items-start overflow-hidden text-left flex-1">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300 w-full truncate">{user.name || 'User'}</span>
              <span className="text-xs font-medium text-slate-500 w-full truncate">{user.email}</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </Button>

      {isOpen && (
        <div className={`absolute w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg py-1 z-50 animate-in fade-in duration-200 ${dropdownClasses}`}>
          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <User className="w-4 h-4" />
            Profile
          </Link>

          {isPrivileged ? (
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          ) : (
            <Link
              href="/activities"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Activity className="w-4 h-4" />
              Activities
            </Link>
          )}

          <div className="h-px bg-slate-200 dark:bg-slate-800 my-1"></div>
          <Button variant="none" size="none" style={{fontSize: "var(--font-size-button-default, var(--font-size-button-default))"}} 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      )}
    </div>
  );
}
