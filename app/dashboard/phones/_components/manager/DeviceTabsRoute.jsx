'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DeviceTabsRoute() {
  const pathname = usePathname();

  const tabs = [
    { name: 'Devices', href: '/dashboard/phones' },
    { name: 'Brands', href: '/dashboard/phones/brands' },
    { name: 'Groups', href: '/dashboard/phones/groups' },
    { name: 'Attributes', href: '/dashboard/phones/attributes' },
    { name: 'Filters', href: '/dashboard/phones/filters' },
    { name: 'Rating Bars', href: '/dashboard/phones/rating-bars' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 dark:border-slate-800 mb-6 px-2 sm:px-0">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`px-5 py-2.5 text-sm font-semibold rounded-t-xl transition-all ${
              isActive
                ? 'bg-white dark:bg-slate-900 border-x border-t border-slate-200 dark:border-slate-800 text-brand-600 dark:text-brand-400 relative top-[1px]'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 border-x border-t border-transparent'
            }`}
          >
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
}
