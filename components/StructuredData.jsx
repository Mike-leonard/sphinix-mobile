import React from 'react';

export function StructuredData({ settings }) {
  return (
    <>
      {settings?.seo?.advanced?.globalStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: settings.seo.advanced.globalStructuredData }}
        />
      )}
      {settings?.seo?.home?.structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: settings.seo.home.structuredData }}
        />
      )}
    </>
  );
}
