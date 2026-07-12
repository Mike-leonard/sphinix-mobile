'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Globe, Type, Palette, BarChart, 
  MonitorPlay, MessageSquare, Languages, 
  Wrench, Share2, Image as ImageIcon, Shield, Sparkles
} from 'lucide-react';

export default function SettingsLayout({ children }) {
  const pathname = usePathname();

  const settingsNav = [
    { name: 'SEO & Metadata', href: '/dashboard/settings/seo-metadata', icon: Globe },
    { name: 'Typography', href: '/dashboard/settings/typography', icon: Type },
    { name: 'Appearance', href: '/dashboard/settings/appearance', icon: Palette },
    { name: 'Analytics', href: '/dashboard/settings/analytics', icon: BarChart },
    { name: 'Advertisements', href: '/dashboard/settings/advertisements', icon: MonitorPlay },
    { name: 'Comments', href: '/dashboard/settings/comments', icon: MessageSquare },
    { name: 'Localization', href: '/dashboard/settings/localization', icon: Languages },
    { name: 'Maintenance', href: '/dashboard/settings/maintenance', icon: Wrench },
    { name: 'Social Media', href: '/dashboard/settings/social-media', icon: Share2 },
    { name: 'Media', href: '/dashboard/settings/media', icon: ImageIcon },
    { name: 'AI Configuration', href: '/dashboard/settings/ai-configuration', icon: Sparkles },
    { name: 'Security', href: '/dashboard/settings/security', icon: Shield },
  ];

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 style={{fontSize: "var(--font-size-h1-dashboard, var(--font-size-h1-default))"}} className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Settings</h1>
          <p style={{fontSize: "var(--font-size-p-default, var(--font-size-p-default))"}} className="text-slate-600 dark:text-slate-400">
            Configure site-wide settings, metadata, and preferences.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Settings Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <nav className="flex flex-col gap-1">
              {settingsNav.map(item => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-sm ${
                      isActive 
                        ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Settings Content Area */}
          <div className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
