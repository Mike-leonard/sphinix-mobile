import React from 'react';

export default function CompareDrawer({ 
  compareList, 
  isOpen, 
  onClose, 
  onToggleCompare, 
  onClear 
}) {
  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Comparison Drawer/Modal dialog */}
      {isOpen && (
        <div className="mb-4 w-[340px] sm:w-[480px] bg-slate-900 border-2 border-brand-500/30 rounded-2xl p-5 shadow-2xl space-y-4 animate-slide-up">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h4 className="font-extrabold text-white text-base">Compare Devices</h4>
              <p className="text-[10px] text-slate-400">Comparing {compareList.length} of max 3</p>
            </div>
            <button 
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-850 hover:bg-slate-850 text-slate-400 flex items-center justify-center hover:text-white text-sm"
            >
              ✕
            </button>
          </div>

          {/* Grid showing comparison values side-by-side */}
          <div className="grid grid-cols-12 gap-3 divide-x divide-slate-850 overflow-x-auto py-1">
            {compareList.map((item, index) => (
              <div 
                key={item.id} 
                className={`${compareList.length === 1 ? "col-span-12" : compareList.length === 2 ? "col-span-6" : "col-span-4"} space-y-3 ${index > 0 ? "pl-3" : ""}`}
              >
                <div className="text-center">
                  <span className="text-[9px] font-extrabold text-brand-400 uppercase tracking-widest block">{item.brand}</span>
                  <h5 className="font-extrabold text-xs text-white truncate block">{item.name}</h5>
                  <span className="text-xs font-black text-brand-500 mt-1 block">{item.price}</span>
                </div>

                <div className="space-y-2 text-[10px] border-t border-slate-850 pt-2 text-slate-400">
                  <div>
                    <span className="text-slate-600 block uppercase font-bold text-[8px]">Display</span>
                    <p className="line-clamp-2">{item.specs.screen}</p>
                  </div>
                  <div>
                    <span className="text-slate-600 block uppercase font-bold text-[8px]">Chipset</span>
                    <p className="line-clamp-2">{item.specs.chipset}</p>
                  </div>
                  <div>
                    <span className="text-slate-600 block uppercase font-bold text-[8px]">Camera</span>
                    <p className="line-clamp-2">{item.specs.camera}</p>
                  </div>
                  <div>
                    <span className="text-slate-600 block uppercase font-bold text-[8px]">Battery</span>
                    <p className="line-clamp-2">{item.specs.battery}</p>
                  </div>
                  <div>
                    <span className="text-slate-600 block uppercase font-bold text-[8px]">RAM / ROM</span>
                    <p className="line-clamp-2">{item.specs.ram} / {item.specs.storage}</p>
                  </div>
                </div>

                <button 
                  onClick={() => onToggleCompare(item)}
                  className="w-full py-1.5 bg-slate-950 border border-red-500/20 hover:border-red-500/40 text-red-400 font-bold text-[9px] rounded-lg transition-all hover:bg-red-500/5 uppercase tracking-widest mt-2"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-3 border-t border-slate-850">
            <button 
              onClick={onClear}
              className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-white font-bold text-xs rounded-xl border border-slate-850 transition-colors"
            >
              Clear All
            </button>
            <button 
              onClick={() => alert("Comparison analysis loaded! Specs verified.")}
              className="flex-1 py-2.5 bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-brand-600/10"
            >
              Full Specs Chart
            </button>
          </div>
        </div>
      )}

      {/* Trigger button */}
      <button 
        onClick={onClose}
        className="flex items-center gap-2 px-5 py-3.5 bg-brand-600 hover:bg-brand-500 text-white rounded-full shadow-2xl shadow-brand-500/30 hover:scale-105 active:scale-95 transition-all border border-brand-500/20 font-bold text-sm tracking-wide"
      >
        <span>📊 Compare List</span>
        <span className="bg-white/20 text-white font-extrabold text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {compareList.length}
        </span>
      </button>

    </div>
  );
}
