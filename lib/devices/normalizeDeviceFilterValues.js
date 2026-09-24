/**
 * Extracts attribute value from grouped detailed specification array.
 * @param {object} specs - Specs JSON object.
 * @param {string} groupName - Group category name (e.g. 'Battery', 'Hardware', 'Connectivity', 'General', 'Display', 'Camera').
 * @param {string} slug - Attribute slug or label to search for.
 * @returns {string|null} The attribute value or null if not found.
 */
function getGroupAttributeValue(specs, groupName, slug) {
  if (!specs || typeof specs !== 'object') return null;
  const group = specs[groupName];
  if (Array.isArray(group)) {
    const item = group.find(x => x && (x.slug === slug || x.label?.toLowerCase() === slug.toLowerCase()));
    if (item && item.value !== undefined && item.value !== null) {
      return String(item.value).trim();
    }
  }
  return null;
}

/**
 * Normalizes unstructured device specifications (specs JSON) into structured database filter fields.
 * This function is the single source of truth for extracting filterable values from device specs.
 *
 * @param {object} rawSpecs - Device specifications object (or full device object).
 * @returns {object} Object containing normalized database values:
 *  - batteryMah: Int | null
 *  - cameraMainMp: Int | null
 *  - displaySize: Float | null
 *  - ramMinGb: Int | null
 *  - ramMaxGb: Int | null
 *  - storageOptionsGb: Int[]
 *  - chipset: String | null
 *  - os: String | null
 *  - bluetoothVersion: String | null
 *  - wifiVersion: String | null
 *  - hasNfc: Boolean | null
 */
