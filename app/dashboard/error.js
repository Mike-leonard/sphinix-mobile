'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertOctagon, RefreshCw, LayoutDashboard } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function DashboardError({ error, reset }) {
  useEffect(() => {
    console.error("Dashboard Error:", error);
  }, [error]);

  return (
    <div className="p-8 min-h-[60vh] flex flex-col items-center justify-center text-center animate-in fade-in duration-200">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
          <AlertOctagon className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Dashboard Error</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Failed to load dashboard data. This might be due to a temporary network issue or configuration error.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onClick={() => reset()}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl py-3 font-semibold gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Reload View
          </Button>

          <Link href="/dashboard" className="flex-1">
            <Button
              variant="outline"
              className="w-full border-slate-200 dark:border-slate-800 rounded-xl py-3 font-semibold gap-2 cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard Overview
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
