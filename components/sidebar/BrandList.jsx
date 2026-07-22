'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function BrandList({ brands = [], selectedBrand: propSelectedBrand, setSelectedBrand }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlBrand = searchParams ? searchParams.get('brand') : null;
  const activeBrand = propSelectedBrand || urlBrand || "All";

  const handleBrandSelect = (brandName) => {
    if (typeof setSelectedBrand === 'function') {
      setSelectedBrand(brandName);
    } else {
      const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
      if (brandName === 'All') {
        params.delete('brand');
      } else {
        params.set('brand', brandName);
      }
      params.delete('page');
      const queryString = params.toString();
      router.push(queryString ? `/phones?${queryString}` : '/phones');
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 style={{fontSize: "var(--font-size-h3-section, var(--font-size-h3-default))"}} className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Popular Brands</h3>
        {activeBrand !== "All" && (
          <Button
            variant="link"
            onClick={() => handleBrandSelect("All")}
            className="text-[10px] text-brand-400 h-auto p-0 cursor-pointer"
          >
            Show All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {brands.map(brand => (
          <Button
            key={brand.name}
            variant={activeBrand === brand.name ? "default" : "ghost"}
            onClick={() => handleBrandSelect(brand.name)}
            className={`cursor-pointer text-xs py-2 px-3 h-auto flex items-center justify-between rounded-xl font-bold transition-all active:scale-95 border ${activeBrand === brand.name ? "bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/10 border-brand-500" : "bg-slate-50 border-slate-300 hover:bg-slate-100 text-slate-600 hover:text-slate-900 dark:bg-slate-800/80 dark:border-slate-700/60 dark:hover:bg-slate-700 dark:text-slate-400 dark:hover:text-white"}`}
          >
            <span className="truncate">{brand.name}</span>
            <span className={`text-[10px] ml-1.5 px-1.5 py-0.5 rounded-md ${activeBrand === brand.name ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400"}`}>
              {brand.count}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}