'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import DeviceGalleryInputs from './DeviceGalleryInputs';
import DeviceAffiliateInputs from './DeviceAffiliateInputs';
import DeviceThemeAndBadges from './DeviceThemeAndBadges';

export default function DeviceBasicInfo({ formData, setFormData, brands = [] }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsBrandOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Section: Brand & Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Brand *
          </label>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsBrandOpen(!isBrandOpen)}
              className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all hover:bg-slate-100 dark:hover:bg-slate-800/50"
            >
              <span className={formData.brand ? "font-medium" : "text-slate-500"}>
                {formData.brand || "Select a brand"}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
            {isBrandOpen && (
              <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-h-60 overflow-y-auto py-1">
                {brands.map(brand => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, brand }));
                      setIsBrandOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <span className="font-medium">{brand}</span>
                    {formData.brand === brand && <Check className="w-4 h-4 text-brand-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Price
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="1,199"
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-4 py-3 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all hover:bg-slate-100 dark:hover:bg-slate-800/50"
            />
          </div>
        </div>
      </div>

      <DeviceThemeAndBadges formData={formData} setFormData={setFormData} handleChange={handleChange} />

      <div className="h-px w-full bg-slate-100 dark:bg-slate-800"></div>

      <DeviceGalleryInputs formData={formData} setFormData={setFormData} />

      <div className="h-px w-full bg-slate-100 dark:bg-slate-800"></div>

      <DeviceAffiliateInputs formData={formData} setFormData={setFormData} />
    </div>
  );
}
