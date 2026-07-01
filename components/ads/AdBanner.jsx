import React from 'react';

export default function AdBanner({ type = 'horizontal', className = '' }) {
  const isHorizontal = type === 'horizontal';
  
  // Base classes for the ad container
  const containerClasses = `
    relative overflow-hidden flex items-center justify-center 
    bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 
    rounded-xl text-slate-400 dark:text-slate-600 font-medium text-sm
    ${isHorizontal ? 'w-full min-h-[100px] sm:min-h-[120px]' : 'w-full min-h-[250px] sm:min-h-[300px] lg:min-h-[400px]'}
    ${className}
  `;

  return (
    <div className={containerClasses}>
      {/* Decorative background pattern to look like a premium placeholder */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
      
      {/* Ad Label */}
      <div className="relative flex flex-col items-center gap-2">
        <span className="text-xs tracking-widest uppercase opacity-50">Advertisement</span>
        <span className="text-center px-4">
          {isHorizontal ? '728 x 90 (Leaderboard)' : '300 x 600 (Half Page)'}
        </span>
        
        {/* Placeholder for future AdSense code */}
        {/* 
          <ins className="adsbygoogle"
               style={{ display: 'block' }}
               data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
               data-ad-slot="XXXXXXXXXX"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        */}
      </div>
    </div>
  );
}
