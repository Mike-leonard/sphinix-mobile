import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BlogsPagination({ totalPages, currentPage, setCurrentPage }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 pt-6">
      <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <span className="text-sm text-slate-600 dark:text-slate-400 px-4 font-medium">
        Page {currentPage} of {totalPages}
      </span>
      <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
