import "./globals.css";
import { ThemeProvider } from "@/provider/ThemeProvider";
import { getSettings } from "@/actions/settings";
import { SettingsProvider } from "@/context/SettingsContext";
import AnalyticsWrapper from "@/components/AnalyticsWrapper";
import CookieConsent from "@/components/CookieConsent";
import { DynamicStyles } from "@/components/DynamicStyles";
import { StructuredData } from "@/components/StructuredData";

export async function generateMetadata() {
  const settings = await getSettings();

  const metadata = {
    title: {
      default: settings.seo.home.title,
      template: "%s | Sphinix Mobile",
    },
    description: settings.seo.home.description,
    keywords: settings.seo.home.keywords?.split(',').map(k => k.trim()) || ["smartphone reviews", "mobile specifications", "phone comparisons", "tech blog", "latest phones", "Sphinix Mobile"],
    openGraph: {
      title: settings.seo.home.ogTitle || settings.seo.home.title,
      description: settings.seo.home.ogDescription || settings.seo.home.description,
      images: settings.seo.home.ogImage ? [{ url: settings.seo.home.ogImage }] : [],
      type: "website",
    },
    icons: {
      icon: [
        { url: settings.seo.home.favicon || "/favicon.png", type: "image/png" },
        { url: "/favicon.ico" }
      ],
      shortcut: "/favicon.png",
      apple: "/favicon.png",
    }
  };

  if (settings.analytics?.googleSearchConsoleId) {
    metadata.verification = {
      google: settings.analytics.googleSearchConsoleId,
    };
  }

  // Support custom HTML meta tags from Dashboard (e.g. site verification, Bing, Facebook)
  const customMetaString = settings.seo?.advanced?.customMetaTags;
  if (customMetaString) {
    const metaRegex = /<meta\s+([^>]+)>/gi;
    let match;
    metadata.other = metadata.other || {};
    while ((match = metaRegex.exec(customMetaString)) !== null) {
      const attrs = match[1];
      const nameMatch = attrs.match(/(?:name|property)=["']([^"']+)["']/i);
      const contentMatch = attrs.match(/content=["']([^"']+)["']/i);
      if (nameMatch && contentMatch) {
        metadata.other[nameMatch[1]] = contentMatch[1];
      }
    }
  }

  return metadata;
}

export default async function RootLayout({ children, modal }) {
  const settings = await getSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <DynamicStyles settings={settings} />
        <StructuredData settings={settings} />
      </head>
      <body
        className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 antialiased selection:bg-brand-500/30 selection:text-brand-900 dark:selection:text-brand-100 flex flex-col"
        suppressHydrationWarning
      >
        <AnalyticsWrapper gaId={settings.analytics?.googleAnalyticsId} />
        <ThemeProvider
          attribute="class"
          defaultTheme={settings.appearance?.theme || "system"}
          forcedTheme={settings.appearance?.theme && settings.appearance.theme !== "system" ? settings.appearance.theme : undefined}
        >
          <SettingsProvider settings={settings}>
            {/* Renders either the (main) layout or the (auth) layout */}
            {children}

            {/* Renders the intercepting login/register modal if active */}
            {modal}

            {/* Cookie Consent Banner for GDPR / Privacy compliance */}
            <CookieConsent />
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
