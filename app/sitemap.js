import { getSettings } from '@/actions/settings';

export default async function sitemap() {
  const settings = await getSettings();
  
  if (!settings.seo?.advanced?.generateSitemap) {
    return [];
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://sphinix-mobile.com';

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/phones`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
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
}
