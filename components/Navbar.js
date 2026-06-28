'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar({ compareCount, onOpenCompare }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'All Products', href: '/products' },
    { name: 'Comparisons', href: '/comparisons' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/80 border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <Link href="/" className="relative group cursor-pointer block">
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-brand-500 to-pink-500 opacity-75 blur-sm transition duration-300 group-hover:opacity-100"></div>
            <div className="relative px-4 py-2 bg-slate-950 rounded-lg text-white font-extrabold tracking-wider border border-slate-800 text-lg">
              SPHINIX <span className="text-brand-400 font-normal">MOBILE</span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-400">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className={`transition-colors hover:text-brand-400 ${pathname === link.href ? 'text-white font-semibold' : ''}`}
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
          <div className="hidden lg:block relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Search..." 
              className="block w-full sm:w-48 bg-slate-900/50 border border-slate-800 rounded-full py-1.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none focus:bg-slate-900 transition-all"
            />
          </div>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
          <button className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 rounded-xl shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all">
            Sign In
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-4 space-y-4 shadow-xl">
          {/* Mobile Search */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Search products..." 
              className="block w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-base text-white placeholder-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all"
            />
          </div>

          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block text-base font-medium transition-colors hover:text-brand-400 ${pathname === link.href ? 'text-white' : 'text-slate-400'}`}
            >
              {link.name}
            </Link>
          ))}
          <button 
            onClick={() => {
              setIsMobileMenuOpen(false);
              if (compareCount > 0) onOpenCompare();
            }} 
            className={`block text-base font-medium w-full text-left transition-colors ${compareCount > 0 ? "text-brand-400" : "text-slate-400 hover:text-brand-400"}`}
          >
            Compare {compareCount > 0 && `(${compareCount})`}
          </button>
          
          <button className="w-full mt-4 flex items-center justify-center px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-purple-600 rounded-xl active:scale-[0.98] transition-all">
            Sign In
          </button>
        </div>
      )}
    </header>
  );
}
