'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search } from './Search';
import { ThemeToggle } from '../lib/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export default function Navbar({ compareCount, onOpenCompare, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Devices', href: '/devices' },
    { name: 'Comparisons', href: '/comparisons' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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
          <button 
            onClick={() => {
              if (compareCount > 0) onOpenCompare();
            }} 
            className={`relative transition-colors ${compareCount > 0 ? "text-brand-400 font-semibold" : "hover:text-brand-400"}`}
          >
            Compare
            {compareCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-brand-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {compareCount}
              </span>
            )}
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <Button 
            variant="outline"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
          <Button className="hidden sm:inline-flex bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 rounded-xl shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all text-white border-0">
            Sign In
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 inset-x-0 z-50 lg:hidden border-b border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-4 py-4 space-y-4 shadow-2xl">
          
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
            onClick={() => {
              setIsMobileMenuOpen(false);
              if (compareCount > 0) onOpenCompare();
            }} 
            className={`block text-base font-medium w-full text-left transition-colors ${compareCount > 0 ? "text-brand-400" : "text-slate-600 dark:text-slate-400 hover:text-brand-400"}`}
          >
            Compare {compareCount > 0 && `(${compareCount})`}
          </button>
          {/* Mobile Search */}
          <div className="mb-4">
            <Search 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>
          <Button className="w-full mt-4 flex sm:hidden bg-gradient-to-r from-brand-600 to-purple-600 rounded-xl active:scale-[0.98] transition-all text-white border-0 hover:from-brand-500 hover:to-purple-500">
            Sign In
          </Button>
        </div>
      )}
    </header>
  );
}
