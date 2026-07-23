import 'dotenv/config';
import prisma from '../lib/prisma.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const defaultGroups = [
  "General",
  "Design",
  "Network",
  "Display",
  "Hardware",
  "Camera",
  "Connectivity",
  "Battery",
  "Audio",
  "Multimedia",
  "Software",
  "Sensors",
  "In The Box"
];

async function main() {
  // 1. Seed Groups
  const groupsPath = path.join(__dirname, '../data/device-groups.json');
  let groupsData = defaultGroups;
  if (fs.existsSync(groupsPath)) {
    groupsData = JSON.parse(fs.readFileSync(groupsPath, 'utf8'));
  }

  console.log(`Seeding ${groupsData.length} device groups to PostgreSQL...`);
  const createdGroupsMap = new Map();

  for (let i = 0; i < groupsData.length; i++) {
    const groupName = typeof groupsData[i] === 'string' ? groupsData[i] : groupsData[i].name;
    const dbGroup = await prisma.deviceGroup.upsert({
      where: { name: groupName },
      update: { order: i },
      create: { name: groupName, order: i }
    });
    createdGroupsMap.set(groupName, dbGroup);
  }
  console.log("Device groups seeded successfully!");

  // 2. Seed Attributes with Foreign Key Relation (groupId & deviceGroup)
  const attributesPath = path.join(__dirname, '../data/device-attributes.json');
  const attributesData = JSON.parse(fs.readFileSync(attributesPath, 'utf8'));

  console.log(`Seeding ${attributesData.length} device attributes to PostgreSQL...`);
  for (let i = 0; i < attributesData.length; i++) {
    const attr = attributesData[i];
    const groupName = (attr.groupIds && attr.groupIds[0]) || attr.group || 'General';
    const targetGroup = createdGroupsMap.get(groupName) || createdGroupsMap.get('General');

    await prisma.deviceAttribute.upsert({
      where: { id: attr.id },
      update: {
        name: attr.name,
        slug: attr.slug,
        terms: attr.terms || [],
        group: groupName,
        groupId: targetGroup ? targetGroup.id : null,
        placeholder: attr.placeholder || null,
        order: i
      },
      create: {
        id: attr.id,
        name: attr.name,
        slug: attr.slug,
        terms: attr.terms || [],
        group: groupName,
        groupId: targetGroup ? targetGroup.id : null,
        placeholder: attr.placeholder || null,
        order: i
      }
    });
  }
  console.log("Device attributes seeded successfully with BlogCategory/Blog style relations!");
}

main()
  .catch((e) => {
    console.error("Error seeding groups & attributes:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
