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
    <section className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-8 md:p-10">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 opacity-60 z-0"></div>

      <div className="relative z-10 min-h-[480px] sm:min-h-[440px] md:min-h-[380px] lg:min-h-[420px] flex flex-col justify-between">
        {/* Slides list */}
        <div className="relative w-full flex-1">
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={`slide-${slide.id}`}
              className={`transition-all duration-700 ease-in-out ${
                index === activeSlide
                  ? "opacity-100 translate-y-0 pointer-events-auto flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-8 items-center"
                  : "opacity-0 translate-y-8 pointer-events-none absolute inset-0 hidden"
              }`}
            >
              {/* Content Area */}
              <div className="flex flex-col justify-center text-left w-full space-y-3 sm:space-y-4 md:space-y-6">
                <div>
                  <span className="inline-block px-3 py-1 bg-brand-500/10 border border-brand-500/20 text-brand-500 dark:text-brand-400 text-[10px] sm:text-xs font-semibold uppercase tracking-widest rounded-full mb-3 sm:mb-4">
                    {slide.subtitle}
                  </span>
                  <h1
                    style={{ fontSize: "var(--font-size-h1-hero, var(--font-size-h1-default))" }}
                    className="text-2xl sm:text-3.5xl md:text-4xl lg:text-5xl font-black tracking-tight leading-snug sm:leading-tight text-slate-900 dark:text-white mb-3 sm:mb-4"
                  >
                    {slide.title}
                  </h1>
                  <p
                    style={{ fontSize: "var(--font-size-p-subtitle, var(--font-size-p-default))" }}
                    className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed mb-5 sm:mb-6 max-w-xl"
                  >
                    {slide.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 relative z-20">
                    <Button className="px-5 sm:px-6 h-10 sm:h-12 bg-brand-600 hover:bg-brand-500 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-lg shadow-brand-500/20 hover:scale-[1.02] border-0">
                      {slide.cta}
                    </Button>
                    <Button variant="outline" className="px-5 sm:px-6 h-10 sm:h-12 bg-slate-200/80 dark:bg-slate-800/80 hover:bg-slate-300/80 dark:hover:bg-slate-700/80 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700/60 text-xs sm:text-sm font-bold rounded-xl transition-all">
                      Watch Video
                    </Button>
                  </div>
                </div>
              </div>

              {/* Visualizer Area (Smartphone Mockup) */}
              <div className="relative w-full flex items-center justify-center py-4 md:py-0">
                {/* Glowing background behind mockup */}
                <div className={`absolute w-44 h-44 sm:w-56 sm:h-56 md:w-60 md:h-60 rounded-full bg-gradient-to-r ${slide.color} opacity-30 blur-3xl`}></div>

                {/* Styled Smartphone Mockup */}
                <div className="relative w-44 sm:w-52 md:w-56 h-[220px] sm:h-[260px] md:h-[290px] rounded-[28px] sm:rounded-[36px] bg-slate-50 dark:bg-slate-950 p-2 sm:p-2.5 border-4 border-slate-200 dark:border-slate-800 shadow-2xl hover:rotate-3 transition-transform duration-500 flex flex-col">
                  {/* Speaker notch */}
                  <div className="absolute top-1 right-1/2 translate-x-1/2 w-16 sm:w-20 h-3 sm:h-4 bg-slate-50 dark:bg-slate-950 rounded-b-xl sm:rounded-b-2xl border border-slate-200 dark:border-slate-800 border-t-0 flex justify-center items-center">
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-900"></div>
                  </div>
                  {/* Screen content */}
                  <div className={`flex-1 rounded-[22px] sm:rounded-[28px] bg-gradient-to-tr ${slide.color} p-3 sm:p-4 flex flex-col justify-between overflow-hidden relative`}>
                    <div className="text-[9px] sm:text-[10px] text-white/60 tracking-wider font-extrabold uppercase mt-1 sm:mt-2">Sphinix Dev</div>
                    <div className="text-center font-bold text-xs sm:text-sm text-white drop-shadow-md">
                      {slide.phoneName}
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-lg sm:rounded-xl p-1.5 sm:p-2 text-center text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-wider">
                      120Hz LTPO OLED
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slider Controls */}
        <div className="pt-4 sm:pt-6 flex items-center justify-end gap-3 z-20">
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
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${idx === activeSlide ? "w-6 bg-brand-500" : "w-2 bg-slate-300 dark:bg-slate-700"}`}
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
      </div>
    </section>
  );
}