export function normalizeDeviceFilterValues(rawSpecs) {
  const specs = (rawSpecs && typeof rawSpecs === 'object') ? (rawSpecs.specs || rawSpecs) : {};

  // 1. Battery (mAh)
  let batteryMah = null;
  const batteryRaw = specs.battery 
    || getGroupAttributeValue(specs, 'Battery', 'capacity') 
    || getGroupAttributeValue(specs, 'Battery', 'battery-capacity')
    || getGroupAttributeValue(specs, 'Battery', 'battery');
  if (batteryRaw) {
    const match = String(batteryRaw).match(/([0-9]{1,3}(?:,[0-9]{3})*|[0-9]{3,5})\s*mah/i);
    if (match) {
      batteryMah = parseInt(match[1].replace(/,/g, ''), 10);
    } else {
      const fallback = String(batteryRaw).match(/\b([1-9][0-9]{3,4})\b/);
      if (fallback) {
        batteryMah = parseInt(fallback[1], 10);
      }
    }
  }

  // 2. Camera Main MP
  let cameraMainMp = null;
  const cameraRaw = specs.camera 
    || getGroupAttributeValue(specs, 'Camera', 'rear-camera') 
    || getGroupAttributeValue(specs, 'Camera', 'primary-camera')
    || getGroupAttributeValue(specs, 'Camera', 'main-camera');
  if (cameraRaw) {
    const mainMatch = String(cameraRaw).match(/(\d+)\s*mp[^\n+,|/]*\bmain\b/i) 
      || String(cameraRaw).match(/\bmain[^\n+,|/]*?(\d+)\s*mp/i);
    if (mainMatch) {
      cameraMainMp = parseInt(mainMatch[1], 10);
    } else {
      const firstMatch = String(cameraRaw).match(/(\d+)\s*mp/i);
      if (firstMatch) {
        cameraMainMp = parseInt(firstMatch[1], 10);
      }
    }
  }

  // 3. Display Size (inches)
  let displaySize = null;
  const screenRaw = specs.screen 
    || specs.display 
    || getGroupAttributeValue(specs, 'Display', 'screen-size') 
    || getGroupAttributeValue(specs, 'Display', 'display-size')
    || getGroupAttributeValue(specs, 'Display', 'size');
  if (screenRaw) {
    const match = String(screenRaw).match(/(\d+(?:\.\d+)?)\s*(?:inches|inch|"|”|-inch)/i) 
      || String(screenRaw).match(/\b(\d+\.\d+)\b/);
    if (match) {
      displaySize = parseFloat(parseFloat(match[1]).toFixed(2));
    }
  }

  // 4. RAM (Min & Max GB)
  let ramMinGb = null;
  let ramMaxGb = null;
  const ramRaw = specs.ram 
    || getGroupAttributeValue(specs, 'Hardware', 'ram-memory') 
    || getGroupAttributeValue(specs, 'Hardware', 'ram');
  if (ramRaw) {
    const matches = [...String(ramRaw).matchAll(/\b(\d+)\s*(?:gb|g)\b/gi)]
      .map(m => parseInt(m[1], 10))
      .filter(n => n > 0 && n <= 1024);
    if (matches.length > 0) {
      const sorted = [...new Set(matches)].sort((a, b) => a - b);
      ramMinGb = sorted[0];
      ramMaxGb = sorted[sorted.length - 1];
    }
  }

  // 5. Storage Options (GB Array)
  let storageOptionsGb = [];
  const storageRaw = specs.storage 
    || getGroupAttributeValue(specs, 'Hardware', 'internal-storage') 
    || getGroupAttributeValue(specs, 'Hardware', 'storage');
  if (storageRaw) {
    // Exclude external expansion phrases (e.g. "Expandable up to 1TB", "microSD up to 1TB")
    const internalPart = String(storageRaw).split(/expandable|microsd|card\s*slot/i)[0];
    const matches = [];
    for (const m of internalPart.matchAll(/\b(\d+)\s*(tb|gb)\b/gi)) {
      const val = parseInt(m[1], 10);
      const unit = m[2].toUpperCase();
      matches.push(unit === 'TB' ? val * 1024 : val);
    }
    if (matches.length > 0) {
      storageOptionsGb = [...new Set(matches)].sort((a, b) => a - b);
    }
  }

  // 6. Chipset / CPU
  let chipset = null;
  const chipsetRaw = specs.chipset 
    || specs.cpu 
    || getGroupAttributeValue(specs, 'Hardware', 'cpu') 
    || getGroupAttributeValue(specs, 'Hardware', 'chipset');
  if (chipsetRaw) {
    chipset = String(chipsetRaw).trim();
  }

  // 7. OS
  let os = null;
  const osRaw = specs.os 
    || getGroupAttributeValue(specs, 'General', 'released-os-version') 
    || getGroupAttributeValue(specs, 'General', 'os')
    || getGroupAttributeValue(specs, 'General', 'user-interface');
  if (osRaw) {
    os = String(osRaw).trim();
  }

  // 8. Connectivity (Bluetooth, WiFi, NFC)
  let bluetoothVersion = null;
  const btRaw = specs.bluetooth 
    || getGroupAttributeValue(specs, 'Connectivity', 'bluetooth') 
    || specs.connectivity 
    || specs.wlan;
  if (btRaw) {
    const match = String(btRaw).match(/\bv?([456]\.\d+)\b/i);
    if (match) {
      bluetoothVersion = match[1];
    }
  }

  let wifiVersion = null;
  const wifiRaw = specs.wifi 
    || specs.wlan 
    || getGroupAttributeValue(specs, 'Connectivity', 'wi-fi') 
    || getGroupAttributeValue(specs, 'Connectivity', 'wifi') 
    || specs.connectivity;
  if (wifiRaw) {
    const s = String(wifiRaw);
    if (/wi-?fi\s*7|\b802\.11\s*be\b|\/be\b|\bbe\b/i.test(s)) {
      wifiVersion = 'Wi-Fi 7';
    } else if (/wi-?fi\s*6e/i.test(s)) {
      wifiVersion = 'Wi-Fi 6E';
    } else if (/wi-?fi\s*6|\b802\.11\s*ax\b|\/ax\b|\bax\b/i.test(s)) {
      wifiVersion = 'Wi-Fi 6';
    } else if (/wi-?fi\s*5|\b802\.11\s*ac\b|\/ac\b|\bac\b/i.test(s)) {
      wifiVersion = 'Wi-Fi 5';
    } else if (/wi-?fi\s*4|\b802\.11\s*n\b/i.test(s)) {
      wifiVersion = 'Wi-Fi 4';
    }
  }

  let hasNfc = null;
  const nfcRaw = specs.nfc 
    ?? getGroupAttributeValue(specs, 'Connectivity', 'nfc') 
    ?? specs.wlan 
    ?? specs.connectivity;
  if (nfcRaw !== null && nfcRaw !== undefined) {
    const s = String(nfcRaw).toLowerCase();
    if (s === 'yes' || s === 'true' || s.includes('nfc')) {
      hasNfc = true;
    } else if (s === 'no' || s === 'false') {
      hasNfc = false;
    }
  }

  return {
    batteryMah,
    cameraMainMp,
    displaySize,
    ramMinGb,
    ramMaxGb,
    storageOptionsGb,
    chipset,
    os,
    bluetoothVersion,
    wifiVersion,
    hasNfc
  };
}

export default normalizeDeviceFilterValues;
