/**
 * Utility functions for normalizing, extracting, and rendering smartphone specifications.
 * Supports DUAL-FORMAT reading:
 * - Legacy format: specs[Group] = [ { slug, label, value } ]
 * - Modern format: specs[group] = { [slug]: value }
 */

const NON_SPEC_KEYS = new Set([
  'images',
  'imageAlts',
  'affiliates',
  'expertRatings',
  'seo',
  'quickSpecs',
  'description',
  'ratingBars',
  'gallery',
  'deviceGallery'
]);

// Acronyms that should remain uppercase when humanizing slugs
const ACRONYMS = new Set([
  'ai', 'cpu', 'gpu', 'os', 'ram', 'rom', 'mp', 'nfc', 'fps', 'hdr',
  'ois', 'pdaf', 'led', 'lcd', 'oled', 'amoled', 'sim', 'esim', 'sar',
  'usb', 'ip', 'gsm', 'cdma', 'hspa', 'lte', '5g', '4g', '3g', '2g',
  'wi-fi', 'wifi', 'wlan', 'gps', 'glonass', 'bds', 'galileo', 'qzs',
  'bt', 'ir', 'ppi', 'rgb', 'dci-p3', 'mah', 'w', 'hz', 'khz', 'mhz'
]);

/**
 * Converts a kebab-case or snake-case slug into a clean, human-readable label.
 * e.g. "main-lens" -> "Main Lens", "rear-video-fps" -> "Rear Video FPS"
 * 
 * @param {string} slug
 * @returns {string}
 */
