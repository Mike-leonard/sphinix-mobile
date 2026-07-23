import 'dotenv/config';
import prisma from '../lib/prisma.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const jsonPath = path.join(__dirname, '../data/rating-bars.json');
  const rawData = fs.readFileSync(jsonPath, 'utf8');
  const barsData = JSON.parse(rawData);

  console.log(`Found ${barsData.length} rating bars in JSON. Seeding to PostgreSQL...`);

  for (let i = 0; i < barsData.length; i++) {
    const bar = barsData[i];
    const created = await prisma.ratingBar.upsert({
      where: { id: bar.id },
      update: {
        name: bar.name,
        slug: bar.slug,
        description: bar.description || '',
        defaultValue: bar.defaultValue ?? 3,
        order: i
      },
      create: {
        id: bar.id,
        name: bar.name,
        slug: bar.slug,
        description: bar.description || '',
        defaultValue: bar.defaultValue ?? 3,
        order: i
      }
    });
    console.log(`Seeded rating bar: ${created.name} (${created.id})`);
  }

  console.log("Rating bars successfully seeded into PostgreSQL!");
}

main()
  .catch((e) => {
    console.error("Error seeding rating bars:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
