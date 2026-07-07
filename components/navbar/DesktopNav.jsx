'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCompare } from '@/context/CompareContext';
import { Button } from "@/components/ui/button";

export default function DesktopNav({ navLinks }) {
  const pathname = usePathname();
  const { compareList, setIsCompareOpen } = useCompare();
  const compareCount = compareList.length;

  return (
    <nav className="hidden lg:flex items-center gap-8 font-medium text-sm text-slate-600 dark:text-slate-400">
      {navLinks.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={`transition-colors hover:text-brand-400 text-dynamic-nav ${pathname === link.href ? 'text-slate-900 dark:text-white font-semibold' : ''}`}
        >
          {link.name}
        </Link>
      ))}
      {/* Compare button with tooltip */}
      <div className="relative group">
        <Button variant="none" size="none" style={{fontSize: "var(--font-size-button-sidebar, var(--font-size-button-default))"}} 
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
        </Button>

        {compareCount === 0 && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-slate-800 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            Select items to compare
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-800" />
          </div>
        )}
      </div>
    </nav>
  );
}
