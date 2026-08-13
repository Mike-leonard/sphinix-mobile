import { getSettings } from '@/actions/settings';

export async function generateMetadata() {
  const settings = await getSettings();
  const data = settings?.seo?.phones || settings?.seo?.devices || {};
  
  const title = data.title || "Devices";
  const description = data.description || "Browse, filter, and compare the latest mobile phone specifications, prices, and features on Sphinix Mobile.";
  const keywords = data.keywords
    ? data.keywords.split(',').map(k => k.trim()).filter(Boolean)
    : ["smartphones", "mobile specifications", "phone reviews", "phone specs"];

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

export default async function DevicesLayout({ children }) {
  const settings = await getSettings();
  const rawData = settings?.seo?.phones?.structuredData || settings?.seo?.devices?.structuredData;
  const globalData = settings?.seo?.advanced?.globalStructuredData;

  const structuredData = rawData?.trim();
  const shouldRender = structuredData && structuredData !== globalData?.trim();

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
