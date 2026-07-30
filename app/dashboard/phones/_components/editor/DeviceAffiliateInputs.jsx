'use client';

import React, { useState, useEffect } from 'react';
import { Plus, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import { getPublishedAffiliateCountries } from '@/actions/affiliate-countries';
import { COMMON_ISO_COUNTRIES } from '../../affiliate-country/_components/constants';
import {
  normalizeCountryRecord,
  normalizeAffiliates,
  updateStoreInAffiliates,
  deleteStoreFromAffiliates,
  countActiveMarkets
} from '@/lib/affiliate-helpers';
import StoreInputCard from './StoreInputCard';
import AddRetailerModal from './AddRetailerModal';

const DEFAULT_COUNTRIES = COMMON_ISO_COUNTRIES.map(normalizeCountryRecord);

export default function DeviceAffiliateInputs({ formData, setFormData }) {
  const [countries, setCountries] = useState(DEFAULT_COUNTRIES);
  const [activeCountryCode, setActiveCountryCode] = useState('US');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRetailerName, setNewRetailerName] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    getPublishedAffiliateCountries()
      .then((fetched) => {
        if (fetched && fetched.length > 0) {
          setCountries(fetched.map(normalizeCountryRecord));
        }
      })
      .catch((err) => console.error('Failed to load affiliate countries:', err));
  }, []);

  const normalizedAffiliates = normalizeAffiliates(formData.affiliates);
  const activeCountryObj = countries.find((c) => c.code === activeCountryCode) || countries[0] || DEFAULT_COUNTRIES[0];
  const currentCountryAffiliates = normalizedAffiliates[activeCountryCode] || {};
  const activeMarketsCount = countActiveMarkets(normalizedAffiliates);

  const handleUpdateStore = (storeKey, key, val) => {
    setFormData({
      ...formData,
      affiliates: updateStoreInAffiliates(normalizedAffiliates, activeCountryCode, storeKey, key, val)
    });
  };

  const handleDeleteStore = (storeKey) => {
    setFormData({
      ...formData,
      affiliates: deleteStoreFromAffiliates(normalizedAffiliates, activeCountryCode, storeKey)
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
    <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950 p-4 transition-all">
      {/* Clickable Header Row for Collapsing / Expanding */}
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider cursor-pointer group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                Affiliate Markets & Store Links
              </label>
              {activeMarketsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                  {activeMarketsCount} Active Markets
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              US is the global default market for all visitors
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="p-1.5 rounded-xl text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 group-hover:bg-slate-100 dark:group-hover:bg-slate-900 transition-colors">
            {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </div>
        </div>
      </button>

      {/* Collapsed Summary Banner */}
      {isCollapsed && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
          {countries.map((c) => {
            const storeCount = Object.keys(normalizedAffiliates[c.code] || {}).filter(
              (k) => normalizedAffiliates[c.code][k]?.url
            ).length;
            if (storeCount === 0) return null;
            return (
              <div
                key={`summary-${c.code}`}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs shrink-0"
              >
                <span>{c.flag}</span>
                <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">{c.code}</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  {storeCount}
                </span>
              </div>
            );
          })}
          {activeMarketsCount === 0 && (
            <span className="text-xs text-slate-400 italic">No affiliate store links configured yet</span>
          )}
        </div>
      )}

      {/* Collapsible Main Content */}
      {!isCollapsed && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
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
        </div>
      )}

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
