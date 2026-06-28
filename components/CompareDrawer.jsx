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

export default function CompareDrawer({ 
  compareList, 
  isOpen, 
  onClose, 
  onToggleCompare, 
  onClear 
}) {
  if (compareList.length === 0) return null;

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent side="right" className="w-[340px] sm:w-[480px] overflow-y-auto border-l-slate-200 dark:border-l-slate-800 bg-white dark:bg-slate-900">
          <SheetHeader className="mb-4">
            <SheetTitle className="font-extrabold text-slate-900 dark:text-white">Compare Devices</SheetTitle>
            <SheetDescription className="text-xs">
              Comparing {compareList.length} of max 3
            </SheetDescription>
          </SheetHeader>

          {/* Grid showing comparison values side-by-side */}
          <div className="grid grid-cols-12 gap-3 divide-x divide-slate-200 dark:divide-slate-800 overflow-x-auto py-1">
            {compareList.map((item, index) => (
              <div 
                key={item.id} 
                className={`${compareList.length === 1 ? "col-span-12" : compareList.length === 2 ? "col-span-6" : "col-span-4"} space-y-3 ${index > 0 ? "pl-3" : ""}`}
              >
                <div className="text-center">
                  <span className="text-[9px] font-extrabold text-brand-500 dark:text-brand-400 uppercase tracking-widest block">{item.brand}</span>
                  <h5 className="font-extrabold text-xs text-slate-900 dark:text-white truncate block">{item.name}</h5>
                  <span className="text-xs font-black text-brand-600 dark:text-brand-500 mt-1 block">{item.price}</span>
                </div>

                <div className="space-y-2 text-[10px] border-t border-slate-200 dark:border-slate-800 pt-2 text-slate-600 dark:text-slate-400">
                  <div>
                    <span className="text-slate-500 dark:text-slate-500 block uppercase font-bold text-[8px]">Display</span>
                    <p className="line-clamp-2">{item.specs.screen}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-500 block uppercase font-bold text-[8px]">Chipset</span>
                    <p className="line-clamp-2">{item.specs.chipset}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-500 block uppercase font-bold text-[8px]">Camera</span>
                    <p className="line-clamp-2">{item.specs.camera}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-500 block uppercase font-bold text-[8px]">Battery</span>
                    <p className="line-clamp-2">{item.specs.battery}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-500 block uppercase font-bold text-[8px]">RAM / ROM</span>
                    <p className="line-clamp-2">{item.specs.ram} / {item.specs.storage}</p>
                  </div>
                </div>

                <Button 
                  variant="destructive"
                  size="sm"
                  onClick={() => onToggleCompare(item)}
                  className="w-full h-7 text-[9px] uppercase tracking-widest mt-2"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
            <Button 
              variant="outline"
              onClick={onClear}
              className="flex-1 text-xs"
            >
              Clear All
            </Button>
            <Button 
              onClick={() => alert("Comparison analysis loaded! Specs verified.")}
              className="flex-1 bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white border-0 text-xs shadow-md shadow-brand-600/20"
            >
              Full Specs
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Floating Trigger button at bottom right (only visible when closed, or kept persistent based on original logic) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button 
            onClick={onClose} // in the original code, `onClose` toggles the drawer in the parent state
            className="flex items-center gap-2 h-12 px-5 rounded-full bg-brand-600 hover:bg-brand-500 text-white shadow-2xl shadow-brand-500/30 hover:scale-105 active:scale-95 transition-all border border-brand-500/20 font-bold text-sm tracking-wide"
          >
            <BarChart2 className="w-4 h-4" />
            <span>Compare List</span>
            <span className="bg-white/20 text-white font-extrabold text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {compareList.length}
            </span>
          </Button>
        </div>
      )}
    </>
  );
}

