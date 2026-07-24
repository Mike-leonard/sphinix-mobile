import 'dotenv/config';
import prisma from '../lib/prisma.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const settingsPath = path.join(__dirname, '../data/settings.json');
  let fileData = {};

  if (fs.existsSync(settingsPath)) {
    const raw = fs.readFileSync(settingsPath, 'utf8');
    fileData = JSON.parse(raw);
    console.log("Found existing data/settings.json file. Migrating to PostgreSQL...");
  } else {
    console.log("No data/settings.json file found. Seeding initial default settings row to PostgreSQL...");
  }

  const updated = await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {
      seo: fileData.seo || undefined,
      typography: fileData.typography || undefined,
      appearance: fileData.appearance || undefined,
      analytics: fileData.analytics || undefined,
      advertisements: fileData.advertisements || undefined,
      comments: fileData.comments || undefined,
      localization: fileData.localization || undefined,
      maintenance: fileData.maintenance || undefined,
      socialMedia: fileData.socialMedia || undefined,
      media: fileData.media || undefined,
      security: fileData.security || undefined,
      ai: fileData.ai || undefined,
      recaptcha: fileData.recaptcha || undefined,
      backups: fileData.backups || undefined,
    },
    create: {
      id: 1,
      version: 1,
      seo: fileData.seo || null,
      typography: fileData.typography || null,
      appearance: fileData.appearance || null,
      analytics: fileData.analytics || null,
      advertisements: fileData.advertisements || null,
      comments: fileData.comments || null,
      localization: fileData.localization || null,
      maintenance: fileData.maintenance || null,
      socialMedia: fileData.socialMedia || null,
      media: fileData.media || null,
      security: fileData.security || null,
      ai: fileData.ai || null,
      recaptcha: fileData.recaptcha || null,
      backups: fileData.backups || null,
    }
  });

  console.log("SiteSettings singleton row successfully seeded/migrated to PostgreSQL (ID: 1, Version:", updated.version, ")");
}

main()
  .catch((e) => {
    console.error("Error seeding settings:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
