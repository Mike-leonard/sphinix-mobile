'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { detectVisitorCountry } from '@/actions/geo';

export default function AffiliateLinks({ affiliates }) {
  const [visitorCountry, setVisitorCountry] = useState('US');

  useEffect(() => {
    async function initGeo() {
      try {
        const country = await detectVisitorCountry();
        if (country) setVisitorCountry(country);
      } catch (e) {
        console.error('Geo detection error:', e);
      }
    }
    initGeo();
  }, []);

  if (!affiliates || typeof affiliates !== 'object') {
    return null;
  }

  // 1. Resolve store list for visitor country, fallback to US or flat
  let countryStores = {};

  if (affiliates[visitorCountry] && Object.keys(affiliates[visitorCountry]).length > 0) {
    countryStores = affiliates[visitorCountry];
  } else if (affiliates.US && Object.keys(affiliates.US).length > 0) {
    countryStores = affiliates.US;
  } else {
    // Legacy flat format check (e.g. { amazon: { url, price } })
    countryStores = affiliates;
  }

  const getStoreData = (data) => {
    if (!data) return null;
    if (typeof data === 'string') return data.trim() !== '' ? { url: data, price: '' } : null;
    if (data.url && data.url.trim() !== '') return data;
    return null;
  };

  const storeEntries = Object.entries(countryStores)
    .map(([key, data]) => {
      const storeData = getStoreData(data);
      if (!storeData) return null;

      const name =
        storeData.name ||
        (key === 'amazon'
          ? 'Amazon'
          : key === 'bestbuy'
            ? 'Best Buy'
            : key === 'walmart'
              ? 'Walmart'
              : key === 'ebay'
                ? 'eBay'
                : key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()));

      return { key, name, url: storeData.url, price: storeData.price };
    })
    .filter(Boolean);

  if (storeEntries.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-2 mb-4">
      {storeEntries.map((store) => (
        <Link
          key={store.key}
          href={store.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 'var(--font-size-link-inline, var(--font-size-link-default))' }}
          className="flex flex-col sm:flex-row items-center justify-center gap-1 bg-brand-50 dark:bg-brand-500/10 hover:bg-brand-100 dark:hover:bg-brand-500/20 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-500/20 py-2 px-3 rounded-xl font-bold text-[11px] sm:text-xs transition-colors text-center shadow-sm"
        >
          {store.price ? (
            <>
              {store.name} <span className="opacity-75">{store.price}</span>
            </>
          ) : (
            <>
              <span className="opacity-75 font-medium">Buy on</span> {store.name}
            </>
          )}
        </Link>
      ))}
    </div>
  );
}
