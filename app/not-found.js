import React from 'react';
import Link from 'next/link';
import { Search, Home, Smartphone, Newspaper } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200 relative overflow-hidden">
      
      {/* Background Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/15 dark:bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-2xl w-full text-center space-y-8 relative z-10">
        
        {/* Top Category Tag + 404 Header */}
        <div className="space-y-3 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 text-brand-600 dark:text-brand-400 text-xs font-extrabold uppercase tracking-widest">
            <span>404</span>
            <span className="opacity-40">•</span>
            <span>Page Not Found</span>
          </div>

          <h1 className="text-7xl sm:text-8xl font-black tracking-tight text-slate-900 dark:text-white select-none pt-2">
            40<span className="text-brand-500 dark:text-brand-400">4</span>
          </h1>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-lg">
            Lost in the Mobile Ecosystem?
          </h2>
          
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            The smartphone specifications, tech article, or page you were looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* Quick Search Form */}
        <div className="max-w-md mx-auto">
          <form action="/phones" method="GET" className="relative flex items-center">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-slate-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </div>

            <input
              type="text"
              name="q"
              placeholder="Search phones, specs, or blogs..."
              className="w-full pl-11 pr-28 py-3.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            />

            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-95 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs sm:text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>

          <Link
            href="/phones"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors shadow-sm"
          >
            <Smartphone className="w-4 h-4 text-brand-500" />
            Explore Phones
          </Link>

          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors shadow-sm"
          >
            <Newspaper className="w-4 h-4 text-teal-500" />
            Read Articles
          </Link>
        </div>

        {/* Popular Brand Pills */}
        <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60 max-w-lg mx-auto">
          <span className="text-xs text-slate-500 dark:text-slate-500 font-medium block mb-3">
            Or browse by popular brand:
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {['Apple', 'Samsung', 'Xiaomi', 'OnePlus', 'Google'].map((brand) => (
              <Link
                key={brand}
                href={`/phones?brand=${brand}`}
                className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-medium hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-500/20 dark:hover:text-brand-400 border border-slate-200/60 dark:border-slate-700/60 transition-colors"
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
