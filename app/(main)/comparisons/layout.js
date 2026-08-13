import { getSettings } from '@/actions/settings';
import { isSameJson } from '@/components/StructuredData';

export default async function ComparisonsLayout({ children }) {
  const settings = await getSettings();
  const rawData = settings?.seo?.comparisons?.structuredData;
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
