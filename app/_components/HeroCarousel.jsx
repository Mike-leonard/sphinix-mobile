'use client';

import React, { useState } from 'react';

const HERO_SLIDES = [
  {
    id: 1,
    title: "Sphinix Flagship Hub",
    subtitle: "DISCOVER NEXT-GEN TECHNOLOGY",
    description: "Compare hardware specifications, view expert scores, and find the perfect phone matching your budget.",
    cta: "Compare Now",
    color: "from-brand-600 via-purple-700 to-pink-800",
    phoneName: "Galaxy S24 Ultra",
    phoneColor: "from-slate-400 to-zinc-700",
  },
  {
    id: 2,
    title: "Unbiased Mobile Reviews",
    subtitle: "READ REAL-WORLD EXPERT BLOGS",
    description: "Our testers push screen brightness, camera sensors, and battery limits to provide reviews you can trust.",
    cta: "Read Reviews",
    color: "from-indigo-700 via-blue-800 to-emerald-900",
    phoneName: "iPhone 16 Pro Max",
    phoneColor: "from-amber-600 to-orange-800",
  }
];

export default function HeroCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-10">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 opacity-60 z-0"></div>
      
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-[320px]">
        {/* Content */}
        <div className="space-y-6">
          <span className="inline-block px-3 py-1 bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold uppercase tracking-widest rounded-full">
            {HERO_SLIDES[activeSlide].subtitle}
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">
            {HERO_SLIDES[activeSlide].title}
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            {HERO_SLIDES[activeSlide].description}
          </p>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-brand-500/20 hover:scale-[1.02]">
              {HERO_SLIDES[activeSlide].cta}
            </button>
            <button className="px-6 py-3 bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700/60 font-bold text-sm rounded-xl transition-all">
              Watch Video
            </button>
          </div>
        </div>

        {/* Device Render Visualizer */}
        <div className="flex items-center justify-center relative">
          {/* Glowing background behind mockup */}
          <div className={`absolute w-60 h-60 rounded-full bg-gradient-to-r ${HERO_SLIDES[activeSlide].color} opacity-30 blur-3xl`}></div>
          
          {/* SVG & Styled Smartphone Mockup */}
          <div className="relative w-56 h-[290px] rounded-[36px] bg-slate-950 p-2.5 border-4 border-slate-800 shadow-2xl hover:rotate-3 transition-transform duration-500 flex flex-col">
            {/* Speaker notch */}
            <div className="absolute top-1 right-1/2 translate-x-1/2 w-20 h-4 bg-slate-950 rounded-b-2xl border border-slate-800 border-t-0 flex justify-center items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-900"></div>
            </div>
            {/* Screen content */}
            <div className={`flex-1 rounded-[28px] bg-gradient-to-tr ${HERO_SLIDES[activeSlide].color} p-4 flex flex-col justify-between overflow-hidden relative group-hover:scale-95 transition-all`}>
              <div className="text-[10px] text-white/50 tracking-wider font-extrabold uppercase mt-2">Sphinix Dev</div>
              <div className="text-center font-bold text-sm text-white drop-shadow-md">
                {HERO_SLIDES[activeSlide].phoneName}
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-2 text-center text-[10px] font-bold text-white uppercase tracking-wider">
                120Hz LTPO OLED
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Arrows & Indicator Controls */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-3">
        <button 
          onClick={() => setActiveSlide(prev => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
          className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center border border-slate-700/50 hover:scale-105 active:scale-95 transition-all"
        >
          &larr;
        </button>
        <div className="flex gap-1.5">
          {HERO_SLIDES.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all ${idx === activeSlide ? "w-6 bg-brand-500" : "bg-slate-700"}`}
            />
          ))}
        </div>
        <button 
          onClick={() => setActiveSlide(prev => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1))}
          className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center border border-slate-700/50 hover:scale-105 active:scale-95 transition-all"
        >
          &rarr;
        </button>
      </div>
    </section>
  );
}
