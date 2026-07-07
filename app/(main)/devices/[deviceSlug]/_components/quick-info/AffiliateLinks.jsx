import React from 'react';
import Link from 'next/link';

export default function AffiliateLinks({ deviceName }) {
  return (
    <div className="grid grid-cols-2 gap-2 mb-4">
      <Link href="#" style={{fontSize: "var(--font-size-link-inline, var(--font-size-link-default))"}} className="flex flex-col sm:flex-row items-center justify-center gap-1 bg-orange-50 dark:bg-orange-500/10 hover:bg-orange-100 dark:hover:bg-orange-500/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20 py-2 px-3 rounded-md font-bold text-[11px] sm:text-xs transition-colors text-center">
        <span className="opacity-75 font-medium">Buy from</span> Amazon
      </Link>
      <Link href="#" style={{fontSize: "var(--font-size-link-inline, var(--font-size-link-default))"}} className="flex flex-col sm:flex-row items-center justify-center gap-1 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 py-2 px-3 rounded-md font-bold text-[11px] sm:text-xs transition-colors text-center">
        <span className="opacity-75 font-medium">Get it at</span> Best Buy
      </Link>
      <Link href="#" style={{fontSize: "var(--font-size-link-inline, var(--font-size-link-default))"}} className="flex flex-col sm:flex-row items-center justify-center gap-1 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20 py-2 px-3 rounded-md font-bold text-[11px] sm:text-xs transition-colors text-center">
        <span className="opacity-75 font-medium">Shop on</span> Walmart
      </Link>
      <Link href="#" style={{fontSize: "var(--font-size-link-inline, var(--font-size-link-default))"}} className="flex flex-col sm:flex-row items-center justify-center gap-1 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20 py-2 px-3 rounded-md font-bold text-[11px] sm:text-xs transition-colors text-center">
        <span className="opacity-75 font-medium">Find on</span> eBay
      </Link>
    </div>
  );
}
