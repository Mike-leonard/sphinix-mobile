import React from 'react';

export default function BlogHero({ blog }) {
  return (
    <div className={`w-full h-64 sm:h-80 relative bg-gradient-to-br ${blog.color}`}>
      <div className="absolute inset-0 flex items-center justify-center font-black text-6xl text-white/10 select-none">SPHINIX</div>
      <div className="absolute bottom-6 left-6 right-6">
        <span className="bg-white/90 dark:bg-slate-900/90 text-brand-400 text-[10px] font-bold px-3 py-1 rounded border border-slate-200 dark:border-slate-800 uppercase tracking-widest inline-block mb-4 shadow-sm">
          {blog.category}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight drop-shadow-md">
          {blog.title}
        </h1>
      </div>
    </div>
  );
}
