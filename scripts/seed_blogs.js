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
  console.log('Migrating Blogs...');
  const blogsData = JSON.parse(await fs.readFile(path.join(process.cwd(), 'data', 'blogs.json'), 'utf8'));
  for (const blog of blogsData) {
    await prisma.blog.upsert({
      where: { id: blog.id },
      update: {
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
}

main().catch(console.error).finally(() => prisma.$disconnect());
