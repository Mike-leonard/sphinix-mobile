import React from 'react';
import Link from 'next/link';
import { Search, Home, Smartphone, Newspaper, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      <div className="max-w-2xl w-full text-center space-y-8">
        
        {/* Glowing 404 Badge */}
        <div className="relative inline-block">
          <div className="text-8xl sm:text-9xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-indigo-500 to-teal-400 select-none">
            404
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold uppercase tracking-widest shadow-lg">
            Page Not Found
          </div>
        </div>

        {/* Description Text */}
        <div className="space-y-3 max-w-md mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Lost in the Mobile Ecosystem?
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            The phone specifications, blog article, or page you were looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* Quick Search Form */}
        <form action="/phones" method="GET" className="max-w-md mx-auto relative flex items-center">
          <Search className="w-5 h-5 absolute left-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            name="q"
            placeholder="Search smartphones, specs, or blogs..."
            className="w-full pl-11 pr-24 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Main Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm hover:opacity-90 transition-opacity shadow-sm"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>

          <Link
            href="/phones"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors shadow-sm"
          >
            <Smartphone className="w-4 h-4 text-brand-500" />
            Explore Phones
          </Link>

          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors shadow-sm"
          >
            <Newspaper className="w-4 h-4 text-teal-500" />
            Read Articles
          </Link>
        </div>

        {/* Quick Popular Brand Pills */}
        <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60 max-w-lg mx-auto">
          <span className="text-xs text-slate-500 dark:text-slate-500 font-medium block mb-3">
            Popular Brands:
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {['Apple', 'Samsung', 'Xiaomi', 'OnePlus', 'Google'].map((brand) => (
              <Link
                key={brand}
                href={`/phones?brand=${brand}`}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-200/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-500/20 dark:hover:text-brand-400 transition-colors"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
