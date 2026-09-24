/**
 * Helper to extract numeric values from filter option strings.
 * e.g. "Under 4000 mAh" -> { type: 'under', limit: 4000 }
 *      "4000 - 5000 mAh" -> { type: 'range', min: 4000, max: 5000 }
 *      "Above 10000 mAh" -> { type: 'above', limit: 10000 }
 */
function parseNumericOption(optStr) {
  if (!optStr || typeof optStr !== 'string') return null;
  const s = optStr.toLowerCase().trim();

  // Extract all numbers (including decimals)
  const numbers = [...s.matchAll(/[\d.]+/g)].map(m => parseFloat(m[0])).filter(n => !isNaN(n));
  if (numbers.length === 0) return null;

  if (s.includes('under') || s.includes('<')) {
    return { type: 'under', limit: numbers[0] };
  }
  if (s.includes('above') || s.includes('>')) {
    return { type: 'above', limit: numbers[0] };
  }
  if (numbers.length >= 2) {
    return { type: 'range', min: Math.min(numbers[0], numbers[1]), max: Math.max(numbers[0], numbers[1]) };
  }
  return { type: 'exact', value: numbers[0] };
}

/**
 * Builds a Prisma `where` condition object from active filter search parameters.
 * Allows PostgreSQL to execute filtering, sorting, and pagination at the database level.
 *
 * @param {object} options
 * @param {string} [options.query=''] - Search term matching name or brand.
 * @param {string} [options.brand='All'] - Brand filter.
 * @param {object} [options.filters=null] - Map of filter keys to selected option string arrays.
 * @returns {object} Prisma where clause.
 */
