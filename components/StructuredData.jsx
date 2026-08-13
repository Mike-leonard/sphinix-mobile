import React from 'react';

export function isSameJson(str1, str2) {
  if (!str1 || !str2) return false;
  if (str1.trim() === str2.trim()) return true;
  try {
    return JSON.stringify(JSON.parse(str1)) === JSON.stringify(JSON.parse(str2));
  } catch {
    return false;
  }
}

export function StructuredData({ settings }) {
  const globalData = settings?.seo?.advanced?.globalStructuredData?.trim();
  const homeData = settings?.seo?.home?.structuredData?.trim();

  let shouldRenderHome = Boolean(homeData);

  if (globalData && homeData) {
    if (isSameJson(globalData, homeData)) {
      shouldRenderHome = false;
    } else {
      try {
        const gParsed = JSON.parse(globalData);
        const hParsed = JSON.parse(homeData);

        const gGraph = Array.isArray(gParsed['@graph']) ? gParsed['@graph'] : [gParsed];
        const hGraph = Array.isArray(hParsed['@graph']) ? hParsed['@graph'] : [hParsed];

        const gIds = new Set(gGraph.map(item => item?.['@id']).filter(Boolean));
        const gTypes = new Set(gGraph.map(item => item?.['@type']).filter(Boolean));

        // If every entity in homeData is already represented in globalData (by @id or @type), skip homeData
        const isDuplicateEntity = hGraph.every(item => {
          if (!item) return true;
          if (item['@id'] && gIds.has(item['@id'])) return true;
          if (item['@type'] && (item['@type'] === 'WebSite' || item['@type'] === 'Organization') && gTypes.has(item['@type'])) return true;
          return false;
        });

        if (isDuplicateEntity) {
          shouldRenderHome = false;
        }
      } catch (e) {
        // Fallback to basic state if JSON parsing fails
      }
    }
  }

  return (
    <>
      {globalData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: globalData }}
        />
      )}
      {shouldRenderHome && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: homeData }}
        />
      )}
    </>
  );
}
