/**
 * Utility functions for building and parsing clean SEO comparison slugs.
 * Delimiter: '-vs-'
 * Example: ['apple-iphone-17-pro', 'samsung-galaxy-s26-ultra'] <-> 'apple-iphone-17-pro-vs-samsung-galaxy-s26-ultra'
 */

/**
 * Builds a canonical comparison slug from an array of device IDs/slugs.
 * Always sorts IDs alphabetically so that 'A vs B' and 'B vs A' resolve to the exact same canonical URL.
 * 
 * @param {string[]} deviceIds - Array of device IDs (e.g. ['galaxy-s26', 'iphone-17-pro'])
 * @returns {string} Clean URL slug (e.g. 'apple-iphone-17-pro-vs-samsung-galaxy-s26-ultra')
 */
export function buildComparisonSlug(deviceIds) {
  if (!Array.isArray(deviceIds) || deviceIds.length === 0) return '';
  const cleanIds = deviceIds
    .map(id => String(id).trim().toLowerCase())
    .filter(Boolean);

  if (cleanIds.length === 0) return '';
  return [...cleanIds].sort().join('-vs-');
}

/**
 * Parses a combined comparison slug back into individual device IDs.
 * 
 * @param {string|string[]} slugParam - The slug string or catch-all array from Next.js params
 * @returns {string[]} Array of individual device IDs
 */
export function parseComparisonSlug(slugParam) {
  if (!slugParam) return [];
  const rawString = Array.isArray(slugParam) ? slugParam.join('/') : String(slugParam);
  if (!rawString.trim()) return [];

  return rawString
    .split('-vs-')
    .map(part => part.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Checks if the given raw slug matches its canonical sorted form.
 * 
 * @param {string|string[]} slugParam
 * @returns {boolean} True if already in canonical alphabetical order
 */
export function isCanonicalComparisonSlug(slugParam) {
  const ids = parseComparisonSlug(slugParam);
  if (ids.length <= 1) return true;
  const canonical = buildComparisonSlug(ids);
  const current = Array.isArray(slugParam) ? slugParam.join('/') : String(slugParam);
  return current === canonical;
}
