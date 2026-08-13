import React from 'react';

export function StructuredData({ settings }) {
  const globalData = settings?.seo?.advanced?.globalStructuredData?.trim();
  const homeData = settings?.seo?.home?.structuredData?.trim();

  // Avoid rendering duplicate schema if homeData is identical to globalData
  const shouldRenderHome = homeData && homeData !== globalData;

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
