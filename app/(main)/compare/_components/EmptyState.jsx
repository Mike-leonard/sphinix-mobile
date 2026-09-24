'use client';

import React, { useEffect, useState } from 'react';
import { Smartphone } from 'lucide-react';
import Link from 'next/link';
import { useCompare } from '@/context/CompareContext';
import { useRouter } from 'next/navigation';
import CompareLoading from '../loading';
import { buildComparisonSlug } from '@/lib/devices/comparison-helpers';

export default function EmptyState() {
  const { compareList } = useCompare();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (compareList && compareList.length > 0) {
      setIsRedirecting(true);
      const slug = buildComparisonSlug(compareList.map(item => item.id));
      if (slug) {
        router.replace(`/compare/${slug}`);
      }
    }
  }, [compareList, router]);

  if (isRedirecting || (compareList && compareList.length > 0)) {
    return <CompareLoading />;
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 px-4">
      <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-full mb-6">
        <Smartphone className="w-12 h-12 text-slate-400" />
      </div>
      <h2 style={{fontSize: "var(--font-size-h1-comparisons, var(--font-size-h1-default))"}} className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Compare Smartphones Side-by-Side</h2>
      <p style={{fontSize: "var(--font-size-p-form, var(--font-size-p-default))"}} className="text-slate-500 dark:text-slate-400 text-center mb-6 max-w-md">
        Select smartphones from our database to compare displays, processors, cameras, battery life, and prices side-by-side.
      </p>
      <Link 
        href="/phones" style={{fontSize: "var(--font-size-link-inline, var(--font-size-link-default))"}} className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-2.5 px-6 rounded-md transition-colors shadow-lg cursor-pointer"
      >
        Browse Devices
      </Link>
    </div>
  );
}
