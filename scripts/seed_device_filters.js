import 'dotenv/config';
import prisma from '../lib/prisma.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const jsonPath = path.join(__dirname, '../data/device-filters.json');
  const rawData = fs.readFileSync(jsonPath, 'utf8');
  const filtersData = JSON.parse(rawData);

  console.log(`Found ${filtersData.length} filter categories in JSON. Seeding to PostgreSQL...`);

  for (let i = 0; i < filtersData.length; i++) {
    const filter = filtersData[i];
    const created = await prisma.deviceFilter.upsert({
      where: { id: filter.id },
      update: {
        title: filter.title,
        attributeSlug: filter.attributeSlug,
        options: filter.options || [],
        order: i
      },
      create: {
        id: filter.id,
        title: filter.title,
        attributeSlug: filter.attributeSlug,
        options: filter.options || [],
        order: i
      }
    });
    console.log(`Seeded filter: ${created.title} (${created.id}) with ${created.options.length} options`);
  }

  console.log("Device filters successfully seeded into PostgreSQL!");
}

main()
  .catch((e) => {
    console.error("Error seeding device filters:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
