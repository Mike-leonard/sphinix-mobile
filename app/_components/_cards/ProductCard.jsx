import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

export default function ProductCard({ product, isComparing, onToggleCompare }) {
  return (
    <Card className="group rounded-2xl border-slate-200 dark:border-slate-800/80 hover:border-brand-500/40 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 flex flex-col justify-between bg-white dark:bg-slate-900 overflow-hidden">
      <CardContent className="p-5 pb-2 space-y-4">
        {/* Upper visual showcase & Tag */}
        <div className="relative rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950 p-4 h-48 flex items-center justify-center group-hover:scale-[1.01] transition-transform duration-300">
          <div className={`absolute w-32 h-32 rounded-full bg-gradient-to-tr ${product.imageColor} opacity-20 blur-2xl`}></div>
          
          {/* SVG-based SmartPhone illustration */}
          <div className="relative w-24 h-40 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 shadow-md p-1.5 flex flex-col">
            <div className="w-8 h-2 bg-slate-50 dark:bg-slate-950 rounded-full mx-auto mb-1 border border-slate-200 dark:border-slate-800"></div>
            <div className={`flex-1 rounded-xl bg-gradient-to-br ${product.imageColor} p-2 flex flex-col justify-end text-[8px] font-bold text-white/80`}>
              <div>{product.brand}</div>
              <div className="text-[10px] text-white truncate font-extrabold leading-tight">{product.name}</div>
            </div>
          </div>

          {/* Badge */}
          <span className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 text-brand-600 dark:text-brand-400 border border-slate-200 dark:border-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
            {product.brand}
          </span>

          {/* Rating badge */}
          <span className="absolute top-3 right-3 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            ★ {product.rating}
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {product.name}
          </h3>
          
          {/* Specs overview list */}
          <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400 border-t border-b border-slate-200 dark:border-slate-800/60 py-4">
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-bold block uppercase text-[10px] tracking-wider mb-1">Processor</span> 
              <span className="inline-flex px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-md font-bold text-xs border border-slate-200 dark:border-slate-700/50 shadow-sm">{product.specs.chipset.split(' ')[0]} <br/></span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-bold block uppercase text-[10px] tracking-wider mb-1">Display</span> 
              <span className="inline-flex px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-md font-bold text-xs border border-slate-200 dark:border-slate-700/50 shadow-sm">{product.specs.screen.split(' ')[0]} {product.specs.screen.split(' ')[1]}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-500 dark:text-slate-400 font-bold block uppercase text-[10px] tracking-wider mb-1">Camera</span> 
              <span className="inline-flex px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-md font-bold text-xs border border-slate-200 dark:border-slate-700/50 shadow-sm">{product.specs.camera.split(' ')[0]} Primary</span>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Lower action bar */}
      <CardFooter className="p-5 pt-2 flex items-center justify-between">
        <span className="text-xl font-extrabold text-slate-900 dark:text-white">
          {product.price}
        </span>
        
        <label className="group flex items-center gap-2 cursor-pointer py-1.5 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
          <input 
            type="checkbox"
            checked={isComparing}
            onChange={onToggleCompare}
            className="rounded border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-brand-600 dark:text-brand-500 focus:ring-brand-500 focus:ring-offset-white dark:focus:ring-offset-slate-900 w-4 h-4 cursor-pointer"
          />
          <span className={`text-xs font-semibold select-none transition-colors ${isComparing ? "text-brand-600 dark:text-brand-400 font-bold" : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"}`}>
            {isComparing ? "Selected" : "Compare"}
          </span>
        </label>
      </CardFooter>
    </Card>
  );
}
