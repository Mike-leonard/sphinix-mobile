import 'dotenv/config';
import prisma from '../lib/prisma.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  // 1. Seed Groups
  const groupsPath = path.join(__dirname, '../data/device-groups.json');
  const groupsData = JSON.parse(fs.readFileSync(groupsPath, 'utf8'));

  console.log(`Seeding ${groupsData.length} device groups to PostgreSQL...`);
  for (let i = 0; i < groupsData.length; i++) {
    const groupName = groupsData[i];
    await prisma.deviceGroup.upsert({
      where: { name: groupName },
      update: { order: i },
      create: { name: groupName, order: i }
    });
  }
  console.log("Device groups seeded successfully!");

  // 2. Seed Attributes
  const attributesPath = path.join(__dirname, '../data/device-attributes.json');
  const attributesData = JSON.parse(fs.readFileSync(attributesPath, 'utf8'));

  console.log(`Seeding ${attributesData.length} device attributes to PostgreSQL...`);
  for (let i = 0; i < attributesData.length; i++) {
    const attr = attributesData[i];
    await prisma.deviceAttribute.upsert({
      where: { id: attr.id },
      update: {
        name: attr.name,
        slug: attr.slug,
        terms: attr.terms || [],
        groupIds: attr.groupIds || ['General'],
        placeholder: attr.placeholder || null,
        order: i
      },
      create: {
        id: attr.id,
        name: attr.name,
        slug: attr.slug,
        terms: attr.terms || [],
        groupIds: attr.groupIds || ['General'],
        placeholder: attr.placeholder || null,
        order: i
      }
    });
  }
  console.log("Device attributes seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding groups & attributes:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
