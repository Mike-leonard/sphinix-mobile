import React from 'react';

export default function InFeedAd() {
  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group">
      
      {/* Required Ad Compliance Label */}
      <div className="absolute top-0 right-0 bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[9px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
        Advertisement
      </div>

      {/* Ad Image Placeholder */}
      <div className="w-full md:w-48 h-32 bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800"></div>
        <span className="text-slate-400 dark:text-slate-500 text-sm font-bold z-10 relative">Ad Space</span>
      </div>

      {/* Ad Content Placeholder */}
      <div className="flex-1 space-y-2 text-center md:text-left">
        <h4 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-brand-500 transition-colors">
          Experience the Future of Mobile
        </h4>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
          Discover the latest deals on flagship devices and exclusive carrier offers. Upgrade today and save up to $500 on trade-ins.
        </p>
        
        {/* Ad Call to Action */}
        <div className="pt-2">
          <a href="#" className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold transition-colors">
            Learn More
          </a>
        </div>
      </div>

    </div>
  );
}
