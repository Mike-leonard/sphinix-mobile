import React from 'react';
import Link from 'next/link';
import { getDeviceBrands } from '@/actions/device-brands';
import { getDeviceBrandCounts } from '@/actions/devices';

const DEFAULT_BRANDS = ["All", "Apple", "Samsung", "OnePlus", "Google", "LG", "Nokia", "HTC", "Sony", "Motorola", "Huawei", "Oppo"];

export default async function BrandList({ brands: propBrands = [], selectedBrand: propSelectedBrand }) {
  let displayBrands = propBrands;

  if (!displayBrands || displayBrands.length === 0) {
    const [dbBrands, brandCounts] = await Promise.all([
      getDeviceBrands(),
      getDeviceBrandCounts()
    ]);

    const allBrandNames = Array.from(new Set([...DEFAULT_BRANDS, ...(dbBrands || [])]));

    displayBrands = allBrandNames.map(name => ({
      name,
      count: brandCounts[name] || 0
    })).filter(brand => brand.count > 0 || brand.name === "All");
  }

  if (!displayBrands || displayBrands.length === 0) return null;

  const activeBrand = propSelectedBrand || "All";

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 style={{ fontSize: "var(--font-size-h3-section, var(--font-size-h3-default))" }} className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Popular Brands</h3>
        {activeBrand !== "All" && (
          <Link
            href="/phones"
            className="text-[10px] text-brand-400 h-auto p-0 cursor-pointer hover:underline"
          >
            Show All
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {displayBrands.map(brand => {
          const isActive = activeBrand === brand.name;
          const targetUrl = brand.name === 'All' ? '/phones' : `/phones?brand=${encodeURIComponent(brand.name)}`;
          return (
            <Link
              key={brand.name}
              href={targetUrl}
              className={`cursor-pointer text-xs py-2 px-3 h-auto flex items-center justify-between rounded-xl font-bold transition-all active:scale-95 border ${
                isActive
                  ? "bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/10 border-brand-500"
                  : "bg-slate-50 border-slate-300 hover:bg-slate-100 text-slate-600 hover:text-slate-900 dark:bg-slate-800/80 dark:border-slate-700/60 dark:hover:bg-slate-700 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <span className="truncate">{brand.name}</span>
              <span className={`text-[10px] ml-1.5 px-1.5 py-0.5 rounded-md ${isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400"}`}>
                {brand.count}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}