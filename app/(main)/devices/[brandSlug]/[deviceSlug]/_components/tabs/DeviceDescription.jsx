import React from 'react';
import { Star, StarHalf, Battery, Phone, Camera, Wifi, PenTool, MonitorSmartphone, Sparkles, Music, Zap, Smile } from 'lucide-react';

const iconMap = {
  'battery': Battery,
  'call-quality': Phone,
  'camera': Camera,
  'connectivity': Wifi,
  'design': PenTool,
  'display': MonitorSmartphone,
  'features': Sparkles,
  'multimedia': Music,
  'performance': Zap,
  'usability': Smile
};

const StarRating = ({ score, size = "sm" }) => {
  const starClass = size === "lg" ? "w-6 h-6" : "w-4 h-4";
  
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => {
        const isFilled = score >= i + 1;
        const isHalf = !isFilled && score >= i + 0.5;
        
        if (isFilled) {
          return <Star key={i} className={`${starClass} text-amber-400 fill-amber-400`} />;
        } else if (isHalf) {
          return <StarHalf key={i} className={`${starClass} text-amber-400 fill-amber-400`} />;
        } else {
          return <Star key={i} className={`${starClass} text-slate-200 dark:text-slate-700 fill-slate-200 dark:fill-slate-700`} />;
        }
      })}
    </div>
  );
};

export default function DeviceDescription({ device, ratingBars = [] }) {
  const expertRatings = device.expertRatings || {};
  const ratedBars = ratingBars;
  const overallRating = ratedBars.length > 0 
    ? (ratedBars.reduce((acc, bar) => acc + (expertRatings[bar.slug] !== undefined ? expertRatings[bar.slug] : (bar.defaultValue || 3)), 0) / ratedBars.length).toFixed(1)
    : 0;

  return (
    <div className="mt-12 space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
      <h2 style={{fontSize: "var(--font-size-h2-default, var(--font-size-h2-default))"}} className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Overview</h2>

      {device.description ? (
        <div 
          className="mb-10 space-y-4 [&>p]:mb-4 [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-6 [&>h1]:mt-8 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-4 [&>h2]:mt-6 [&>ul]:list-disc [&>ul]:ml-6 [&>ol]:list-decimal [&>ol]:ml-6 [&>a]:text-brand-500"
          dangerouslySetInnerHTML={{ __html: device.description }}
        />
      ) : (
        <>
          <p>
            The <strong>{device.name}</strong> represents the pinnacle of modern mobile engineering by <strong>{device.brand}</strong>. 
            Designed for users who demand uncompromised performance and elegant aesthetics, this device pushes the boundaries of what a smartphone can achieve.
          </p>
          <p>
            Powered by the cutting-edge <em>{device.specs?.chipset}</em> processor and paired with {device.specs?.ram}, it delivers buttery-smooth multitasking and gaming experiences. 
            The stunning {device.specs?.screen} display ensures every photo, video, and interface element is remarkably crisp, vibrant, and incredibly fluid.
          </p>
          <div className="bg-brand-50 dark:bg-brand-500/10 border-l-4 border-brand-500 p-6 rounded-r-xl my-8 text-base">
            <p style={{fontSize: "var(--font-size-p-default, var(--font-size-p-default))"}} className="italic text-brand-800 dark:text-brand-200 font-medium">
              "With its {device.specs?.camera} camera system and robust {device.specs?.battery} battery, the {device.name} ensures you capture every moment without ever worrying about running out of power."
            </p>
          </div>
          <p>
            Whether you are a power user, a photography enthusiast, or someone who simply appreciates premium craftsmanship, the {device.name} offers a comprehensive package that is hard to beat at {device.price}.
          </p>
        </>
      )}

      {ratedBars.length > 0 && (
        <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 mb-10 border border-slate-200 dark:border-slate-800 shadow-xl shadow-brand-500/5">
          {/* Decorative background blob */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-brand-500/10 blur-3xl"></div>
          </div>
          
          <div className="relative z-10 mb-8 flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
              <Star className="w-7 h-7 fill-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1">Expert Review</h3>
              <p className="text-sm text-slate-500 font-medium">Comprehensive ratings by our testing lab</p>
            </div>
          </div>
          
          <style>{`
            .expert-grid:has(.expert-item:hover) .expert-item:not(:hover) {
              opacity: 0.4;
            }
          `}</style>

          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10 expert-grid">
            {ratedBars.map(bar => {
              const score = expertRatings[bar.slug] !== undefined ? expertRatings[bar.slug] : (bar.defaultValue || 3);
              const IconComponent = iconMap[bar.slug] || Star;
              
              return (
                <div key={bar.id} className={`relative h-[68px] group/item transition-opacity duration-300 expert-item
                  [&:nth-child(2n)>div]:right-0 [&:nth-child(2n)>div]:left-auto [&:nth-child(2n)>div]:origin-right
                  sm:[&:nth-child(2n)>div]:right-auto sm:[&:nth-child(2n)>div]:left-0 sm:[&:nth-child(2n)>div]:origin-left
                  sm:[&:nth-child(3n)>div]:right-0 sm:[&:nth-child(3n)>div]:left-auto sm:[&:nth-child(3n)>div]:origin-right
                  lg:[&:nth-child(3n)>div]:right-auto lg:[&:nth-child(3n)>div]:left-0 lg:[&:nth-child(3n)>div]:origin-left
                  lg:[&:nth-child(4n)>div]:right-0 lg:[&:nth-child(4n)>div]:left-auto lg:[&:nth-child(4n)>div]:origin-right
                `}>
                  <div className="absolute top-0 left-0 min-w-full flex items-center p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300 z-10 group-hover/item:z-50 group-hover/item:shadow-2xl hover:w-max group-hover/item:scale-105 origin-left">
                    <div className="flex items-center gap-3 w-max pr-2">
                      <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-white dark:bg-slate-900 text-slate-500 group-hover/item:bg-brand-500 group-hover/item:text-white transition-colors duration-300 shadow-sm cursor-default">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      
                      <div className="max-w-0 opacity-0 group-hover/item:max-w-[200px] group-hover/item:opacity-100 overflow-hidden transition-all duration-300 ease-out whitespace-nowrap">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 pr-2">{bar.name}</span>
                      </div>

                      <div className="flex flex-col gap-1 flex-shrink-0">
                        <StarRating score={score} size="sm" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between p-6 sm:p-8 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 rounded-2xl border border-slate-800 dark:border-slate-800 shadow-2xl overflow-hidden">
            {/* Another blob inside the dark box */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -right-10 -top-10 w-48 h-48 bg-brand-500/20 blur-3xl rounded-full"></div>
            </div>
            
            <div className="relative z-10">
              <h4 className="font-black text-white text-xl sm:text-2xl mb-1">Overall Score</h4>
              <p className="text-sm text-slate-400 font-medium">The definitive average rating</p>
            </div>
            <div className="relative z-10 flex items-center gap-4 sm:gap-6 mt-6 sm:mt-0">
              <div className="bg-white/5 p-3 sm:p-4 rounded-2xl backdrop-blur-md border border-white/10 hidden sm:block">
                <StarRating score={overallRating} size="lg" />
              </div>
              <div className="bg-gradient-to-br from-brand-500 to-brand-600 text-white font-black text-3xl sm:text-4xl px-6 py-4 rounded-2xl shadow-lg shadow-brand-500/30 ring-1 ring-white/20">
                {overallRating}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