export function slugToLabel(slug) {
  if (!slug || typeof slug !== 'string') return '';
  return slug
    .replace(/[_-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map(word => {
      const lower = word.toLowerCase();
      if (ACRONYMS.has(lower)) {
        return lower === 'wi-fi' ? 'Wi-Fi' : lower.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Cleans specification values:
 * - Converts "?" or empty strings to null (no data)
 * - Trims strings
 * - Preserves booleans, numbers, and valid string values
 * 
 * @param {any} value
 * @returns {any|null}
 */
export function cleanSpecValue(value) {
  if (value === undefined || value === null) return null;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '?' || trimmed === '' || trimmed === 'N/A' || trimmed === 'n/a') {
      return null;
    }
    return trimmed;
  }
  return value;
}

/**
 * Finds group data in specs object case-insensitively.
 * Handles both "Camera" and "camera", "Display" and "display", etc.
 * 
 * @param {object} specs
 * @param {string} groupName
 * @returns {any} The group object or array, or undefined
 */
export function findGroupData(specs, groupName) {
  if (!specs || typeof specs !== 'object') return undefined;

  const isGroupObjectOrArray = (v) => v && typeof v === 'object';

  // 1. Direct match if it's an object or array
  if (isGroupObjectOrArray(specs[groupName])) {
    return specs[groupName];
  }

  // 2. Case-insensitive / slug match for an object or array
  const target = groupName.toLowerCase().replace(/[\s_-]+/g, '');
  for (const [key, val] of Object.entries(specs)) {
    if (isGroupObjectOrArray(val) && key.toLowerCase().replace(/[\s_-]+/g, '') === target) {
      return val;
    }
  }

  return undefined;
}

/**
 * Safely extracts an attribute value from a device's specs, supporting both
 * legacy array and modern object formats.
 * 
 * @param {object} specs - The device.specs object
 * @param {string} groupName - Category name (e.g. 'Battery', 'battery')
 * @param {string} slugOrLabel - Attribute slug (e.g. 'capacity') or label (e.g. 'Capacity')
 * @returns {string|null}
 */
export function getGroupAttributeValue(specs, groupName, slugOrLabel) {
  if (!specs || typeof specs !== 'object') return null;
  const targetSlug = String(slugOrLabel).toLowerCase().trim();

  const groupData = findGroupData(specs, groupName);

  // 1. Modern Object Format: specs.battery = { "capacity": "5000 mAh" }
  if (groupData && typeof groupData === 'object' && !Array.isArray(groupData)) {
    // Exact key
    if (groupData[slugOrLabel] !== undefined) {
      return cleanSpecValue(groupData[slugOrLabel]);
    }
    // Case-insensitive / slug-match search in keys
    for (const [key, val] of Object.entries(groupData)) {
      if (key.toLowerCase().trim() === targetSlug) {
        return cleanSpecValue(val);
      }
    }
  }

  // 2. Legacy Array Format: specs.Battery = [ { slug: "capacity", label: "Capacity", value: "5000 mAh" } ]
  if (Array.isArray(groupData)) {
    const item = groupData.find(x => {
      if (!x || typeof x !== 'object') return false;
      const s = String(x.slug || '').toLowerCase().trim();
      const l = String(x.label || '').toLowerCase().trim();
      return s === targetSlug || l === targetSlug;
    });

    if (item && item.value !== undefined) {
      return cleanSpecValue(item.value);
    }
  }

  // 3. Fallback: check top-level specs (e.g. specs.battery, specs.ram)
  if (specs[slugOrLabel] !== undefined) {
    const val = specs[slugOrLabel];
    if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
      return cleanSpecValue(val);
    }
  }

  return null;
}

/**
 * Normalizes all spec groups of a device into a standardized structure for rendering.
 * Output: Array of {
 *   groupKey: string,
 *   title: string,
 *   specs: Array<{ slug: string, label: string, value: any }>
 * }
 * 
 * @param {object} specs - The device.specs object
 * @param {Array<object>} [allAttributes=[]] - Global DeviceAttribute definitions from DB
 * @returns {Array<object>}
 */
export function normalizeDeviceSpecsForDisplay(specs, allAttributes = []) {
  if (!specs || typeof specs !== 'object') return [];

  // Build slug -> attribute definition lookup map
  const attrMap = new Map();
  if (Array.isArray(allAttributes)) {
    allAttributes.forEach(attr => {
      if (attr && attr.slug) {
        attrMap.set(attr.slug.toLowerCase().trim(), attr);
      }
    });
  }

  const groups = [];

  for (const [key, groupData] of Object.entries(specs)) {
    if (NON_SPEC_KEYS.has(key)) continue;
    if (!groupData) continue;

    const normalizedItems = [];

    // Format A: Array of { slug, label, value }
    if (Array.isArray(groupData)) {
      for (const item of groupData) {
        if (!item || typeof item !== 'object') continue;
        const val = cleanSpecValue(item.value);
        if (val === null) continue; // Don't show "?" or empty values

        const slug = item.slug ? String(item.slug).trim() : '';
        const dbAttr = slug ? attrMap.get(slug.toLowerCase()) : null;
        const label = item.label || (dbAttr ? dbAttr.name : slugToLabel(slug));

        normalizedItems.push({
          slug: slug || label.toLowerCase().replace(/\s+/g, '-'),
          label,
          value: val
        });
      }
    } 
    // Format B: Object of { [slug]: value }
    else if (typeof groupData === 'object') {
      for (const [slugKey, rawVal] of Object.entries(groupData)) {
        const val = cleanSpecValue(rawVal);
        if (val === null) continue;

        const cleanSlug = String(slugKey).trim();
        const dbAttr = attrMap.get(cleanSlug.toLowerCase());
        const label = dbAttr ? dbAttr.name : slugToLabel(cleanSlug);

        normalizedItems.push({
          slug: cleanSlug,
          label,
          value: val
        });
      }
    }

    if (normalizedItems.length > 0) {
      groups.push({
        groupKey: key,
        title: slugToLabel(key),
        specs: normalizedItems
      });
    }
  }

  return groups;
}

/**
 * Safely extracts high-level quick summary specs (chipset, display, camera, battery, ram, storage, os)
 * from a device's specs object, supporting BOTH legacy and modern formats.
 * Always guarantees string outputs (never throws or returns objects).
 * 
 * @param {object} rawSpecs - device.specs or device
 * @returns {object} { chipset, display, screen, camera, battery, ram, storage, os }
 */
export function getDeviceQuickSpecs(rawSpecs) {
  const specs = (rawSpecs && typeof rawSpecs === 'object') ? (rawSpecs.specs || rawSpecs) : {};

  // 1. Chipset
  let chipset = '';
  if (typeof specs.chipset === 'string') chipset = specs.chipset;
  else if (typeof specs.cpu === 'string') chipset = specs.cpu;
  else if (specs.quickSpecs && typeof specs.quickSpecs.chipset === 'string') chipset = specs.quickSpecs.chipset;
  else chipset = getGroupAttributeValue(specs, 'Hardware', 'chipset') 
    || getGroupAttributeValue(specs, 'Hardware', 'cpu') || '';

  // 2. Display / Screen
  let display = '';
  if (typeof specs.screen === 'string') display = specs.screen;
  else if (typeof specs.display === 'string') display = specs.display;
  else if (specs.quickSpecs && typeof specs.quickSpecs.screen === 'string') display = specs.quickSpecs.screen;
  else if (specs.quickSpecs && typeof specs.quickSpecs.display === 'string') display = specs.quickSpecs.display;
  else display = getGroupAttributeValue(specs, 'Display', 'screen-size') 
    || getGroupAttributeValue(specs, 'Display', 'display-size')
    || getGroupAttributeValue(specs, 'Display', 'size') || '';

  // 3. Camera
  let camera = '';
  if (typeof specs.camera === 'string') camera = specs.camera;
  else if (specs.quickSpecs && typeof specs.quickSpecs.camera === 'string') camera = specs.quickSpecs.camera;
  else camera = getGroupAttributeValue(specs, 'Camera', 'main-lens') 
    || getGroupAttributeValue(specs, 'Camera', 'rear-camera') 
    || getGroupAttributeValue(specs, 'Camera', 'primary-camera')
    || getGroupAttributeValue(specs, 'Camera', 'main-camera') || '';

  // 4. Battery
  let battery = '';
  if (typeof specs.battery === 'string') battery = specs.battery;
  else if (specs.quickSpecs && typeof specs.quickSpecs.battery === 'string') battery = specs.quickSpecs.battery;
  else battery = getGroupAttributeValue(specs, 'Battery', 'capacity') 
    || getGroupAttributeValue(specs, 'Battery', 'battery-capacity')
    || getGroupAttributeValue(specs, 'Battery', 'battery') || '';

  // 5. RAM
  let ram = '';
  if (typeof specs.ram === 'string') ram = specs.ram;
  else if (specs.quickSpecs && typeof specs.quickSpecs.ram === 'string') ram = specs.quickSpecs.ram;
  else ram = getGroupAttributeValue(specs, 'Hardware', 'ram-memory') 
    || getGroupAttributeValue(specs, 'Hardware', 'ram')
    || getGroupAttributeValue(specs, 'Memory', 'ram') || '';

  // 6. Storage
  let storage = '';
  if (typeof specs.storage === 'string') storage = specs.storage;
  else if (specs.quickSpecs && typeof specs.quickSpecs.storage === 'string') storage = specs.quickSpecs.storage;
  else storage = getGroupAttributeValue(specs, 'Hardware', 'internal-storage') 
    || getGroupAttributeValue(specs, 'Hardware', 'storage')
    || getGroupAttributeValue(specs, 'Memory', 'internal-storage') 
    || getGroupAttributeValue(specs, 'Storage', 'internal-storage') || '';

  // 7. OS
  let os = '';
  if (typeof specs.os === 'string') os = specs.os;
  else if (specs.quickSpecs && typeof specs.quickSpecs.os === 'string') os = specs.quickSpecs.os;
  else os = getGroupAttributeValue(specs, 'General', 'released-os-version') 
    || getGroupAttributeValue(specs, 'General', 'os')
    || getGroupAttributeValue(specs, 'Software', 'os') || '';

  const clean = (val) => (typeof val === 'string' ? val.trim() : (val ? String(val) : ''));

  const cleanChipset = clean(chipset);
  const cleanDisplay = clean(display);
  const cleanCamera = clean(camera);
  const cleanBattery = clean(battery);
  const cleanRam = clean(ram);
  const cleanStorage = clean(storage);
  const cleanOs = clean(os);

  return {
    chipset: cleanChipset,
    display: cleanDisplay,
    screen: cleanDisplay,
    camera: cleanCamera,
    battery: cleanBattery,
    ram: cleanRam,
    storage: cleanStorage,
    os: cleanOs
  };
}

/**
 * Prepares and canonicalizes a device specs object for saving to the database.
 * - Strips '?' and empty placeholder values from all spec groups.
 * - Auto-derives Tier 4 quick summaries (quickSpecs & top-level strings) from detailed specs.
 * - Guarantees data consistency between detailed specs, quick specs, and filter values.
 * 
 * @param {object} rawSpecs - The specs object to prepare.
 * @returns {object} Canonical specs object ready for database storage.
 */
export function prepareDeviceSpecsForSave(rawSpecs) {
  if (!rawSpecs || typeof rawSpecs !== 'object' || Array.isArray(rawSpecs)) {
    return {};
  }

  const cleanedSpecs = {};

  // 1. Non-spec metadata preservation (seo, expertRatings, affiliates, description, etc.)
  for (const [key, val] of Object.entries(rawSpecs)) {
    if (NON_SPEC_KEYS.has(key)) {
      cleanedSpecs[key] = val;
    }
  }

  // Top-level os and ram primitives
  if (typeof rawSpecs.os === 'string') {
    const cOs = cleanSpecValue(rawSpecs.os);
    if (cOs !== null) cleanedSpecs.os = cOs;
  }
  if (typeof rawSpecs.ram === 'string') {
    const cRam = cleanSpecValue(rawSpecs.ram);
    if (cRam !== null) cleanedSpecs.ram = cRam;
  }

  // 2. Process all spec groups into lowercase object maps: { [slug]: value }
  for (const [key, val] of Object.entries(rawSpecs)) {
    if (NON_SPEC_KEYS.has(key) || key === 'os' || key === 'ram') continue;
    if (!val) continue;

    const groupKey = key.toLowerCase().trim().replace(/[\s_]+/g, '-');

    // A. Array format: [ { slug, label, value } ] -> convert to { [slug]: value }
    if (Array.isArray(val)) {
      const groupMap = (cleanedSpecs[groupKey] && typeof cleanedSpecs[groupKey] === 'object' && !Array.isArray(cleanedSpecs[groupKey]))
        ? cleanedSpecs[groupKey]
        : {};

      for (const item of val) {
        if (!item || typeof item !== 'object') continue;
        const slug = item.slug ? String(item.slug).trim() : (item.label ? String(item.label).toLowerCase().trim().replace(/[\s_]+/g, '-') : '');
        const cleanedVal = cleanSpecValue(item.value);
        if (cleanedVal !== null && slug) {
          groupMap[slug] = cleanedVal;
        }
      }

      if (Object.keys(groupMap).length > 0) {
        cleanedSpecs[groupKey] = groupMap;
      }
    }
    // B. Object format: { [slug]: value }
    else if (typeof val === 'object') {
      const groupMap = (cleanedSpecs[groupKey] && typeof cleanedSpecs[groupKey] === 'object' && !Array.isArray(cleanedSpecs[groupKey]))
        ? cleanedSpecs[groupKey]
        : {};

      for (const [subKey, subVal] of Object.entries(val)) {
        const slug = String(subKey).trim();
        const cleanedVal = cleanSpecValue(subVal);
        if (cleanedVal !== null && slug) {
          groupMap[slug] = cleanedVal;
        }
      }

      if (Object.keys(groupMap).length > 0) {
        cleanedSpecs[groupKey] = groupMap;
      }
    }
  }

  // 3. Auto-derive Tier 4 Quick Summaries into quickSpecs
  const quick = getDeviceQuickSpecs(cleanedSpecs);
  cleanedSpecs.quickSpecs = {
    chipset: quick.chipset,
    display: quick.display,
    screen: quick.screen,
    camera: quick.camera,
    battery: quick.battery,
    ram: quick.ram,
    storage: quick.storage,
    os: quick.os
  };

  // Populate top-level os and ram if missing
  if (!cleanedSpecs.os && quick.os) cleanedSpecs.os = quick.os;
  if (!cleanedSpecs.ram && quick.ram) cleanedSpecs.ram = quick.ram;

  return cleanedSpecs;
}


