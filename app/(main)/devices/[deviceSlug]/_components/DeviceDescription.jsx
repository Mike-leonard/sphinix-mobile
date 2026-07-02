import React from 'react';

export default function DeviceDescription({ device }) {
  return (
    <div className="mt-12 space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Overview</h2>
      <p>
        The <strong>{device.name}</strong> represents the pinnacle of modern mobile engineering by <strong>{device.brand}</strong>. 
        Designed for users who demand uncompromised performance and elegant aesthetics, this device pushes the boundaries of what a smartphone can achieve.
      </p>
      <p>
        Powered by the cutting-edge <em>{device.specs.chipset}</em> processor and paired with {device.specs.ram}, it delivers buttery-smooth multitasking and gaming experiences. 
        The stunning {device.specs.screen} display ensures every photo, video, and interface element is remarkably crisp, vibrant, and incredibly fluid.
      </p>
      <div className="bg-brand-50 dark:bg-brand-500/10 border-l-4 border-brand-500 p-6 rounded-r-xl my-8 text-base">
        <p className="italic text-brand-800 dark:text-brand-200 font-medium">
          "With its {device.specs.camera} camera system and robust {device.specs.battery} battery, the {device.name} ensures you capture every moment without ever worrying about running out of power."
        </p>
      </div>
      <p>
        Whether you are a power user, a photography enthusiast, or someone who simply appreciates premium craftsmanship, the {device.name} offers a comprehensive package that is hard to beat at {device.price}.
      </p>
    </div>
  );
}
