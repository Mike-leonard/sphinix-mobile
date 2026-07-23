import React from 'react';
import Link from 'next/link';
import { generateBrandSlug } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import ProductCardImage from './ProductCardImage';
import ProductCardSpecs from './ProductCardSpecs';
import ProductCardFooter from './ProductCardFooter';

export default function ProductCard({ product, isComparing, onToggleCompare, limit = 3 }) {
  const slug = product.id;
  const brandSlug = generateBrandSlug(product.brand || 'unknown');

  return (
    <Card className="group rounded-2xl border-slate-200 dark:border-slate-800/80 hover:border-brand-500/40 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 flex flex-col justify-between bg-white dark:bg-slate-900 overflow-hidden">
      <Link href={`/phones/${brandSlug}/${slug}`} style={{fontSize: "var(--font-size-link-inline, var(--font-size-link-default))"}} className="block flex-1">
        <CardContent className="p-5 pb-2 space-y-4">
          <ProductCardImage product={product} />

          <div className="space-y-2">
            <h3 style={{fontSize: "var(--font-size-h3-card, var(--font-size-h3-default))"}} className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              {product.name}
            </h3>
            
            <ProductCardSpecs specs={product.specs} limit={limit} />
          </div>
        </CardContent>
      </Link>

      <ProductCardFooter 
        price={product.price}
        product={product} 
        isComparing={isComparing} 
        onToggleCompare={onToggleCompare} 
      />
    </Card>
  );
}
