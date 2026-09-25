import { getGroupAttributeValue } from './spec-normalizer.js';

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
  const batteryRaw = (typeof specs.battery === 'string' ? specs.battery : null)
    || (specs.quickSpecs && typeof specs.quickSpecs.battery === 'string' ? specs.quickSpecs.battery : null)
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
  const cameraRaw = (typeof specs.camera === 'string' ? specs.camera : null)
    || (specs.quickSpecs && typeof specs.quickSpecs.camera === 'string' ? specs.quickSpecs.camera : null)
    || getGroupAttributeValue(specs, 'Camera', 'main-lens')
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
  const screenRaw = (typeof specs.screen === 'string' ? specs.screen : null)
    || (typeof specs.display === 'string' ? specs.display : null)
    || (specs.quickSpecs && typeof specs.quickSpecs.screen === 'string' ? specs.quickSpecs.screen : null)
    || (specs.quickSpecs && typeof specs.quickSpecs.display === 'string' ? specs.quickSpecs.display : null)
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
  const ramRaw = (typeof specs.ram === 'string' ? specs.ram : null)
    || (specs.quickSpecs && typeof specs.quickSpecs.ram === 'string' ? specs.quickSpecs.ram : null)
    || getGroupAttributeValue(specs, 'Hardware', 'ram-memory') 
    || getGroupAttributeValue(specs, 'Hardware', 'ram')
    || getGroupAttributeValue(specs, 'Memory', 'ram')
    || getGroupAttributeValue(specs, 'Memory', 'ram-memory');
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
  const storageRaw = (typeof specs.storage === 'string' ? specs.storage : null)
    || (specs.quickSpecs && typeof specs.quickSpecs.storage === 'string' ? specs.quickSpecs.storage : null)
    || getGroupAttributeValue(specs, 'Hardware', 'internal-storage') 
    || getGroupAttributeValue(specs, 'Hardware', 'storage')
    || getGroupAttributeValue(specs, 'Memory', 'internal-storage')
    || getGroupAttributeValue(specs, 'Memory', 'storage')
    || getGroupAttributeValue(specs, 'Storage', 'internal-storage')
    || getGroupAttributeValue(specs, 'Storage', 'storage');
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
  const chipsetRaw = (typeof specs.chipset === 'string' ? specs.chipset : null)
    || (typeof specs.cpu === 'string' ? specs.cpu : null)
    || (specs.quickSpecs && typeof specs.quickSpecs.chipset === 'string' ? specs.quickSpecs.chipset : null)
    || getGroupAttributeValue(specs, 'Hardware', 'cpu') 
    || getGroupAttributeValue(specs, 'Hardware', 'chipset');
  if (chipsetRaw) {
    chipset = String(chipsetRaw).trim();
  }

  // 7. OS
  let os = null;
  const osRaw = (typeof specs.os === 'string' ? specs.os : null)
    || (specs.quickSpecs && typeof specs.quickSpecs.os === 'string' ? specs.quickSpecs.os : null)
    || getGroupAttributeValue(specs, 'General', 'released-os-version') 
    || getGroupAttributeValue(specs, 'General', 'os')
    || getGroupAttributeValue(specs, 'General', 'user-interface')
    || getGroupAttributeValue(specs, 'Software', 'os')
    || getGroupAttributeValue(specs, 'Software', 'released-os-version');
  if (osRaw) {
    os = String(osRaw).trim();
  }

  // 8. Connectivity (Bluetooth, WiFi, NFC)
  let bluetoothVersion = null;
  const btRaw = (typeof specs.bluetooth === 'string' ? specs.bluetooth : null)
    || getGroupAttributeValue(specs, 'Connectivity', 'bluetooth') 
    || (typeof specs.connectivity === 'string' ? specs.connectivity : null)
    || (typeof specs.wlan === 'string' ? specs.wlan : null);
  if (btRaw) {
    const match = String(btRaw).match(/\bv?([456]\.\d+)\b/i);
    if (match) {
      bluetoothVersion = match[1];
    }
  }

  let wifiVersion = null;
  const wifiRaw = (typeof specs.wifi === 'string' ? specs.wifi : null)
    || (typeof specs.wlan === 'string' ? specs.wlan : null)
    || getGroupAttributeValue(specs, 'Connectivity', 'wi-fi') 
    || getGroupAttributeValue(specs, 'Connectivity', 'wifi') 
    || (typeof specs.connectivity === 'string' ? specs.connectivity : null);
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
  const nfcRaw = (typeof specs.nfc === 'string' || typeof specs.nfc === 'boolean' ? specs.nfc : null)
    ?? getGroupAttributeValue(specs, 'Connectivity', 'nfc') 
    ?? (typeof specs.wlan === 'string' ? specs.wlan : null) 
    ?? (typeof specs.connectivity === 'string' ? specs.connectivity : null);
  if (nfcRaw !== null && nfcRaw !== undefined) {
    if (typeof nfcRaw === 'boolean') {
      hasNfc = nfcRaw;
    } else {
      const s = String(nfcRaw).toLowerCase();
      if (s === 'yes' || s === 'true' || s.includes('nfc')) {
        hasNfc = true;
      } else if (s === 'no' || s === 'false') {
        hasNfc = false;
      }
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
