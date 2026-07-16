const fs = require('fs');
const path = './data/device-attributes.json';
let attributes = JSON.parse(fs.readFileSync(path, 'utf8'));

let idCounter = 1;
const generateId = () => `attr_${Date.now()}_${Math.floor(Math.random() * 10000)}_${idCounter++}`;

// --- 1. General > User Interface ---
// Remove old attribute
attributes = attributes.filter(a => !(a.name.startsWith('User Interface') && a.groupIds.includes('General')));

// Add new attribute
attributes.push({
  id: generateId(),
  name: "User Interface",
  slug: "user-interface",
  terms: ["MagicOS", "One UI", "ColorOS", "HyperOS", "OriginOS", "Funtouch OS", "OxygenOS", "Realme UI", "iOS", "Stock Android"],
  groupIds: ["General"]
});


// --- 2. Design > Dimensions ---
// Remove old attribute
attributes = attributes.filter(a => !(a.name.includes('Dimensions') && a.groupIds.includes('Design')));

// Add new attributes
attributes.push({
  id: generateId(),
  name: "Height (mm)",
  slug: "height-mm",
  terms: [],
  groupIds: ["Design"]
});
attributes.push({
  id: generateId(),
  name: "Width (mm)",
  slug: "width-mm",
  terms: [],
  groupIds: ["Design"]
});
attributes.push({
  id: generateId(),
  name: "Thickness (mm)",
  slug: "thickness-mm",
  terms: [],
  groupIds: ["Design"]
});


// --- 3. Camera ---
// We want to replace almost the entire Camera group.
// Let's identify the old camera attributes the user specified:
const oldCameraNames = [
  "Primary (how many lens) if 3 add different lens options",
  "Camera Sensor",
  "Aperture (W)",
  "Image",
  "Zoom",
  "Video Resolution",
  "Secondary",
  "Aperture",
  "Flash",
  "Camera Features"
];

// Remove them if they are in the Camera group
attributes = attributes.filter(a => {
  if (a.groupIds.includes('Camera')) {
    // Some names like "Video Resolution" might be exactly matched.
    if (oldCameraNames.includes(a.name) || oldCameraNames.some(old => a.name.includes(old))) {
      return false; // Remove
    }
  }
  return true; // Keep
});

// Add the new lens-specific strategy attributes
const newCameraAttributes = [
  { name: "Camera Branding", slug: "camera-branding", terms: ["Leica", "Zeiss", "Hasselblad", "Hasselblad Color Calibration"] },
  { name: "Main Lens", slug: "main-lens", terms: [] },
  { name: "Ultrawide Lens", slug: "ultrawide-lens", terms: [] },
  { name: "Telephoto / Periscope Lens", slug: "telephoto-lens", terms: [] },
  { name: "Macro / Depth Sensor", slug: "macro-depth-sensor", terms: [] },
  { name: "Rear Video Resolution", slug: "rear-video-resolution", terms: ["8K@24/30fps", "4K@30/60fps", "1080p@30/60/120/240fps"] },
  { name: "Front / Selfie Camera", slug: "front-camera", terms: [] },
  { name: "Front Video Resolution", slug: "front-video-resolution", terms: ["4K@30/60fps", "1080p@30/60fps"] },
  { name: "Camera Features", slug: "camera-features", terms: ["LED flash", "HDR", "panorama", "Dual-LED flash", "Ring-LED flash"] }
];

newCameraAttributes.forEach(attr => {
  attributes.push({
    id: generateId(),
    name: attr.name,
    slug: attr.slug,
    terms: attr.terms,
    groupIds: ["Camera"]
  });
});

fs.writeFileSync(path, JSON.stringify(attributes, null, 2));
console.log("Attributes updated successfully. Total attributes:", attributes.length);
