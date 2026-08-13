import { getSettings } from '@/actions/settings';
import { isSameJson } from '@/components/StructuredData';

export async function generateMetadata() {
  const settings = await getSettings();
  const data = settings?.seo?.blogs || {};
  
  const title = data.title || "Blog & Tech Articles";
  const description = data.description || "Read expert smartphone reviews, buying guides, tech news, and mobile technology insights on Sphinix Mobile.";
  const keywords = data.keywords
    ? data.keywords.split(',').map(k => k.trim()).filter(Boolean)
    : ["tech blog", "mobile news", "smartphone reviews", "tech guides"];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: data.ogTitle || title,
      description: data.ogDescription || description,
      images: data.ogImage ? [{ url: data.ogImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.ogTitle || title,
      description: data.ogDescription || description,
      images: data.ogImage ? [data.ogImage] : [],
    }
  };
}

export default async function BlogsLayout({ children }) {
  const settings = await getSettings();
  const rawData = settings?.seo?.blogs?.structuredData;
  const globalData = settings?.seo?.advanced?.globalStructuredData;

  const structuredData = rawData?.trim();
  const shouldRender = structuredData && !isSameJson(globalData, structuredData);

  return (
    <>
      {shouldRender && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredData }}
        />
      )}
      {children}
    </>
  );
}
