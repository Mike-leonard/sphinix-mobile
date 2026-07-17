'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { useSettings } from '@/context/SettingsContext';

export default function AdBanner({ type = 'horizontal', placement = '', className = '' }) {
  const settings = useSettings();
  const pathname = usePathname();
  const adSettings = settings?.advertisements;

  // Don't show ads in the admin dashboard (e.g., during preview)
  if (pathname && pathname.includes('/dashboard')) return null;

  // Check if ads are enabled and if this placement is enabled
  if (!adSettings?.enableAds) return null;
  if (placement && adSettings?.placements?.[placement] === false) return null;

  const activeNetwork = adSettings?.network || 'Google AdSense';
  const networkDisplay = {
    google_adsense: 'Google AdSense',
    journey_mv: 'Journey by Mediavine',
    monumetric: 'Monumetric',
    custom: 'Custom Ad'
  }[activeNetwork] || 'Ad Network';

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
        <span className="text-xs tracking-widest uppercase opacity-50 font-bold">{networkDisplay}</span>
        <span className="text-center px-4 font-semibold text-slate-500 dark:text-slate-400">
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
