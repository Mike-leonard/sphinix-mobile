'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

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
    <section className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-10">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 opacity-60 z-0"></div>
      
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-[600px] sm:h-[550px] md:h-[380px] lg:h-[420px]">
        {/* Content Area */}
        <div className="relative h-full w-full">
          {HERO_SLIDES.map((slide, index) => (
            <div 
              key={`content-${slide.id}`} 
              className={`absolute inset-0 flex flex-col justify-center space-y-6 transition-all duration-700 ease-in-out ${
                index === activeSlide 
                  ? "opacity-100 translate-y-0 pointer-events-auto" 
                  : "opacity-0 translate-y-8 pointer-events-none"
              }`}
            >
              <div>
                <span className="inline-block px-3 py-1 bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold uppercase tracking-widest rounded-full mb-6">
                  {slide.subtitle}
                </span>
                <h1  style={{fontSize: "var(--font-size-h1-hero, var(--font-size-h1-default))"}} className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-slate-900 dark:text-white mb-6">
                  {slide.title}
                </h1>
                <p  style={{fontSize: "var(--font-size-p-subtitle, var(--font-size-p-default))"}} className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed mb-6">
                  {slide.description}
                </p>
                <div className="flex gap-4">
                  <Button className="px-6 h-12 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-500/20 hover:scale-[1.02] border-0">
                    {slide.cta}
                  </Button>
                  <Button variant="outline" className="px-6 h-12 bg-slate-200/80 dark:bg-slate-800/80 hover:bg-slate-300/80 dark:hover:bg-slate-700/80 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700/60 font-bold rounded-xl transition-all">
                    Watch Video
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Visualizer Area */}
        <div className="relative h-full w-full">
          {HERO_SLIDES.map((slide, index) => (
            <div 
              key={`visual-${slide.id}`} 
              className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${
                index === activeSlide 
                  ? "opacity-100 scale-100 pointer-events-auto" 
                  : "opacity-0 scale-90 pointer-events-none"
              }`}
            >
              {/* Glowing background behind mockup */}
              <div className={`absolute w-60 h-60 rounded-full bg-gradient-to-r ${slide.color} opacity-30 blur-3xl`}></div>
              
              {/* SVG & Styled Smartphone Mockup */}
              <div className="relative w-56 h-[290px] rounded-[36px] bg-slate-50 dark:bg-slate-950 p-2.5 border-4 border-slate-200 dark:border-slate-800 shadow-2xl hover:rotate-3 transition-transform duration-500 flex flex-col">
                {/* Speaker notch */}
                <div className="absolute top-1 right-1/2 translate-x-1/2 w-20 h-4 bg-slate-50 dark:bg-slate-950 rounded-b-2xl border border-slate-200 dark:border-slate-800 border-t-0 flex justify-center items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-900"></div>
                </div>
                {/* Screen content */}
                <div className={`flex-1 rounded-[28px] bg-gradient-to-tr ${slide.color} p-4 flex flex-col justify-between overflow-hidden relative group-hover:scale-95 transition-all`}>
                  <div className="text-[10px] text-white/50 tracking-wider font-extrabold uppercase mt-2">Sphinix Dev</div>
                  <div className="text-center font-bold text-sm text-white drop-shadow-md">
                    {slide.phoneName}
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-2 text-center text-[10px] font-bold text-white uppercase tracking-wider">
                    120Hz LTPO OLED
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slider Arrows & Indicator Controls */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-3">
        <Button 
          variant="outline"
          size="icon"
          onClick={() => setActiveSlide(prev => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
          className="cursor-pointer w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700/50 hover:scale-105 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex gap-1.5">
          {HERO_SLIDES.map((_, idx) => (
            <Button variant="none" size="none" style={{fontSize: "var(--font-size-button-default, var(--font-size-button-default))"}}  
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all ${idx === activeSlide ? "w-6 bg-brand-500" : "bg-slate-300 dark:bg-slate-700"}`}
            />
          ))}
        </div>
        <Button 
          variant="outline"
          size="icon"
          onClick={() => setActiveSlide(prev => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1))}
          className="cursor-pointer w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700/50 hover:scale-105 active:scale-95 transition-all"
        >
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </section>
  );
}

