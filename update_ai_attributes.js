const fs = require('fs');
const path = './data/device-attributes.json';
let attributes = JSON.parse(fs.readFileSync(path, 'utf8'));

let idCounter = 1;
const generateId = () => `attr_${Date.now()}_${Math.floor(Math.random() * 10000)}_${idCounter++}`;

// First, ensure we don't duplicate them if run multiple times
const newNames = [
  "AI Assistant",
  "AI Photography & Editing",
  "AI Text & Audio Tools",
  "On-Device AI Engine"
];

attributes = attributes.filter(a => {
  if (a.groupIds.includes('AI Features') && newNames.includes(a.name)) {
    return false; // remove existing ones to prevent duplicates
  }
  return true;
});

// Add AI Attributes
attributes.push({
  id: generateId(),
  name: "AI Assistant",
  slug: "ai-assistant",
  terms: ["Apple Intelligence", "Galaxy AI", "Google Gemini", "Siri", "Bixby", "ChatGPT Integration"],
  groupIds: ["AI Features"],
  placeholder: "e.g. Galaxy AI"
});

attributes.push({
  id: generateId(),
  name: "AI Photography & Editing",
  slug: "ai-photography",
  terms: ["Magic Eraser", "Generative Edit", "AI Photo Remaster", "Best Take", "AI Object Removal"],
  groupIds: ["AI Features"],
  placeholder: "e.g. Magic Eraser, Generative Edit"
});

attributes.push({
  id: generateId(),
  name: "AI Text & Audio Tools",
  slug: "ai-text-audio",
  terms: ["Circle to Search", "Live Translate", "Note Summarizer", "Call Transcript", "Chat Assist"],
  groupIds: ["AI Features"],
  placeholder: "e.g. Circle to Search, Live Translate"
});

attributes.push({
  id: generateId(),
  name: "On-Device AI Engine",
  slug: "on-device-ai",
  terms: ["Gemini Nano", "Apple Neural Engine", "Snapdragon Hexagon NPU", "MediaTek APU"],
  groupIds: ["AI Features"],
  placeholder: "e.g. Gemini Nano"
});

fs.writeFileSync(path, JSON.stringify(attributes, null, 2));
console.log("AI attributes added successfully.");
