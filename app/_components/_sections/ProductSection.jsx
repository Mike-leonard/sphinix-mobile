import React from 'react';
import ProductCard from '@/app/_components/_cards/ProductCard';

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
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Latest Products</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">Showing {filteredProducts.length} devices based on filters</p>
        </div>
        {selectedBrand !== "All" && (
          <button
            onClick={() => { setSelectedBrand("All"); setSearchQuery(""); }}
            className="text-xs text-brand-400 hover:underline flex items-center gap-1"
          >
            Clear Filter ({selectedBrand})
          </button>
        )}
      </div>
      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center text-slate-600 dark:text-slate-400">
          <svg className="w-12 h-12 mx-auto mb-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-semibold text-lg text-slate-700 dark:text-slate-300">No products found</p>
          <p className="text-sm mt-1">Try resetting the search terms or selecting a different brand.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredProducts.map(product => {
            const isComparing = compareList.some(item => item.id === product.id);
            return (
              <ProductCard
                key={product.id}
                product={product}
                isComparing={isComparing}
                onToggleCompare={() => handleToggleCompare(product)}
              />
            );
          })}
        </div>
      )}
      {/* View More button */}
      <div className="text-center pt-2">
        <button className="inline-flex items-center justify-center px-6 py-3 font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-850 hover:bg-slate-100 dark:bg-slate-850 hover:text-slate-900 dark:text-white rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all gap-2 text-sm">
          View More Products
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </section>
  );
}