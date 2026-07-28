'use client';

import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { getPublishedAffiliateCountries } from '@/actions/affiliate-countries';
import StoreInputCard from './StoreInputCard';
import AddRetailerModal from './AddRetailerModal';

const DEFAULT_COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸', currencySymbol: '$', stores: ['amazon', 'bestbuy', 'walmart', 'ebay'] },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', currencySymbol: '€', stores: ['amazon_it', 'mediaworld', 'unieuro'] },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', currencySymbol: '€', stores: ['amazon_es', 'pccomponentes', 'mediamarkt_es'] },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', currencySymbol: '৳', stores: ['daraz', 'startech', 'ryans'] },
  { code: 'FR', name: 'France', flag: '🇫🇷', currencySymbol: '€', stores: ['amazon_fr', 'fnac', 'darty'] },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', currencySymbol: 'CA$', stores: ['amazon_ca', 'bestbuy_ca'] },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', currencySymbol: '€', stores: ['amazon_de', 'cyberport', 'mediamarkt_de'] }
];

export default function DeviceAffiliateInputs({ formData, setFormData }) {
  const [countries, setCountries] = useState(DEFAULT_COUNTRIES);
  const [activeCountryCode, setActiveCountryCode] = useState('US');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRetailerName, setNewRetailerName] = useState('');

  useEffect(() => {
    async function loadCountries() {
      try {
        const fetched = await getPublishedAffiliateCountries();
        if (fetched && fetched.length > 0) {
          setCountries(
            fetched.map((c) => ({
              code: c.code,
              name: c.name,
              flag: c.flag || '🌐',
              currencySymbol: c.currencySymbol || '$',
              stores: Array.isArray(c.stores)
                ? c.stores.map((s) => (typeof s === 'string' ? s : s.id || s.name))
                : ['amazon', 'bestbuy', 'walmart', 'ebay']
            }))
          );
        }
      } catch (err) {
        console.error('Failed to load affiliate countries:', err);
      }
    }
    loadCountries();
  }, []);

  // Ensure formData.affiliates is structured as { US: { store: { url, price } }, IT: { ... } }
  const rawAffiliates = formData.affiliates || {};
  let normalizedAffiliates = { ...rawAffiliates };

  // Check if legacy flat structure (e.g. { amazon: { url, price } })
  const isLegacyFlat =
    rawAffiliates.amazon || rawAffiliates.bestbuy || rawAffiliates.walmart || rawAffiliates.ebay;

  if (isLegacyFlat && !rawAffiliates.US) {
    normalizedAffiliates = {
      US: { ...rawAffiliates }
    };
  }

  const activeCountryObj =
    countries.find((c) => c.code === activeCountryCode) || countries[0] || DEFAULT_COUNTRIES[0];

  const currentCountryAffiliates = normalizedAffiliates[activeCountryCode] || {};

  const handleUpdateStore = (storeKey, key, val) => {
    const updatedCountryData = {
      ...currentCountryAffiliates,
      [storeKey]: {
        ...(currentCountryAffiliates[storeKey] || { url: '', price: '' }),
        [key]: val
      }
    };

    const updatedAffiliates = {
      ...normalizedAffiliates,
      [activeCountryCode]: updatedCountryData
    };

    setFormData({
      ...formData,
      affiliates: updatedAffiliates
    });
  };

  const handleDeleteStore = (storeKey) => {
    const updatedCountryData = { ...currentCountryAffiliates };
    delete updatedCountryData[storeKey];

    const updatedAffiliates = {
      ...normalizedAffiliates,
      [activeCountryCode]: updatedCountryData
    };

    setFormData({
      ...formData,
      affiliates: updatedAffiliates
    });
  };

  const handleConfirmAddRetailer = (e) => {
    if (e) e.preventDefault();
    if (!newRetailerName || !newRetailerName.trim()) return;

    const trimmed = newRetailerName.trim();
    const storeKey = trimmed.toLowerCase().replace(/\s+/g, '_');
    handleUpdateStore(storeKey, 'name', trimmed);

    setNewRetailerName('');
    setIsAddModalOpen(false);
  };

  const storeKeys = Array.from(
    new Set([...(activeCountryObj.stores || []), ...Object.keys(currentCountryAffiliates)])
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Affiliate Markets & Store Links
        </label>
        <span className="text-xs text-slate-400">US is the global default market for all visitors</span>
      </div>

      {/* Country Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {countries.map((c) => {
          const isActive = activeCountryCode === c.code;
          const countryStoreCount = Object.keys(normalizedAffiliates[c.code] || {}).filter(
            (k) => normalizedAffiliates[c.code][k]?.url
          ).length;

          return (
            <button
              type="button"
              key={c.code}
              onClick={() => setActiveCountryCode(c.code)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <span className="text-base">{c.flag}</span>
              <span>{c.code}</span>
              {countryStoreCount > 0 && (
                <span
                  className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-extrabold'
                  }`}
                >
                  {countryStoreCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Store Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{activeCountryObj.flag}</span>
            <span>
              {activeCountryObj.name} Market Links ({activeCountryObj.code})
            </span>
          </h4>
          <button
            type="button"
            onClick={() => {
              setNewRetailerName('');
              setIsAddModalOpen(true);
            }}
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Retailer
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {storeKeys.map((store) => {
            const data = currentCountryAffiliates[store] || { url: '', price: '' };
            const displayName =
              data.name ||
              (store === 'bestbuy'
                ? 'Best Buy'
                : store.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()));

            return (
              <StoreInputCard
                key={`card-${activeCountryCode}-${store}`}
                storeKey={store}
                displayName={displayName}
                data={data}
                currencySymbol={activeCountryObj.currencySymbol}
                onUpdateStore={handleUpdateStore}
                onDeleteStore={handleDeleteStore}
              />
            );
          })}
        </div>
      </div>

      {/* Add Retailer Modal Dialog */}
      <AddRetailerModal
        isOpen={isAddModalOpen}
        activeCountryObj={activeCountryObj}
        newRetailerName={newRetailerName}
        setNewRetailerName={setNewRetailerName}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={handleConfirmAddRetailer}
      />
    </div>
  );
}
