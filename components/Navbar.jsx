'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search } from './Search';
import { ThemeToggle } from '../lib/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Menu, X, User, Activity, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react';
import { useCompare } from '@/context/CompareContext';
import { logoutAction } from '@/actions/auth';

export default function Navbar({ user, searchQuery: externalSearchQuery, setSearchQuery: externalSetSearchQuery, selectedCategory = "", setSelectedCategory }) {
  const { compareList, setIsCompareOpen } = useCompare();
  const compareCount = compareList.length;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const profileRef = useRef(null);

  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : localSearchQuery;
  const setSearchQuery = externalSetSearchQuery !== undefined ? externalSetSearchQuery : setLocalSearchQuery;

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileRef]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Devices', href: '/devices' },
    { name: 'Comparisons', href: '/comparisons' },
    { name: 'Blogs', href: '/blogs' },
  ];

  const handleLogout = async () => {
    await logoutAction();
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    router.push('/login');
    router.refresh();
  };

  const isPrivileged = user?.role === 'Admin' || user?.role === 'Moderator' || user?.role === 'ContentWriter';

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-900">
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <Link href="/" className="relative group cursor-pointer block">
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-brand-500 to-pink-500 opacity-75 blur-sm transition duration-300 group-hover:opacity-100"></div>
            <div className="relative px-4 py-2 bg-slate-50 dark:bg-slate-950 rounded-lg text-slate-900 dark:text-white font-extrabold tracking-wider border border-slate-200 dark:border-slate-800 text-lg">
              SPHINIX <span className="text-brand-400 font-normal">MOBILE</span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8 font-medium text-sm text-slate-600 dark:text-slate-400">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`transition-colors hover:text-brand-400 ${pathname === link.href ? 'text-slate-900 dark:text-white font-semibold' : ''}`}
            >
              {link.name}
            </Link>
          ))}
          {/* Compare button with tooltip */}
          <div className="relative group">
            <button
              onClick={() => compareCount > 0 && setIsCompareOpen(true)}
              className={`relative transition-colors ${compareCount > 0
                ? "text-brand-400 font-semibold cursor-pointer hover:text-brand-500"
                : "text-slate-600 dark:text-slate-400 cursor-default"
                }`}
            >
              Compare
              {compareCount > 0 && (
                <span className="absolute -top-2 -right-4 bg-brand-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {compareCount}
                </span>
              )}
            </button>

            {compareCount === 0 && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-slate-800 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                Select items to compare
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-800" />
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden relative"
            aria-label="Toggle menu"
          >
            <Menu className={`w-5 h-5 absolute transition-all duration-500 ${isMobileMenuOpen ? 'scale-0 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'}`} />
            <X className={`w-5 h-5 absolute transition-all duration-500 ${isMobileMenuOpen ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-90 opacity-0'}`} />
          </Button>

          {/* Desktop User/Sign In */}
          <div className="hidden sm:block">
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  aria-label="Toggle profile menu"
                  className="flex items-center gap-2 h-10 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs uppercase">
                    {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[100px] truncate">{user.name || user.email}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    
                    {isPrivileged ? (
                      <Link
                        href="/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                    ) : (
                      <Link
                        href="/activities"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <Activity className="w-4 h-4" />
                        Activities
                      </Link>
                    )}
                    
                    <div className="h-px bg-slate-200 dark:bg-slate-800 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="inline-flex items-center justify-center h-10 px-4 py-2 bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 rounded-xl shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all text-white font-medium text-sm border-0">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
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
              className={`block text-base font-medium transition-colors hover:text-brand-400 ${pathname === link.href ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={() => compareCount > 0 && setIsCompareOpen(true)}
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
    </header>
  );
}
