import { getSettings } from '@/actions/settings';

export async function generateMetadata() {
  const settings = await getSettings();
  const data = settings?.seo?.devices || {};
  
  return {
    title: data.title || "Devices",
    description: data.description || "",
    openGraph: {
      title: data.ogTitle || data.title || "Devices",
      description: data.ogDescription || data.description || "",
      images: data.ogImage ? [{ url: data.ogImage }] : [],
    },
  };
}

export default function DevicesLayout({ children }) {
  return <>{children}</>;
}
