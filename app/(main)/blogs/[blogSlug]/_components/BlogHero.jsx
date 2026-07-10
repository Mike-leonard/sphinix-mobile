import React from 'react';

export default function BlogHero({ blog }) {
  const bgStyle = blog.image ? { backgroundImage: `url(${blog.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};
  const gradientClass = blog.image ? '' : (blog.color || 'from-slate-800 to-slate-900');

  return (
    <div className={`w-full h-64 sm:h-80 relative bg-gradient-to-br ${gradientClass} overflow-hidden`} style={bgStyle}>
      {/* Premium Gradient Overlay for Text Readability */}
      <div className={`absolute inset-0 ${blog.image ? 'bg-gradient-to-t from-black/90 via-black/40 to-black/10' : ''}`} />

      {/* SPHINIX Background Text (Only show if no image) */}
      {!blog.image && (
        <div className="absolute inset-0 flex items-center justify-center font-black text-6xl text-white/10 select-none z-0">SPHINIX</div>
      )}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 z-10">
        {/* Top: Category Badge */}
        <div className="flex justify-start">
          <span className="bg-white/95 dark:bg-black/50 dark:backdrop-blur-md dark:border dark:border-white/10 text-brand-600 dark:text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
            {blog.category}
          </span>
        </div>
        
        {/* Bottom: Title */}
        <div className="w-full max-w-4xl mt-auto">
          <h1 style={{ fontSize: "var(--font-size-h1-blogs, var(--font-size-h1-default))" }} className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.15] drop-shadow-lg">
            {blog.title}
          </h1>
        </div>
      </div>
    </div>
  );
}
