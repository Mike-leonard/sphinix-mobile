import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function slugifyCategory(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  const filePath = path.join(process.cwd(), 'data', 'categories.json');
  const rawData = fs.readFileSync(filePath, 'utf8');
  const categories = JSON.parse(rawData);

  console.log(`Found ${categories.length} categories in categories.json:`, categories);

  for (const catName of categories) {
    if (!catName || typeof catName !== 'string') continue;
    const trimmed = catName.trim();
    const slug = slugifyCategory(trimmed);

    const upserted = await prisma.blogCategory.upsert({
      where: { slug },
      update: { name: trimmed },
      create: { name: trimmed, slug }
    });

    console.log(`Seeded category: "${upserted.name}" (id: ${upserted.id}, slug: "${upserted.slug}")`);
  }

  console.log('Category seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding categories:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
