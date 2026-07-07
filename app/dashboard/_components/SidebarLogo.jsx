import React from 'react';
import Link from 'next/link';
import { PanelLeftClose, PanelRightClose } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function SidebarLogo({ isCollapsed, onToggle }) {
  return (
    <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
      {!isCollapsed && (
        <Link href="/" style={{fontSize: "var(--font-size-link-nav, var(--font-size-link-default))"}} className="relative group cursor-pointer block overflow-hidden">
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-brand-500 to-pink-500 opacity-75 blur-sm transition duration-300 group-hover:opacity-100"></div>
          <div className="relative px-3 py-1.5 bg-slate-50 dark:bg-slate-950 rounded-lg text-slate-900 dark:text-white font-extrabold tracking-wider border border-slate-200 dark:border-slate-800 text-sm whitespace-nowrap">
            SPHINIX <span className="text-brand-400 font-normal">MOBILE</span>
          </div>
        </Link>
      )}

      {/* Toggle Button */}
      <Button variant="none" size="none" style={{fontSize: "var(--font-size-button-sidebar, var(--font-size-button-default))"}} 
        onClick={onToggle}
        className={`p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors ${isCollapsed ? 'mx-auto' : ''}`}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <PanelRightClose className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
      </Button>
    </div>
  );
}
