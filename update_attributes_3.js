const fs = require('fs');
const path = './data/device-attributes.json';
let attributes = JSON.parse(fs.readFileSync(path, 'utf8'));

let idCounter = 1;
const generateId = () => `attr_${Date.now()}_${Math.floor(Math.random() * 10000)}_${idCounter++}`;

// --- Re-split Dimensions (Height, Width, Thickness) ---
// Remove the single dimensions attribute
attributes = attributes.filter(a => {
  if (a.groupIds.includes('Design') && a.name === 'Dimensions (H x W x T)') {
    return false; // remove
  }
  return true;
});

// Add split dimensions attribute
attributes.push({
  id: generateId(),
  name: "Height (mm)",
  slug: "height-mm",
  terms: [],
  groupIds: ["Design"],
  placeholder: "e.g. 162.3"
});
attributes.push({
  id: generateId(),
  name: "Width (mm)",
  slug: "width-mm",
  terms: [],
  groupIds: ["Design"],
  placeholder: "e.g. 79.0"
});
attributes.push({
  id: generateId(),
  name: "Thickness (mm)",
  slug: "thickness-mm",
  terms: [],
  groupIds: ["Design"],
  placeholder: "e.g. 8.6"
});

fs.writeFileSync(path, JSON.stringify(attributes, null, 2));
console.log("Attributes updated successfully.");
