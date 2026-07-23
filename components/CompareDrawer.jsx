"use client";

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { BarChart2, X } from 'lucide-react'
import { useCompare } from '@/context/CompareContext';
import { useRouter, usePathname } from 'next/navigation';

export default function CompareDrawer() {
  const { compareList, isOpen, setIsCompareOpen, handleToggleCompare, clearCompare } = useCompare();
  const router = useRouter();
  const pathname = usePathname();

  // We read from isCompareOpen from context! Note context uses 'isCompareOpen'
  const isDrawerOpen = useCompare().isCompareOpen; 

  const isVisibleRoute = pathname === '/' || pathname.startsWith('/phones');

  if (!isVisibleRoute) return null;
  if (compareList.length === 0) return null;

  return (
    <>
      <Sheet open={isDrawerOpen} onOpenChange={(open) => setIsCompareOpen(open)}>
        <SheetContent side="right" className="w-[95vw] sm:max-w-[800px] lg:max-w-[1000px] overflow-y-auto border-l-slate-200 dark:border-l-slate-800 bg-white dark:bg-slate-900 p-0 flex flex-col">
          <SheetHeader className="px-6 pt-6 mb-4">
            <SheetTitle className="font-extrabold text-slate-900 dark:text-white text-xl">Compare Phones</SheetTitle>
            <SheetDescription className="text-sm">
              Comparing {compareList.length} of max 3
            </SheetDescription>
          </SheetHeader>

          {/* Grid showing comparison values side-by-side */}
          <div className="flex-1 grid grid-cols-12 gap-4 divide-x divide-slate-200 dark:divide-slate-800 py-2 px-6">
            {compareList.map((item, index) => (
              <div
                key={item.id}
                className={`${compareList.length === 1 ? "col-span-12" : compareList.length === 2 ? "col-span-6" : "col-span-4"} space-y-4 ${index > 0 ? "pl-4" : ""}`}
              >
                <div className="text-center">
                  <span className="text-[10px] font-extrabold text-brand-600 dark:text-brand-400 uppercase tracking-widest block">{item.brand}</span>
                  <h5 className="font-extrabold text-sm text-slate-900 dark:text-white truncate block mt-1">{item.name}</h5>
                  <span className="text-sm font-black text-brand-600 dark:text-brand-500 mt-1 block">{item.price}</span>
                </div>

                <div className="space-y-4 border-t border-slate-200 dark:border-slate-800 pt-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-slate-500 dark:text-slate-400 font-bold block uppercase text-[10px] tracking-wider">Display</span>
                    <span className="block w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-md font-bold text-xs border border-slate-200 dark:border-slate-700/50 shadow-sm leading-snug">{item.specs.screen}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-slate-500 dark:text-slate-400 font-bold block uppercase text-[10px] tracking-wider">Chipset</span>
                    <span className="block w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-md font-bold text-xs border border-slate-200 dark:border-slate-700/50 shadow-sm leading-snug">{item.specs.chipset}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-slate-500 dark:text-slate-400 font-bold block uppercase text-[10px] tracking-wider">Camera</span>
                    <span className="block w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-md font-bold text-xs border border-slate-200 dark:border-slate-700/50 shadow-sm leading-snug">{item.specs.camera}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-slate-500 dark:text-slate-400 font-bold block uppercase text-[10px] tracking-wider">Battery</span>
                    <span className="block w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-md font-bold text-xs border border-slate-200 dark:border-slate-700/50 shadow-sm leading-snug">{item.specs.battery}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-slate-500 dark:text-slate-400 font-bold block uppercase text-[10px] tracking-wider">RAM / ROM</span>
                    <span className="block w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-md font-bold text-xs border border-slate-200 dark:border-slate-700/50 shadow-sm leading-snug">{item.specs.ram} / {item.specs.storage}</span>
                  </div>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleToggleCompare(item)}
                  className="w-full h-8 text-[10px] uppercase tracking-widest mt-4 font-bold"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-3 p-6 mt-auto border-t border-slate-200 dark:border-slate-800">
            <Button
              variant="outline"
              onClick={clearCompare}
              className="flex-1 text-xs"
            >
              Clear All
            </Button>
            <Button
              onClick={() => {
                setIsCompareOpen(false);
                const ids = compareList.map(item => item.id).join(',');
                router.push(ids ? `/comparisons?ids=${ids}` : "/comparisons");
              }}
              className="flex-1 bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white border-0 text-xs shadow-md shadow-brand-600/20"
            >
              Full Specs
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Floating Trigger button at bottom right */}
      {!isDrawerOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center shadow-2xl shadow-brand-500/30 rounded-full group">
          <Button
            onClick={() => {
              if (compareList.length < 2) {
                alert("Please select at least 2 phones to compare.");
              } else {
                setIsCompareOpen(true);
              }
            }}
            className="flex items-center gap-2 h-12 pl-5 pr-4 rounded-l-full rounded-r-none bg-brand-600 hover:bg-brand-500 text-white group-hover:scale-105 active:scale-95 transition-all border-y border-l border-brand-500/20 border-r border-r-white/20 font-bold text-sm tracking-wide"
          >
            <BarChart2 className="w-4 h-4" />
            <span>Compare List</span>
            <span className="bg-white/20 text-white font-extrabold text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {compareList.length}
            </span>
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              clearCompare();
            }}
            className="h-12 px-3 rounded-r-full rounded-l-none bg-brand-600 hover:bg-red-500 text-white group-hover:scale-105 active:scale-95 transition-all border-y border-r border-brand-500/20"
            title="Clear Compare List"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </>
  );
}

