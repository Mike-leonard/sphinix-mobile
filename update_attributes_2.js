const fs = require('fs');
const path = './data/device-attributes.json';
let attributes = JSON.parse(fs.readFileSync(path, 'utf8'));

let idCounter = 1;
const generateId = () => `attr_${Date.now()}_${Math.floor(Math.random() * 10000)}_${idCounter++}`;

// --- 1. General > OS ---
// The old attribute might be named "OS (android version, how many major updates)"
// Replace it or update it.
attributes = attributes.filter(a => {
  if (a.groupIds.includes('General') && a.name.includes('OS (android')) {
    return false; // remove
  }
  return true;
});

attributes.push({
  id: generateId(),
  name: "OS",
  slug: "os",
  terms: [],
  groupIds: ["General"],
  placeholder: "e.g. Android 14 (up to 4 major updates)"
});


// --- 2. Design > Dimensions ---
// Remove the split ones (Height, Width, Thickness) if they exist
attributes = attributes.filter(a => {
  if (a.groupIds.includes('Design')) {
    if (a.name === 'Height (mm)' || a.name === 'Width (mm)' || a.name === 'Thickness (mm)') {
      return false; // remove
    }
  }
  return true;
});

// Add single dimensions attribute
attributes.push({
  id: generateId(),
  name: "Dimensions (H x W x T)",
  slug: "dimensions",
  terms: [],
  groupIds: ["Design"],
  placeholder: "e.g. 162.3 x 79 x 8.6 mm"
});

fs.writeFileSync(path, JSON.stringify(attributes, null, 2));
console.log("Attributes updated successfully.");
