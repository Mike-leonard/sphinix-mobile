import { getSettings } from '@/actions/settings';

export async function generateMetadata() {
  const settings = await getSettings();
  const data = settings?.seo?.devices || {};
  
  return {
    title: data.title || "Devices",
    description: data.description || "",
    keywords: data.keywords?.split(',').map(k => k.trim()) || [],
    openGraph: {
      title: data.ogTitle || data.title || "Devices",
      description: data.ogDescription || data.description || "",
      images: data.ogImage ? [{ url: data.ogImage }] : [],
    },
  };
}

export default async function DevicesLayout({ children }) {
  const settings = await getSettings();
  const structuredData = settings?.seo?.devices?.structuredData;

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredData }}
        />
      )}
      {children}
    </>
  );
}
