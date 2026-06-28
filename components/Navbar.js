import React from 'react';

export default function Navbar({ compareCount, onOpenCompare }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/80 border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-brand-500 to-pink-500 opacity-75 blur-sm transition duration-300 group-hover:opacity-100"></div>
            <div className="relative px-4 py-2 bg-slate-950 rounded-lg text-white font-extrabold tracking-wider border border-slate-800 text-lg">
              SPHINIX <span className="text-brand-400 font-normal">MOBILE</span>
            </div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-400">
          <a href="#" className="text-white hover:text-brand-400 transition-colors">Home</a>
          <a href="#" className="hover:text-brand-400 transition-colors">All Products</a>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              if (compareCount > 0) onOpenCompare();
            }} 
            className={`relative transition-colors ${compareCount > 0 ? "text-brand-400 font-semibold" : "hover:text-brand-400"}`}
          >
            Compare
            {compareCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-brand-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {compareCount}
              </span>
            )}
          </a>
          <a href="#" className="hover:text-brand-400 transition-colors">Comparisons</a>
          <a href="#" className="hover:text-brand-400 transition-colors">Blog</a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          <button className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 rounded-xl shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all">
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
}
