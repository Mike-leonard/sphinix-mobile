import fs from 'fs';
import path from 'path';

// Read settings.json at startup to dynamically configure remotePatterns
const settingsPath = path.join(process.cwd(), 'data/settings.json');
let dynamicPatterns = [];

try {
  if (fs.existsSync(settingsPath)) {
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    if (settings?.media?.cdnDomains && Array.isArray(settings.media.cdnDomains)) {
      dynamicPatterns = settings.media.cdnDomains.map(domain => ({
        protocol: 'https',
        hostname: domain.replace(/^https?:\/\//, ''), // Strip protocol if user pasted it
      }));
    }
  }
} catch (e) {
  console.warn("Could not read settings.json for Next.js image configuration.");
}

// Fallback defaults if empty
if (dynamicPatterns.length === 0) {
  dynamicPatterns = [
    { protocol: 'https', hostname: 'res.cloudinary.com' },
    { protocol: 'https', hostname: 'images.unsplash.com' }
  ];
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: dynamicPatterns,
  },
};

export default nextConfig;
