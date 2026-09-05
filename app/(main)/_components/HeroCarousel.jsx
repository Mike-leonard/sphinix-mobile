'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Cpu, Smartphone, Zap, Camera, Sparkles, ChevronRight } from 'lucide-react';
import { getDeviceFirstImage, generateBrandSlug, generateDeviceSlug } from '@/lib/utils';

// Fallback slides if database has zero published items
const FALLBACK_SLIDES = [
  {
    id: 'xiaomi-17t-pro',
    name: 'Xiaomi 17T Pro',
    brand: 'Xiaomi',
    price: '$899',
    subtitle: 'NEXT-GEN FLAGSHIP PERFORMANCE',
    title: 'Xiaomi 17T Pro',
    description: 'Powered by MediaTek Dimensity 9500 with a groundbreaking 200MP Leica optics camera and 7000mAh 100W HyperCharge battery.',
    imageColor: 'from-amber-500 via-orange-600 to-red-700',
    specs: {
      chipset: 'MediaTek Dimensity 9500',
      display: '6.83" 120Hz LTPO AMOLED',
      camera: '50MP + 50MP + 12MP OIS',
      battery: '7000 mAh • 100W Fast Charge'
    }
  },
  {
    id: 'honor-magic-v6',
    name: 'Honor Magic V6',
    brand: 'Honor',
    price: '$1299',
    subtitle: 'ULTRA-THIN FOLDABLE REVOLUTION',
    title: 'Honor Magic V6',
    description: 'The world’s thinnest foldable flagship with titanium hinge architecture, dual LTPO OLED canvases, and silicon-carbon battery technology.',
    imageColor: 'from-purple-600 via-indigo-700 to-pink-700',
    specs: {
      chipset: 'Snapdragon 8 Gen 3',
      display: '7.92" Foldable 120Hz OLED',
      camera: '50MP Falcon Triple Camera',
      battery: '5250 mAh • 66W Wired'
    }
  },
  {
    id: 'samsung-galaxy-s26-ultra',
    name: 'Galaxy S26 Ultra',
    brand: 'Samsung',
    price: '$1199',
    subtitle: 'AI-POWERED PRODUCTIVITY KING',
    title: 'Galaxy S26 Ultra',
    description: 'Integrated S-Pen, Galaxy AI real-time translation, titanium frame, and 200MP Quad-Telephoto zoom system.',
    imageColor: 'from-blue-600 via-cyan-700 to-indigo-800',
    specs: {
      chipset: 'Snapdragon 8 Gen 3 for Galaxy',
      display: '6.8" Dynamic AMOLED 2X',
      camera: '200MP Quad Telephoto',
      battery: '5000 mAh • 45W Fast Charge'
    }
  }
];

function extractDynamicSpec(specs, keywords, fallback) {
  if (!specs || typeof specs !== 'object') return fallback;

  // 1. Direct key search
  for (const [key, val] of Object.entries(specs)) {
    if (typeof val === 'string' && val.trim() !== '' && val !== 'Not specified' && val !== 'N/A') {
      const lowerKey = key.toLowerCase();
      if (keywords.some(kw => lowerKey === kw || lowerKey.includes(kw))) {
        return val.trim();
      }
    }
  }

  // 2. Nested search (if specs contains category objects)
  for (const val of Object.values(specs)) {
    if (val && typeof val === 'object') {
      for (const [subKey, subVal] of Object.entries(val)) {
        if (typeof subVal === 'string' && subVal.trim() !== '' && subVal !== 'Not specified' && subVal !== 'N/A') {
          const lowerKey = subKey.toLowerCase();
          if (keywords.some(kw => lowerKey === kw || lowerKey.includes(kw))) {
            return subVal.trim();
          }
        }
      }
    }
  }

  return fallback;
}

