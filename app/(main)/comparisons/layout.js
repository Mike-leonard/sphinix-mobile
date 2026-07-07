import { getSettings } from '@/actions/settings';

export async function generateMetadata() {
  const settings = await getSettings();
  const data = settings?.seo?.comparisons || {};
  
  return {
    title: data.title || "Comparisons",
    description: data.description || "",
    openGraph: {
      title: data.ogTitle || data.title || "Comparisons",
      description: data.ogDescription || data.description || "",
      images: data.ogImage ? [{ url: data.ogImage }] : [],
    },
  };
}

export default function ComparisonsLayout({ children }) {
  return <>{children}</>;
}
