import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function UsersTablePagination({ currentPage, setCurrentPage, totalPages, totalItems, itemsPerPage }) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
      <span className="text-sm text-slate-500">
        Showing <span className="font-medium text-slate-700 dark:text-slate-300">{startItem}</span> to <span className="font-medium text-slate-700 dark:text-slate-300">{endItem}</span> of <span className="font-medium text-slate-700 dark:text-slate-300">{totalItems}</span> users
      </span>
      <div className="flex items-center gap-2">
        <Button variant="none" size="none" style={{fontSize: "var(--font-size-button-default, var(--font-size-button-default))"}} 
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Button variant="none" size="none" style={{fontSize: "var(--font-size-button-default, var(--font-size-button-default))"}} 
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                currentPage === i + 1
                  ? 'bg-brand-500 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {i + 1}
            </Button>
          ))}
        </div>

        <Button variant="none" size="none" style={{fontSize: "var(--font-size-button-default, var(--font-size-button-default))"}} 
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
