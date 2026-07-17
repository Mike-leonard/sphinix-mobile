import React, { useState } from 'react';
import { Check } from 'lucide-react';

export default function DeviceAffiliateInputs({ formData, setFormData }) {
  const [editingAffiliate, setEditingAffiliate] = useState({});

  return (
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
              type="button"
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
                    type="button"
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
  );
}
