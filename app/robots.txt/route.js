import { getSettings } from '@/actions/settings';

export async function GET() {
  const settings = await getSettings();
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://sphinix.xyz').replace(/\/$/, '');
  
  // Default fallback if not defined in dashboard settings
  let content = settings.seo?.advanced?.robotsTxt || `User-agent: *\nAllow: /\nDisallow: /dashboard/\nDisallow: /api/`;
  
  if (!content.includes('Sitemap:')) {
    content += `\n\nSitemap: ${baseUrl}/sitemap.xml`;
  }

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  });
}