export function buildPublishedDeviceWhere({ query = '', brand = 'All', filters = null } = {}) {
  const where = {
    status: 'PUBLISHED'
  };

  // 1. Brand filtering
  if (brand && brand !== 'All') {
    where.brandName = { equals: brand, mode: 'insensitive' };
  }

  // 2. Search query (matches device name or brand)
  if (query && typeof query === 'string' && query.trim() !== '') {
    const q = query.trim();
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { brandName: { contains: q, mode: 'insensitive' } }
    ];
  }

  // 3. Normalized multi-attribute filter evaluation
  if (filters && typeof filters === 'object') {
    const andConditions = [];

    for (const [rawKey, options] of Object.entries(filters)) {
      if (!Array.isArray(options) || options.length === 0) continue;

      const key = rawKey.toLowerCase().replace(/^filter_/, '');

      // --- Battery Capacity ---
      if (key === 'battery') {
        const batteryOrs = [];
        for (const opt of options) {
          const parsed = parseNumericOption(opt);
          if (!parsed) continue;
          if (parsed.type === 'under') {
            batteryOrs.push({ batteryMah: { lt: Math.round(parsed.limit) } });
          } else if (parsed.type === 'above') {
            batteryOrs.push({ batteryMah: { gt: Math.round(parsed.limit) } });
          } else if (parsed.type === 'range') {
            batteryOrs.push({
              batteryMah: {
                gte: Math.round(parsed.min),
                lte: Math.round(parsed.max)
              }
            });
          }
        }
        if (batteryOrs.length > 0) {
          andConditions.push(batteryOrs.length === 1 ? batteryOrs[0] : { OR: batteryOrs });
        }
      }

      // --- Camera Main MP ---
      else if (key === 'camera') {
        const cameraOrs = [];
        for (const opt of options) {
          const parsed = parseNumericOption(opt);
          if (!parsed) continue;
          if (parsed.type === 'under') {
            cameraOrs.push({ cameraMainMp: { lt: Math.round(parsed.limit) } });
          } else if (parsed.type === 'above') {
            cameraOrs.push({ cameraMainMp: { gt: Math.round(parsed.limit) } });
          } else if (parsed.type === 'range') {
            cameraOrs.push({
              cameraMainMp: {
                gte: Math.round(parsed.min),
                lte: Math.round(parsed.max)
              }
            });
          }
        }
        if (cameraOrs.length > 0) {
          andConditions.push(cameraOrs.length === 1 ? cameraOrs[0] : { OR: cameraOrs });
        }
      }

      // --- Display Size (inches) ---
      else if (key === 'screen' || key === 'display') {
        const displayOrs = [];
        for (const opt of options) {
          const parsed = parseNumericOption(opt);
          if (!parsed) continue;
          if (parsed.type === 'under') {
            displayOrs.push({ displaySize: { lt: parsed.limit } });
          } else if (parsed.type === 'above') {
            displayOrs.push({ displaySize: { gt: parsed.limit } });
          } else if (parsed.type === 'range') {
            displayOrs.push({
              displaySize: {
                gte: parsed.min,
                lte: parsed.max
              }
            });
          }
        }
        if (displayOrs.length > 0) {
          andConditions.push(displayOrs.length === 1 ? displayOrs[0] : { OR: displayOrs });
        }
      }

      // --- RAM (GB) ---
      else if (key === 'ram') {
        const ramOrs = [];
        for (const opt of options) {
          const parsed = parseNumericOption(opt);
          if (!parsed) continue;
          if (parsed.type === 'under') {
            // Device min RAM is less than limit
            ramOrs.push({ ramMinGb: { lt: Math.round(parsed.limit) } });
          } else if (parsed.type === 'above') {
            // Device max RAM is greater than limit
            ramOrs.push({ ramMaxGb: { gt: Math.round(parsed.limit) } });
          } else if (parsed.type === 'range') {
            // Overlapping intervals: device min <= opt max AND device max >= opt min
            ramOrs.push({
              AND: [
                { ramMinGb: { lte: Math.round(parsed.max) } },
                { ramMaxGb: { gte: Math.round(parsed.min) } }
              ]
            });
          }
        }
        if (ramOrs.length > 0) {
          andConditions.push(ramOrs.length === 1 ? ramOrs[0] : { OR: ramOrs });
        }
      }

      // --- Storage (GB) ---
      else if (key === 'storage') {
        const storageValues = [];
        for (const opt of options) {
          const s = String(opt).toLowerCase().trim();
          const match = s.match(/(\d+)\s*(tb|gb)\b/i);
          if (match) {
            const val = parseInt(match[1], 10);
            const unit = match[2].toUpperCase();
            storageValues.push(unit === 'TB' ? val * 1024 : val);
          } else {
            const fallback = s.match(/\d+/);
            if (fallback) storageValues.push(parseInt(fallback[0], 10));
          }
        }
        if (storageValues.length > 0) {
          andConditions.push({
            storageOptionsGb: {
              hasSome: storageValues
            }
          });
        }
      }

      // --- Chipset / CPU ---
      else if (key === 'chipset' || key === 'cpu') {
        const cpuOrs = options.map(opt => ({
          chipset: { contains: String(opt).trim(), mode: 'insensitive' }
        }));
        if (cpuOrs.length > 0) {
          andConditions.push(cpuOrs.length === 1 ? cpuOrs[0] : { OR: cpuOrs });
        }
      }

      // --- Operating System ---
      else if (key === 'os') {
        const osOrs = options.map(opt => ({
          os: { contains: String(opt).trim(), mode: 'insensitive' }
        }));
        if (osOrs.length > 0) {
          andConditions.push(osOrs.length === 1 ? osOrs[0] : { OR: osOrs });
        }
      }

      // --- Connectivity (Bluetooth, WiFi, NFC) ---
      else if (key === 'wlan' || key === 'connectivity') {
        const connOrs = [];
        for (const opt of options) {
          const s = String(opt).trim();
          if (/nfc/i.test(s)) {
            connOrs.push({ hasNfc: true });
          } else if (/wi-?fi/i.test(s)) {
            // e.g. "Wi-Fi 7", "Wi-Fi 6"
            const num = s.match(/\d+/);
            if (num) {
              connOrs.push({ wifiVersion: { contains: num[0], mode: 'insensitive' } });
            } else {
              connOrs.push({ wifiVersion: { not: null } });
            }
          } else if (/bluetooth/i.test(s)) {
            // e.g. "Bluetooth 5.4", "Bluetooth 5.3"
            const num = s.match(/([456]\.\d+)/);
            if (num) {
              connOrs.push({ bluetoothVersion: { contains: num[1], mode: 'insensitive' } });
            } else {
              connOrs.push({ bluetoothVersion: { not: null } });
            }
          }
        }
        if (connOrs.length > 0) {
          andConditions.push(connOrs.length === 1 ? connOrs[0] : { OR: connOrs });
        }
      }
    }

    if (andConditions.length > 0) {
      if (where.AND) {
        where.AND.push(...andConditions);
      } else {
        where.AND = andConditions;
      }
    }
  }

  return where;
}

export default buildPublishedDeviceWhere;
