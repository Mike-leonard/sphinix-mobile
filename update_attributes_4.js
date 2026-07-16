const fs = require('fs');
const path = './data/device-attributes.json';
let attributes = JSON.parse(fs.readFileSync(path, 'utf8'));

let idCounter = 1;
const generateId = () => `attr_${Date.now()}_${Math.floor(Math.random() * 10000)}_${idCounter++}`;

// --- General > OS ---
// Remove the single OS attribute I just added
attributes = attributes.filter(a => {
  if (a.groupIds.includes('General') && a.name === 'OS') {
    return false; // remove
  }
  return true;
});

// Add split OS attributes
attributes.push({
  id: generateId(),
  name: "Released OS Version",
  slug: "released-os-version",
  terms: [],
  groupIds: ["General"],
  placeholder: "e.g. Android 14"
});
attributes.push({
  id: generateId(),
  name: "Major OS Updates",
  slug: "major-os-updates",
  terms: [],
  groupIds: ["General"],
  placeholder: "e.g. 4 years of upgrades"
});

fs.writeFileSync(path, JSON.stringify(attributes, null, 2));
console.log("Attributes updated successfully.");
