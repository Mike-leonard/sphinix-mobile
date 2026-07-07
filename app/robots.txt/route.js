import { getSettings } from '@/actions/settings';

export async function GET() {
  const settings = await getSettings();
  
  // Default fallback if not defined
  const content = settings.seo?.advanced?.robotsTxt || `User-agent: *\nAllow: /`;
  
  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  });
}
