'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { User, Activity, LayoutDashboard, LogOut } from 'lucide-react';
import { useCompare } from '@/context/CompareContext';
import { Search } from '../Search';
import { logoutAction } from '@/actions/auth';

export default function MobileNav({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  navLinks,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  user
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { compareList, setIsCompareOpen } = useCompare();
  const compareCount = compareList.length;

  const handleLogout = async () => {
    await logoutAction();
    setIsMobileMenuOpen(false);
    router.push('/login');
    router.refresh();
  };

  const isPrivileged = user?.role === 'Admin' || user?.role === 'Moderator' || user?.role === 'ContentWriter';

  return (
    <div
      className={`absolute top-16 inset-x-0 z-50 lg:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-2xl overflow-hidden transition-all duration-500 ease-in-out ${isMobileMenuOpen
          ? 'max-h-[800px] opacity-100 border-b border-t border-slate-200 dark:border-slate-800 pointer-events-auto'
          : 'max-h-0 opacity-0 border-transparent pointer-events-none'
        }`}
    >
      <div className="px-4 py-4 space-y-4">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block font-medium transition-colors hover:text-brand-400 text-dynamic-nav ${pathname === link.href ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}
          >
            {link.name}
          </Link>
        ))}
        <button
          onClick={() => {
            if (compareCount > 0) setIsCompareOpen(true);
            setIsMobileMenuOpen(false);
          }}
          className={`block text-base font-medium w-full text-left transition-colors ${compareCount > 0 ? "text-brand-400 cursor-pointer" : "text-slate-600 dark:text-slate-400 cursor-default"}`}
        >
          Compare {compareCount > 0 && `(${compareCount})`}
        </button>

        {/* Mobile Search */}
        {setSearchQuery && (
          <div className="mb-4">
            <Search
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>
        )}

        <div className="h-px bg-slate-200 dark:bg-slate-800 my-2 block sm:hidden"></div>

        {/* Mobile User/Sign In */}
        <div className="block sm:hidden">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 py-2">
                <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm uppercase">
                  {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</div>
                  <div className="text-xs text-slate-500">{user.email}</div>
                </div>
              </div>

              <div className="space-y-1">
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  <User className="w-5 h-5 text-slate-400" />
                  Profile
                </Link>

                {isPrivileged ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                  >
                    <LayoutDashboard className="w-5 h-5 text-slate-400" />
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/activities"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                  >
                    <Activity className="w-5 h-5 text-slate-400" />
                    Activities
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center justify-center h-10 px-4 py-2 bg-gradient-to-r from-brand-600 to-purple-600 rounded-xl active:scale-[0.98] transition-all text-white font-medium border-0 hover:from-brand-500 hover:to-purple-500">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
