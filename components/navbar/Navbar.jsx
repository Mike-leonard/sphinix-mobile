'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '../../lib/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import UserProfileDropdown from './UserProfileDropdown';

export default function Navbar({ user, searchQuery, setSearchQuery, selectedCategory = "", setSelectedCategory }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Phones', href: '/phones' },
    { name: 'Comparisons', href: '/comparisons' },
    { name: 'Blogs', href: '/blogs' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-900">
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <Link href="/" style={{fontSize: "var(--font-size-link-nav, var(--font-size-link-default))"}} className="relative group cursor-pointer block">
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-brand-500 to-pink-500 opacity-75 blur-sm transition duration-300 group-hover:opacity-100"></div>
            <div className="relative px-4 py-2 bg-slate-50 dark:bg-slate-950 rounded-lg text-slate-900 dark:text-white font-extrabold tracking-wider border border-slate-200 dark:border-slate-800 text-lg">
              SPHINIX <span className="text-brand-400 font-normal">MOBILE</span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <DesktopNav navLinks={navLinks} />

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
              <UserProfileDropdown
                user={user}
                dropdownClasses="right-0 mt-2 slide-in-from-top-2"
              />
            ) : (
              <Link href="/login" style={{fontSize: "var(--font-size-link-nav, var(--font-size-link-default))"}} className="inline-flex items-center justify-center h-10 px-4 py-2 bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 rounded-xl shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all text-white font-medium text-sm border-0">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <MobileNav
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        navLinks={navLinks}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        user={user}
      />
    </header>
  );
}
