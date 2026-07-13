import React from 'react';

export function DynamicStyles({ settings }) {
  if (!settings?.typography) return null;

  return (
    <style dangerouslySetInnerHTML={{
      __html: `
        :root {
          --font-size-h1-default: ${settings.typography.h1Size?.["Global Default"] || '2.25rem'};
          --font-size-h1-hero: ${settings.typography.h1Size?.["Hero Section"] || '3rem'};
          --font-size-h1-dashboard: ${settings.typography.h1Size?.["Dashboard Headers"] || '1.875rem'};
          --font-size-h1-auth: ${settings.typography.h1Size?.["Auth Pages"] || '1.5rem'};
          --font-size-h1-device: ${settings.typography.h1Size?.["Device Details"] || '1.875rem'};
          --font-size-h1-blogs: ${settings.typography.h1Size?.["Blogs Header"] || '1.875rem'};
          --font-size-h1-comparisons: ${settings.typography.h1Size?.["Comparisons Header"] || '1.125rem'};
          
          --font-size-h2-default: ${settings.typography.h2Size?.["Global Default"] || '1.875rem'};
          --font-size-h2-section: ${settings.typography.h2Size?.["Section Headers"] || '1.875rem'};
          --font-size-h2-card: ${settings.typography.h2Size?.["Card Titles"] || '1.25rem'};
          --font-size-h2-settings: ${settings.typography.h2Size?.["Settings & Forms"] || '1.5rem'};
          --font-size-h2-modal: ${settings.typography.h2Size?.["Modal & Drawer Titles"] || '1.5rem'};
          
          --font-size-h3-default: ${settings.typography.h3Size?.["Global Default"] || '1.5rem'};
          --font-size-h3-section: ${settings.typography.h3Size?.["Section Headers"] || '1.5rem'};
          --font-size-h3-card: ${settings.typography.h3Size?.["Card Titles"] || '1.125rem'};
          --font-size-h3-settings: ${settings.typography.h3Size?.["Settings & Forms"] || '1.25rem'};
          --font-size-h3-modal: ${settings.typography.h3Size?.["Modal & Drawer Titles"] || '1.25rem'};
          
          --font-size-p-default: ${settings.typography.pSize?.["Global Default"] || '1rem'};
          --font-size-p-subtitle: ${settings.typography.pSize?.["Section Subtitles"] || '0.875rem'};
          --font-size-p-card: ${settings.typography.pSize?.["Card Descriptions"] || '0.875rem'};
          --font-size-p-form: ${settings.typography.pSize?.["Form Text"] || '0.875rem'};
          --font-size-p-footer: ${settings.typography.pSize?.["Footer Text"] || '0.875rem'};
          
          --font-size-nav: ${settings.typography.navSize || '0.875rem'};
          
          --font-size-button-default: ${settings.typography.buttonSize?.["Global Default"] || '0.875rem'};
          --font-size-button-primary: ${settings.typography.buttonSize?.["Primary Actions"] || '1rem'};
          --font-size-button-secondary: ${settings.typography.buttonSize?.["Secondary Actions"] || '0.875rem'};
          --font-size-button-sidebar: ${settings.typography.buttonSize?.["Sidebar & Nav Items"] || '0.875rem'};
          
          --font-size-link-default: ${settings.typography.linkSize?.["Global Default"] || '1rem'};
          --font-size-link-nav: ${settings.typography.linkSize?.["Navigation Links"] || '0.875rem'};
          --font-size-link-footer: ${settings.typography.linkSize?.["Footer Links"] || '0.875rem'};
          --font-size-link-inline: ${settings.typography.linkSize?.["Inline Links"] || '1rem'};
          
          --color-brand-dynamic: ${settings.appearance?.primaryColor || '#a855f7'};
        }
      `
    }} />
  );
}
