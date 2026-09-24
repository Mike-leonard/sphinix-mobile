import React from 'react';
import { Edit2, Trash2, ArrowUpDown, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function BrandList({
  sortedBrands,
  brandCounts,
  onOpenEdit,
  isPending,
  isContentWriter,
  toggleSort,
  confirmDeleteBrand,
}) {
  return (
    <div className="w-full lg:w-2/3">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th 
                  className="py-4 px-6 font-medium text-slate-500 dark:text-slate-400 text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                  onClick={toggleSort}
                >
                  <div className="flex items-center gap-2">
                    Name
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="py-4 px-4 font-medium text-slate-500 dark:text-slate-400 text-sm">SEO Content</th>
                <th className="py-4 px-6 font-medium text-slate-500 dark:text-slate-400 text-sm w-28 text-center">Published</th>
                <th className="py-4 px-6 font-medium text-slate-500 dark:text-slate-400 text-sm w-32 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedBrands.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-500">No brands found.</td>
                </tr>
              ) : (
                sortedBrands.map(brand => {
                  const isProtected = brand.name === 'Other';
                  const count = brandCounts[brand.name] || 0;
                  const hasCustomSeo = Boolean(brand.h1 || brand.intro);
                  const brandSlug = brand.slug || brand.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

                  return (
                    <tr key={brand.id || brand.name} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/25 transition-colors group">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-brand-600 dark:text-brand-400">
                            {brand.name}
                          </span>
                          {isProtected && (
                            <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                              Default
                            </span>
                          )}
                          <Link
                            href={`/phones/${brandSlug}`}
                            target="_blank"
                            title={`View /phones/${brandSlug} in new tab`}
                            className="text-slate-400 hover:text-brand-500 transition-colors opacity-0 group-hover:opacity-100 p-0.5"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {hasCustomSeo ? (
                          <div className="max-w-xs">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                              <CheckCircle2 className="w-3 h-3 shrink-0" />
                              {brand.h1 ? brand.h1 : 'Custom Intro'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                            Default template
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-6 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
                        {count}
                      </td>

                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenEdit(brand)}
                            disabled={isPending}
                            className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Edit Brand & SEO Copy"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {!isProtected && !isContentWriter && (
                            <button
                              onClick={() => confirmDeleteBrand(brand.name)}
                              disabled={isPending}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                              title="Delete Brand"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
