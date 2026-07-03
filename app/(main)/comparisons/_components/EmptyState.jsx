import React from 'react';
import { Smartphone } from 'lucide-react';
import Link from 'next/link';

export default function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 px-4">
      <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-full mb-6">
        <Smartphone className="w-12 h-12 text-slate-400" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No devices selected</h1>
      <p className="text-slate-500 dark:text-slate-400 text-center mb-6 max-w-md">
        You haven't added any devices to compare yet. Browse our selection and click "Compare" to see them side-by-side.
      </p>
      <Link 
        href="/devices" 
        className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-2.5 px-6 rounded-md transition-colors shadow-lg"
      >
        Browse Devices
      </Link>
    </div>
  );
}
