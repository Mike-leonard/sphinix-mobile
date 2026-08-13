'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Globe, Type, Palette, BarChart, 
  MonitorPlay, MessageSquare, Languages, 
  Wrench, Share2, Image as ImageIcon, Shield, Sparkles, Mail
} from 'lucide-react';

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
  { name: 'SMTP & Email', href: '/dashboard/settings/smtp-email', icon: Mail },
];

export default function SettingsNavList() {
  const pathname = usePathname();

  return (
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
  );
}
