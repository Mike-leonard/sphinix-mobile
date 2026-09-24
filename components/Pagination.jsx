'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';

export default function Pagination({ currentPage, totalPages }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  if (totalPages <= 1) return null;

  const createPageUrl = (page) => {
    const params = new URLSearchParams(
      searchParams ? searchParams.toString() : ''
    );

    if (page <= 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }

    const query = params.toString();
    const basePath = pathname || '/phones';

    return query ? `${basePath}?${query}` : basePath;
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">

      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Previous
        </Link>
      ) : (
        <span
          className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 opacity-50 cursor-not-allowed"
        >
          Previous
        </span>
      )}

      {/* Pages */}
      <div className="flex items-center space-x-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
          (page) => (
            <Link
              key={page}
              href={createPageUrl(page)}
              aria-current={currentPage === page ? 'page' : undefined}
              className={`w-10 h-10 flex items-center justify-center rounded-md font-medium transition-colors ${
                currentPage === page
                  ? 'bg-brand-600 text-white border border-brand-600'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {page}
            </Link>
          )
        )}
      </div>

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Next
        </Link>
      ) : (
        <span
          className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 opacity-50 cursor-not-allowed"
        >
          Next
        </span>
      )}

    </div>
  );
}