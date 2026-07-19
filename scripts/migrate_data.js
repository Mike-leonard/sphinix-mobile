const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const fs = require('fs/promises');
const path = require('path');
require('dotenv').config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting data migration to Supabase...');

  // 1. Migrate Users
  console.log('Migrating Users...');
  const usersData = JSON.parse(await fs.readFile(path.join(process.cwd(), 'data', 'users.json'), 'utf8'));
  for (const user of usersData) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified || false,
        createdAt: new Date(user.createdAt || new Date()),
        modifiedAt: new Date(user.modifiedAt || new Date()),
      },
    });
  }
  console.log(`✅ Migrated ${usersData.length} users.`);

  // 2. Migrate Blogs
  console.log('Migrating Blogs...');
  const blogsData = JSON.parse(await fs.readFile(path.join(process.cwd(), 'data', 'blogs.json'), 'utf8'));
  for (const blog of blogsData) {
    await prisma.blog.upsert({
      where: { id: blog.id },
      update: {},
      create: {
        id: blog.id,
        title: blog.title,
        excerpt: blog.excerpt || '',
        date: blog.date,
        readTime: blog.readTime || '',
        author: blog.author,
        category: blog.category,
        color: blog.color || '',
        image: blog.image || '',
        content: blog.content || '',
        status: blog.status || 'published',
        seo: blog.seo || {},
      },
    });
  }
  console.log(`✅ Migrated ${blogsData.length} blogs.`);

  // 3. Migrate Devices (Products)
  console.log('Migrating Devices...');
  const productsData = JSON.parse(await fs.readFile(path.join(process.cwd(), 'data', 'products.json'), 'utf8'));
  for (const device of productsData) {
    await prisma.device.upsert({
      where: { id: device.id },
      update: {},
      create: {
        id: device.id,
        name: device.name,
        brand: device.brand,
        category: device.category,
        price: device.price,
        rating: device.rating || 0,
        imageColor: device.imageColor || '',
        isNew: device.isNew || false,
        isTopRated: device.isTopRated || false,
        status: device.status || 'published',
        specs: device.specs || {},
      },
    });
  }
  console.log(`✅ Migrated ${productsData.length} devices.`);

  console.log('🎉 Migration completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
