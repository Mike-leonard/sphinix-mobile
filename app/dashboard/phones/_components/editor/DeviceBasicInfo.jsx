'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Settings, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [editingGallery, setEditingGallery] = useState({});
  const [editingAffiliate, setEditingAffiliate] = useState({});

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsBrandOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const colorPresets = [
    { label: 'Slate', value: 'from-slate-600 to-zinc-800' },
    { label: 'Emerald', value: 'from-emerald-600 to-teal-800' },
    { label: 'Blue', value: 'from-blue-600 to-indigo-800' },
    { label: 'Purple', value: 'from-purple-600 to-fuchsia-800' },
    { label: 'Amber', value: 'from-amber-700 to-amber-900' },
    { label: 'Rose', value: 'from-rose-600 to-pink-800' },
  ];

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

      {/* Card Gradient Theme */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Card Gradient Theme
        </label>
        <div className="flex flex-wrap gap-3">
          {colorPresets.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => setFormData({ ...formData, imageColor: preset.value })}
              title={preset.label}
              className={cn(
                "w-12 h-12 rounded-full bg-gradient-to-br transition-all relative flex items-center justify-center shadow-sm",
                preset.value,
                formData.imageColor === preset.value 
                  ? "ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-slate-950 scale-110 z-10" 
                  : "hover:scale-110 opacity-70 hover:opacity-100"
              )}
            >
              {formData.imageColor === preset.value && (
                <Check className="w-5 h-5 text-white drop-shadow-md" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Separator */}
      <div className="h-px w-full bg-slate-100 dark:bg-slate-800"></div>

      {/* Gallery Images */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Gallery Images (URLs)
        </label>
        
        {/* Badges for completed items */}
        <div className="flex flex-wrap gap-2 mb-4">
          {['Front View', 'Back View', 'Camera', 'Side Profile'].map((label, idx) => {
            const url = formData.images?.[idx];
            const isEditing = editingGallery[idx] || !url;
            if (isEditing) return null;
            return (
              <button 
                key={`badge-${label}`}
                onClick={() => setEditingGallery({ ...editingGallery, [idx]: true })}
                className="flex items-center gap-2 px-3 py-1.5 bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 text-brand-700 dark:text-brand-300 rounded-xl hover:bg-brand-100 dark:hover:bg-brand-500/30 transition-colors"
              >
                <span className="text-sm font-medium">{label}</span>
                <div className="w-5 h-5 rounded overflow-hidden bg-white">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </div>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['Front View', 'Back View', 'Camera', 'Side Profile'].map((label, idx) => {
            const url = formData.images?.[idx];
            const isEditing = editingGallery[idx] || !url;
            if (!isEditing) return null;

            return (
              <div key={`card-${label}`} className="flex flex-col gap-2 p-4 bg-slate-50/50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-brand-500/30 transition-colors group">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
                  {url && (
                    <button 
                      onClick={() => setEditingGallery({ ...editingGallery, [idx]: false })}
                      className="text-slate-400 hover:text-brand-500 p-1 bg-white dark:bg-slate-800 rounded shadow-sm border border-slate-200 dark:border-slate-700 transition-colors"
                      title="Done editing"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <input
                  type="url"
                  placeholder={`https://...`}
                  value={formData.images?.[idx] || ''}
                  onChange={(e) => {
                    const newImages = [...(formData.images || ['', '', '', ''])];
                    newImages[idx] = e.target.value;
                    setFormData({ ...formData, images: newImages });
                  }}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Separator */}
      <div className="h-px w-full bg-slate-100 dark:bg-slate-800"></div>

      {/* Affiliate Links */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Affiliate Links
        </label>
        
        {/* Badges for completed items */}
        <div className="flex flex-wrap gap-2 mb-4">
          {['amazon', 'bestbuy', 'walmart', 'ebay'].map((store) => {
            const affiliateData = typeof formData.affiliates?.[store] === 'string'
              ? { url: formData.affiliates[store], price: '' }
              : (formData.affiliates?.[store] || { url: '', price: '' });
              
            const isEditing = editingAffiliate[store] || !affiliateData.url;
            if (isEditing) return null;
            return (
              <button 
                key={`badge-${store}`}
                onClick={() => setEditingAffiliate({ ...editingAffiliate, [store]: true })}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-white text-[10px] ${
                  store === 'amazon' ? 'bg-orange-500' :
                  store === 'bestbuy' ? 'bg-blue-600' :
                  store === 'walmart' ? 'bg-blue-500' : 'bg-red-500'
                }`}>
                  {store.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium capitalize">{store === 'bestbuy' ? 'Best Buy' : store}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {['amazon', 'bestbuy', 'walmart', 'ebay'].map((store) => {
            const affiliateData = typeof formData.affiliates?.[store] === 'string'
              ? { url: formData.affiliates[store], price: '' }
              : (formData.affiliates?.[store] || { url: '', price: '' });

            const isEditing = editingAffiliate[store] || !affiliateData.url;
            if (!isEditing) return null;

            return (
              <div key={`card-${store}`} className="flex flex-col gap-3 p-4 bg-slate-50/50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-brand-500/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs ${
                      store === 'amazon' ? 'bg-orange-500' :
                      store === 'bestbuy' ? 'bg-blue-600' :
                      store === 'walmart' ? 'bg-blue-500' : 'bg-red-500'
                    }`}>
                      {store.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 capitalize">
                      {store === 'bestbuy' ? 'Best Buy' : store}
                    </span>
                  </div>
                  {affiliateData.url && (
                    <button 
                      onClick={() => setEditingAffiliate({ ...editingAffiliate, [store]: false })}
                      className="text-slate-400 hover:text-brand-500 p-1 bg-white dark:bg-slate-800 rounded shadow-sm border border-slate-200 dark:border-slate-700 transition-colors"
                      title="Done editing"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="url"
                      placeholder="Product URL"
                      value={affiliateData.url}
                      onChange={(e) => {
                        const newAffiliates = { ...(formData.affiliates || {}) };
                        newAffiliates[store] = { ...affiliateData, url: e.target.value };
                        setFormData({ ...formData, affiliates: newAffiliates });
                      }}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                    />
                  </div>
                  <div className="w-full sm:w-28 relative shrink-0">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                    <input
                      type="text"
                      placeholder="Price"
                      value={affiliateData.price}
                      onChange={(e) => {
                        const newAffiliates = { ...(formData.affiliates || {}) };
                        newAffiliates[store] = { ...affiliateData, price: e.target.value };
                        setFormData({ ...formData, affiliates: newAffiliates });
                      }}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-6 pr-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges / Toggles */}
      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <label className="flex-1 flex items-center justify-between p-4 bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 rounded-2xl cursor-pointer group hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-colors">
          <div>
            <span className="block text-sm font-bold text-brand-900 dark:text-brand-300">
              New Release
            </span>
            <span className="text-xs text-brand-600/70 dark:text-brand-400/70 mt-0.5 block">
              Show "New" badge on card
            </span>
          </div>
          <div className="relative flex items-center">
            <input
              type="checkbox"
              name="isNew"
              checked={formData.isNew}
              onChange={handleChange}
              className="peer sr-only"
            />
            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer-checked:bg-brand-500 transition-colors"></div>
            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5 shadow-sm"></div>
          </div>
        </label>

        <label className="flex-1 flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-2xl cursor-pointer group hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors">
          <div>
            <span className="block text-sm font-bold text-amber-900 dark:text-amber-300">
              Top Rated
            </span>
            <span className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-0.5 block">
              Highlight as top tier
            </span>
          </div>
          <div className="relative flex items-center">
            <input
              type="checkbox"
              name="isTopRated"
              checked={formData.isTopRated}
              onChange={handleChange}
              className="peer sr-only"
            />
            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer-checked:bg-amber-500 transition-colors"></div>
            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5 shadow-sm"></div>
          </div>
        </label>
      </div>

    </div>
  );
}
