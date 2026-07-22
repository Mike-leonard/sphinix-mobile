'use client';
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const handlePageChange = (newPage) => {
    if (typeof onPageChange === 'function') {
      onPageChange(newPage);
    } else {
      const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
      params.set('page', newPage.toString());
      router.push(`?${params.toString()}`);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <Button 
        variant="none" 
        size="none" 
        style={{ fontSize: "var(--font-size-button-default, var(--font-size-button-default))" }} 
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="cursor-pointer px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </Button>
      
      <div className="flex items-center space-x-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button 
            variant="none" 
            size="none" 
            style={{ fontSize: "var(--font-size-button-default, var(--font-size-button-default))" }} 
            key={page}
            onClick={() => handlePageChange(page)}
            className={`cursor-pointer w-10 h-10 rounded-md font-medium transition-colors ${
              currentPage === page
                ? 'bg-brand-600 text-white border border-brand-600'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {page}
          </Button>
        ))}
      </div>

      <Button 
        variant="none" 
        size="none" 
        style={{ fontSize: "var(--font-size-button-default, var(--font-size-button-default))" }} 
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="cursor-pointer px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </Button>
    </div>
  );
}
