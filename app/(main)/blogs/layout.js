import { getSettings } from '@/actions/settings';

export async function generateMetadata() {
  const settings = await getSettings();
  const data = settings?.seo?.blogs || {};
  
  return {
    title: data.title || "Blogs",
    description: data.description || "",
    keywords: data.keywords?.split(',').map(k => k.trim()) || [],
    openGraph: {
      title: data.ogTitle || data.title || "Blogs",
      description: data.ogDescription || data.description || "",
      images: data.ogImage ? [{ url: data.ogImage }] : [],
    },
  };
}

export default async function BlogsLayout({ children }) {
  const settings = await getSettings();
  const structuredData = settings?.seo?.blogs?.structuredData;

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
