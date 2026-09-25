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

/**
 * Generates high-value, deduplicated comparison pairs from a list of devices.
 * Avoids N*N index bloat by targeting:
 * 1. Intra-brand sibling pairs (e.g. S26 vs S26 Ultra, iPhone 17 vs iPhone 17 Pro)
 * 2. Cross-brand rival pairs (e.g. Samsung vs Apple, Xiaomi vs POCO, Honor vs Samsung)
 * 
 * @param {Array<Object>} devices - Array of published device objects
 * @param {number} [maxPairs=60] - Maximum pairs to return
 * @returns {Array<{ slug: string, deviceA: Object, deviceB: Object, updatedAt: Date }>}
 */
export function generateComparisonPairs(devices, maxPairs = 60) {
  if (!Array.isArray(devices) || devices.length < 2) return [];

  const pairs = [];
  const seenSlugs = new Set();

  const addPair = (dev1, dev2) => {
    if (!dev1 || !dev2 || dev1.id === dev2.id) return;
    const slug = buildComparisonSlug([dev1.id, dev2.id]);
    if (!slug || seenSlugs.has(slug)) return;

    seenSlugs.add(slug);
    const date1 = dev1.updatedAt ? new Date(dev1.updatedAt) : new Date();
    const date2 = dev2.updatedAt ? new Date(dev2.updatedAt) : new Date();
    const latestDate = date1 > date2 ? date1 : date2;

    pairs.push({
      slug,
      deviceA: dev1,
      deviceB: dev2,
      updatedAt: latestDate
    });
  };

  // Group devices by brand
  const byBrand = {};
  for (const device of devices) {
    const brand = (device.brandName || device.brand || 'Other').toLowerCase();
    if (!byBrand[brand]) byBrand[brand] = [];
    byBrand[brand].push(device);
  }

  const brands = Object.keys(byBrand);

  // 1. Intra-brand comparisons (siblings)
  for (const brand of brands) {
    const list = byBrand[brand];
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < Math.min(list.length, i + 3); j++) {
        addPair(list[i], list[j]);
        if (pairs.length >= maxPairs) return pairs;
      }
    }
  }

  // 2. Cross-brand rivalries
  for (let b1 = 0; b1 < brands.length; b1++) {
    for (let b2 = b1 + 1; b2 < brands.length; b2++) {
      const listA = byBrand[brands[b1]];
      const listB = byBrand[brands[b2]];

      // Pair top devices between each brand pair
      for (let i = 0; i < Math.min(listA.length, 3); i++) {
        for (let j = 0; j < Math.min(listB.length, 3); j++) {
          addPair(listA[i], listB[j]);
          if (pairs.length >= maxPairs) return pairs;
        }
      }
    }
  }

  return pairs;
}

/**
 * Returns 3-4 top competitor comparison options for a given smartphone.
 * Ideal for "Compare with Competitors" sections on device detail pages.
 * 
 * @param {Object} currentDevice
 * @param {Array<Object>} candidateDevices
 * @param {number} [limit=3]
 * @returns {Array<{ competitor: Object, slug: string, url: string }>}
 */
export function getSuggestedComparisonsForDevice(currentDevice, candidateDevices, limit = 3) {
  if (!currentDevice || !Array.isArray(candidateDevices)) return [];

  const currentBrand = (currentDevice.brandName || currentDevice.brand || '').toLowerCase();
  const rivals = [];
  const siblings = [];

  for (const candidate of candidateDevices) {
    if (!candidate || candidate.id === currentDevice.id) continue;
    const candBrand = (candidate.brandName || candidate.brand || '').toLowerCase();

    if (candBrand && candBrand === currentBrand) {
      siblings.push(candidate);
    } else {
      rivals.push(candidate);
    }
  }

  const selectedCompetitors = [];

  // Pick 1 sibling (if available)
  if (siblings.length > 0) {
    selectedCompetitors.push(siblings[0]);
  }

  // Fill remaining slots with cross-brand rivals
  for (const rival of rivals) {
    if (selectedCompetitors.length >= limit) break;
    selectedCompetitors.push(rival);
  }

  // Fallback if not enough rivals: add more siblings
  if (selectedCompetitors.length < limit && siblings.length > 1) {
    for (let i = 1; i < siblings.length; i++) {
      if (selectedCompetitors.length >= limit) break;
      selectedCompetitors.push(siblings[i]);
    }
  }

  return selectedCompetitors.map(competitor => {
    const slug = buildComparisonSlug([currentDevice.id, competitor.id]);
    return {
      competitor,
      slug,
      url: `/compare/${slug}`
    };
  });
}

