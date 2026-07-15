const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/device-attributes.json');
let attributes = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const seedData = {
  "ram-memory": ["4GB", "6GB", "8GB", "12GB", "16GB", "24GB"],
  "ram": ["4GB", "6GB", "8GB", "12GB", "16GB", "24GB"],
  "internal-memory": ["64GB", "128GB", "256GB", "512GB", "1TB"],
  "processor-type": ["Snapdragon 8 Gen 3", "Snapdragon 8 Gen 2", "Apple A18 Pro", "Apple A17 Pro", "MediaTek Dimensity 9300", "Google Tensor G3"],
  "resolution": ["1080 x 2400 pixels", "1440 x 3200 pixels", "1170 x 2532 pixels", "1290 x 2796 pixels"],
  "display-type": ["AMOLED", "Super AMOLED", "OLED", "LTPO OLED", "IPS LCD"],
  "battery-type": ["Li-Po", "Li-Ion"],
  "operating-system": ["Android 14", "Android 13", "iOS 18", "iOS 17", "iOS 16"],
  "5g-network": ["Sub6", "mmWave", "Sub6/mmWave"],
  "wi-fi": ["Wi-Fi 6", "Wi-Fi 6E", "Wi-Fi 7", "Wi-Fi 5"],
  "bluetooth": ["5.3", "5.4", "5.2"],
  "charging": ["20W wired", "25W wired", "45W wired", "65W wired", "100W wired", "120W wired", "15W wireless"],
  "fingerprint": ["Under display, optical", "Under display, ultrasonic", "Side-mounted", "Rear-mounted"],
  "usb": ["USB Type-C 2.0", "USB Type-C 3.2", "Lightning"]
};

let updated = 0;
attributes.forEach(attr => {
  if (seedData[attr.slug]) {
    attr.terms = seedData[attr.slug];
    updated++;
  }
});

fs.writeFileSync(filePath, JSON.stringify(attributes, null, 2));
console.log(`Successfully seeded terms for ${updated} attributes!`);
