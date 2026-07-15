const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/device-attributes.json');
let attributes = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const seedData = {
  // Connectivity
  "bluetooth": ["5.0", "5.1", "5.2", "5.3", "5.4"],
  "gps": ["Yes, with A-GPS", "GLONASS, GALILEO, BDS", "Dual-band A-GPS"],
  "nfc": ["Yes", "No", "Yes (market/region dependent)"],
  "radio": ["FM radio", "No"],
  "usb": ["USB Type-C 2.0", "USB Type-C 3.2", "Lightning, USB 2.0"],
  "wi-fi": ["Wi-Fi 802.11 a/b/g/n/ac/6/7", "Dual-band", "Wi-Fi Direct", "Hotspot"],
  "wireless-charging": ["15W wireless", "50W wireless", "No"],

  // Data
  "speed": ["HSPA 42.2/5.76 Mbps, LTE-A, 5G", "HSPA, LTE", "5G"],
  "web-browser": ["HTML5"],

  // Design / Dimensions / Hardware
  "build": ["Glass front, glass back, aluminum frame", "Glass front, plastic back", "Titanium frame"],
  "colors": ["Black", "White", "Blue", "Green", "Silver", "Gold"],
  "weight": ["150 g", "180 g", "200 g", "220 g", "240 g"],
  "protection": ["Corning Gorilla Glass Victus", "Ceramic Shield", "Sapphire crystal"],
  "dimensions": ["160 x 75 x 8 mm", "150 x 70 x 7.5 mm"],
  "sim": ["Nano-SIM", "Nano-SIM and eSIM", "Dual SIM (Nano-SIM, dual stand-by)"],
  "sensors": ["Fingerprint (under display, optical)", "Accelerometer", "Gyro", "Proximity", "Compass", "Face ID"],
  
  // Display
  "display-type": ["AMOLED, 120Hz", "Super AMOLED", "OLED", "IPS LCD"],
  "resolution": ["1080 x 2400 pixels", "1440 x 3200 pixels", "1170 x 2532 pixels"],
  "size": ["6.1 inches", "6.5 inches", "6.7 inches", "6.8 inches"],
  "pixel-density": ["~390 ppi", "~460 ppi", "~500 ppi"],
  "touch-screen": ["Yes", "Capacitive touchscreen"],

  // Performance / General
  "price": ["$500", "$800", "$1000", "$1200", "€400", "€900"],
  "status": ["Available", "Coming soon", "Discontinued"],
  "announced": ["2023, September", "2024, January", "2024, February"],
  "water-resistant": ["IP68 dust/water resistant (up to 6m for 30 mins)", "IP67 dust/water resistant", "Splash resistant"],

  // Audio / Media
  "loudspeaker": ["Yes, with stereo speakers", "Yes"],
  "3-5mm-jack": ["Yes", "No"],
  "audio-features": ["Tuned by AKG", "Snapdragon Sound", "Hi-Res audio"],

  // Memory
  "card-slot": ["microSDXC (uses shared SIM slot)", "microSDXC (dedicated slot)", "No"],
  "internal-memory": ["128GB 8GB RAM", "256GB 12GB RAM", "512GB 16GB RAM", "1TB 16GB RAM"],

  // Processor
  "cpu": ["Octa-core (1x3.3 GHz Cortex-X4 & 3x3.2 GHz Cortex-A720 & 2x3.0 GHz Cortex-A720 & 2x2.3 GHz Cortex-A520)", "Hexa-core"],
  "gpu": ["Adreno 750", "Apple GPU (6-core graphics)", "Xclipse 940"],
  "chipset": ["Qualcomm Snapdragon 8 Gen 3 (4 nm)", "Apple A17 Pro (3 nm)", "Exynos 2400 (4 nm)"],

  // Messaging
  "sms": ["Threaded view"],
  "email": ["Push Email", "IMAP/POP3"],

  // Network
  "2g-network": ["GSM 850 / 900 / 1800 / 1900"],
  "3g-network": ["HSDPA 850 / 900 / 1700 / 1900 / 2100"],
  "4g-network": ["LTE band 1, 2, 3, 4, 5, 7, 8, 12, 17, 20, 28, 38, 40, 41"],
  "5g-network": ["SA/NSA/Sub6/mmWave"]
};

let updated = 0;
attributes.forEach(attr => {
  if (seedData[attr.slug] && (!attr.terms || attr.terms.length === 0)) {
    attr.terms = seedData[attr.slug];
    updated++;
  } else if (!attr.terms || attr.terms.length === 0) {
    // Generate some generic mock data if we didn't specify it, based on the group
    if (attr.groupIds) {
      if (attr.groupIds.includes('Display')) attr.terms = ["Standard", "Advanced", "Pro"];
      else if (attr.groupIds.includes('Performance')) attr.terms = ["High", "Medium", "Low"];
      else if (attr.groupIds.includes('Software')) attr.terms = ["Supported", "Not Supported"];
      else if (attr.groupIds.includes('Imaging')) attr.terms = ["Optic", "Digital"];
      else if (attr.groupIds.includes('Network')) attr.terms = ["Supported", "Global", "Regional"];
      else attr.terms = ["Option A", "Option B", "Option C"];
      updated++;
    }
  }
});

fs.writeFileSync(filePath, JSON.stringify(attributes, null, 2));
console.log(`Successfully seeded terms for ${updated} additional attributes!`);
