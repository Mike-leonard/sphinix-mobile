'use client';

import React from 'react';
import { Globe, Plus, Check, X } from 'lucide-react';
import { COMMON_ISO_COUNTRIES } from './constants';

export default function AffiliateCountryForm({
  editingId,
  formData,
  setFormData,
  newStoreInput,
  setNewStoreInput,
  loading,
  message,
  onSubmit,
  onReset
}) {
  const handleSelectPreset = (e) => {
    const selectedCode = e.target.value;
    const preset = COMMON_ISO_COUNTRIES.find((c) => c.code === selectedCode);
    if (preset) {
      setFormData({
        ...formData,
        name: preset.name,
        code: preset.code,
        flag: preset.flag,
        currencySymbol: preset.currencySymbol,
        currencyCode: preset.currencyCode,
        stores: preset.stores || []
      });
    }
  };

  const handleAddStoreTag = () => {
    if (!newStoreInput.trim()) return;
    const storeName = newStoreInput.trim();
    if (!formData.stores.includes(storeName)) {
      setFormData({
        ...formData,
        stores: [...formData.stores, storeName]
      });
    }
    setNewStoreInput('');
  };

  const handleRemoveStoreTag = (storeName) => {
    setFormData({
      ...formData,
      stores: formData.stores.filter((s) => s !== storeName)
    });
  };

  return (
    <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 h-fit space-y-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-brand-500" />
          {editingId ? 'Edit Country Market' : 'Add Affiliate Country'}
        </h2>
        {editingId && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline"
          >
            Cancel Edit
          </button>
        )}
      </div>

      {/* Preset Selector */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
          Quick Select Preset
        </label>
        <select
          onChange={handleSelectPreset}
          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
        >
          <option value="">-- Pick Country Preset --</option>
          {COMMON_ISO_COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.name} ({c.code}) - {c.currencySymbol}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Country Name
          </label>
          <input
            type="text"
            placeholder="e.g. Italy, Spain, France"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              ISO Code
            </label>
            <input
              type="text"
              placeholder="e.g. IT, US, ES"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              maxLength={5}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white uppercase font-bold focus:ring-2 focus:ring-brand-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Flag Emoji
            </label>
            <input
              type="text"
              placeholder="e.g. 🇮🇹, 🇪🇸, 🇫🇷"
              value={formData.flag}
              onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Currency Symbol
            </label>
            <input
              type="text"
              placeholder="e.g. €, $, ৳"
              value={formData.currencySymbol}
              onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Currency Code
            </label>
            <input
              type="text"
              placeholder="e.g. EUR, USD, BDT"
              value={formData.currencyCode}
              onChange={(e) => setFormData({ ...formData, currencyCode: e.target.value.toUpperCase() })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white uppercase focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
        </div>

        {/* Default Retailers / Stores Input */}
        <div className="space-y-2 pt-1">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Default Retailers / Stores
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add store e.g. Fnac, MediaWorld"
              value={newStoreInput}
              onChange={(e) => setNewStoreInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddStoreTag();
                }
              }}
              className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
            />
            <button
              type="button"
              onClick={handleAddStoreTag}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Add
            </button>
          </div>

          {/* Store Badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {formData.stores.map((store) => (
              <span
                key={store}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-500/20 rounded-lg text-xs font-medium"
              >
                {store}
                <button
                  type="button"
                  onClick={() => handleRemoveStoreTag(store)}
                  className="hover:text-rose-500 transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
            />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Set as Global Default (US)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.enabled}
              onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
            />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Enabled</span>
          </label>
        </div>

        {message && (
          <p className={`text-xs font-medium text-center ${message.includes('success') ? 'text-emerald-500' : 'text-rose-500'}`}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          {editingId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {editingId ? 'Save Changes' : 'Add Country Market'}
        </button>
      </form>
    </div>
  );
}
