/**
 * -----------------------------------------------------------------------------
 * DEVICE QUERY OPTIMIZER & PHRASE MAP
 * -----------------------------------------------------------------------------
 * @description Transforms short database attribute names into high-intent web search query phrases.
 * Prevents search engine ambiguity without modifying database attribute names or slugs.
 */

const PHRASE_MAP = {
  // General & Release
  announced: 'official announcement date announced',
  released: 'official release date availability',
  'device model': 'exact model number model code variant',
  'ip resistant': 'IP rating ingress protection water dust resistance',
  'user interface': 'operating system Android version user interface UI software',
  'released os version': 'operating system version at launch',
  'major os updates': 'OS updates software support years Android updates',

  // Display
  display: 'display screen specifications',
  'display type': 'display panel type OLED AMOLED LTPO LCD',
  size: 'display screen size inches',
  resolution: 'display resolution pixels',
  'display colors': 'display colors color depth',
  'display protection': 'display glass screen protection',
  'display refresh rate': 'display refresh rate Hz',
  'pixel density': 'pixel density PPI',
  'secondary display': 'secondary display screen size resolution',
  'scratch resistant screen': 'scratch resistant glass screen protection',
  features: 'display features HDR brightness touch sampling rate',

  // Hardware & Memory
  chipset: 'chipset processor SoC model',
  cpu: 'CPU processor cores clock speed GHz',
  gpu: 'GPU graphics processor model',
  ram: 'RAM memory capacity memory type',
  'ram memory': 'RAM memory capacity memory type',
  storage: 'internal storage capacity storage variants',
  'internal storage': 'internal storage capacity storage variants UFS',
  internal: 'RAM internal storage capacity variants',
  'card slot': 'microSD memory card slot expandable storage',

  // Battery & Charging
  battery: 'battery capacity mAh',
  'battery capacity': 'battery capacity mAh',
  'battery type': 'battery type technology Li-Po Li-Ion silicon carbon',
  capacity: 'battery capacity mAh',
  placement: 'battery removable non-removable',
  'wired charging': 'wired charging fast charging maximum wattage W',
  'wireless charging': 'wireless charging Qi maximum wattage W',
  'reverse charging': 'reverse charging wireless wired support',
  'video playback time hours': 'battery life video playback hours test',

  // Camera
  camera: 'rear main camera specifications megapixels sensor',
  'camera branding': 'camera optics branding Leica Zeiss Hasselblad',
  'main lens': 'main primary camera megapixels sensor aperture OIS',
  'ultrawide lens': 'ultrawide camera megapixels field of view aperture',
  'telephoto periscope lens': 'periscope telephoto camera optical zoom megapixels OIS',
  'telephoto lens': 'telephoto camera optical zoom megapixels OIS',
  'macro depth sensor': 'macro depth camera sensor megapixels',
  'rear video resolution': 'rear camera video recording resolution 4K 8K frame rate FPS',
  'front selfie camera': 'front selfie camera megapixels aperture',
  'front camera': 'front selfie camera megapixels aperture',
  'front video resolution': 'front camera video recording resolution 4K 1080p frame rate FPS',
  'camera features': 'camera features HDR panorama flash OIS EIS autofocus',

  // Connectivity & Network
  '2g network': '2G GSM network bands',
  '3g network': '3G WCDMA network bands',
  '4g network': '4G LTE network bands',
  '5g network': '5G NR network bands SA NSA',
  'dual sim': 'dual SIM dual standby DSDS',
  esim: 'eSIM support',
  'sim type': 'SIM card type Nano SIM eSIM',
  bluetooth: 'Bluetooth version Bluetooth codecs A2DP LE',
  gps: 'GPS GNSS positioning systems',
  'headphone jack': '3.5mm headphone jack audio port',
  '3.5mm jack': '3.5mm headphone jack audio port',
  hdmi: 'HDMI video output DisplayPort',
  infrared: 'IR blaster infrared port',
  'ir blaster': 'IR blaster infrared remote',
  'usb interface': 'USB Type-C port connector',
  'usb version': 'USB version USB 2.0 USB 3.2 DisplayPort OTG',
  usb: 'USB Type-C USB OTG',
  'wi fi': 'Wi-Fi standard supported versions 802.11',
  wlan: 'Wi-Fi wireless network standards',
  'wi fi hotspot': 'Wi-Fi hotspot tethering',
  positioning: 'GPS GNSS positioning Galileo GLONASS BeiDou',
  nfc: 'NFC contactless communication support',

  // Design & Build
  colors: 'official color options colors variants',
  type: 'phone form factor design type candybar foldable',
  weight: 'device weight grams',
  'height mm': 'device height dimensions mm',
  'width mm': 'device width dimensions mm',
  'thickness mm': 'device thickness dimensions mm',
  dimensions: 'device dimensions height width thickness',
  build: 'build materials glass aluminum metal frame',
  protection: 'Gorilla Glass display protection IP rating water dust resistance',

  // Audio & Sensors
  audio: 'audio stereo speakers audio codec 3.5mm jack',
  microphones: 'microphone microphones noise cancellation',
  speakers: 'stereo speakers audio Dolby Atmos',
  loudspeaker: 'loudspeaker stereo speaker configuration',
  'fingerprint reader': 'fingerprint sensor in-display side-mounted optical ultrasonic',
  sensors: 'sensors fingerprint accelerometer gyroscope proximity compass',
  proximity: 'proximity sensor',
  accelerometer: 'accelerometer sensor',
  'ambient light': 'ambient light sensor',
  gyroscope: 'gyroscope sensor',
  'sar sensor': 'SAR value SAR rating',
  'electronic compass': 'electronic compass magnetometer',
  barometer: 'barometer sensor atmospheric pressure',

  // AI Features
  'ai assistant': 'built-in AI assistant AI features Gemini Siri Bixby',
  'ai photography editing': 'AI photography AI photo editing generative editing',
  'ai text audio tools': 'AI writing transcription translation summarization tools',
  'on device ai engine': 'NPU neural processing unit AI engine on-device AI',

  // Box Content
  'included items': 'box contents included accessories charger cable documentation'
};

