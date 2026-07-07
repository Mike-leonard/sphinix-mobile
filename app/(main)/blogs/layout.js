import { getSettings } from '@/actions/settings';

export async function generateMetadata() {
  const settings = await getSettings();
  const data = settings?.seo?.blogs || {};
  
  return {
    title: data.title || "Blogs",
    description: data.description || "",
    openGraph: {
      title: data.ogTitle || data.title || "Blogs",
      description: data.ogDescription || data.description || "",
      images: data.ogImage ? [{ url: data.ogImage }] : [],
    },
  };
}

export default function BlogsLayout({ children }) {
  return <>{children}</>;
}
