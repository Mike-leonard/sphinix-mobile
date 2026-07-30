/**
 * Affiliate Market Data Normalization & State Helpers
 */

/**
 * Normalizes a country record from DB or presets
 */
export function normalizeCountryRecord(c) {
  if (!c) return null;
  return {
    code: c.code,
    name: c.name,
    flag: c.flag || '🌐',
    currencySymbol: c.currencySymbol || '$',
    stores: Array.isArray(c.stores)
      ? c.stores.map((s) =>
          typeof s === 'string'
            ? s.toLowerCase().replace(/\s+/g, '_')
            : (s?.id || s?.name || '').toLowerCase().replace(/\s+/g, '_')
        )
      : ['amazon', 'bestbuy', 'walmart', 'ebay']
  };
}

/**
 * Normalizes raw device affiliates structure (handles legacy flat format)
 */
export function normalizeAffiliates(rawAffiliates = {}) {
  if (!rawAffiliates || typeof rawAffiliates !== 'object') {
    return {};
  }

  const isLegacyFlat =
    rawAffiliates.amazon || rawAffiliates.bestbuy || rawAffiliates.walmart || rawAffiliates.ebay;

  if (isLegacyFlat && !rawAffiliates.US) {
    return { US: { ...rawAffiliates } };
  }

  return { ...rawAffiliates };
}

/**
 * Immutably updates a store field (url/price/name) for a specific country in affiliates state
 */
export function updateStoreInAffiliates(affiliates, countryCode, storeKey, key, val) {
  const currentAffiliates = normalizeAffiliates(affiliates);
  const countryData = currentAffiliates[countryCode] || {};

  const updatedCountryData = {
    ...countryData,
    [storeKey]: {
      ...(countryData[storeKey] || { url: '', price: '' }),
      [key]: val
    }
  };

  return {
    ...currentAffiliates,
    [countryCode]: updatedCountryData
  };
}

/**
 * Immutably deletes a store from a specific country in affiliates state
 */
export function deleteStoreFromAffiliates(affiliates, countryCode, storeKey) {
  const currentAffiliates = normalizeAffiliates(affiliates);
  const countryData = { ...(currentAffiliates[countryCode] || {}) };
  delete countryData[storeKey];

  return {
    ...currentAffiliates,
    [countryCode]: countryData
  };
}

/**
 * Counts total active market countries with at least one store link
 */
export function countActiveMarkets(affiliates) {
  const normalized = normalizeAffiliates(affiliates);
  return Object.keys(normalized).filter((countryCode) => {
    const cData = normalized[countryCode];
    if (!cData) return false;
    return Object.values(cData).some((s) => s?.url && s.url.trim() !== '');
  }).length;
}
