const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/device-attributes.json');
let attributes = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const seedData = {
  "camera-features": ["HDR", "Panorama", "Zeiss optics", "Leica lens", "OIS", "EIS", "Laser AF"],
  "flash": ["LED flash", "Dual-LED flash", "Dual-LED dual-tone flash", "Quad-LED flash", "Ring-LED flash"],
  "image": ["JPEG", "RAW", "HEIF", "ProRAW"],
  "primary": ["12 MP, f/1.8", "48 MP, f/1.8", "50 MP, f/1.9", "64 MP, f/1.8", "108 MP, f/1.8", "200 MP, f/1.7"],
  "secondary": ["12 MP, f/2.2", "16 MP, f/2.4", "32 MP, f/2.0", "Under-display 4 MP", "Under-display 12 MP"],
  "video": ["4K@30fps", "4K@60fps", "8K@24fps", "8K@30fps", "1080p@60fps", "1080p@240fps"]
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