const REVIEW_ATTRIBUTES = new Set([
  'video playback time hours'
]);

/**
 * Builds a search-engine optimized query phrase for live web searches using live app database attributes.
 * @param {string} brand - Device brand (e.g. "Samsung", "Honor")
 * @param {string} deviceName - Device name (e.g. "Galaxy S26+", "Magic V6")
 * @param {string} attributeName - Target attribute (e.g. "Announced", "GPU")
 * @param {string} [groupName] - Optional category group (e.g. "General", "Display")
 * @param {Array<object>} [dbAttributes] - Live PostgreSQL device attributes from getDeviceAttributes()
 * @returns {string} Optimized search query string
 */
export function buildOptimizedSearchQuery(brand, deviceName, attributeName, groupName = '', dbAttributes = []) {
  const rawAttr = (attributeName || '').trim();
  const norm = rawAttr
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const fallbackPhrase =
    norm.length <= 4
      ? `${rawAttr} technical specifications`
      : `${rawAttr} specifications`;

  const expandedPhrase = PHRASE_MAP[norm] || fallbackPhrase;
  
  const normGroup = (groupName || '').trim().toLowerCase();
  let groupContext = '';
  if (
    groupName?.trim() &&
    !['general', 'quick specifications', 'specs', 'specifications'].includes(normGroup) &&
    !norm.includes(normGroup) &&
    !expandedPhrase.toLowerCase().includes(normGroup)
  ) {
    groupContext = groupName.trim();
  }

  let isOfficial = true;
  if (REVIEW_ATTRIBUTES.has(norm)) {
    isOfficial = false;
  } else if (dbAttributes && dbAttributes.length > 0) {
    const dbSet = new Set(
      dbAttributes.flatMap(attr => {
        const normName = (attr.name || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
        const normSlug = (attr.slug || '').replace(/-/g, ' ').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
        return [normName, normSlug];
      }).filter(Boolean)
    );
    isOfficial = dbSet.has(norm);
  }

  const sourceIntent = isOfficial ? 'official specifications' : 'review test';

  return [
    brand?.trim(),
    deviceName?.trim(),
    groupContext,
    expandedPhrase,
    sourceIntent
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}
