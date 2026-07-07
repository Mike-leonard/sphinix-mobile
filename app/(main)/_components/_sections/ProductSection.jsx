import React from 'react';
import ProductCard from '@/app/(main)/_components/_cards/ProductCard';
import InFeedAd from '@/components/ads/InFeedAd';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function ProductSection({
  filteredProducts,
  selectedBrand,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  compareList,
  handleToggleCompare
}) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2  style={{fontSize: "var(--font-size-h2-section, var(--font-size-h2-default))"}} className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Latest Products</h2>
          <p  style={{fontSize: "var(--font-size-p-subtitle, var(--font-size-p-default))"}} className="text-xs text-slate-600 dark:text-slate-400">Showing {filteredProducts.length} devices based on filters</p>
        </div>
        {selectedBrand !== "All" && (
          <Button
            variant="link"
            size="sm"
            onClick={() => { setSelectedBrand("All"); setSearchQuery(""); }}
            className="text-xs text-brand-400 h-auto p-0"
          >
            Clear Filter ({selectedBrand})
          </Button>
        )}
      </div>
      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center text-slate-600 dark:text-slate-400">
          <svg className="w-12 h-12 mx-auto mb-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p  style={{fontSize: "var(--font-size-p-default, var(--font-size-p-default))"}} className="font-semibold text-lg text-slate-700 dark:text-slate-300">No products found</p>
          <p  style={{fontSize: "var(--font-size-p-subtitle, var(--font-size-p-default))"}} className="text-sm mt-1">Try resetting the search terms or selecting a different brand.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredProducts.map((product, index) => {
            const isComparing = compareList.some(item => item.id === product.id);
            return (
              <React.Fragment key={product.id}>
                {index === 4 && (
                  <div className="col-span-full w-full py-2">
                    <InFeedAd />
                  </div>
                )}
                <ProductCard
                  product={product}
                  isComparing={isComparing}
                  onToggleCompare={() => handleToggleCompare(product)}
                />
              </React.Fragment>
            );
          })}
        </div>
      )}
      {/* View More button */}
      <div className="text-center pt-2">
        <Link
          href="/devices" style={{fontSize: "var(--font-size-link-inline, var(--font-size-link-default))"}} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-colors border border-brand-200 dark:border-brand-500/30"
        >
          View More Devices
          <ChevronDown className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}