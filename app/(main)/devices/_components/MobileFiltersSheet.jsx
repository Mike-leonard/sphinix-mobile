import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import AdvancedFilters from '@/components/AdvancedFilters';

export default function MobileFiltersSheet({ showFilters, setShowFilters, advancedFilters, handleToggleAdvancedFilter }) {
  return (
    <Sheet open={showFilters} onOpenChange={setShowFilters}>
      <SheetContent onOpenAutoFocus={(e) => e.preventDefault()} side="bottom" className="max-h-[85vh] flex flex-col rounded-t-2xl p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-xl">
        <SheetHeader className="text-left mb-2 pr-8 shrink-0">
          <SheetTitle className="font-extrabold text-xl text-slate-900 dark:text-white">Advanced Filters</SheetTitle>
          <SheetDescription>Select options to refine your results.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 min-h-0 overflow-y-auto pb-4 pr-2">
          <AdvancedFilters
            isOpen={true}
            selectedFilters={advancedFilters}
            onToggleFilter={handleToggleAdvancedFilter}
            className="!bg-transparent !border-0 !p-0 !mb-0"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
