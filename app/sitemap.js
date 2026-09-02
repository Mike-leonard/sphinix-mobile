import prisma from '@/lib/prisma';
import { getSettings } from '@/actions/settings';
import { generateBrandSlug, generateDeviceSlug } from '@/lib/utils';

export default async function sitemap() {
  const settings = await getSettings();
  
  if (settings.seo?.advanced?.generateSitemap === false) {
    return [];
  }

  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://sphinix.xyz').replace(/\/$/, '');

  // Static site routes
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/phones`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/comparisons`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Dynamic published smartphone detail pages
  let phoneRoutes = [];
  try {
    const publishedDevices = await prisma.device.findMany({
      where: { status: 'PUBLISHED' },
      select: { id: true, name: true, brandName: true, updatedAt: true }
    });

    phoneRoutes = publishedDevices.map((device) => {
      const brandSlug = generateBrandSlug(device.brandName || 'general');
      const deviceSlug = generateDeviceSlug(device.name || device.id);
      return {
        url: `${baseUrl}/phones/${brandSlug}/${deviceSlug}`,
        lastModified: device.updatedAt ? new Date(device.updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      };
    });
  } catch (e) {
    console.error('Error generating phone sitemap routes:', e);
  }

  // Dynamic published blog articles
  let blogRoutes = [];
  try {
    const publishedBlogs = await prisma.blog.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true }
    });

    blogRoutes = publishedBlogs.map((blog) => {
      return {
        url: `${baseUrl}/blogs/${blog.slug}`,
        lastModified: blog.updatedAt ? new Date(blog.updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      };
    });
  } catch (e) {
    console.error('Error generating blog sitemap routes:', e);
  }

  return [...staticRoutes, ...phoneRoutes, ...blogRoutes];
}
