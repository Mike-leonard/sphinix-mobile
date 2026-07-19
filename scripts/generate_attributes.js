const fs = require('fs');

const rawData = {
  "Battery": [
    "Battery Type",
    "Capacity",
    "Placement",
    "Wired Charging",
    "Wireless charging",
    "Reverse charging",
    "Video playback time (hours)"
  ],
  "Camera": [
    "Primary (how many lens) if 3 add different lens options",
    "Camera Sensor",
    "Aperture (W)",
    "Image",
    "Zoom",
    "Video Resolution",
    "Secondary",
    "Aperture",
    "Video Resolution",
    "Flash",
    "Camera Features"
  ],
  "Connectivity": [
    "Bluetooth",
    "GPS",
    "Headphone jack",
    "HDMI",
    "Infrared",
    "NFC",
    "USB interface",
    "USB version",
    "Wi-fi",
    "Wi-fi Hotspot",
    "Positioning"
  ],
  "Design": [
    "Colors",
    "Type",
    "Dimensions (height, width, thickness)",
    "Weight"
  ],
  "Display": [
    "Display Type",
    "Size",
    "Resolution",
    "Display Colors",
    "Display Protection",
    "Display Refresh Rate",
    "Pixel Density",
    "Secondary Display",
    "Scratch Resistant Screen",
    "Features"
  ],
  "Hardware": [
    "Chipset",
    "CPU",
    "GPU",
    "RAM (Memory)",
    "Internal Storage",
    "Card Slot"
  ],
  "Sensors": [
    "Fingerprint reader",
    "Proximity",
    "Accelerometer",
    "Ambient light",
    "Gyroscope",
    "SAR sensor",
    "Electronic compass",
    "IR blaster",
    "NFC"
  ],
  "Network": [
    "2G Network",
    "3G Network",
    "4G Network",
    "5G Network",
    "Dual SIM",
    "eSim",
    "SIM Type"
  ],
  "Audio": [
    "Headphone jack",
    "Microphones",
    "Speakers"
  ],
  "Box Content": [
    "Included Items"
  ],
  "General": [
    "Device Type",
    "Announced",
    "Released",
    "Device Model",
    "IP resistant",
    "OS (android version, how many major updates)",
    "User Interface (OS name - Magic OS, ONE UI, Color OS)"
  ],
  "Quick Specifications": [
    "Chipset",
    "Camera",
    "Display",
    "RAM",
    "Storage",
    "Battery Capacity"
  ],
  "AI Features": []
};

const groups = Object.keys(rawData);

const attributesMap = new Map(); // to handle attributes that might belong to multiple groups if they have exactly the same name

let idCounter = 1;

for (const [group, attrs] of Object.entries(rawData)) {
  for (let attrName of attrs) {
    let slug = attrName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let terms = [];
    
    // Quick specs specific slug overrides
    if (group === "Quick Specifications") {
        if (attrName === "Display") slug = "screen";
        if (attrName === "Battery Capacity") slug = "battery";
        if (attrName === "RAM") slug = "ram";
        if (attrName === "Storage") slug = "storage";
        if (attrName === "Camera") slug = "camera";
        if (attrName === "Chipset") slug = "chipset";
    }

    if (group === "Box Content" && attrName === "Included Items") {
        terms = ["Smartphone / USB Type-C cable / SIM eject tool / Protective case / Safety information / Quick start guide and warranty card / Desiccant"];
    }

    if (attributesMap.has(attrName)) {
      const existing = attributesMap.get(attrName);
      if (!existing.groupIds.includes(group)) {
        existing.groupIds.push(group);
      }
    } else {
      attributesMap.set(attrName, {
        id: `attr_${Date.now()}_${idCounter++}`,
        name: attrName,
        slug: slug,
        terms: terms,
        groupIds: [group]
      });
    }
  }
}

const finalAttributes = Array.from(attributesMap.values());

fs.writeFileSync('./data/device-groups.json', JSON.stringify(groups, null, 2));
fs.writeFileSync('./data/device-attributes.json', JSON.stringify(finalAttributes, null, 2));

console.log("Generated groups:", groups.length);
console.log("Generated attributes:", finalAttributes.length);