export default function HeroCarousel({ initialDevices = [] }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [phoneImageIndex, setPhoneImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Map initial DB devices or fallback
  const slides = Array.isArray(initialDevices) && initialDevices.length > 0
    ? initialDevices.map((device) => {
        const brandSlug = generateBrandSlug(device.brand || 'general');
        const deviceSlug = generateDeviceSlug(device.name || device.id);
        const imageUrl = getDeviceFirstImage(device);
        const specs = (device.specs && typeof device.specs === 'object') ? device.specs : {};

        // Extract clean dynamic specs matching database keys (chipset, screen/display, camera, battery)
        const chipsetVal = extractDynamicSpec(specs, ['chipset', 'processor', 'cpu', 'platform'], 'Flagship Octa-Core');
        const displayVal = extractDynamicSpec(specs, ['screen', 'display', 'screen-size', 'display-size', 'resolution'], '120Hz LTPO OLED');
        const cameraVal = extractDynamicSpec(specs, ['camera', 'main-camera', 'camera-specs', 'rear-camera', 'sensor'], 'Pro Triple Camera');
        const batteryVal = extractDynamicSpec(specs, ['battery', 'charging', 'battery-capacity', 'capacity'], '5000 mAh Fast Charge');

        // Format clean price
        let formattedPrice = '';
        if (device.price && device.price !== '$N/A' && device.price !== 'N/A' && device.price !== '$0' && device.price !== '0') {
          formattedPrice = `$${device.price.toString().replace(/^\$/, '')}`;
        }

        // Format clean description
        let cleanDescription = '';
        if (specs.description) {
          cleanDescription = specs.description
            .replace(/<[^>]*>?/gm, '')
            .replace(/^Introduction:\s*/i, '')
            .slice(0, 160)
            .trim() + '...';
        } else {
          cleanDescription = `Experience cutting-edge ${device.brand} innovation with high-refresh display technology, supreme processing power, and advanced camera optics.`;
        }

        // Extract all valid gallery images for full screen auto-slideshow inside phone frame
        let galleryImages = [];
        if (Array.isArray(specs.images)) {
          galleryImages = specs.images.filter(img => img && typeof img === 'string' && img.trim() !== '');
        }
        if (galleryImages.length === 0 && Array.isArray(device.deviceGallery)) {
          galleryImages = device.deviceGallery
            .map(item => typeof item === 'string' ? item : item?.url || item?.src)
            .filter(img => img && typeof img === 'string' && img.trim() !== '');
        }
        if (galleryImages.length === 0 && Array.isArray(device.images)) {
          galleryImages = device.images.filter(img => img && typeof img === 'string' && img.trim() !== '');
        }
        if (galleryImages.length === 0 && imageUrl) {
          galleryImages = [imageUrl];
        }

        return {
          id: device.id || deviceSlug,
          name: device.name,
          brand: device.brand,
          price: formattedPrice,
          subtitle: device.isNew ? 'NEW RELEASE FLAGSHIP' : 'TOP RATED SMARTPHONE',
          title: device.name,
          description: cleanDescription,
          imageColor: device.imageColor || 'from-purple-600 via-indigo-700 to-pink-700',
          imageUrl,
          galleryImages,
          brandSlug,
          deviceSlug,
          specs: {
            chipset: chipsetVal,
            display: displayVal,
            camera: cameraVal,
            battery: batteryVal
          }
        };
      })
    : FALLBACK_SLIDES.map(slide => ({ ...slide, galleryImages: slide.imageUrl ? [slide.imageUrl] : [] }));

  const currentSlide = slides[activeSlide] || slides[0];
  const handleNextSlide = () => {
    setPhoneImageIndex(0);
    setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handlePrevSlide = () => {
    setPhoneImageIndex(0);
    setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleSelectSlide = (idx) => {
    setPhoneImageIndex(0);
    setActiveSlide(idx);
  };

  // Auto-rotate inner phone gallery images every 3.5 seconds
  useEffect(() => {
    const currentImages = currentSlide.galleryImages || [];
    if (currentImages.length <= 1) return;

    const innerTimer = setInterval(() => {
      setPhoneImageIndex((prev) => (prev + 1) % currentImages.length);
    }, 3500);

    return () => clearInterval(innerTimer);
  }, [currentSlide.galleryImages]);

  // Auto-play main carousel slides every 6 seconds
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      handleNextSlide();
    }, 6000);

    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  return (
    <section 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 md:p-10 shadow-xl dark:shadow-2xl text-slate-800 dark:text-slate-100 group/hero transition-colors"
    >
      {/* Background Animated Gradient Mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-purple-50/20 to-slate-100/60 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 opacity-90 z-0"></div>
      
      {/* Dynamic Background Glow matching active phone color */}
      <div className={`absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr ${currentSlide.imageColor} opacity-20 dark:opacity-25 blur-[100px] transition-all duration-1000 pointer-events-none`}></div>

      <div className="relative z-10 flex flex-col justify-between space-y-6">

        {/* Slide Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[380px]">
          
          {/* LEFT: Text & Spec Attributes (Col 7) */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-4">
            
            {/* Tag Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 text-[11px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3 h-3 text-amber-500 dark:text-amber-400 animate-pulse" />
                {currentSlide.subtitle}
              </span>
              <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 text-[11px] font-mono font-semibold rounded-full">
                {currentSlide.brand}
              </span>
              {currentSlide.price && (
                <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[11px] font-mono font-bold rounded-full">
                  {currentSlide.price}
                </span>
              )}
            </div>

            {/* Smartphone Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight drop-shadow-sm dark:drop-shadow-md">
              {currentSlide.title}
            </h1>

            {/* Short Description */}
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl line-clamp-2">
              {currentSlide.description}
            </p>

            {/* Spec Attributes List (2 Columns for Maximum Readability) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 pb-1">
              
              <div className="bg-slate-50/80 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/90 p-3 rounded-2xl flex items-center gap-3 shadow-sm dark:shadow-inner transition-colors">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <Cpu className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Chipset</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight block truncate" title={currentSlide.specs.chipset}>
                    {currentSlide.specs.chipset}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50/80 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/90 p-3 rounded-2xl flex items-center gap-3 shadow-sm dark:shadow-inner transition-colors">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Display</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight block truncate" title={currentSlide.specs.display}>
                    {currentSlide.specs.display}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50/80 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/90 p-3 rounded-2xl flex items-center gap-3 shadow-sm dark:shadow-inner transition-colors">
                <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
                  <Camera className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Camera Setup</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight block truncate" title={currentSlide.specs.camera}>
                    {currentSlide.specs.camera}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50/80 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/90 p-3 rounded-2xl flex items-center gap-3 shadow-sm dark:shadow-inner transition-colors">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Battery & Charge</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight block truncate" title={currentSlide.specs.battery}>
                    {currentSlide.specs.battery}
                  </span>
                </div>
              </div>

            </div>

            {/* Single Prominent CTA Action Button */}
            <div className="pt-2">
              <Link 
                href={currentSlide.brandSlug && currentSlide.deviceSlug 
                  ? `/phones/${currentSlide.brandSlug}/${currentSlide.deviceSlug}`
                  : `/phones`}
              >
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm px-7 h-11 rounded-2xl shadow-lg shadow-purple-600/30 gap-2 cursor-pointer transition-all hover:scale-[1.02]">
                  <span>Explore Full Specs</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

          </div>

          {/* RIGHT: 3D Smartphone Glassmorphism Card (Col 5) */}
          <div className="lg:col-span-5 flex items-center justify-center relative py-4 lg:py-0">
            
            {/* Styled 3D Phone Chassis */}
            <div className="relative w-56 sm:w-64 h-[320px] sm:h-[360px] rounded-[36px] bg-slate-900 dark:bg-slate-950 p-3 border-[5px] border-slate-200 dark:border-slate-800 shadow-2xl transition-all duration-500 hover:scale-105 hover:-rotate-1 group/phone cursor-pointer">
              
              {/* Top Notch / Camera Cutout */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 w-20 h-4 bg-slate-900 dark:bg-slate-950 rounded-b-xl border border-slate-200 dark:border-slate-800 border-t-0 flex items-center justify-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800 dark:bg-slate-900 border border-slate-600 dark:border-slate-700"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40"></div>
              </div>

              {/* Internal Screen Area */}
              <div className={`w-full h-full rounded-[28px] bg-gradient-to-tr ${currentSlide.imageColor} p-4 flex flex-col justify-between overflow-hidden relative border border-white/10 shadow-inner`}>
                
                {/* Brand Header */}
                <div className="flex items-center justify-between text-[10px] font-bold text-white/70 tracking-widest uppercase pt-2">
                  <span>{currentSlide.brand}</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[9px]">Flagship</span>
                </div>

                {/* Main Render Image with Auto-Cycling Gallery & Smooth Animation */}
                <div className="flex-1 flex items-center justify-center my-2 relative">
                  {currentSlide.galleryImages && currentSlide.galleryImages.length > 0 ? (
                    <img
                      key={`${currentSlide.id}-${phoneImageIndex}`}
                      src={currentSlide.galleryImages[phoneImageIndex % currentSlide.galleryImages.length]}
                      alt={currentSlide.name}
                      className="max-h-[220px] w-auto object-contain drop-shadow-2xl transition-all duration-700 animate-in fade-in zoom-in-95 group-hover/phone:scale-110"
                    />
                  ) : (
                    <div className="w-32 h-44 rounded-2xl bg-slate-950/80 border border-white/20 p-3 flex flex-col items-center justify-center text-center space-y-2 shadow-xl backdrop-blur-md">
                      <Smartphone className="w-8 h-8 text-purple-400 animate-pulse" />
                      <p className="text-xs font-bold text-white leading-tight">{currentSlide.name}</p>
                    </div>
                  )}
                </div>

                {/* Bottom Screen Badge */}
                <div className="bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-xl p-2 text-center text-[10px] font-bold text-white uppercase tracking-wider shadow-lg flex items-center justify-between">
                  <span>120Hz LTPO OLED</span>
                  <span className="text-emerald-400 font-mono">{currentSlide.price || currentSlide.brand}</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Carousel Bottom Control Bar: Phone Selector Pills & Arrow Buttons */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Phone Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
            {slides.map((slide, idx) => {
              const isActive = idx === activeSlide;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => handleSelectSlide(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-1 ring-purple-400'
                      : 'bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <Smartphone className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{slide.name}</span>
                </button>
              );
            })}
          </div>

          {/* Controls: Prev/Next & Progress Line */}
          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevSlide}
              className="w-9 h-9 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>

            {/* Animated Progress Bar */}
            <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-purple-500 transition-all duration-500 rounded-full"
                style={{ width: `${((activeSlide + 1) / slides.length) * 100}%` }}
              />
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNextSlide}
              className="w-9 h-9 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-all shadow-sm"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

        </div>

      </div>
    </section>
  );
}
