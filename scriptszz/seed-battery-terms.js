const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/device-attributes.json');
let attributes = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const seedData = {
  "capacity": ["3000 mAh", "4000 mAh", "4500 mAh", "5000 mAh", "5500 mAh", "6000 mAh"],
  "music-play": ["Up to 40 h", "Up to 50 h", "Up to 60 h", "Up to 80 h"],
  "placement": ["Non-removable", "Removable"],
  "standby": ["Up to 380 h (3G)", "Up to 400 h (3G)", "Up to 500 h (3G)", "Up to 600 h (3G)"],
  "talk-time": ["Up to 15 h (3G)", "Up to 20 h (3G)", "Up to 25 h (3G)", "Up to 30 h (3G)", "Up to 35 h (3G)"]
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
