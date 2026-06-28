import React from 'react';

export default function ProductCard({ product, isComparing, onToggleCompare }) {
  return (
    <div className="group rounded-2xl bg-slate-900 border border-slate-800/80 p-5 space-y-4 hover:border-brand-500/40 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Upper visual showcase & Tag */}
        <div className="relative rounded-xl overflow-hidden bg-slate-950 p-4 h-48 flex items-center justify-center group-hover:scale-[1.01] transition-transform duration-300">
          <div className={`absolute w-32 h-32 rounded-full bg-gradient-to-tr ${product.imageColor} opacity-20 blur-2xl`}></div>
          
          {/* SVG-based SmartPhone illustration */}
          <div className="relative w-24 h-40 rounded-2xl bg-slate-900 border-2 border-slate-700 shadow-md p-1.5 flex flex-col">
            <div className="w-8 h-2 bg-slate-950 rounded-full mx-auto mb-1 border border-slate-800"></div>
            <div className={`flex-1 rounded-xl bg-gradient-to-br ${product.imageColor} p-2 flex flex-col justify-end text-[8px] font-bold text-white/80`}>
              <div>{product.brand}</div>
              <div className="text-[10px] text-white truncate font-extrabold leading-tight">{product.name}</div>
            </div>
          </div>

          {/* Badge */}
          <span className="absolute top-3 left-3 bg-slate-900/90 text-brand-400 border border-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            {product.brand}
          </span>

          {/* Rating badge */}
          <span className="absolute top-3 right-3 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            ★ {product.rating}
          </span>
        </div>

        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors">
            {product.name}
          </h3>
          
          {/* Specs overview list */}
          <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-400 border-t border-b border-slate-800/60 py-2.5">
            <div>
              <span className="text-slate-600 font-bold block uppercase text-[8px]">Processor</span> 
              {product.specs.chipset.split(' ')[0]}
            </div>
            <div>
              <span className="text-slate-600 font-bold block uppercase text-[8px]">Display</span> 
              {product.specs.screen.split(' ')[0]} {product.specs.screen.split(' ')[1]}
            </div>
            <div className="col-span-2">
              <span className="text-slate-600 font-bold block uppercase text-[8px]">Camera</span> 
              {product.specs.camera.split(' ')[0]} Primary
            </div>
          </div>
        </div>
      </div>

      {/* Lower action bar */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xl font-extrabold text-white">
          {product.price}
        </span>
        
        <label className="flex items-center gap-2 cursor-pointer py-1 px-2.5 rounded-lg hover:bg-slate-850 transition-colors">
          <input 
            type="checkbox"
            checked={isComparing}
            onChange={onToggleCompare}
            className="rounded border-slate-700 bg-slate-950 text-brand-500 focus:ring-brand-500 focus:ring-offset-slate-900 w-4 h-4 cursor-pointer"
          />
          <span className={`text-xs font-semibold select-none ${isComparing ? "text-brand-400 font-bold" : "text-slate-400 hover:text-slate-200"}`}>
            {isComparing ? "Selected" : "Compare"}
          </span>
        </label>
      </div>
    </div>
  );
}
